---
name: spec
description: Run spec-driven development workflow - create or update a specification
---

# /spec

Execute the BetaPilot spec-driven development workflow.

## Usage

```
/spec "<description of what you want to build>"
```

Or just `/spec` to update the current spec.

## What it does

1. **Requirements Analysis** - Understand what needs to be built
2. **Spec Creation** - Write detailed specification to `.pilot/spec.md`
3. **Acceptance Criteria** - Define clear success criteria
4. **Scope Definition** - Clarify what's in/out of scope

## Output

Creates/updates `.pilot/spec.md` with:
- Overview
- Requirements (list)
- Acceptance Criteria (checklist)
- Technical Notes

## Related Commands

- `/plan` - Generate implementation plan from spec
- `/implement` - Execute the plan
- `/sync` - Learn codebase structure first
