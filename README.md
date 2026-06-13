# Evolutionary Constraint Development

English | [简体中文](README.zh-CN.md)

<div align="center">

**Freeze product meaning before coding starts, then drive delivery through a constrained plan-code-achieve loop.**

![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-412991?style=flat-square)
![Constraint Planning](https://img.shields.io/badge/Planning-Constraint_Driven-0F766E?style=flat-square)
![CLI Toolkit](https://img.shields.io/badge/CLI-Toolkit-1D4ED8?style=flat-square)
![Plan Code Achieve](https://img.shields.io/badge/Workflow-Plan_Code_Achieve-7C3AED?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/version-1.3-blue?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=flat-square)

Raw request → frozen meaning → code-ready handoff → run evidence → achieve verdict

</div>

## Contents

- [Why ECD](#why-ecd)
- [What This Repository Contains](#what-this-repository-contains)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Uninstall](#uninstall)
- [CLI Quick Start](#cli-quick-start)
- [Required Claude Code Capabilities](#required-claude-code-capabilities)
- [Repository Map](#repository-map)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)
- [License](#license)

`ecd` (Evolutionary Constraint Development) is a Claude Code skill for turning a raw request into a constrained delivery loop. Invoke it with `/ecd` in Claude Code.

1. `pre` interrogates the request until meaning is frozen enough to approve.
2. `plan` converges the retained path into a code-ready bundle.
3. `code` executes only from the frozen handoff.
4. `achieve` decides whether the result actually met acceptance and whether the case can be archived.

The core idea is simple: planning owns meaning, coding owns execution, and closure owns acceptance. If the coding model still has to invent product semantics, planning failed.

> 🆕 **First time?** → [`skills/ecd/docs/zh-CN/beginners-guide.md`](skills/ecd/docs/zh-CN/beginners-guide.md) (beginner's guide, in Chinese)
> **v1.3 highlights:** 12 fully translated reference guides (`references/zh-CN/`), unified versioning system, Schema L1 dependency chain fix. See [`USAGE.zh-CN.md`](USAGE.zh-CN.md).

## Why ECD

When you ask an AI coding agent to build something from a vague request, the typical result is a **semantic lottery**: the model guesses what you meant, invents product behavior on the fly, and you end up with something that *looks* right but *behaves* wrong — missing edge cases, wrong state transitions, broken error handling.

ECD solves this by enforcing a **strict semantic freeze before any code is written**:

| Without ECD | With ECD |
|---|---|
| "Build a dashboard" → model invents features | `pre` interrogates until meaning is frozen |
| Code drifts from intent | `plan` converges into a code-ready handoff bundle |
| No way to tell if it's "done" | `code` executes only frozen instructions |
| "Looks good to me" acceptance | `achieve` demands evidence-based closure |

The core philosophy: **planning owns meaning, coding owns execution, and closure owns acceptance.** If the coding model still has to invent product semantics, planning failed.

## What This Repository Contains

- `skills/ecd/SKILL.md`: the Claude Code skill definition.
- `skills/ecd/scripts/`: CLI helpers for scaffold, render, validate, run recording, and achieve notes (Python, dependency: `pyyaml` for optional YAML parsing).
- `skills/ecd/templates/`: markdown templates for bundle artifacts and stage notes.
- `skills/ecd/schemas/`: structured schema guidance for the normalized case format.
- `skills/ecd/references/`: playbooks, quality bars, and subagent protocol adapted for Claude Code.
- `skills/ecd/docs/`: technical documentation for the theory, stages, subagents, and implementation (English + 简体中文).
- `skills/ecd/agents/`: Claude Code agent interface definitions for mandatory subagent stages (D/G/H/J).
- `.claude-plugin/`: Claude Code plugin metadata (supports `/plugin install`).

## Prerequisites

- **Claude Code** — latest version recommended. ECD relies on the `Agent` tool for spawning independent subagents during critical review stages.
- **Python 3.8+** — required only if you use the CLI helper scripts (`skills/ecd/scripts/`). All scripts use only the Python standard library, with one optional exception:
  - **pyyaml** (optional) — `pip install pyyaml`. Only needed by `render_obsidian_bundle.py` for full YAML schema parsing; the script gracefully falls back to a built-in default schema without it.
- **Git** — required only if you install via `git clone` (Methods 5 and 6 below).

## Installation

Choose one of the methods below.

---

### Method 1: npx skills add (⭐ Recommended)

```bash
npx skills add Zyc-Bryce/ECD --skill ecd -g
```

One command — auto-discovers and installs the skill globally. No manual steps.

---

### Method 2: npx One-Liner (⭐ Easiest)

```bash
npx @zyc-bryce/ecd
```

Auto-configures Claude Code (adds marketplace + enables plugin). Restart and you're done. No manual file editing.

> 💡 This command only edits `settings.json` — functionally equivalent to Method 4's manual configuration below.

---

### Method 3: Plugin Command (⭐ Recommended)

Use Claude Code's built-in plugin system — auto-download, auto-update, no manual file management.

#### Step 1 — Add marketplace source

Run this in your terminal:

```bash
claude plugin source add ecd-marketplace --source github --repo Zyc-Bryce/ECD
```

#### Step 2 — Install the plugin

Start Claude Code and type:

```
/plugin install ecd@ecd-marketplace
```

#### Step 3 — Restart Claude Code

Close and reopen Claude Code. Type `/ecd` to verify — if you see the ECD prompt, you're all set.

> ✅ **Advantage**: Claude Code will automatically detect new versions. No manual file management needed.
>
> 🔧 **Troubleshooting**: If `/ecd` doesn't appear after restart, run `claude plugin list` in terminal to check the ECD plugin status. If it shows `failed to load` with "conflicting manifests" error, the `marketplace.json` and `plugin.json` have duplicate component declarations — update to the latest version or check [GitHub Issues](https://github.com/Zyc-Bryce/ECD/issues).

---

### Method 4: Manual Config

Prefer to edit config files directly? Add a few lines to your Claude Code settings.

#### Step 1 — Open your settings file

| OS | Config file path |
|---|---|
| Windows | `%USERPROFILE%\.claude\settings.json` |
| macOS / Linux | `~/.claude/settings.json` |

> If the file doesn't exist, create an empty JSON file: `{}`

#### Step 2 — Add ECD marketplace and enable plugin

Add these entries to `settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "ecd-marketplace": {
      "source": {
        "source": "github",
        "repo": "Zyc-Bryce/ECD"
      }
    }
  },
  "enabledPlugins": {
    "ecd@ecd-marketplace": true
  }
}
```

> 💡 If `extraKnownMarketplaces` or `enabledPlugins` already exist, **merge** the new entries — don't overwrite existing content.

#### Step 3 — Restart Claude Code

Close and reopen Claude Code. Type `/ecd` to verify — if you see the ECD prompt, you're all set.

> ✅ **Advantage**: Same as Method 3 — Claude Code will automatically detect new versions.

---

### Method 5: Command-Line Install

#### Windows (PowerShell)

```powershell
# Clone the repository
git clone https://github.com/Zyc-Bryce/ECD.git evolutionary-constraint-development

# --- User-level install (available in every project) ---
Copy-Item -Recurse evolutionary-constraint-development $env:USERPROFILE\.claude\skills\

# --- Project-level install (only for the current project) ---
# First navigate to your project root, then:
Copy-Item -Recurse evolutionary-constraint-development .\.claude\skills\
```

#### macOS / Linux

```bash
# Clone the repository
git clone https://github.com/Zyc-Bryce/ECD.git evolutionary-constraint-development

# User-level install (available in every project)
cp -r evolutionary-constraint-development ~/.claude/skills/

# Project-level install (only for the current project)
cp -r evolutionary-constraint-development /path/to/your-project/.claude/skills/
```

#### Direct Clone Into Skills Directory (all platforms)

```bash
# Windows (PowerShell):
git clone https://github.com/Zyc-Bryce/ECD.git $env:USERPROFILE\.claude\skills\evolutionary-constraint-development

# macOS / Linux:
git clone https://github.com/Zyc-Bryce/ECD.git ~/.claude/skills/evolutionary-constraint-development
```

After installation, the skill is automatically discovered the next time you start Claude Code in the relevant directory.

---

### Method 6: Manual Install (No Terminal Required)

If you prefer to avoid the command line, follow these steps.

#### Step 1 — Download

Visit https://github.com/Zyc-Bryce/ECD and click **Code → Download ZIP**. Extract the ZIP to a folder of your choice.

**Example:** Extract to `C:\Users\Alice\Downloads\evolutionary-constraint-development`.

#### Step 2 — Choose install scope

Pick **one** of the two options below. *(The following steps are for Windows. macOS/Linux users: see the dedicated section below.)*

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

#### macOS / Linux Users

1. Visit https://github.com/Zyc-Bryce/ECD and click **Code → Download ZIP**.
2. Extract the ZIP to a folder (e.g., `~/Downloads/evolutionary-constraint-development`).
3. Open Finder (macOS) or your file manager (Linux). Enable "Show Hidden Files" so the `.claude` folder is visible.
4. **User-level:** Copy the extracted folder into `~/.claude/skills/`. Create `skills/` inside `~/.claude/` if it doesn't exist.
5. **Project-level:** Copy the extracted folder into `<your-project>/.claude/skills/`.

## Uninstall

Choose the method matching your installation.

---

### Method 1: npx skills add → Uninstall

```bash
npx skills remove ecd -g
```

---

### Method 2: npx Install → Uninstall

The npx one-liner only edits `settings.json`. To undo:

1. Open `settings.json` (see [Method 4](#method-4-manual-config) Step 1 for paths)
2. Remove the `"ecd-marketplace"` entry from `extraKnownMarketplaces`
3. Remove the `"ecd@ecd-marketplace"` entry from `enabledPlugins`
4. Restart Claude Code

> 💡 If `extraKnownMarketplaces` or `enabledPlugins` become empty `{}`, you can keep or remove them.

---

### Method 3: Plugin Command → Uninstall

Run in terminal:

```bash
# Disable the plugin
claude plugins disable ecd@ecd-marketplace

# Remove the marketplace source
claude plugins source remove ecd-marketplace
```

Restart Claude Code.

---

### Method 4: Manual Config → Uninstall

Same as Method 2: remove the `ecd-marketplace` and `ecd@ecd-marketplace` entries from `settings.json`, then restart.

---

### Method 5 / 6: Manual / Command-Line → Uninstall

Delete the ECD folder from your skills directory:

```powershell
# Windows (PowerShell) — user-level
Remove-Item -Recurse -Force $env:USERPROFILE\.claude\skills\evolutionary-constraint-development

# Windows (PowerShell) — project-level (run in project root)
Remove-Item -Recurse -Force .\.claude\skills\evolutionary-constraint-development
```

```bash
# macOS / Linux — user-level
rm -rf ~/.claude/skills/evolutionary-constraint-development

# macOS / Linux — project-level
rm -rf /path/to/your-project/.claude/skills/evolutionary-constraint-development
```

---

### Supplementary: npm Global Uninstall

If you also installed via `npm install -g @zyc-bryce/ecd`:

```bash
npm uninstall -g @zyc-bryce/ecd
```

> ⚠️ **Note**: `npm uninstall -g` only removes the npm package — it does **not** clean up `settings.json`. If you also registered via npx or manual config, follow Method 2/4 to clean up `settings.json`.

---

## CLI Quick Start

The CLI is intentionally thin — it handles rendering, validation, and run recording. The reasoning work still belongs to the model following the skill.

> **Platform note:** Commands below use `python3` on macOS/Linux and `python` on Windows. Paths use the hypothetical user **Alice** and project **my-app** — replace them with your own.

### `ecd pre` — Initialize Stage A approval workspace

Scaffolds a normalized case JSON from a raw request, renders the Obsidian bundle, and validates it. This starts the high-interaction clarification phase (Stage A).

```bash
# macOS / Linux
python3 skills/ecd/scripts/ecd.py pre \
  --request "Build a minimal app with a dashboard, an empty state, and one write flow." \
  --output /home/alice/projects/ecd-demo/bundle \
  --repo-path /home/alice/projects/my-app \
  --project-path /home/alice/projects/my-app
```

```powershell
# Windows (PowerShell)
python skills/ecd/scripts/ecd.py pre `
  --request "Build a minimal app with a dashboard, an empty state, and one write flow." `
  --output C:\Users\Alice\Projects\ecd-demo\bundle `
  --repo-path C:\Users\Alice\Projects\my-app `
  --project-path C:\Users\Alice\Projects\my-app
```

### `ecd plan` — Render the post-approval code-ready bundle

Reads a completed case JSON (Stage A must be `complete`), renders the full A-J bundle, validates it, and generates the OpenSpec pack. Exits with an error if `code_ready` is not `true`.

```bash
# macOS / Linux
python3 skills/ecd/scripts/ecd.py plan \
  --input-json /home/alice/projects/ecd-demo/case.json \
  --output /home/alice/projects/ecd-demo/bundle \
  --force
```

```powershell
# Windows (PowerShell)
python skills/ecd/scripts/ecd.py plan `
  --input-json C:\Users\Alice\Projects\ecd-demo\case.json `
  --output C:\Users\Alice\Projects\ecd-demo\bundle `
  --force
```

### `ecd code` — Record a `/code` run

Validates the bundle, checks that `code_ready=true`, parses the run payload, renders run evidence notes (`00-code-run.md`, `01-verification.md`), and re-validates the bundle.

```bash
# macOS / Linux
python3 skills/ecd/scripts/ecd.py code \
  --case /home/alice/projects/ecd-demo/bundle \
  --run-json /home/alice/projects/ecd-demo/run.json
```

```powershell
# Windows (PowerShell)
python skills/ecd/scripts/ecd.py code `
  --case C:\Users\Alice\Projects\ecd-demo\bundle `
  --run-json C:\Users\Alice\Projects\ecd-demo\run.json
```

### `ecd achieve` — Render the final acceptance-and-archive verdict

Validates the bundle, reads the latest code run, synthesizes an achieve verdict (`achieved` / `achieved_with_followups` / `not_achieved`), and renders `03-achieve.md`.

```bash
# macOS / Linux
python3 skills/ecd/scripts/ecd.py achieve --case /home/alice/projects/ecd-demo/bundle
```

```powershell
# Windows (PowerShell)
python skills/ecd/scripts/ecd.py achieve --case C:\Users\Alice\Projects\ecd-demo\bundle
```

### Validation

Validate any bundle directly:

```bash
# macOS / Linux
python3 skills/ecd/scripts/validate_ecl_bundle.py /home/alice/projects/ecd-demo/bundle
```

```powershell
# Windows (PowerShell)
python skills/ecd/scripts/validate_ecl_bundle.py C:\Users\Alice\Projects\ecd-demo\bundle
```

## Required Claude Code Capabilities

This skill assumes:

- the environment can load a `SKILL.md` directory as a Claude Code skill
- the model can read local files and run the helper scripts via `Bash`
- the `Agent` tool is available for spawning real subagents (mandatory for D/G/H/J stages)

If your environment cannot launch real subagents, ECD can still be studied, but D, G, H, and J cannot be truthfully marked complete.

## Repository Map

### Documentation

- [skills/ecd/docs/zh-CN/beginners-guide.md](skills/ecd/docs/zh-CN/beginners-guide.md): 🆕 **Beginner's Guide** — decision trees, scenario quick-lookup, common mistakes, 20 FAQs, and glossary
- [USAGE.zh-CN.md](USAGE.zh-CN.md): full usage manual — complexity classifier, three-tier workflow, Superpowers integration, incremental mode, common scenarios
- [skills/ecd/docs/theory.md](skills/ecd/docs/theory.md): what ECD is, where its theory comes from, and what problem it is designed to solve
- [skills/ecd/docs/stages.md](skills/ecd/docs/stages.md): every stage, owner, input, output, exit gate, and failure mode
- [skills/ecd/docs/subagents.md](skills/ecd/docs/subagents.md): exactly where real subagents are required and what they return
- [skills/ecd/docs/implementation.md](skills/ecd/docs/implementation.md): CLI flow, bundle compilation, templates, schema, and OpenSpec output
- [skills/ecd/docs/zh-CN/theory.md](skills/ecd/docs/zh-CN/theory.md): 中文理论文档
- [skills/ecd/docs/zh-CN/stages.md](skills/ecd/docs/zh-CN/stages.md): 中文阶段模型
- [skills/ecd/docs/zh-CN/subagents.md](skills/ecd/docs/zh-CN/subagents.md): 中文子代理协议
- [skills/ecd/docs/zh-CN/implementation.md](skills/ecd/docs/zh-CN/implementation.md): 中文实现说明
- [skills/ecd/references/zh-CN/](skills/ecd/references/zh-CN/): 12 fully translated reference guides (v1.3)

### Core

- [skills/ecd/SKILL.md](skills/ecd/SKILL.md): the Claude Code skill definition
- [skills/ecd/scripts/](skills/ecd/scripts/): CLI helpers (pure Python stdlib + optional `pyyaml`)
- [skills/ecd/templates/](skills/ecd/templates/): markdown templates (Lite and Full variants)
- [skills/ecd/schemas/](skills/ecd/schemas/): structured schema guidance for the normalized case format
- [skills/ecd/references/](skills/ecd/references/): playbooks, quality bars, and subagent protocol
- [skills/ecd/agents/](skills/ecd/agents/): Claude Code agent interface definitions

### Meta

- [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md): version history and release notes
- [.claude-plugin/](.claude-plugin/): Claude Code plugin metadata

## Contributing

Contributions are welcome! Here's how to get involved:

- **Bug reports & feature requests**: open an issue on [GitHub Issues](https://github.com/Zyc-Bryce/ECD/issues)
- **Pull requests**: fork the repo, create a feature branch, and submit a PR against `main`
- **Documentation improvements**: corrections, translations, examples — all appreciated
- **Before submitting a PR**: please ensure CLI scripts still pass basic validation (`python skills/ecd/scripts/validate_ecl_bundle.py --help`)

## Acknowledgments

This skill is based on [Evolution Constraint Planner](https://github.com/Etherstrings/evolution-constraint-planner) by [@Etherstrings](https://github.com/Etherstrings). The original ECL v2 methodology, CLI scripts, templates, schemas, and reference materials were created for Codex and have been adapted here for Claude Code.

## License

MIT
