# ECD Stage Model

## Stage Overview

ECD separates the delivery loop into ownership boundaries. Each boundary exists to stop one class of semantic drift.

| Phase | Owner | Primary purpose | Main artifact | Real subagents required |
| --- | --- | --- | --- | --- |
| `pre` / A | parent model | interrogate the request and freeze the approval target | `10-a-preprocess.md` | optional support agents only |
| B | parent model | generate materially different retained paths | `20-b-divergence.md` | no |
| C | parent model | freeze requirement units and future coding cut lines | `30-c-requirements.md` | no |
| D | critique agent + parent model | independently attack vague or wasteful requirements | `40-d-critique.md` | yes |
| E | parent model | close dependency gaps and execution prerequisites | `50-e-closure.md` | no |
| F | parent model | run reality probes against the repo and environment | `60-f-probes.md` | no |
| G | red agent + blue agent + parent model | attack and defend the retained path | `70-g-red-blue.md` | yes |
| H | review agent + parent model | decide whether the next coder would still need to invent meaning | `80-h-review.md` | yes |
| J | compile-for-code agent + parent model | compile A-H into a code-ready package | `98-j-compile-for-code.md`, `99-code-handoff.md` | yes |
| `code` | coding model | execute only from the frozen handoff | `Runs/<run-id>/00-code-run.md` | no |
| `achieve` | closure model | decide whether the run truly achieved acceptance | `Runs/<run-id>/03-achieve.md` | no |

## Shared Truth Surfaces

Two files dominate the workflow:

- `05-constraint-ledger.md`: the shared planning truth surface
- `90-code-handoff.md`: the only truthful `/code` entrypoint

The companion bundle exists to inspect and operationalize those truths:

- `91-canonical-contracts.md`
- `92-constraint-crosswalk.md`
- `95-execution-manifest.md`
- `96-code-batches.md`
- `97-code-preflight.md`
- `98-j-compile-for-code.md`
- `99-code-handoff.md`

## `pre` And Stage A

`pre` owns the approval gate.

### Input

- raw request
- repo facts
- local docs, tests, configs, and product clues

### Output

- a reframed request
- ambiguity list
- hidden assumptions
- scenario fragments
- approval pack

### Exit gate

You do not leave Stage A until the user explicitly approves the reframed direction.

### Why A exists

If the planning system asks too little here, every later stage becomes cleanup for hidden semantics.

## B / Divergence

Stage B forces option space before convergence.

### Input

- approved Stage A understanding

### Output

- materially different options
- retained option id
- dropped options

### Exit gate

Exactly one retained path survives. Style variants do not count as real options.

## C / Requirements

Stage C turns the retained path into implementation-relevant requirement units.

### Input

- retained option
- constraint ledger

### Output

- requirement units
- interface contracts
- validation targets
- frozen terms

### Exit gate

The package must be specific enough that a coder will not invent product meaning later.

## D / Critique

Stage D is the first mandatory independent attack.

### Input

- retained requirement package

### Output

- critique findings
- conflicts
- dropped pseudo-requirements
- resolution decisions

### Exit gate

If a critique agent is unavailable, the stage must be marked `blocked_by_agent_unavailable`, not silently completed.

## E / Closure

Stage E closes dependency gaps.

### Input

- retained requirements
- critique decisions

### Output

- end-to-end dependency chain
- dependency gap resolutions
- completion chain

### Exit gate

No unresolved high-impact dependency remains for coding.

## F / Probes

Stage F confronts the plan with repo and environment reality.

### Input

- hypotheses about the target repo, commands, or environment

### Output

- probes
- discarded paths
- surviving paths

### Exit gate

A complete stage needs executable evidence or an explicit inability-to-probe explanation.

## G / Red-Blue

Stage G forces adversarial pressure before approval.

### Input

- retained path
- dependency chain
- probe evidence

### Output

- red-team attacks
- blue-team mitigations
- residual risks

### Exit gate

The bundle must either mitigate attacks or name the residual risk explicitly.

## H / Review

Stage H is the coding-readiness gate.

### Input

- the full A-H package

### Output

- verdict
- blockers or approval conditions
- rationale
- reentry stage if rejected

### Exit gate

If the next coder would still need to invent product semantics, validation meaning, state behavior, or dependency behavior, H must reject the package.

## J / Compile For Code

Stage J turns planning truth into coder-operable artifacts.

### Input

- converged A-H package
- current handoff state

### Output

- code-ready verdict
- companion docs
- final handoff summary
- reopen stage if blocked

### Exit gate

`code_ready=true` is allowed only when the next coding model can implement without reopening product meaning.

## `/code`

`/code` is execution, not interpretation.

### Required entry conditions

- a bundle path or handoff path exists
- `90-code-handoff.md` is present
- `ecl.code_handoff.code_ready=true`
- repo target exists

### Required behavior

- read the handoff and explicit references only
- execute implementation units in order
- verify after each unit
- update `97-code-preflight.md`
- record `00-code-run.md` and `01-verification.md`

### Reentry rule

If a high-impact ambiguity appears, stop and reopen the earliest broken stage.

## `/achieve`

`/achieve` decides whether evidence supports closure.

### Input

- validated bundle
- latest truthful code run
- acceptance checks
- verification evidence

### Output

- achieve verdict
- archive status
- archive reason
- next actions

### Exit gate

If acceptance or first-open quality fails, the case stays open.
