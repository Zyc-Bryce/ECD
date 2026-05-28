# Evolutionary Constraint Development

[English](README.md) | 简体中文

<div align="center">

**Freeze product meaning before coding starts, then drive delivery through a constrained plan-code-achieve loop.**

Raw request → frozen meaning → code-ready handoff → run evidence → achieve verdict

</div>

`evolutionary-constraint-development` is a Claude Code skill for turning a raw request into a constrained delivery loop:

1. `pre` interrogates the request until meaning is frozen enough to approve.
2. `plan` converges the retained path into a code-ready bundle.
3. `code` executes only from the frozen handoff.
4. `achieve` decides whether the result actually met acceptance and whether the case can be archived.

The core idea is simple: planning owns meaning, coding owns execution, and closure owns acceptance. If the coding model still has to invent product semantics, planning failed.

## What This Repository Contains

- `SKILL.md`: the Claude Code skill definition.
- `scripts/`: CLI helpers for scaffold, render, validate, run recording, and achieve notes (Python, dependency: `pyyaml` for optional YAML parsing).
- `templates/`: markdown templates for bundle artifacts and stage notes.
- `schemas/`: structured schema guidance for the normalized case format.
- `references/`: playbooks, quality bars, and subagent protocol adapted for Claude Code.
- `docs/`: technical documentation for the theory, stages, subagents, and implementation.
- `agents/`: Claude Code agent interface definitions for mandatory subagent stages (D/G/H/J).

## Claude Code Installation

Install this skill into your Claude Code skills directory:

```bash
# Copy to project-level skills
cp -r evolutionary-constraint-development /path/to/your-project/.claude/skills/

# Or copy to user-level skills
cp -r evolutionary-constraint-development ~/.claude/skills/
```

The skill will be automatically discovered by Claude Code when working in that directory (project-level) or globally (user-level).

## CLI Quick Start

The CLI is intentionally thin. It does rendering, validation, and run recording. The reasoning work still belongs to the model following the skill.

Initialize Stage A from a raw request:

```bash
python scripts/ecl.py pre \
  --request "Build a minimal app with a dashboard, an empty state, and one write flow." \
  --output /abs/path/to/bundle \
  --repo-path /abs/path/to/repo \
  --project-path /abs/path/to/repo
```

After the approval gate is complete, render the post-approval bundle:

```bash
python scripts/ecl.py plan \
  --input-json /abs/path/to/case.json \
  --output /abs/path/to/bundle \
  --force
```

Record a code run:

```bash
python scripts/ecl.py code \
  --case /abs/path/to/bundle \
  --run-json /abs/path/to/run.json
```

Render the final achieve verdict:

```bash
python scripts/ecl.py achieve --case /abs/path/to/bundle
```

## Required Claude Code Capabilities

This skill assumes:

- the environment can load a `SKILL.md` directory as a Claude Code skill
- the model can read local files and run the helper scripts via `Bash`
- the `Agent` tool is available for spawning real subagents (mandatory for D/G/H/J stages)

If your environment cannot launch real subagents, ECD can still be studied, but D, G, H, and J cannot be truthfully marked complete.

## Repository Map

- [docs/theory.md](docs/theory.md): what ECD is, where its theory comes from, and what problem it is designed to solve
- [docs/stages.md](docs/stages.md): every stage, owner, input, output, exit gate, and failure mode
- [docs/subagents.md](docs/subagents.md): exactly where real subagents are required and what they return
- [docs/implementation.md](docs/implementation.md): CLI flow, bundle compilation, templates, schema, and OpenSpec output
- [docs/zh-CN/theory.md](docs/zh-CN/theory.md): Chinese theory documentation
- [docs/zh-CN/stages.md](docs/zh-CN/stages.md): Chinese stage model documentation
- [docs/zh-CN/subagents.md](docs/zh-CN/subagents.md): Chinese subagent protocol
- [docs/zh-CN/implementation.md](docs/zh-CN/implementation.md): Chinese implementation notes

## Verification

Validate a bundle:

```bash
python scripts/validate_ecl_bundle.py /abs/path/to/bundle
```

## Acknowledgments

This skill is based on [Evolution Constraint Planner](https://github.com/Etherstrings/evolution-constraint-planner) by [@Etherstrings](https://github.com/Etherstrings). The original ECL v2 methodology, CLI scripts, templates, schemas, and reference materials were created for Codex and have been adapted here for Claude Code.

## License

MIT
