---
name: learn
description: Extract and save reusable knowledge from session
---

# /learn

Capture non-obvious discoveries as reusable knowledge for future sessions.

## Usage

```
/learn "<what you learned>"
```

Or just `/learn` to trigger manual extraction.

## What it does

1. **Analyze Session** - Review recent discoveries
2. **Extract Knowledge** - Identify reusable patterns
3. **Save to Memory** - Store in `.pilot/memory/learned.json`

## When Triggered

- **Manual**: Run `/learn "description of knowledge"`
- **Automatic**: After 10+ minute investigations (via context monitor)

## What to Learn

- Debugging workflows
- Architecture decisions
- Workarounds for issues
- Team conventions
- API patterns
- Configuration tricks

## Memory Storage

Learned knowledge is stored in:
```
.pilot/memory/learned.json
```

## Related Commands

- `/sync` - Learn codebase structure
- Session hooks auto-save observations
