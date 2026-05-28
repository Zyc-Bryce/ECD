# 演进约束开发

[English](README.md) | 简体中文

<div align="center">

**先冻结产品含义，再把交付压进一个有约束的 plan-code-achieve 闭环。**

![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-412991?style=flat-square)
![Constraint Planning](https://img.shields.io/badge/Planning-Constraint_Driven-0F766E?style=flat-square)
![CLI Toolkit](https://img.shields.io/badge/CLI-Toolkit-1D4ED8?style=flat-square)
![Plan Code Achieve](https://img.shields.io/badge/Workflow-Plan_Code_Achieve-7C3AED?style=flat-square)

原始需求 → 冻结含义 → code-ready handoff → run evidence → achieve verdict

</div>

`evolutionary-constraint-development` 是一套 Claude Code Skill，用来把一条原始需求压成一个有约束的交付闭环：

1. `pre` — 追问和整理，直到需求语义足够冻结，可以进入审批门。
2. `plan` — 让保留下来的路径收敛成一个 code-ready bundle。
3. `code` — 只能从冻结后的 handoff 执行，不允许重新发明产品含义。
4. `achieve` — 判断结果是否真的满足验收，以及这个 case 是否可以归档关闭。

它的核心原则很简单：规划负责冻结含义，编码负责忠实执行，闭环负责证明结果是否可接受。只要编码阶段还需要补产品语义，说明规划失败了。

## 这个仓库包含什么

- `SKILL.md`：Claude Code Skill 本体。
- `scripts/`：用于 scaffold、render、validate、run 记录、achieve note 的 CLI 辅助脚本（Python，可选依赖 `pyyaml`）。
- `templates/`：bundle 各类产物的 markdown 模板。
- `schemas/`：normalized case 的结构说明。
- `references/`：playbook、质量门槛、子代理协议（已适配 Claude Code）。
- `docs/`：理论、阶段、子代理、实现细节文档（中英双语）。
- `agents/`：Claude Code Agent 接口定义（D/G/H/J 强制子代理阶段）。

## 安装方式

### Git Clone 安装

```bash
# 克隆仓库
git clone https://github.com/<your-username>/evolutionary-constraint-development.git

# 安装为项目级技能（仅在特定项目中可用）
cp -r evolutionary-constraint-development /path/to/your-project/.claude/skills/

# 或安装为用户级技能（全局可用）
cp -r evolutionary-constraint-development ~/.claude/skills/
```

### 直接克隆安装

```bash
# 直接克隆到 Claude Code skills 目录
git clone https://github.com/<your-username>/evolutionary-constraint-development.git ~/.claude/skills/evolutionary-constraint-development
```

安装后，Claude Code 会在对应目录下自动发现并加载该技能。

## CLI 快速开始

CLI 本身是薄工具层，负责渲染、校验和记录。真正的推理行为仍由遵循这个 Skill 的模型承担。

### `ecl pre` — 初始化 Stage A 审批工作区

从原始请求创建 normalized case JSON scaffold，渲染 Obsidian bundle 并校验。这将启动高交互的澄清阶段（Stage A）。

```bash
python3 scripts/ecl.py pre \
  --request "Build a minimal app with a dashboard, an empty state, and one write flow." \
  --output /abs/path/to/bundle \
  --repo-path /abs/path/to/repo \
  --project-path /abs/path/to/repo
```

### `ecl plan` — 渲染审批后的 code-ready bundle

读取已完成的 case JSON（Stage A 必须为 `complete`），渲染完整的 A-J bundle，校验并生成 OpenSpec pack。如果 `code_ready` 不为 `true` 则报错退出。

```bash
python3 scripts/ecl.py plan \
  --input-json /abs/path/to/case.json \
  --output /abs/path/to/bundle \
  --force
```

### `ecl code` — 记录一次 `/code` 运行

校验 bundle，检查 `code_ready=true`，解析运行 payload，渲染运行证据笔记（`00-code-run.md`、`01-verification.md`）并重新校验。

```bash
python3 scripts/ecl.py code \
  --case /abs/path/to/bundle \
  --run-json /abs/path/to/run.json
```

### `ecl achieve` — 渲染最终验收与归档判定

校验 bundle，读取最近一次 code run，综合生成 achieve 判定（achieved / achieved_with_followups / not_achieved），渲染 `03-achieve.md`。

```bash
python3 scripts/ecl.py achieve --case /abs/path/to/bundle
```

### 直接校验

直接校验任意 bundle：

```bash
python3 scripts/validate_ecl_bundle.py /abs/path/to/bundle
```

> **注意：** 在 Windows 上如果 `python3` 不可用，请使用 `python`。

## Claude Code 侧的必要能力

这个 Skill 明确按 Claude Code-first 来设计，所以默认假设：

- 环境可以把一个目录里的 `SKILL.md` 作为 Claude Code skill 加载
- 模型可以通过 `Bash` 工具执行本地脚本
- 模型可以通过 `Read`/`Glob`/`Grep`/`codegraph_*` 读取本地文件
- 环境支持 `Agent` 工具启动真实子代理（D/G/H/J 阶段强制要求）

如果你的运行环境不能拉起真实子代理，那么 ECD 仍然可以被阅读和参考，但 D、G、H、J 这几个阶段就不能被诚实地标记为 complete。

## 仓库导览

- [docs/zh-CN/theory.md](docs/zh-CN/theory.md)：ECD 的理论源头、定位和要解决的问题
- [docs/zh-CN/stages.md](docs/zh-CN/stages.md)：每个阶段的职责、输入输出、exit gate 和失败方式
- [docs/zh-CN/subagents.md](docs/zh-CN/subagents.md)：哪些阶段必须启用真实子代理、返回协议是什么
- [docs/zh-CN/implementation.md](docs/zh-CN/implementation.md)：CLI 流程、bundle 编译、模板、schema 与 OpenSpec 输出
- [docs/theory.md](docs/theory.md)：English theory documentation
- [docs/stages.md](docs/stages.md)：English stage model
- [docs/subagents.md](docs/subagents.md)：English subagent protocol
- [docs/implementation.md](docs/implementation.md)：English implementation notes

## 致谢

本技能基于 [@Etherstrings](https://github.com/Etherstrings) 创建的 [Evolution Constraint Planner](https://github.com/Etherstrings/evolution-constraint-planner)。原始的 ECL v2 方法论、CLI 脚本、模板、schema 和参考资料均为 Codex 设计，现已适配至 Claude Code。

## 许可证

MIT
