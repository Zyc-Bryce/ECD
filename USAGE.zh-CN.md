# ECD v1.1 使用指南

> 演进约束开发 (Evolutionary Constraint Development) — 从模糊需求到可运行代码的完整闭环
>
> 🆕 **第一次接触 ECD？** 先读 [`skills/ecd/docs/zh-CN/beginners-guide.md`](skills/ecd/docs/zh-CN/beginners-guide.md) —— 专为零基础用户编写的入门指南。
> 本文档是完整参考手册，适合已经了解基本概念的用户。

## 目录

1. [快速上手：5 分钟理解 ECD](#快速上手)
2. [复杂度分类器：选择正确的等级](#复杂度分类器)
3. [三级工作流详解](#三级工作流详解)
4. [Superpowers 集成](#superpowers-集成)
5. [增量模式](#增量模式)
6. [常见场景与示例](#常见场景与示例)
7. [FAQ 与常见错误](#faq-与常见错误)

---

## 快速上手

### 触发方式

在 Claude Code 中输入以下任一关键词即可激活 ECD：

```
/ecd
```
或直接说出需求，包含触发词：`ecd`、`ECL`、`演进约束`、`pre-plan-code-achieve`

### 最简示例

```
用户："用 ECD 给这个 React 项目加个暗色模式切换"
```

ECD 会自动：
1. **静默分类**：判定为 L1 (≤3文件，UI风险，需求清晰)
2. **A-Lite**：问你最多 3 个问题（CSS方案？跟随系统？持久化？）
3. **审批**：呈现紧凑审批包，你确认
4. **J-Lite**：编译最小交接包
5. **code**：执行实现
6. **achieve-Lite**：验收关闭

**从需求到代码，L1 任务全程约 2-3 轮交互，消耗 15k-30k Token。**

### 四个命令

| 命令 | 作用 | 何时触发 |
|------|------|---------|
| `pre` | 质疑澄清 + 冻结审批目标 | 需求提出时 |
| `plan` | 收敛需求 + 冻结交接包 | pre 审批通过后 |
| `code` | 严格按交接包执行编码 | plan 完成且 code_ready=true |
| `achieve` | 基于证据判定验收关闭 | code 执行完毕后 |

---

## 复杂度分类器

### 工作原理

在执行任何阶段之前，ECD 会**静默**（不向你提问）评估 3 个问题，然后自动选择最合适的流程等级。

### 三问评估

| 问题 | L1 (轻量) | L2 (标准) | L3 (重量) |
|------|-----------|-----------|-----------|
| **Q1: 代码影响面有多大？** | ≤3 个文件 | 4–10 个文件 | >10 个文件 |
| **Q2: 出错后果多严重？** | 仅UI样式/文案 | 功能逻辑/API行为 | 数据丢失/认证/支付/PII |
| **Q3: 需求说得清楚吗？** | 明确无歧义 | 部分细节待定 | **模糊（如"让它变快"）→ 强制 L3** |

**定级规则：** `最终等级 = max(Q1, Q2, Q3)`。Q3 为"模糊"时强制升级到 L3。

### 如何手动指定等级

如果你明确知道自己需要哪个等级：

```
用户："用 ECD L1 加个暗色模式"      → 强制 L1
用户："用 ECD Full 做认证系统"      → 强制 L3
用户："--tier standard 加个 API"   → 强制 L2
```

### 等级速查表

| | L1 ECD-Lite | L2 ECD-Standard | L3 ECD-Full |
|---|------------|----------------|-------------|
| **适用** | 暗色模式、修bug、文案修改、单组件改动 | 新增API、中等功能、多文件改动 | 认证系统、架构变更、安全敏感、需求模糊 |
| **阶段数** | 2–3 | 5–7 | 10 |
| **子Agent** | 0 | 0–2 (可选) | 5 (全部强制) |
| **Token** | 15k–30k | 35k–55k | 65k–105k |
| **交互轮数** | 1–2 | 2–4 | 4–8 |
| **时间** | 快（类似原生Claude） | 中等 | 慢（完整流程） |

---

## 三级工作流详解

### L1 ECD-Lite：轻量级（暗色模式、修Bug、文案修改）

**流程：** `A-Lite → J-Lite → code → achieve-Lite`

**A-Lite 阶段：**
- 最多问你 **3 个问题**
- 冻结：重述目标、保留范围、排除范围、3–5项验收检查、关键假设
- 呈现**紧凑审批包**：5 行以内，你确认即可

**J-Lite 阶段（后台自动）：**
- 将 A-Lite 输出编译为最小交接包
- 仅生成 `90-code-handoff.md`，无伴侣文档

**code 阶段：**
- 从交接包严格执行，不发明产品语义
- 每个实现单元完成后自动验证

**achieve-Lite 阶段：**
- 运行验证命令 → 检查首次打开体验 → 裁决

**示例对话：**

```
👤 用户："给这个项目加个暗色模式切换"
🤖 ECD："[L1 暗色模式] 我看一下项目结构...
        Q1: 项目用的是 CSS 变量还是 Tailwind？
        Q2: 需要跟随系统偏好 (prefers-color-scheme) 吗？
        Q3: 用户的选择需要持久化到 localStorage 吗？"

👤 用户："CSS变量，跟随系统，需要持久化"

🤖 ECD："[审批包]
        🎯 目标：添加暗色模式切换（CSS变量方案）
        ✅ 范围：CSS变量定义、ThemeContext、Toggle组件、localStorage持久化、系统偏好检测
        ❌ 排除：第三方组件库主题适配、过渡动画
        ✅ 验收：1)切换按钮可见可用 2)刷新后保持选择 3)首次跟随系统偏好
        🔒 冻结：CSS变量方案、手动选择覆盖系统偏好
        确认？"

👤 用户："确认"

🤖 ECD："[J-Lite] 编译交接包..."
        "[code] 执行实现单元1/5: CSS变量定义 ✅"
        "[code] 执行实现单元2/5: ThemeContext ✅"
        "[code] 执行实现单元3/5: Toggle组件 ✅"
        "[code] 执行实现单元4/5: App集成 ✅"
        "[code] 执行实现单元5/5: localStorage持久化 ✅"
        "[achieve-Lite] 验证通过 ✅ 首次打开体验正常 ✅ archived"
```

---

### L2 ECD-Standard：标准级（新增API、中等功能）

**流程：** `A → B → C → D(可选) → E(精简) → H(可选) → J → code → achieve`

- **A 阶段**：标准 3–5 个反问
- **B 阶段**：生成 2–3 个技术方案，保留 1 个
- **C 阶段**：拆解为需求单元和接口契约
- **D 阶段（可选）**：需求单元 >5 或有横切关注点时，启动独立批判子Agent
- **E 阶段（精简）**：仅解决高影响依赖缺口
- **H 阶段（可选）**：交接包 >3 个实现单元时，启动独立评审子Agent
- **J 阶段**：标准编译交接包 + 伴侣文档
- **code + achieve**：同 L1

**D/H 可选决策规则：**
- D (批判)：`requirement_units > 5` 或存在横切关注点 → 运行
- H (评审)：`implementation_units > 3` → 运行

---

### L3 ECD-Full：重量级（认证系统、架构变更、安全敏感）

**流程：** `A → B → C → D → E → F → G → H → J → code → achieve`

**完全等同于 ECD v1.0。** 10 阶段全部执行，5 次强制独立子Agent：

| 阶段 | 子Agent | 作用 |
|------|---------|------|
| D | 批判Agent ×1 | 独立攻击模糊/矛盾/不可验证的需求 |
| G | 红方Agent + 蓝方Agent | 红方攻击边界/滥用/依赖断裂；蓝方防守并命名残余风险 |
| H | 评审Agent ×1 | 判断下一编码者是否还需发明产品语义 |
| J | 编译Agent ×1 | 将A-H收敛结果编译为代码就绪的交接包 |

**何时必须用 L3：**
- 需求模糊（如"让这个应用变快"）— ECD 会在 Stage A 阻止你盲目编码
- 涉及认证/支付/数据安全
- 架构级变更（影响 >10 个文件）
- 需要通过审计追踪

---

## Superpowers 集成

ECD 和 Superpowers 是互补关系。ECD 管"做什么"（语义冻结），Superpowers 管"怎么做得好"（工程纪律）。

### 三种组合模式

#### 模式 A：ECD Plan + Superpowers Execute（推荐大中功能）

```
ECD pre/plan (语义冻结)
  → Superpowers using-git-worktrees (隔离工作区)
  → Superpowers test-driven-development (从ECD契约写测试)
  → 执行编码
  → Superpowers verification-before-completion (验证)
  → ECD achieve (证据关闭)
```

#### 模式 B：ECD Lite + Superpowers TDD（小功能）

```
ECD A-Lite → J-Lite (快速冻结)
  → Superpowers test-driven-development (TDD纪律)
  → Superpowers verification-before-completion
  → ECD achieve-Lite
```

#### 模式 C：仅 Superpowers（Bug修复/重构）

```
需求已经明确 → 直接用 Superpowers (TDD + code-review + verification)
```

### 交接格式

| ECD 输出 | 映射到 Superpowers |
|----------|-------------------|
| `90-code-handoff.md` → `implementation_units` | `writing-plans` 任务列表 |
| `90-code-handoff.md` → `function_contracts` | TDD 测试规格 |
| `90-code-handoff.md` → `verification_commands` | `verification-before-completion` 检查项 |
| `90-code-handoff.md` → `acceptance_checks` | 最终验收清单 |
| `05-constraint-ledger.md` → `frozen_constraints` | "不要重新解释"护栏 |

---

## 增量模式

已有 ECD bundle 的项目，后续修改不需要重走完整流水线。

### 触发条件

1. 目标路径已存在 ECD bundle（有 `00-overview.md` + `90-code-handoff.md`）
2. 你的请求是有限范围的变更（不是完整重写）
3. 满足条件 → 自动进入增量模式，**跳过复杂度分类器**

### 变更路由

| 你要做什么 | 从哪个阶段进入 | 示例 |
|-----------|-------------|------|
| 改变产品语义 | Stage A | "改成支持多用户" |
| 改变实现方案 | Stage C | "从 SQLite 换成 PostgreSQL" |
| 纯增量功能 | Stage J | "给登录页加个 loading spinner" |
| Bug 修复 | 直接 `/code` | "登录按钮点两下会提交两次" |

### 示例

```
👤 用户："在上次的 ECD handoff 里给登录表单加个 loading spinner"

🤖 ECD："[增量模式] 检测到已有 bundle...
        变更分析：纯增量，在现有架构内
        重入阶段：Stage J
        保留 A-H 不变，仅更新 90-code-handoff.md
        新增实现单元：登录表单 loading 状态..."
```

---

## 常见场景与示例

### 场景 1："加个暗色模式"

```
分类：L1 ECD-Lite
流程：A-Lite(3问) → J-Lite → code → achieve-Lite
Token：~20k
时间：~2-3轮交互
```

### 场景 2："构建用户注册 API，含验证和错误处理"

```
分类：L2 ECD-Standard（4-10文件，功能逻辑风险）
流程：A → B → C → D(可选) → E(精简) → H(可选) → J → code → achieve
Token：~45k-55k
时间：~3-5轮交互
是否运行D：看需求单元是否>5
是否运行H：看实现单元是否>3
```

### 场景 3："让这个应用变快"

```
分类：L3 ECD-Full（需求模糊 → 强制L3）
流程：Stage A 发现需求太模糊 → 阻塞
ECD："'变快'不够具体。你需要的是首屏加载<2s？还是交互响应<100ms？
      建议先跑 Lighthouse 审计，拿到数据后再回来。"
Token：~18k（在Stage A就停了，后面的都不执行）
效果：阻止了大量无效的"猜测性优化"
```

### 场景 4："给现有 Express 应用加认证"

```
分类：L3 ECD-Full（安全敏感）
流程：完整10阶段，含红蓝对抗
红方攻击：JWT过期？中间件绕过？用户枚举？时序攻击？
蓝方防御：短TTL + refresh token、统一错误响应时间、速率限制
Token：~90k-120k
效果：交付的认证方案覆盖了原生Claude和Superpowers都会遗漏的安全漏洞
```

### 场景 5："做一个 todo 应用"（从零开始）

```
分类：L2 ECD-Standard（绿地项目默认L2，需求通常有部分细节待定）
流程：A → B → C → D(可选) → E(精简) → H(可选) → J → code → achieve
如果需求特别模糊（"做个todo"无任何细节）→ Q3模糊 → 自动升级L3
```

### 场景 6：已有 bundle 的增量修改

```
分类：增量模式（跳过分类器）
用户："在上次那个 bundle 里把密码最小长度从8改成12"
分析：不改变语义，不改变架构
重入：Stage J → 更新交接包 → code → achieve
Token：~10k
```

---

## FAQ 与常见错误

### Q: 为什么我的简单需求被分到了 L3？

A: 最可能的原因是你的需求表述太模糊。比如"优化一下"、"让它更好"、"改进性能"——这些都会被 Q3 判定为"模糊"并强制升级到 L3。**解决方法：** 把需求说具体一点，比如"给登录按钮加 loading 状态"而不是"改进登录体验"。

### Q: ECD 是不是比原生 Claude 慢很多？

A: L1 (Lite) 模式和原生 Claude 速度差不多（2-3轮交互）。L3 (Full) 确实慢——但这是因为它在做原生 Claude 不会做的事情（红蓝对抗、独立审查、语义挖掘）。对安全敏感或需求模糊的任务，这个"慢"是在避免后续的"错"。

### Q: 什么时候应该用 ECD，什么时候用 Superpowers？

A:

| 场景 | 推荐 |
|------|------|
| 需求模糊/矛盾 | ECD L3（先冻结语义再动手） |
| 需求明确但有安全要求 | ECD L3 pre/plan + Superpowers execute |
| 需求明确的中等功能 | ECD L2 或 Superpowers（效果接近） |
| 简单功能/修bug | ECD L1 或仅 Superpowers |
| 重构（行为不变） | 仅 Superpowers |
| 绿地项目（从零开始） | ECD L2/L3 pre/plan + Superpowers execute |

### Q: 增量模式和分类器谁先执行？

A: **增量模式优先。** 只要检测到已有 bundle + scoped change，直接进入增量模式，完全跳过复杂度分类器。

### Q: 我可以强制指定等级吗？

A: 可以。在请求中加入 `--tier lite`、`--tier standard` 或 `--tier full`，或者直接说"用 ECD L1/L2/L3"。

### Q: 如果我对自动分类不满意怎么办？

A: 直接用上面的方式手动覆盖。分类器的判断基于代码影响面、风险和清晰度——如果你更了解任务，你的判断优先。

### Q: L1/L2 的 bundle 能不能升级到 L3？

A: 可以。如果 L1/L2 执行过程中发现了隐藏的复杂度（比如 L2 的 D 批判发现了严重的安全问题），可以升级到 L3 补跑缺失的阶段。

### 常见错误

❌ **"用 ECD 修个拼写错误"** → L1 就够，不要手动指定 Full
❌ **"用 ECD 做认证系统"但没有说具体需求** → 会被分到 L3（正确！），但 Stage A 会因为需求不具体而阻塞你
❌ **增量模式下说"全面重构"** → 这不适合增量模式，会被路由回完整流程
❌ **L3 Stage A 时嫌问题太多而跳过** → 这会导致后续阶段变成"替用户补语义"，失去 ECD 的核心价值
