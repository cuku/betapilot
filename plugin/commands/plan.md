---
name: plan
description: Generate implementation plan from specification
---

# /plan

Generate a detailed implementation plan from the current specification.

## Usage

```
/plan
```

## What it does

1. **Read Spec** - Load `.pilot/spec.md`
2. **Analyze Requirements** - Understand what's needed
3. **Create Tasks** - Break down into actionable steps
4. **Write Plan** - Save to `.pilot/plan.md`

## Output

Creates/updates `.pilot/plan.md` with:
- Numbered implementation steps
- Dependencies between tasks
- Technical approach for each step

## Prerequisites

Run `/spec` first to create the specification.

## Related Commands

- `/spec` - Create specification
- `/implement` - Execute the plan
- `/test` - Run tests after implementation
