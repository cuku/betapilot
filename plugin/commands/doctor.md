---
name: doctor
description: Check prerequisites and configuration
---

# /doctor

Check that all prerequisites are properly configured.

## Usage

```
/doctor
```

## What it checks

1. **Node.js** - Is Node.js installed?
2. **Git** - Is git available and initialized?
3. **API Keys** - Are ANTHROPIC_API_KEY or OPENAI_API_KEY set?
4. **Config** - Does `.pilot/config.json` exist and valid?

## Output

Shows status for each check:
- ✓ Node.js: installed
- ✓ Git: repo initialized
- ✓ API Key: configured
- ✓ Config: valid

## Fixes

If issues found, shows instructions to fix:
- Install Node.js
- Initialize git
- Set API key
- Run initial setup

## Related Commands

- All BetaPilot commands depend on these prerequisites
