# BetaPilot Rules

BetaPilot is a spec-driven development workflow that helps you build production-quality code.

## Core Principles

1. **Spec First** - Always create a specification before implementing
2. **Plan Then Do** - Generate a plan, get approval, then execute
3. **Test Driven** - Write tests first, then implementation
4. **Verify Everything** - Run tests, lint, and review before marking complete

## Available Commands

| Command | Purpose |
|---------|---------|
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

## Workflow

```
/spec → /plan → /implement → /test → /review → /deploy
```

## Memory & Context

- BetaPilot preserves context across sessions
- Run `/sync` when starting on a new project
- Run `/learn` to save important discoveries
- Session state is saved before compaction

## File Structure

```
.pilot/
├── spec.md        # Current specification
├── plan.md        # Implementation plan
├── context.md     # Project context
├── runlog.md     # Action log
└── memory/        # Persistent memory
    ├── sessions.json
    ├── learned.json
    └── context.json
```

## Quality Gates

Before marking any task complete:
- [ ] Tests pass
- [ ] Lint passes
- [ ] Code reviewed
- [ ] No security issues
