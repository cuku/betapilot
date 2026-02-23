---
name: deploy
description: Run deployment checklist and execute deploy
---

# /deploy

Run the deployment checklist and optionally execute deploy.

## Usage

```
/deploy
```

## What it does

1. **Checklist** - Verify all pre-deployment items:
   - Tests passing
   - Code reviewed
   - Build succeeds
   - No security issues
   - Documentation updated

2. **Execute Deploy** - Run deploy command if configured

## Configuration

Configure deploy command in `.pilot/config.json`:
```json
{
  "deployCommand": "npm run deploy"
}
```

## Safety

- Requires checklist completion before deploy
- Dry-run available

## Related Commands

- `/test` - Run tests
- `/review` - Review changes
