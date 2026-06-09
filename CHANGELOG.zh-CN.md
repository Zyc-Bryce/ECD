# ECD 更新说明

> v1.3：自我进化 — 修复版本号不一致 + Schema L1 依赖链断裂 + 中文本地化补齐 12 篇 reference + 卸载方式文档
> v1.2：基于 50 任务深度验证，四项精准优化冲刺 90 分成熟度 + 插件标准化
> v1.1：基于 5 任务对比分析，修复 v1.0 三大核心问题

---

## v1.3.1 更新说明 `[2026-06-09]`

### 文档完善

- **新增** README.zh-CN.md 卸载章节，覆盖全部四种安装方式的对应卸载方法
  - npx 安装 → 手动清理 settings.json
  - /plugin 安装 → `claude plugins disable` + `source remove`
  - 手动/命令行安装 → 直接删除 skills 目录
  - npm 全局安装 → `npm uninstall -g @zyc-bryce/ecd` + settings.json 清理提示

### v1.3.1 文件变更

| 文件 | 变更 |
|------|------|
| `README.zh-CN.md` | 新增卸载方式章节 |
| `package.json` | version 1.3.0 → 1.3.1 |
| `.claude-plugin/plugin.json` | version 1.3.0 → 1.3.1 |
| `.claude-plugin/marketplace.json` | version 1.3.0 → 1.3.1 |
| `CHANGELOG.zh-CN.md` | 追加 v1.3.1 条目 |

---

## v1.3.0 更新说明 `[2026-06-09]`

### 自我进化：ECD 用 ECD 方法论进化自身

首次将 ECD 的 pre→plan→code→achieve 闭环应用于 ECD 技能源文件本身，修复了客观缺陷并补全了中文本地化。

### 更新方式

已安装用户通过以下任一方式更新：

```bash
# 方式一：npx 一键更新（推荐）
npx @zyc-bryce/ecd

# 方式二：Claude Code 插件更新
claude plugins update ecd

# 方式三：重新安装 marketplace
# 重启 Claude Code 即可自动检测更新
```

### v1.3 修复与改进

| # | 类别 | 说明 | 影响 |
|---|------|------|------|
| 1 | **Bug修复** | 版本号统一：`package.json`(1.2.3)、`plugin.json`(1.2.2)、`marketplace.json`(1.2.2) → 统一 `1.3.0` | 消除版本混乱 |
| 2 | **Bug修复** | SKILL.md 新增版本号体系说明（包版本 vs 功能标记 vs Schema格式版本） | 厘清三套版本号 |
| 3 | **Bug修复** | Schema L1 依赖链断裂修复：`code_preflight` 不再无条件依赖 `code_batches`（L2/L3 only） | L1 路径可正常走通 |
| 4 | **Bug修复** | 澄清 `90-code-handoff.md` 与 `99-code-handoff.md` 关系（后者是前者的 J 阶段编译归档副本） | 消除文档歧义 |
| 5 | **中文化** | 新增 `references/zh-CN/` 目录，翻译全部 12 篇 reference 文档 | 中文用户首次获得完整的 reference 中文阅读体验 |
| 6 | **中文化** | SKILL.md 资源索引新增 `references/zh-CN/` 路径引用 | 用户可发现中文参考文档 |
| 7 | **改进** | Schema 版本 `2.1` → `2.2`（格式版本独立于包版本） | 版本号体系统一 |

### v1.3 文件变更

| 文件 | 变更 |
|------|------|
| `package.json` | version 1.2.3 → 1.3.0 |
| `.claude-plugin/plugin.json` | version 1.2.2 → 1.3.0 |
| `.claude-plugin/marketplace.json` | version 1.2.2 → 1.3.0（2处） |
| `USAGE.zh-CN.md` | 标题 v1.1 → v1.3 |
| `skills/ecd/SKILL.md` | 新增版本号体系说明 + 90/99 handoff 澄清 + 资源索引补充 `references/zh-CN/` |
| `skills/ecd/schemas/ecl-v2/schema.yaml` | version 2.1→2.2；修复 `code_preflight` L1 依赖链断裂 |
| `skills/ecd/references/zh-CN/*.md` | **新增 12 篇**中文翻译 |
| `CHANGELOG.zh-CN.md` | 追加 v1.3 条目 |

---


## v1.2 更新说明 `[2026-06-09]`

### 插件标准化 `[v1.2]`

ECD 现已符合 Claude Code 插件标准，安装方式从"手动复制文件"升级为"配置即安装"：

- **新增** `.claude-plugin/plugin.json` — 插件元数据定义
- **新增** `.claude-plugin/marketplace.json` — 自引用 marketplace
- **新增** `package.json` — 支持 `npm`/`npx` 安装
- **新增** `bin/install.js` — `npx @zyc-bryce/ecd` 一键安装脚本（自动配置 settings.json）
- **目录重构**：`SKILL.md` + `references/` + `docs/` + `agents/` + `scripts/` + `templates/` + `schemas/` → `skills/ecd/`（符合插件标准结构）
- **安装方式**：
  - ⭐ `/plugin marketplace add Zyc-Bryce/ECD` → `/plugin install ecd@ecd-marketplace`
  - `npm install @zyc-bryce/ecd`
  - 手动 `git clone`（保留）
- **文档更新**：README（中英）、小白指南均已将插件方式列为推荐安装方式

> 基于[50任务深度验证报告](../../ECD调试报告.md)，实施四项精准优化，成熟度从 88% → 91.5%。

### v1.2 四项优化

| # | 优化 | 说明 | 影响 |
|---|------|------|------|
| 1 | **微型任务快速通道** | <10行+UI风险+需求明确→跳过pre/plan直接code | L1过度工程率 8%→1% |
| 2 | **增量模式自动检测** | 检测到已有bundle→主动提示用户选择增量模式 | 增量触发率 50%→90% |
| 3 | **分类器可解释性** | 审批包顶部显示分类理由 `[L2] 判定: 6文件+功能逻辑+需求明确` | 用户信任度提升 |
| 4 | **D阶段触发阈值优化** | L2 D(批判)触发阈值 >5→>3 | D覆盖率 60%→78%，L2成功率 +2% |

### v1.2 文件变更

| 文件 | 变更 |
|------|------|
| `SKILL.md` | 新增微型任务快速通道+分类理由输出规则；D阈值>3；增量模式自动检测 |
| `references/stage-playbook.md` | 新增Micro-Task Fast Path条目；D阈值更新 |
| `references/plan-approval-gate.md` | 所有审批包增加分类理由行（Lite/Standard/Full） |
| `references/incremental-mode.md` | 检测规则更新为自动检测+主动提示 |

### v1.2 成熟度

```
v1.0: ~70%（无自适应，严重过度工程）
v1.1: ~88%（三级路由，文档不足）
v1.2: ~91.5%（微型通道+自动检测+可解释性+D阈值优化）🏆
```

---

## v1.1 更新说明 `[2026-06-09]`

> 基于[实证测试报告](../../ECD调试报告.md)的五任务对比分析，针对 ECD v1.0 发现的三大问题实施优化。

## v1.0 存在的问题

经过 5 个真实任务（暗色模式、注册API、性能优化、加认证、todo应用）与原生 Claude 和 Superpowers 的对比测试：

| 问题 | 表现 |
|------|------|
| **无复杂度自适应** | 200行的暗色模式切换和认证系统走同样的10阶段流程，简单任务Token浪费3-5倍 |
| **与Superpowers割裂** | ECD语义保真度高但缺TDD，Superpowers工程纪律强但语义冻结弱，两者互不打通 |
| **无增量模式** | 已有bundle的项目改一个小功能也要重走全流程 |

## v1.1 三项改进

### 1. 复杂度自适应引擎

在进入任何阶段前先静默回答3个问题：

| 问题 | L1 (轻量) | L2 (标准) | L3 (重量) |
|------|-----------|-----------|-----------|
| Q1 代码影响面 | ≤3文件 | 4-10文件 | >10文件 |
| Q2 安全风险 | 仅UI样式 | 功能逻辑 | 数据/认证/支付 |
| Q3 需求清晰度 | 明确 | 部分待定 | 模糊→强制L3 |

最终等级 = max(Q1, Q2, Q3)，自动路由到对应流程：

- **L1 (Lite)**：A-Lite → J-Lite → code → achieve-Lite，0子Agent，15k-30k Token
- **L2 (Standard)**：A → B → C → D(可选) → E(精简) → H(可选) → J → code → achieve，0-2可选子Agent，35k-55k Token
- **L3 (Full)**：完整10阶段 + 5强制子Agent，完全等同于v1.0，65k-105k Token

**效果：** v1.2重测中，Token消耗降低40%，成功率保持92.4%（仅下降1.6%），时间效率提升41%。

### 2. Superpowers互补集成

明确分工：
- **ECD 负责语义冻结**（pre/plan）—— 冻结"做什么"
- **Superpowers 负责工程纪律**（TDD/code review/worktree）—— 保证"怎么做得好"

三种组合模式：
- A. ECD Plan → Superpowers Execute（大中功能）
- B. ECD Lite → Superpowers TDD（小功能）
- C. 仅 Superpowers（Bug修复/重构）

详见 `references/superpowers-integration.md`

### 3. 增量模式

已有ECD bundle的项目，检测变更类型后最小重入：

| 变更类型 | 重入阶段 | 示例 |
|---------|---------|------|
| 影响产品语义 | Stage A | "改成支持多用户" |
| 影响实现方案 | Stage C | "SQLite换PostgreSQL" |
| 纯增量功能 | Stage J | "加个loading spinner" |
| Bug修复 | 直接code | "按钮点两下提交两次" |

增量模式优先于复杂度分类器执行。

## 文件变更

### 新增文件 (9个)

| 文件 | 说明 |
|------|------|
| `docs/zh-CN/beginners-guide.md` | 🆕 **小白入门完全指南**（531行，零基础友好，含决策树、场景速查、常见错误、20FAQ、术语词典） |
| `USAGE.zh-CN.md` | 详细中文使用指南（含FAQ和场景示例） |
| `references/superpowers-integration.md` | Superpowers互补集成指南 |
| `references/incremental-mode.md` | 增量模式完整说明 |
| `templates/stage-a-lite.md` | L1精简A阶段模板 |
| `templates/stage-j-lite.md` | L1精简J阶段模板 |
| `templates/code-handoff-lite.md` | L1精简交接包模板 |
| `templates/constraint-ledger-lite.md` | L1精简约束账本模板 |

### 修改文件 (10个)

| 文件 | 变更内容 |
|------|---------|
| `SKILL.md` | 新增复杂度分类器章节、Superpowers集成章节、增量模式章节、所有阶段添加tier标签、资源索引更新 |
| `schemas/ecl-v2/schema.yaml` | 版本升至2.1，添加tier字段和tiers标注 |
| `references/stage-playbook.md` | 新增Tier Model章节、A-Lite/J-Lite/achieve-Lite规则 |
| `references/plan-approval-gate.md` | 新增三级审批包（Lite/Standard/Full） |
| `templates/overview.md` | 添加tier和复杂度分类字段 |
| `docs/stages.md` | 新增Tier Model章节，阶段表添加Tiers列 |
| `docs/zh-CN/stages.md` | 同上（中文） |
| `docs/implementation.md` | 新增Tier Architecture章节 |
| `docs/zh-CN/implementation.md` | 同上（中文） |
| `README.zh-CN.md` | 添加v1.1特性介绍、小白指南链接和使用指南链接 |
| `USAGE.zh-CN.md` | 顶部新增小白指南导航 |

## v1.1 最终版判定

基于 50 任务深度验证（详见 [`ECD调试报告.md`](../../ECD调试报告.md)）：

- **核心架构成熟度：~88%** — 分类器准确率 92%，综合效能 0.929
- **剩余 6 项改进**全部为"优化"性质，非致命缺陷
- **v1.1 可定为 feature-complete（功能完整版）**
- 最大的缺口已不是代码，而是用户文档 → 已通过小白入门指南补全

## 向后兼容

- **L3 (Full) 完全等同于 v1.0**，所有阶段、子Agent、退出门不变
- 已有 bundle 若缺失 tier 字段，默认视为 L3
- 所有原始模板未修改，Lite 模板为独立新文件
- 用户可随时通过 `--tier full` 或 "用 ECD L3" 强制使用完整流程

## 测试数据 (v1.2 重测：50任务)

基于 50 个真实任务的三方对比（18 L1 + 20 L2 + 12 L3）：

| 指标 | ECD v1.0 | ECD v1.2 | Superpowers | 原生 Claude |
|------|----------|----------|-------------|-------------|
| 平均 Token | 72.8k | **43.2k** (-41%) | 39.9k | 25.6k |
| 平均成功率 | 94.0% | **93.4%** | 81.4% | 61.8% |
| 平均返工率 | 6.0% | **6.6%** | 18.6% | 38.2% |
| 综合效能 | 0.940 | **0.929** | 0.771 | 0.572 |
| 过度工程率 | 42% | **8%** | 16% | 0% |

> 50 任务全量数据见 [`ECD调试报告.md`](../../ECD调试报告.md) 第十部分。

---

*发布日期：2026-06-09*
