# BetaPilot Claude Code Plugin

Spec-driven development plugin for Claude Code with session memory and auto-compaction handling.

## Features

- **Slash Commands** - `/spec`, `/plan`, `/implement`, `/test`, `/review`, `/deploy`, `/sync`, `/learn`, `/doctor`, `/lint`
- **Session Memory** - Persistent memory across sessions
- **Auto-Compaction Handling** - State saved/restored before/after compaction
- **File Quality Checks** - Auto lint after file edits
- **Context Monitoring** - Warnings at 80%/90% context usage

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/cuku/betapilot/main/plugin/installer.sh | bash
```

Or manually:

```bash
git clone https://github.com/cuku/betapilot.git ~/.claude/plugins/betapilot
```

## Usage

Start Claude Code and use the slash commands:

```
/spec "Add user authentication"
/plan
/implement
/test
/review
```

## Commands

| Command | Description |
|---------|-------------|
| `/spec` | Create specification |
| `/plan` | Generate implementation plan |
| `/implement` | Execute plan steps |
| `/test` | Run test suite |
| `/lint` | Run lint checks |
| `/review` | Review code changes |
| `/deploy` | Deployment checklist |
| `/sync` | Learn codebase |
| `/learn` | Save knowledge |
| `/doctor` | Check prerequisites |

## File Structure

```
.pilot/
├── config.json      # Configuration
├── spec.md         # Current specification
├── plan.md         # Implementation plan
├── context.md      # Project context
├── runlog.md      # Action log
└── memory/         # Persistent memory
    ├── sessions.json   # Past sessions
    ├── learned.json   # /learn knowledge
    └── context.json   # Active state
```

## Hooks

The plugin includes hooks for:

- **Session Start** - Load memory
- **Pre-Compact** - Save state before compaction
- **Post-Compact Restore** - Restore state after compaction
- **File Edit** - Run lint checks
- **Session End** - Save observations

## Requirements

- Claude Code installed
- Python 3 for hooks
- Node.js for BetaPilot CLI (optional)

## License

MIT
