---
name: implement
description: Execute implementation plan steps iteratively
---

# /implement

Execute the implementation plan step by step.

## Usage

```
/implement
```

Or implement a specific task:
```
/implement "<task description>"
```

## What it does

1. **Read Plan** - Load `.pilot/plan.md`
2. **Execute Steps** - Work through each task sequentially
3. **Generate Diffs** - Create patches for each change
4. **Apply Changes** - Write updated files
5. **Verify** - Ensure changes are correct

## Safety

- Shows diff before applying each change
- Requires confirmation unless `--yes` flag used
- Runs in dry-run mode by default

## Options

- `--dry-run` - Show changes without applying
- `--yes` - Skip confirmation prompts
- `--force` - Continue even on errors

## Prerequisites

Run `/plan` first to create the implementation plan.

## Related Commands

- `/plan` - Create implementation plan
- `/test` - Run tests after implementation
- `/review` - Review changes
