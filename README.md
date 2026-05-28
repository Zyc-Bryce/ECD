# Evolutionary Constraint Development

English | [简体中文](README.zh-CN.md)

<div align="center">

**Freeze product meaning before coding starts, then drive delivery through a constrained plan-code-achieve loop.**

![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-412991?style=flat-square)
![Constraint Planning](https://img.shields.io/badge/Planning-Constraint_Driven-0F766E?style=flat-square)
![CLI Toolkit](https://img.shields.io/badge/CLI-Toolkit-1D4ED8?style=flat-square)
![Plan Code Achieve](https://img.shields.io/badge/Workflow-Plan_Code_Achieve-7C3AED?style=flat-square)

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
- `docs/`: technical documentation for the theory, stages, subagents, and implementation (English + 简体中文).
- `agents/`: Claude Code agent interface definitions for mandatory subagent stages (D/G/H/J).

## Installation

### Via Git Clone

```bash
# Clone the repository
git clone https://github.com/<your-username>/evolutionary-constraint-development.git

# Install as a project-level skill (available only in that project)
cp -r evolutionary-constraint-development /path/to/your-project/.claude/skills/

# Or install as a user-level skill (available globally)
cp -r evolutionary-constraint-development ~/.claude/skills/
```

### Via Direct Clone

```bash
# Clone directly into the Claude Code skills directory
git clone https://github.com/<your-username>/evolutionary-constraint-development.git ~/.claude/skills/evolutionary-constraint-development
```

The skill will be automatically discovered by Claude Code when working in the relevant directory (project-level) or globally (user-level).

## CLI Quick Start

The CLI is intentionally thin — it handles rendering, validation, and run recording. The reasoning work still belongs to the model following the skill.

### `ecl pre` — Initialize Stage A approval workspace

Scaffolds a normalized case JSON from a raw request, renders the Obsidian bundle, and validates it. This starts the high-interaction clarification phase (Stage A).

```bash
python3 scripts/ecl.py pre \
  --request "Build a minimal app with a dashboard, an empty state, and one write flow." \
  --output /abs/path/to/bundle \
  --repo-path /abs/path/to/repo \
  --project-path /abs/path/to/repo
```

### `ecl plan` — Render the post-approval code-ready bundle

Reads a completed case JSON (Stage A must be `complete`), renders the full A-J bundle, validates it, and generates the OpenSpec pack. Exits with an error if `code_ready` is not `true`.

```bash
python3 scripts/ecl.py plan \
  --input-json /abs/path/to/case.json \
  --output /abs/path/to/bundle \
  --force
```

### `ecl code` — Record a `/code` run

Validates the bundle, checks that `code_ready=true`, parses the run payload, renders run evidence notes (`00-code-run.md`, `01-verification.md`), and re-validates the bundle.

```bash
python3 scripts/ecl.py code \
  --case /abs/path/to/bundle \
  --run-json /abs/path/to/run.json
```

### `ecl achieve` — Render the final acceptance-and-archive verdict

Validates the bundle, reads the latest code run, synthesizes an achieve verdict (achieved / achieved_with_followups / not_achieved), and renders `03-achieve.md`.

```bash
python3 scripts/ecl.py achieve --case /abs/path/to/bundle
```

### Validation

Validate any bundle directly:

```bash
python3 scripts/validate_ecl_bundle.py /abs/path/to/bundle
```

> **Note:** On Windows, use `python` instead of `python3` if `python3` is not available.

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
- [docs/zh-CN/theory.md](docs/zh-CN/theory.md): 中文理论文档
- [docs/zh-CN/stages.md](docs/zh-CN/stages.md): 中文阶段模型
- [docs/zh-CN/subagents.md](docs/zh-CN/subagents.md): 中文子代理协议
- [docs/zh-CN/implementation.md](docs/zh-CN/implementation.md): 中文实现说明

## Acknowledgments

This skill is based on [Evolution Constraint Planner](https://github.com/Etherstrings/evolution-constraint-planner) by [@Etherstrings](https://github.com/Etherstrings). The original ECL v2 methodology, CLI scripts, templates, schemas, and reference materials were created for Codex and have been adapted here for Claude Code.

## License

MIT
