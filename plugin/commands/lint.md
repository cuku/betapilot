---
name: lint
description: Run linting and format checks
---

# /lint

Run linting and code format checks.

## Usage

```
/lint
```

## What it does

1. **Load Config** - Read lint command from `.pilot/config.json`
2. **Execute Lint** - Run configured linter
3. **Report Issues** - Show linting errors/warnings

## Configuration

Configure lint command in `.pilot/config.json`:
```json
{
  "lintCommand": "npm run lint"
}
```

## Output

- Linting errors
- Formatting issues
- Code style violations

## Related Commands

- `/test` - Run tests
- `/implement` - Make code changes
