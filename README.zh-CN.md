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

`ecd`（Evolutionary Constraint Development，演进约束开发）是一套 Claude Code Skill。在 Claude Code 中输入 `/ecd` 即可调用。

> **🆕 第一次用？** → [`docs/zh-CN/beginners-guide.md`](docs/zh-CN/beginners-guide.md) 小白入门完全指南（5 分钟看懂）
> **v1.1 新特性：** 复杂度自适应（Lite/Standard/Full 三级路由）、Superpowers 互补集成、增量模式。详见 [`USAGE.zh-CN.md`](USAGE.zh-CN.md)。

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

以下三种方式**任选其一**即可。所有示例以 **Alice** 作为 Windows 用户名、**my-app** 作为项目名——请替换为你自己的。

---

### 方式一：插件安装（⭐ 推荐）

只需在 Claude Code 的配置文件中加几行，自动下载、自动更新，无需手动管理文件。

#### 第 1 步 — 打开配置文件

| 系统 | 配置文件路径 |
|------|-------------|
| Windows | `%USERPROFILE%\.claude\settings.json` |
| macOS / Linux | `~/.claude/settings.json` |

> 如果文件不存在，新建一个空 JSON 文件：`{}`

#### 第 2 步 — 添加 ECD 市场源和启用插件

在 `settings.json` 中添加：

```json
{
  "extraKnownMarketplaces": {
    "ecd-marketplace": {
      "source": {
        "source": "github",
        "repo": "Zyc-Bryce/ECD"
      }
    }
  },
  "enabledPlugins": {
    "ecd@ecd-marketplace": true
  }
}
```

> 💡 如果文件中已有 `extraKnownMarketplaces` 或 `enabledPlugins`，将新条目**合并进去**，不要覆盖已有内容。

#### 第 3 步 — 重启 Claude Code

关闭并重新打开 Claude Code。输入 `/ecd` 验证——如果看到 ECD 提示信息，安装成功。

> ✅ **优势**：后续 ECD 发新版本时，Claude Code 会自动检测更新。你也无需手动管理文件。

---

### 方式二：命令行安装

适合习惯命令行的用户。本质是克隆仓库 → 复制到 skills 目录。

#### Windows (PowerShell)

```powershell
# 克隆仓库
git clone https://github.com/Zyc-Bryce/ECD.git evolutionary-constraint-development

# --- 用户级安装（在所有项目中可用）---
Copy-Item -Recurse evolutionary-constraint-development $env:USERPROFILE\.claude\skills\

# --- 项目级安装（仅在当前项目中可用）---
# 先切换到你的项目根目录，然后执行：
Copy-Item -Recurse evolutionary-constraint-development .\.claude\skills\
```

#### macOS / Linux

```bash
# 克隆仓库
git clone https://github.com/Zyc-Bryce/ECD.git evolutionary-constraint-development

# 用户级安装（在所有项目中可用）
cp -r evolutionary-constraint-development ~/.claude/skills/

# 项目级安装（仅在当前项目中可用）
cp -r evolutionary-constraint-development /path/to/your-project/.claude/skills/
```

#### 直接克隆到 skills 目录（所有平台）

```bash
# Windows (PowerShell):
git clone https://github.com/Zyc-Bryce/ECD.git $env:USERPROFILE\.claude\skills\evolutionary-constraint-development

# macOS / Linux:
git clone https://github.com/Zyc-Bryce/ECD.git ~/.claude/skills/evolutionary-constraint-development
```

安装后，下次在对应目录中启动 Claude Code 时，技能就会被自动发现并加载。

---

### 方式三：手动安装（无需终端）

如果你不想使用命令行，可以按以下步骤手动操作。

#### 第 1 步 — 下载

访问 https://github.com/Zyc-Bryce/ECD ，点击 **Code → Download ZIP** 下载压缩包，然后解压到你选择的目录。

**示例：** 解压到 `C:\Users\Alice\Downloads\evolutionary-constraint-development`。

#### 第 2 步 — 选择安装范围

从下面两个选项中**任选其一**。

---

**选项 A：用户级安装（技能在所有项目中都可用）**

1. 打开文件资源管理器，在地址栏输入 `%USERPROFILE%\.claude\skills\` 并回车。

   *以 Alice 为例，完整路径为：* `C:\Users\Alice\.claude\skills\`

2. 如果 `skills` 文件夹不存在，新建它：
   - 右键 → **新建 → 文件夹**，命名为 `skills`。

3. 将第 1 步解压得到的 `evolutionary-constraint-development` 文件夹，复制（或移动）到 `skills\` 中。

   *复制完成后，路径应类似：* `C:\Users\Alice\.claude\skills\evolutionary-constraint-development\SKILL.md`

---

**选项 B：项目级安装（技能仅在当前项目中可用）**

1. 打开文件资源管理器，导航到你的项目根目录。

   *例如：* `C:\Users\Alice\Projects\my-app`

2. 在项目目录中，查看是否存在 `.claude` 文件夹。如果不存在，新建它：
   - 右键 → **新建 → 文件夹**，命名为 `.claude`
   - *Windows 可能会提示"必须键入文件名"——正常现象，确认即可。*

3. 在 `.claude` 文件夹内，查看是否存在 `skills` 文件夹。如果不存在，新建 `skills`。

4. 将第 1 步解压得到的 `evolutionary-constraint-development` 文件夹，复制（或移动）到 `.claude\skills\` 中。

   *复制完成后，路径应类似：* `C:\Users\Alice\Projects\my-app\.claude\skills\evolutionary-constraint-development\SKILL.md`

---

无论选择哪个选项，重启 Claude Code（或在对应项目目录中启动），技能就会被自动发现。

---

### 方式三：手动安装（macOS / Linux，无需终端）

1. 访问 https://github.com/Zyc-Bryce/ECD ，点击 **Code → Download ZIP**。
2. 将 ZIP 解压到某个目录（例如 `~/Downloads/evolutionary-constraint-development`）。
3. 打开 Finder（macOS）或文件管理器（Linux），启用"显示隐藏文件"以便看到 `.claude` 文件夹。
4. **用户级安装：** 将解压后的文件夹复制到 `~/.claude/skills/`。如果 `~/.claude/` 下没有 `skills/`，先创建它。
5. **项目级安装：** 将解压后的文件夹复制到 `<你的项目>/.claude/skills/`。

## CLI 快速开始

CLI 本身是薄工具层，负责渲染、校验和记录。真正的推理行为仍由遵循这个 Skill 的模型承担。

> **平台提示：** macOS/Linux 使用 `python3`，Windows 使用 `python`。以下路径以用户 **Alice**、项目 **my-app** 为例——请替换为你自己的路径。

### `ecl pre` — 初始化 Stage A 审批工作区

从原始请求创建 normalized case JSON scaffold，渲染 Obsidian bundle 并校验。这将启动高交互的澄清阶段（Stage A）。

```bash
# macOS / Linux
python3 scripts/ecl.py pre \
  --request "Build a minimal app with a dashboard, an empty state, and one write flow." \
  --output /home/alice/projects/ecd-demo/bundle \
  --repo-path /home/alice/projects/my-app \
  --project-path /home/alice/projects/my-app
```

```powershell
# Windows (PowerShell)
python scripts/ecl.py pre `
  --request "Build a minimal app with a dashboard, an empty state, and one write flow." `
  --output C:\Users\Alice\Projects\ecd-demo\bundle `
  --repo-path C:\Users\Alice\Projects\my-app `
  --project-path C:\Users\Alice\Projects\my-app
```

### `ecl plan` — 渲染审批后的 code-ready bundle

读取已完成的 case JSON（Stage A 必须为 `complete`），渲染完整的 A-J bundle，校验并生成 OpenSpec pack。如果 `code_ready` 不为 `true` 则报错退出。

```bash
# macOS / Linux
python3 scripts/ecl.py plan \
  --input-json /home/alice/projects/ecd-demo/case.json \
  --output /home/alice/projects/ecd-demo/bundle \
  --force
```

```powershell
# Windows (PowerShell)
python scripts/ecl.py plan `
  --input-json C:\Users\Alice\Projects\ecd-demo\case.json `
  --output C:\Users\Alice\Projects\ecd-demo\bundle `
  --force
```

### `ecl code` — 记录一次 `/code` 运行

校验 bundle，检查 `code_ready=true`，解析运行 payload，渲染运行证据笔记（`00-code-run.md`、`01-verification.md`）并重新校验。

```bash
# macOS / Linux
python3 scripts/ecl.py code \
  --case /home/alice/projects/ecd-demo/bundle \
  --run-json /home/alice/projects/ecd-demo/run.json
```

```powershell
# Windows (PowerShell)
python scripts/ecl.py code `
  --case C:\Users\Alice\Projects\ecd-demo\bundle `
  --run-json C:\Users\Alice\Projects\ecd-demo\run.json
```

### `ecl achieve` — 渲染最终验收与归档判定

校验 bundle，读取最近一次 code run，综合生成 achieve 判定（`achieved` / `achieved_with_followups` / `not_achieved`），渲染 `03-achieve.md`。

```bash
# macOS / Linux
python3 scripts/ecl.py achieve --case /home/alice/projects/ecd-demo/bundle
```

```powershell
# Windows (PowerShell)
python scripts/ecl.py achieve --case C:\Users\Alice\Projects\ecd-demo\bundle
```

### 直接校验

直接校验任意 bundle：

```bash
# macOS / Linux
python3 scripts/validate_ecl_bundle.py /home/alice/projects/ecd-demo/bundle
```

```powershell
# Windows (PowerShell)
python scripts/validate_ecl_bundle.py C:\Users\Alice\Projects\ecd-demo\bundle
```

## Claude Code 侧的必要能力

这个 Skill 明确按 Claude Code-first 来设计，所以默认假设：

- 环境可以把一个目录里的 `SKILL.md` 作为 Claude Code skill 加载
- 模型可以通过 `Bash` 工具执行本地脚本
- 模型可以通过 `Read`/`Glob`/`Grep`/`codegraph_*` 读取本地文件
- 环境支持 `Agent` 工具启动真实子代理（D/G/H/J 阶段强制要求）

如果你的运行环境不能拉起真实子代理，那么 ECD 仍然可以被阅读和参考，但 D、G、H、J 这几个阶段就不能被诚实地标记为 complete。

## 仓库导览

- **[docs/zh-CN/beginners-guide.md](docs/zh-CN/beginners-guide.md)：🆕 小白入门完全指南**——零基础也能看懂，5 分钟理解 ECD，含决策树、场景速查、常见错误、20 个 FAQ、术语词典
- [USAGE.zh-CN.md](USAGE.zh-CN.md)：**v1.1 详细使用指南**——复杂度分类器、三级工作流、Superpowers 集成、增量模式、常见场景与 FAQ
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
