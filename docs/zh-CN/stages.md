# ECD 阶段模型

## 阶段总览

ECD 把交付过程拆成带所有权边界的阶段。每条边界都是为了阻止某一种语义漂移。

| 阶段 | 所有者 | 核心目的 | 主产物 | 是否必须独立子 Agent |
| --- | --- | --- | --- | --- |
| `pre` / A | 主模型 | 追问请求并冻结 approval target | `10-a-preprocess.md` | 可选 support agents |
| B | 主模型 | 生成真正不同的保留路径 | `20-b-divergence.md` | 否 |
| C | 主模型 | 冻结需求单元与后续 coding cut line | `30-c-requirements.md` | 否 |
| D | critique agent + 主模型 | 独立攻击模糊或浪费的需求 | `40-d-critique.md` | 是 — `Agent` 工具 |
| E | 主模型 | 闭合依赖缺口和执行前置条件 | `50-e-closure.md` | 否 |
| F | 主模型 | 用 repo / 环境现实验证规划 | `60-f-probes.md` | 否 |
| G | red agent + blue agent + 主模型 | 攻击并防守保留路径 | `70-g-red-blue.md` | 是 — `Agent` 工具（两次调用） |
| H | review agent + 主模型 | 判断下一个 coder 是否还得发明含义 | `80-h-review.md` | 是 — `Agent` 工具 |
| J | compile-for-code agent + 主模型 | 把 A-H 编译成 code-ready package | `98-j-compile-for-code.md`、`99-code-handoff.md` | 是 — `Agent` 工具 |
| `code` | coding model | 严格按 handoff 执行 | `Runs/<run-id>/00-code-run.md` | 否 |
| `achieve` | closure model | 判断结果是否真的满足验收 | `Runs/<run-id>/03-achieve.md` | 否 |

## 共享真值面

整个流程里最关键的两份文件是：

- `05-constraint-ledger.md`：共享规划真值面
- `90-code-handoff.md`：唯一真实的 `code` 入口

配套 companion bundle 负责把这些真值展开成可检查、可执行的表面：

- `91-canonical-contracts.md`
- `92-constraint-crosswalk.md`
- `95-execution-manifest.md`
- `96-code-batches.md`
- `97-code-preflight.md`
- `98-j-compile-for-code.md`
- `99-code-handoff.md`

## `pre` 与 A 阶段

`pre` 拥有 approval gate。

### 输入

- 原始请求
- repo 现实
- 本地文档、测试、配置、产品线索

### 输出

- reframed request
- ambiguity list
- hidden assumptions
- scenario fragments
- approval pack

### 退出门

只有用户明确批准了重述后的方向，才允许离开 Stage A。

### A 为什么存在

如果这里问得不够狠，后面的每个阶段都会变成替用户补语义。

## B / Divergence

Stage B 强制在收敛前展开选项空间。

### 输入

- 已经过 Stage A 冻结的理解

### 输出

- 真正不同的 options
- retained option id
- dropped options

### 退出门

必须且只能保留一条路径。样式微调不算真实 option。

## C / Requirements

Stage C 把保留下来的路径翻成实现相关的需求单元。

### 输入

- retained option
- constraint ledger

### 输出

- requirement units
- interface contracts
- validation targets
- frozen terms

### 退出门

内容必须具体到让 coder 不再需要发明产品含义。

## D / Critique

Stage D 是第一个强制独立攻击阶段。

### 输入

- 保留后的 requirement package

### 输出

- critique findings
- conflicts
- dropped pseudo-requirements
- resolution decisions

### Claude Code 实现

使用 `Agent` 工具启动独立 critique 子 Agent：
```
Agent(description: "Independent critique of requirements", subagent_type: "general-purpose", prompt: "你是一名独立评论员...")
```

### 退出门

如果 `Agent` 工具不可用，必须诚实地把阶段标成 `blocked_by_agent_unavailable`，而不是假装 complete。

## E / Closure

Stage E 负责补齐依赖链上的漏洞。

### 输入

- retained requirements
- critique 决策

### 输出

- end-to-end dependency chain
- dependency gap resolutions
- completion chain

### 退出门

进入编码前，不能再留高影响依赖缺口。

## F / Probes

Stage F 让规划接受 repo 和环境现实的检验。

### 输入

- 关于 repo、命令或环境的假设

### 输出

- probes
- discarded paths
- surviving paths

### Claude Code 实现

使用 `Bash` 工具实际运行探针代码，验证技术路径可行性。

### 退出门

complete 状态必须伴随可执行证据，或者伴随明确的无法探测说明。

## G / Red-Blue

Stage G 在批准前强制加入对抗压力。

### 输入

- retained path
- dependency chain
- probe evidence

### 输出

- red-team attacks
- blue-team mitigations
- residual risks

### Claude Code 实现

使用 `Agent` 工具启动两次独立调用——先红方、后蓝方。两次调用必须独立，不可由主模型自己扮演。

### 退出门

所有攻击要么被缓解，要么被明确写成残余风险。

## H / Review

Stage H 是 coding-readiness gate。

### 输入

- 完整的 A-H package

### 输出

- verdict
- blockers 或 approval conditions
- rationale
- 如果被拒绝，应该回到哪个阶段

### Claude Code 实现

使用 `Agent` 工具启动独立 review 子 Agent。不得将主模型的偏好答案传递给 Review Agent。

### 退出门

只要下一位 coder 还需要补产品语义、验证含义、状态行为或者依赖行为，H 就必须拒绝。

## J / Compile For Code

Stage J 负责把规划真值编译成 coder 真正可执行的产物。

### 输入

- 已收敛的 A-H package
- 当前 handoff 状态

### 输出

- code-ready verdict
- companion docs
- final handoff summary
- reopen stage if blocked

### Claude Code 实现

使用 `Agent` 工具启动独立 compile 子 Agent。

### 退出门

只有当下一个编码模型不需要重新解释产品含义时，才允许把 `code_ready` 标成 `true`。

## `code`

`code` 是执行阶段，不是解释阶段。

### 必要入场条件

- 存在 bundle path 或 handoff path
- `90-code-handoff.md` 存在
- `ecl.code_handoff.code_ready=true`
- repo target 存在

### 必要行为

- 只读 handoff 和显式引用的文件
- 用 `TaskCreate`/`TaskUpdate` 跟踪实现单元进度
- 严格按 implementation units 顺序执行
- 每个 unit 后都用 `Bash` 运行验证
- 更新 `97-code-preflight.md`
- 用 `Write` 写回 `00-code-run.md` 和 `01-verification.md`

### 回流规则

只要出现高影响语义缺口，就必须停止，并回流到最早破掉的阶段。

## `achieve`

`achieve` 决定证据是否足以支持 closure。

### 输入

- 已通过校验的 bundle
- 最近一次真实 code run
- acceptance checks
- verification evidence

### 输出

- achieve verdict
- archive status
- archive reason
- next actions

### Claude Code 实现

运行 `python scripts/ecl.py achieve --case /abs/path/to/bundle` 渲染 achieve 判定。

### 退出门

只要验收失败或者首开体验明显有问题，这个 case 就必须保持 open。
