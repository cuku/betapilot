---
name: review
description: Review code changes and provide feedback
---

# /review

Generate a code review summary for current changes.

## Usage

```
/review
```

## What it does

1. **Git Analysis** - Check for uncommitted changes
2. **Diff Review** - Analyze what was changed
3. **Risk Assessment** - Identify potential issues
4. **Generate Report** - Create review summary

## Output

Provides:
- Files changed
- Lines added/removed
- Potential risks
- Next steps
- Open questions

## Prerequisites

Run `/implement` first to make changes.

## Related Commands

- `/implement` - Make code changes
- `/test` - Run tests
- `/deploy` - Deployment checklist
