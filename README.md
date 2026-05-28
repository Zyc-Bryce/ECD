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

`ecd` (Evolutionary Constraint Development) is a Claude Code skill for turning a raw request into a constrained delivery loop. Invoke it with `/ecd` in Claude Code.

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

Choose one of the methods below. All examples use **Alice** as the Windows username and **my-app** as the project name — replace them with your own.

---

### Method 1: Command-Line Install

#### Windows (PowerShell)

```powershell
# Clone the repository
git clone https://github.com/Zyc-Bryce/evolutionary-constraint-development.git

# --- User-level install (available in every project) ---
Copy-Item -Recurse evolutionary-constraint-development $env:USERPROFILE\.claude\skills\

# --- Project-level install (only for the current project) ---
# First navigate to your project root, then:
Copy-Item -Recurse evolutionary-constraint-development .\.claude\skills\
```

#### macOS / Linux

```bash
# Clone the repository
git clone https://github.com/Zyc-Bryce/evolutionary-constraint-development.git

# User-level install (available in every project)
cp -r evolutionary-constraint-development ~/.claude/skills/

# Project-level install (only for the current project)
cp -r evolutionary-constraint-development /path/to/your-project/.claude/skills/
```

#### Direct Clone Into Skills Directory (all platforms)

```bash
# Windows (PowerShell):
git clone https://github.com/Zyc-Bryce/evolutionary-constraint-development.git $env:USERPROFILE\.claude\skills\evolutionary-constraint-development

# macOS / Linux:
git clone https://github.com/Zyc-Bryce/evolutionary-constraint-development.git ~/.claude/skills/evolutionary-constraint-development
```

After installation, the skill is automatically discovered the next time you start Claude Code in the relevant directory.

---

### Method 2: Manual Install (No Terminal Required)

If you prefer to avoid the command line, follow these steps.

#### Step 1 — Download

Visit https://github.com/Zyc-Bryce/evolutionary-constraint-development and click **Code → Download ZIP**. Extract the ZIP to a folder of your choice.

**Example:** Extract to `C:\Users\Alice\Downloads\evolutionary-constraint-development`.

#### Step 2 — Choose install scope

Pick **one** of the two options below.

---

**Option A: User-level install (the skill is available in every project)**

1. Open File Explorer and navigate to `%USERPROFILE%\.claude\skills\`.

   *For Alice, the full path is:* `C:\Users\Alice\.claude\skills\`

2. If the `skills` folder does not exist, create it:
   - Right-click → **New → Folder**, name it `skills`.

3. Copy (or move) the `evolutionary-constraint-development` folder you extracted in Step 1 into `skills\`.

   *After copying, the path should look like:* `C:\Users\Alice\.claude\skills\evolutionary-constraint-development\SKILL.md`

---

**Option B: Project-level install (the skill is only available in one project)**

1. In File Explorer, navigate to your project root.

   *For example:* `C:\Users\Alice\Projects\my-app`

2. Inside the project, look for a `.claude` folder. If it doesn't exist, create it:
   - Right-click → **New → Folder**, name it `.claude`
   - *Windows may warn about names starting with a dot — that's OK, confirm it.*

3. Inside `.claude`, look for a `skills` folder. If it doesn't exist, create it.

4. Copy (or move) the `evolutionary-constraint-development` folder you extracted in Step 1 into `.claude\skills\`.

   *After copying, the path should look like:* `C:\Users\Alice\Projects\my-app\.claude\skills\evolutionary-constraint-development\SKILL.md`

---

After either option, restart Claude Code (or start it in the relevant project directory), and the skill will be discovered automatically.

---

### Method 3: Manual Install (macOS / Linux, No Terminal)

1. Visit https://github.com/Zyc-Bryce/evolutionary-constraint-development and click **Code → Download ZIP**.
2. Extract the ZIP to a folder (e.g., `~/Downloads/evolutionary-constraint-development`).
3. Open Finder (macOS) or your file manager (Linux). Enable "Show Hidden Files" so the `.claude` folder is visible.
4. **User-level:** Copy the extracted folder into `~/.claude/skills/`. Create `skills/` inside `~/.claude/` if it doesn't exist.
5. **Project-level:** Copy the extracted folder into `<your-project>/.claude/skills/`.

## CLI Quick Start

The CLI is intentionally thin — it handles rendering, validation, and run recording. The reasoning work still belongs to the model following the skill.

> **Platform note:** Commands below use `python3` on macOS/Linux and `python` on Windows. Paths use the hypothetical user **Alice** and project **my-app** — replace them with your own.

### `ecl pre` — Initialize Stage A approval workspace

Scaffolds a normalized case JSON from a raw request, renders the Obsidian bundle, and validates it. This starts the high-interaction clarification phase (Stage A).

```bash
# macOS / Linux
python3 scripts/ecl.py pre \
  --request "Build a minimal app with a dashboard, an empty state, and one write flow." \
  --output /home/alice/projects/ecd-demo/bundle \
  --repo-path /home/alice/projects/my-app \
  --project-path /home/alice/projects/my-app
```

```powershell
# Windows (PowerShell)
python scripts/ecl.py pre `
  --request "Build a minimal app with a dashboard, an empty state, and one write flow." `
  --output C:\Users\Alice\Projects\ecd-demo\bundle `
  --repo-path C:\Users\Alice\Projects\my-app `
  --project-path C:\Users\Alice\Projects\my-app
```

### `ecl plan` — Render the post-approval code-ready bundle

Reads a completed case JSON (Stage A must be `complete`), renders the full A-J bundle, validates it, and generates the OpenSpec pack. Exits with an error if `code_ready` is not `true`.

```bash
# macOS / Linux
python3 scripts/ecl.py plan \
  --input-json /home/alice/projects/ecd-demo/case.json \
  --output /home/alice/projects/ecd-demo/bundle \
  --force
```

```powershell
# Windows (PowerShell)
python scripts/ecl.py plan `
  --input-json C:\Users\Alice\Projects\ecd-demo\case.json `
  --output C:\Users\Alice\Projects\ecd-demo\bundle `
  --force
```

### `ecl code` — Record a `/code` run

Validates the bundle, checks that `code_ready=true`, parses the run payload, renders run evidence notes (`00-code-run.md`, `01-verification.md`), and re-validates the bundle.

```bash
# macOS / Linux
python3 scripts/ecl.py code \
  --case /home/alice/projects/ecd-demo/bundle \
  --run-json /home/alice/projects/ecd-demo/run.json
```

```powershell
# Windows (PowerShell)
python scripts/ecl.py code `
  --case C:\Users\Alice\Projects\ecd-demo\bundle `
  --run-json C:\Users\Alice\Projects\ecd-demo\run.json
```

### `ecl achieve` — Render the final acceptance-and-archive verdict

Validates the bundle, reads the latest code run, synthesizes an achieve verdict (`achieved` / `achieved_with_followups` / `not_achieved`), and renders `03-achieve.md`.

```bash
# macOS / Linux
python3 scripts/ecl.py achieve --case /home/alice/projects/ecd-demo/bundle
```

```powershell
# Windows (PowerShell)
python scripts/ecl.py achieve --case C:\Users\Alice\Projects\ecd-demo\bundle
```

### Validation

Validate any bundle directly:

```bash
# macOS / Linux
python3 scripts/validate_ecl_bundle.py /home/alice/projects/ecd-demo/bundle
```

```powershell
# Windows (PowerShell)
python scripts/validate_ecl_bundle.py C:\Users\Alice\Projects\ecd-demo\bundle
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
- [docs/zh-CN/theory.md](docs/zh-CN/theory.md): 中文理论文档
- [docs/zh-CN/stages.md](docs/zh-CN/stages.md): 中文阶段模型
- [docs/zh-CN/subagents.md](docs/zh-CN/subagents.md): 中文子代理协议
- [docs/zh-CN/implementation.md](docs/zh-CN/implementation.md): 中文实现说明

## Acknowledgments

This skill is based on [Evolution Constraint Planner](https://github.com/Etherstrings/evolution-constraint-planner) by [@Etherstrings](https://github.com/Etherstrings). The original ECL v2 methodology, CLI scripts, templates, schemas, and reference materials were created for Codex and have been adapted here for Claude Code.

## License

MIT
