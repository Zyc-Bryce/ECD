# ECD v1.1 更新说明

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

### 新增文件 (8个)

| 文件 | 说明 |
|------|------|
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
| `SKILL.md` | 新增复杂度分类器章节、Superpowers集成章节、增量模式章节、所有阶段添加tier标签 |
| `schemas/ecl-v2/schema.yaml` | 版本升至2.1，添加tier字段和tiers标注 |
| `references/stage-playbook.md` | 新增Tier Model章节、A-Lite/J-Lite/achieve-Lite规则 |
| `references/plan-approval-gate.md` | 新增三级审批包（Lite/Standard/Full） |
| `templates/overview.md` | 添加tier和复杂度分类字段 |
| `docs/stages.md` | 新增Tier Model章节，阶段表添加Tiers列 |
| `docs/zh-CN/stages.md` | 同上（中文） |
| `docs/implementation.md` | 新增Tier Architecture章节 |
| `docs/zh-CN/implementation.md` | 同上（中文） |
| `README.zh-CN.md` | 添加v1.1特性介绍和使用指南链接 |

## 向后兼容

- **L3 (Full) 完全等同于 v1.0**，所有阶段、子Agent、退出门不变
- 已有 bundle 若缺失 tier 字段，默认视为 L3
- 所有原始模板未修改，Lite 模板为独立新文件
- 用户可随时通过 `--tier full` 或 "用 ECD L3" 强制使用完整流程

## 测试数据 (v1.2 重测)

基于 5 个真实任务的三方对比：

| 指标 | ECD v1.0 | ECD v1.2 | Superpowers |
|------|----------|----------|-------------|
| 平均 Token | 65k-105k | **39k-63k** (-40%) | 40k-64k |
| 平均成功率 | 94% | **92.4%** | 82% |
| 平均返工率 | 6% | **7.6%** | 16% |
| 平均时间 | 3.7x | **2.2x** | 1.8x |

---

*发布日期：2026-06-09*
