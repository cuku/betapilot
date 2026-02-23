# BetaPilot

A hands-free CLI agent runner with slash commands and spec-driven development workflow. Inspired by Claude Pilot but with a cleaner, project-local approach.

## Overview

BetaPilot helps developers and teams manage their development workflow through an interactive CLI:

1. **Define requirements** with `/spec`
2. **Create implementation plan** with `/plan`
3. **Implement changes** with `/implement`
4. **Run tests** with `/test`
5. **Review code** with `/review`

### Key Differences from Claude Pilot

- **No vault**: All state lives in `.pilot/` directory within your project
- **Simpler architecture**: No complex secret management or knowledge base
- **Safer defaults**: Dry-run mode enabled by default
- **Clean extension**: Easy to add new providers and tools

## Installation

### Quick Install (macOS/Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/cuku/betapilot/b683a7d/install.sh | bash
```

Or manually:

```bash
npm install -g betapilot
```

Or install from source:

```bash
git clone https://github.com/your-repo/betapilot.git
cd betapilot
npm install
npm run build
npm link
```

## Quickstart

### 1. Set up your API key

```bash
# For Anthropic (default)
export ANTHROPIC_API_KEY=your_api_key

# Or for OpenAI
export OPENAI_API_KEY=your_api_key
export PILOT_PROVIDER=openai
```

### 2. Run in your project

```bash
cd your-project
pilot
```

### 3. Use slash commands

```
pilot> /spec
pilot> /plan
pilot> /implement
pilot> /test
pilot> /review
```

## Command Reference

| Command | Description |
|---------|-------------|
| `/spec` | Interactive requirements capture - creates `.pilot/spec.md` |
| `/plan` | Converts spec to implementation plan - creates `.pilot/plan.md` |
| `/implement` | Executes plan steps, generates and applies patches |
| `/test` | Runs project test command |
| `/review` | Generates code review summary |
| `/deploy` | Shows deployment checklist |
| `/help` | Shows available commands |
| `/doctor` | Checks prerequisites |

## Global Flags

| Flag | Description |
|------|-------------|
| `--dry-run` | Show changes without applying (default: true) |
| `--yes, -y` | Skip confirmation prompts |
| `--verbose` | Enable detailed logging |
| `--force` | Force command execution regardless of state |

## Configuration

BetaPilot stores configuration in `.pilot/config.json` within your project:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "allowShellCommands": ["npm test", "npm run", "npm build", "npx"],
  "denyShellCommands": ["rm -rf", "format", "shutdown"],
  "testCommand": "npm test",
  "lintCommand": "npm run lint",
  "buildCommand": "npm run build",
  "deployCommand": "",
  "dryRunDefault": true,
  "verbose": false,
  "branchPrefix": "pilot/"
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PILOT_PROVIDER` | Provider: anthropic, openai, or mock |
| `PILOT_MODEL` | Model name to use |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_BASE_URL` | OpenAI-compatible base URL (optional) |

## Project Files

All BetaPilot state is stored in the `.pilot/` directory:

| File | Description |
|------|-------------|
| `.pilot/config.json` | Configuration |
| `.pilot/spec.md` | Project specification |
| `.pilot/plan.md` | Implementation plan |
| `.pilot/runlog.md` | Action log |
| `.pilot/context.md` | Curated context |

## Full Workflow Example

```bash
$ pilot

pilot> /spec
? Project name: My API
? Brief project overview: A REST API for user management
? What are the main requirements? CRUD operations, authentication, rate limiting
? What are the acceptance criteria? All endpoints return correct status codes

✓ Specification created

pilot> /plan
✓ Plan created

pilot> /implement
Step 1/3: Create user model
Generated patch:
--- a/src/models/user.ts
+++ b/src/models/user.ts
...

Apply this patch? (y/N) y
✓ Changes applied

Step 2/3: Create routes
...

pilot> /test
✓ Tests passed (1.5s)

pilot> /review
Code Review Summary
==================

Files Changed:
  - src/models/user.ts
  - src/routes/users.ts

+150 -20 lines

Risks:
  - Low risk: Changes are localized
```

## Safety Model

BetaPilot is designed to be safe by default:

1. **Dry-run mode**: Changes are shown but not applied until you confirm
2. **Shell command allow-list**: Only pre-approved commands can run
3. **No destructive commands**: Dangerous commands like `rm -rf` are blocked
4. **Clear diffs**: Every change is shown before applying
5. **Explicit approvals**: Destructive operations require confirmation

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint
npm run lint
```

## License

MIT
