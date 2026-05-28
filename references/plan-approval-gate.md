# Plan Approval Gate

Use this reference during `ecl pre`.

## Purpose

Turn a raw user idea into an approved, frozen planning target before B-H converges the full bundle.

## Rules

- Audit the request before trusting it.
- Search local repo reality before asking the user to restate information that is already discoverable.
- Treat the user's description as low-reliability evidence: they may be unsure, contradictory, solution-biased, or unaware of their own hidden requirements.
- Do not optimize for fewer questions. Use A to aggressively gather meaning while user interaction is still allowed.
- Ask broad but concrete clarification questions across goals, non-goals, examples, anti-examples, workflows, priorities, tradeoffs, failure cases, data semantics, UI states, and acceptance expectations.
- Prefer grouped clarification passes that reveal contradictions and missing semantics over a single minimal follow-up.
- Stop asking only when the remaining unknowns are truly low-impact implementation details rather than latent product semantics.

## Approval Pack

Before entering B-H, present a short approval pack containing:

- `reframed_goal`: the product or change you now believe the user actually wants
- `retained_scope`: what will be delivered in this pass
- `excluded_scope`: what will not be delivered in this pass
- `critical_assumptions`: the assumptions that materially affect semantics
- `frozen_for_code`: the decisions `code` will treat as fixed truth

## Exit Rule

Do not continue to `ecl plan` and B-H until the user has explicitly approved the approval pack.

If the user responds with changes, update the approval pack and ask for approval again.

After the user approves, do not keep turning B-H or J into a stage-by-stage interview. Converge later stages mainly in the background and return to the user only when a new high-impact ambiguity, contradiction, or blocker appears.

## Personal Project Progress Planner Heuristic

For a personal project-progress tool, make sure the approval pack freezes at least:

- what counts as a project, idea, plan item, or capture item
- whether the app is single-user only
- whether persistence is local-only or server-backed
- which time horizons matter, such as long-term, short-term, or spark ideas
- what the dashboard must show on first open
