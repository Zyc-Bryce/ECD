# 演进约束开发

[English](README.md) | 简体中文

<div align="center">

**先冻结产品含义，再把交付压进一个有约束的 plan-code-achieve 闭环。**

![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-412991?style=flat-square)
![Constraint Planning](https://img.shields.io/badge/Planning-Constraint_Driven-0F766E?style=flat-square)
![CLI Toolkit](https://img.shields.io/badge/CLI-Toolkit-1D4ED8?style=flat-square)
![Plan Code Achieve](https://img.shields.io/badge/Workflow-Plan_Code_Achieve-7C3AED?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/version-1.3-blue?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=flat-square)

原始需求 → 冻结含义 → code-ready handoff → run evidence → achieve verdict

</div>

## 目录

- [为什么用 ECD](#为什么用-ecd)
- [这个仓库包含什么](#这个仓库包含什么)
- [前置要求](#前置要求)
- [安装与卸载](#安装与卸载)
- [CLI 快速开始](#cli-快速开始)
- [Claude Code 侧的必要能力](#claude-code-侧的必要能力)
- [仓库导览](#仓库导览)
- [参与贡献](#参与贡献)
- [致谢](#致谢)
- [许可证](#许可证)

`ecd`（Evolutionary Constraint Development，演进约束开发）是一套 Claude Code Skill。在 Claude Code 中输入 `/ecd` 即可调用。

> **🆕 第一次用？** → [`skills/ecd/docs/zh-CN/beginners-guide.md`](skills/ecd/docs/zh-CN/beginners-guide.md) 小白入门完全指南（5 分钟看懂）
> **v1.3 新特性：** 中文本地化补齐（12篇 reference 全文翻译）、版本号体系统一、Schema L1 依赖链修复。详见 [`USAGE.zh-CN.md`](USAGE.zh-CN.md)、[`CHANGELOG.zh-CN.md`](CHANGELOG.zh-CN.md)。

1. `pre` — 追问和整理，直到需求语义足够冻结，可以进入审批门。
2. `plan` — 让保留下来的路径收敛成一个 code-ready bundle。
3. `code` — 只能从冻结后的 handoff 执行，不允许重新发明产品含义。
4. `achieve` — 判断结果是否真的满足验收，以及这个 case 是否可以归档关闭。

它的核心原则很简单：规划负责冻结含义，编码负责忠实执行，闭环负责证明结果是否可接受。只要编码阶段还需要补产品语义，说明规划失败了。

## 为什么用 ECD

当你让 AI 编程助手基于一句模糊需求写代码时，通常的结果是一场**语义赌博**：模型猜你想要的，凭空发明产品行为，最终交付的代码看起来对，但跑起来错——缺失边界场景、状态转换错误、异常处理挂掉。

ECD 会在一行代码被写出来之前就强制执行**语义冻结**：

| 没有 ECD | 有了 ECD |
|---|---|
| "做一个后台面板" → 模型自行发明功能 | `pre` 追问到语义冻结 |
| 代码偏离原始意图 | `plan` 收敛为 code-ready 交接包 |
| 无法判断"做完了没有" | `code` 只执行冻结后的指令 |
| "看着还行"式验收 | `achieve` 要求基于证据关闭 |

核心原则很简单：**规划负责冻结含义，编码负责忠实执行，闭环负责证明结果是否可接受。** 只要编码阶段还需要补产品语义，说明规划失败了。

## 这个仓库包含什么

- `skills/ecd/SKILL.md`：Claude Code Skill 本体。
- `skills/ecd/scripts/`：用于 scaffold、render、validate、run 记录、achieve note 的 CLI 辅助脚本（Python，可选依赖 `pyyaml`）。
- `skills/ecd/templates/`：bundle 各类产物的 markdown 模板。
- `skills/ecd/schemas/`：normalized case 的结构说明。
- `skills/ecd/references/`：playbook、质量门槛、子代理协议（已适配 Claude Code）。
- `skills/ecd/docs/`：理论、阶段、子代理、实现细节文档（中英双语）。
- `skills/ecd/agents/`：Claude Code Agent 接口定义（D/G/H/J 强制子代理阶段）。
- `.claude-plugin/`：Claude Code 插件元数据（支持 `/plugin install`）。

## 前置要求

- **Claude Code** — 建议使用最新版本。ECD 依赖 `Agent` 工具在关键审查阶段启动独立子代理。
- **Python 3.8+** — 仅在使用 CLI 辅助脚本（`skills/ecd/scripts/`）时需要。所有脚本均使用 Python 标准库，仅有一项可选例外：
  - **pyyaml**（可选）— `pip install pyyaml`。仅 `render_obsidian_bundle.py` 完整 YAML schema 解析时需要；未安装时脚本会自动回退到内置默认 schema。
- **Git** — 仅通过 `git clone` 安装时需要（下方方式五和方式六）。

## 安装与卸载

以下六种方式**任选其一**。每种方式自带对应的卸载方法，无需在别处查找。

---

### 方式一：npx skills add（⭐ 推荐）

一条命令自动发现并全局安装技能。安装器会克隆仓库，将文件放入 `.agents/skills/ecd/`（通用技能目录，跨 Claude Code、Copilot、Cline 等平台共享），并自动在 `.claude/skills/ecd` 创建 Junction（Windows）/ 符号链接（macOS/Linux），使 Claude Code 立即发现技能。

#### 安装

```bash
npx skills add Zyc-Bryce/ECD -g
```

> **参数说明：**
> - `-g` — 全局安装到 `~/.agents/skills/`（用户级，所有项目可用）。不加此参数则安装到当前目录的 `.agents/skills/`。
> - `-y` —（可选）在非交互环境中跳过确认提示。

重启 Claude Code 后输入 `/ecd` 验证。

> 🔧 **故障排查**：极少数情况下（如权限受限环境或非标准用户目录），`.claude/skills/ecd` Junction/符号链接可能未自动生成。如果安装后 `/ecd` 未出现，手动创建：
>
> **Windows (PowerShell):**
> ```powershell
> if (-not (Test-Path "$env:USERPROFILE\.claude\skills\ecd")) {
>   New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\skills\ecd" -Target "$env:USERPROFILE\.agents\skills\ecd" -Force
> }
> ```
>
> **macOS / Linux:**
> ```bash
> [ ! -e ~/.claude/skills/ecd ] && ln -s ~/.agents/skills/ecd ~/.claude/skills/ecd
> ```

#### 卸载

```bash
npx skills remove ecd
```

---

### 方式二：npx 一键安装（⭐ 最简）

自动配置 Claude Code——注册市场源并启用插件。效果等同于下方方式四的手动配置，但无需手动编辑文件。

#### 安装

```bash
npx @zyc-bryce/ecd
```

重启 Claude Code 后输入 `/ecd` 验证。

> 💡 此命令仅编辑 `settings.json`——在 `extraKnownMarketplaces` 中添加 `ecd-marketplace`，在 `enabledPlugins` 中启用 `ecd@ecd-marketplace`。

#### 卸载

```bash
npx @zyc-bryce/ecd --uninstall
```

自动从 `settings.json` 中移除 `ecd-marketplace` 与 `ecd@ecd-marketplace` 条目。重启 Claude Code 即可。

---

### 方式三：插件命令安装

使用 Claude Code 内置插件系统——自动下载、自动更新，无需手动管理文件。

#### 安装

**第 1 步 — 添加市场源**（在终端中运行）：

```bash
claude plugin source add ecd-marketplace --source github --repo Zyc-Bryce/ECD
```

**第 2 步 — 安装插件**（在 Claude Code 中输入）：

```
/plugin install ecd@ecd-marketplace
```

**第 3 步 — 重启** Claude Code。输入 `/ecd` 验证。

> ✅ **优势**：后续 ECD 发新版本时，Claude Code 会自动检测更新。
>
> 🔧 **故障排查**：如果重启后 `/ecd` 没出现，在终端运行 `claude plugin list` 检查 ECD 插件状态。若显示 `failed to load` 及 "conflicting manifests" 错误，说明 `marketplace.json` 与 `plugin.json` 存在重复声明——请更新到最新版或参考 [GitHub Issues](https://github.com/Zyc-Bryce/ECD/issues)。

#### 卸载

在终端中执行：

```bash
# 禁用插件
claude plugins disable ecd@ecd-marketplace

# 移除 marketplace 源
claude plugins source remove ecd-marketplace
```

重启 Claude Code 即可。

---

### 方式四：手动配置

如果你更习惯直接编辑配置文件，按以下步骤操作。效果同方式二和方式三——Claude Code 会自动检测更新。

#### 安装

**第 1 步 — 打开配置文件**

| 系统 | 配置文件路径 |
|------|-------------|
| Windows | `%USERPROFILE%\.claude\settings.json` |
| macOS / Linux | `~/.claude/settings.json` |

> 如果文件不存在，新建一个空 JSON 文件：`{}`

**第 2 步 — 添加 ECD 市场源和启用插件**

在 `settings.json` 中添加（或合并到已有内容）：

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

**第 3 步 — 重启** Claude Code。输入 `/ecd` 验证。

#### 卸载

1. 打开 `settings.json`
2. 移除 `extraKnownMarketplaces` 中的 `"ecd-marketplace"` 条目
3. 移除 `enabledPlugins` 中的 `"ecd@ecd-marketplace"` 条目
4. 重启 Claude Code

---

### 方式五：命令行安装（git clone + 复制）

克隆仓库并复制到 skills 目录。

#### 安装

**先克隆到任意位置，再复制：**

*Windows (PowerShell):*
```powershell
git clone https://github.com/Zyc-Bryce/ECD.git evolutionary-constraint-development

# 用户级安装（在所有项目中可用）
Copy-Item -Recurse evolutionary-constraint-development $env:USERPROFILE\.claude\skills\

# 项目级安装（在项目根目录执行）
Copy-Item -Recurse evolutionary-constraint-development .\.claude\skills\
```

*macOS / Linux:*
```bash
git clone https://github.com/Zyc-Bryce/ECD.git evolutionary-constraint-development

# 用户级安装
cp -r evolutionary-constraint-development ~/.claude/skills/

# 项目级安装
cp -r evolutionary-constraint-development /path/to/your-project/.claude/skills/
```

**或直接克隆到 skills 目录：**

```bash
# Windows (PowerShell)
git clone https://github.com/Zyc-Bryce/ECD.git $env:USERPROFILE\.claude\skills\evolutionary-constraint-development

# macOS / Linux
git clone https://github.com/Zyc-Bryce/ECD.git ~/.claude/skills/evolutionary-constraint-development
```

安装后，下次启动 Claude Code 时技能会被自动发现并加载。

#### 卸载

直接删除 skills 目录中的 ECD 文件夹：

*Windows (PowerShell):*
```powershell
# 用户级
Remove-Item -Recurse -Force $env:USERPROFILE\.claude\skills\evolutionary-constraint-development

# 项目级（在项目根目录执行）
Remove-Item -Recurse -Force .\.claude\skills\evolutionary-constraint-development
```

*macOS / Linux:*
```bash
# 用户级
rm -rf ~/.claude/skills/evolutionary-constraint-development

# 项目级
rm -rf /path/to/your-project/.claude/skills/evolutionary-constraint-development
```

---

### 方式六：手动安装（无需终端，跨平台）

下载 ZIP 压缩包，解压后复制到正确目录。

#### 安装

**第 1 步 — 下载：** 访问 https://github.com/Zyc-Bryce/ECD → **Code → Download ZIP**。解压到你选择的目录（例如 `C:\Users\Alice\Downloads\evolutionary-constraint-development`）。

**第 2 步 — 选择安装范围并复制：**

<details>
<summary><b>选项 A：用户级安装</b>（所有项目可用）—— 点击展开</summary>

1. 打开文件资源管理器，在地址栏输入 `%USERPROFILE%\.claude\skills\` 并回车。若 `skills` 文件夹不存在则新建。
2. 将解压得到的 `evolutionary-constraint-development` 文件夹复制到 `skills\` 中。
3. 复制完成后路径示例：`C:\Users\Alice\.claude\skills\evolutionary-constraint-development\SKILL.md`

</details>

<details>
<summary><b>选项 B：项目级安装</b>（仅当前项目可用）—— 点击展开</summary>

1. 导航到你的项目根目录（如 `C:\Users\Alice\Projects\my-app`）。
2. 若 `.claude\skills\` 不存在则逐级新建。
3. 将解压得到的文件夹复制到 `.claude\skills\` 中。
4. 复制完成后路径示例：`C:\Users\Alice\Projects\my-app\.claude\skills\evolutionary-constraint-development\SKILL.md`

</details>

**macOS / Linux 用户：** 同理，将解压后的文件夹复制到 `~/.claude/skills/`（用户级）或 `<你的项目>/.claude/skills/`（项目级）。启用"显示隐藏文件"以看到 `.claude` 文件夹。

重启 Claude Code 后技能会被自动发现。

#### 卸载

同方式五：删除 `.claude/skills/` 中的 `evolutionary-constraint-development` 文件夹。

---

### 补充：npm 全局安装的卸载

如果你曾通过 `npm install -g @zyc-bryce/ecd` 全局安装：

```bash
npm uninstall -g @zyc-bryce/ecd
```

> ⚠️ **注意**：npm 卸载仅移除 npm 全局包本身，不会自动清理 `settings.json` 中的 marketplace/plugin 注册。如果之前也通过 npx 注册过，仍需按方式二/四清理 `settings.json`。

---

## CLI 快速开始

CLI 本身是薄工具层，负责渲染、校验和记录。真正的推理行为仍由遵循这个 Skill 的模型承担。

> **平台提示：** macOS/Linux 使用 `python3`，Windows 使用 `python`。以下路径以用户 **Alice**、项目 **my-app** 为例——请替换为你自己的路径。

### `ecd pre` — 初始化 Stage A 审批工作区

从原始请求创建 normalized case JSON scaffold，渲染 Obsidian bundle 并校验。这将启动高交互的澄清阶段（Stage A）。

```bash
# macOS / Linux
python3 skills/ecd/scripts/ecd.py pre \
  --request "Build a minimal app with a dashboard, an empty state, and one write flow." \
  --output /home/alice/projects/ecd-demo/bundle \
  --repo-path /home/alice/projects/my-app \
  --project-path /home/alice/projects/my-app
```

```powershell
# Windows (PowerShell)
python skills/ecd/scripts/ecd.py pre `
  --request "Build a minimal app with a dashboard, an empty state, and one write flow." `
  --output C:\Users\Alice\Projects\ecd-demo\bundle `
  --repo-path C:\Users\Alice\Projects\my-app `
  --project-path C:\Users\Alice\Projects\my-app
```

### `ecd plan` — 渲染审批后的 code-ready bundle

读取已完成的 case JSON（Stage A 必须为 `complete`），渲染完整的 A-J bundle，校验并生成 OpenSpec pack。如果 `code_ready` 不为 `true` 则报错退出。

```bash
# macOS / Linux
python3 skills/ecd/scripts/ecd.py plan \
  --input-json /home/alice/projects/ecd-demo/case.json \
  --output /home/alice/projects/ecd-demo/bundle \
  --force
```

```powershell
# Windows (PowerShell)
python skills/ecd/scripts/ecd.py plan `
  --input-json C:\Users\Alice\Projects\ecd-demo\case.json `
  --output C:\Users\Alice\Projects\ecd-demo\bundle `
  --force
```

### `ecd code` — 记录一次 `/code` 运行

校验 bundle，检查 `code_ready=true`，解析运行 payload，渲染运行证据笔记（`00-code-run.md`、`01-verification.md`）并重新校验。

```bash
# macOS / Linux
python3 skills/ecd/scripts/ecd.py code \
  --case /home/alice/projects/ecd-demo/bundle \
  --run-json /home/alice/projects/ecd-demo/run.json
```

```powershell
# Windows (PowerShell)
python skills/ecd/scripts/ecd.py code `
  --case C:\Users\Alice\Projects\ecd-demo\bundle `
  --run-json C:\Users\Alice\Projects\ecd-demo\run.json
```

### `ecd achieve` — 渲染最终验收与归档判定

校验 bundle，读取最近一次 code run，综合生成 achieve 判定（`achieved` / `achieved_with_followups` / `not_achieved`），渲染 `03-achieve.md`。

```bash
# macOS / Linux
python3 skills/ecd/scripts/ecd.py achieve --case /home/alice/projects/ecd-demo/bundle
```

```powershell
# Windows (PowerShell)
python skills/ecd/scripts/ecd.py achieve --case C:\Users\Alice\Projects\ecd-demo\bundle
```

### 直接校验

直接校验任意 bundle：

```bash
# macOS / Linux
python3 skills/ecd/scripts/validate_ecl_bundle.py /home/alice/projects/ecd-demo/bundle
```

```powershell
# Windows (PowerShell)
python skills/ecd/scripts/validate_ecl_bundle.py C:\Users\Alice\Projects\ecd-demo\bundle
```

## Claude Code 侧的必要能力

这个 Skill 明确按 Claude Code-first 来设计，所以默认假设：

- 环境可以把一个目录里的 `SKILL.md` 作为 Claude Code skill 加载
- 模型可以通过 `Bash` 工具执行本地脚本
- 模型可以通过 `Read`/`Glob`/`Grep`/`codegraph_*` 读取本地文件
- 环境支持 `Agent` 工具启动真实子代理（D/G/H/J 阶段强制要求）

如果你的运行环境不能拉起真实子代理，那么 ECD 仍然可以被阅读和参考，但 D、G、H、J 这几个阶段就不能被诚实地标记为 complete。

## 仓库导览

### 文档

- **[skills/ecd/docs/zh-CN/beginners-guide.md](skills/ecd/docs/zh-CN/beginners-guide.md)：🆕 小白入门完全指南**——零基础也能看懂，5 分钟理解 ECD，含决策树、场景速查、常见错误、20 个 FAQ、术语词典
- [USAGE.zh-CN.md](USAGE.zh-CN.md)：**详细使用指南**——复杂度分类器、三级工作流、Superpowers 集成、增量模式、常见场景与 FAQ
- [skills/ecd/docs/zh-CN/theory.md](skills/ecd/docs/zh-CN/theory.md)：ECD 的理论源头、定位和要解决的问题
- [skills/ecd/docs/zh-CN/stages.md](skills/ecd/docs/zh-CN/stages.md)：每个阶段的职责、输入输出、exit gate 和失败方式
- [skills/ecd/docs/zh-CN/subagents.md](skills/ecd/docs/zh-CN/subagents.md)：哪些阶段必须启用真实子代理、返回协议是什么
- [skills/ecd/docs/zh-CN/implementation.md](skills/ecd/docs/zh-CN/implementation.md)：CLI 流程、bundle 编译、模板、schema 与 OpenSpec 输出
- [skills/ecd/docs/theory.md](skills/ecd/docs/theory.md)：English theory documentation
- [skills/ecd/docs/stages.md](skills/ecd/docs/stages.md)：English stage model
- [skills/ecd/docs/subagents.md](skills/ecd/docs/subagents.md)：English subagent protocol
- [skills/ecd/docs/implementation.md](skills/ecd/docs/implementation.md)：English implementation notes
- [skills/ecd/references/zh-CN/](skills/ecd/references/zh-CN/)：12 篇完全翻译的参考指南（v1.3 新增）

### 核心

- [skills/ecd/SKILL.md](skills/ecd/SKILL.md)：Claude Code Skill 本体
- [skills/ecd/scripts/](skills/ecd/scripts/)：CLI 辅助脚本（纯 Python 标准库 + 可选 `pyyaml`）
- [skills/ecd/templates/](skills/ecd/templates/)：markdown 模板（Lite 与 Full 双版）
- [skills/ecd/schemas/](skills/ecd/schemas/)：normalized case 的结构说明
- [skills/ecd/references/](skills/ecd/references/)：playbook、质量门槛、子代理协议
- [skills/ecd/agents/](skills/ecd/agents/)：Claude Code Agent 接口定义

### 元信息

- [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)：版本历史与更新日志
- [.claude-plugin/](.claude-plugin/)：Claude Code 插件元数据

## 参与贡献

欢迎贡献！参与方式：

- **Bug 报告与功能建议**：在 [GitHub Issues](https://github.com/Zyc-Bryce/ECD/issues) 提交 issue
- **Pull Request**：fork 仓库 → 创建 feature 分支 → 向 `main` 提交 PR
- **文档改进**：修正、翻译、补充示例——全部欢迎
- **提交 PR 前**：请确保 CLI 脚本基础校验可正常通过（`python skills/ecd/scripts/validate_ecl_bundle.py --help`）

## 致谢

本技能基于 [@Etherstrings](https://github.com/Etherstrings) 创建的 [Evolution Constraint Planner](https://github.com/Etherstrings/evolution-constraint-planner)。原始的 ECL v2 方法论、CLI 脚本、模板、schema 和参考资料均为 Codex 设计，现已适配至 Claude Code。

## 许可证

MIT
