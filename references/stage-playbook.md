# Stage Playbook v2

## Shared Ledger

`05-constraint-ledger.md` is the single source of truth for:

- retained goal
- confirmed facts
- challenged claims
- frozen constraints
- dropped options
- risks
- dependency chain
- verification semantics
- stage references

After approval closes, user interaction should usually drop sharply. B-H and J should converge in the background unless a new high-impact ambiguity or contradiction appears.

## A / Preprocess

- treat the raw request as unreliable input
- inspect repo and workspace facts before asking the user anything
- extract the likely real goal
- assume the user may not understand their own real goal, constraints, or desired outcomes yet
- surface ambiguity, wrong assumptions, missing facts, hidden preferences, anti-goals, and unstated constraints
- produce clarification questions that maximize semantic coverage before approval
- interrogate across examples, counterexamples, workflows, priorities, tradeoffs, failure handling, edge cases, and acceptance meaning
- stop after producing an approval-ready reframing package with saturated semantic coverage

Required output:

- `user_stated_request`
- `ambiguity_points`
- `dubious_claims`
- `factual_gaps`
- `hidden_assumptions`
- `suspected_real_goals`
- `scenario_fragments`
- `success_signals`
- `non_goals`
- `follow_up_questions`
- `blocking_unknowns`
- `reframed_request`

Exit gate:

- the request has been reframed around the likely real goal
- the user has been questioned enough that hidden product meaning is unlikely to surprise later stages
- the approval pack can be shown to the user

## B / Divergence

- generate materially different options, not style variants
- make each option explain which blind spots it covers
- retain exactly one path

## C / Requirements

- decompose the retained path into requirement units
- freeze implementation-relevant semantics
- shape requirement units so they can later map cleanly into implementation units or task batches
- identify interfaces, validation targets, and non-goals
- capture requirement-to-task traceability and likely cut lines without prematurely inventing file order
- make the package specific enough that a coder will not invent product meaning

## D / Critique

- spawn one independent critique agent
- attack vague, contradictory, or wasteful requirements
- remove pseudo-requirements and bad decompositions

## E / Closure

- complete the end-to-end dependency chain
- convert resolved dependencies into a dependency-aware execution chain for later phases, batches, and tasks
- remove hidden prerequisites
- remove hidden prerequisites between planned units, batches, and verification steps
- leave no high-impact dependency gaps for `code`

## F / Probes

- run real executable validation whenever possible
- prefer repo inspection, scripts, tests, experiments, and environment checks
- record hypothesis, method, expected signal, kill criteria, and result

## G / Red-Blue

- spawn independent red and blue agents
- red attacks edge cases, abuse paths, dependency breaks, and invalid states
- blue mitigates, constrains, or accepts residual risk explicitly

## H / Review

- spawn one independent review agent
- reject the package if the next coder would still need to invent:
  - product meaning
  - validation meaning
  - state behavior
  - dependency behavior
- verdict must be one of:
  - `approved`
  - `approved_with_conditions`
  - `rejected`

## J / Compile For Code

- spawn one independent compile-for-code agent
- absorb the retained A-H result into companion docs and the final code-ready package
- compile execution phases, code batches, and implementation units in dependency order
- compile `97-code-preflight.md` as the shared execution workboard the user and coder will maintain before and during `/code`
- compile review conditions and residual blockers into an explicit code-ready or scaffold verdict
- make the package exportable to OpenSpec-style `proposal/design/tasks` without reinterpretation
- keep `90-code-handoff.md` as the only truthful `/code` entrypoint
- emit companion docs `91/92/95/96/97/98/99` as inspection surfaces, not alternate sources of truth

## Code Handoff

The handoff must freeze:

- approval basis
- repo grounding
- product semantics
- domain/data/UI contracts
- function-level contracts
- file plan
- implementation units
- verification commands
- browser checks
- acceptance checks
- reentry triggers

`code_ready=true` is allowed only when those are explicit and unresolved gaps are empty.

Each implementation unit must also freeze:

- exact changes
- task-ready done signals
- tests to add or update

## `/code`

- read only the handoff plus explicit references
- execute in unit order
- verify as you go
- stop and reenter planning if semantics are still missing
