---
name: test
description: Run project test suite
---

# /test

Run the project's test suite and capture results.

## Usage

```
/test
```

Or run specific tests:
```
/test "<test pattern>"
```

## What it does

1. **Load Config** - Read test command from `.pilot/config.json`
2. **Execute Tests** - Run `npm test` or configured test command
3. **Capture Output** - Store test results
4. **Report Results** - Show pass/fail status

## Configuration

Default test command is `npm test`. Configure in `.pilot/config.json`:
```json
{
  "testCommand": "npm test"
}
```

## Output

- Exit code (0 = pass, non-zero = fail)
- Test output
- Duration

## Related Commands

- `/implement` - Run implementation
- `/review` - Review test results in context
- `/lint` - Run linting checks
