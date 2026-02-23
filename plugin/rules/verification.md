# Verification Requirements

Every piece of work must be verified before marking complete.

## Verification Checklist

Before finishing any task:

- [ ] **Tests Pass** - Run `/test` and ensure all pass
- [ ] **Lint Clean** - Run `/lint` and fix any issues
- [ ] **Types Check** - No TypeScript errors
- [ ] **Builds** - Project builds without errors
- [ ] **Security** - No exposed secrets or vulnerabilities

## Verification Steps

### 1. Run Tests
```
/test
```

### 2. Run Linter
```
/lint
```

### 3. Check Types
```bash
npm run typecheck
# or
npx tsc --noEmit
```

### 4. Build Project
```bash
npm run build
```

### 5. Review Changes
```
/review
```

## Verification Gate

The `/review` command will:
- Show all changed files
- Display diff summary
- Identify potential risks
- Suggest next steps

## Quality Standards

- No lint warnings
- 100% type coverage
- Tests for critical paths
- Security scan clean
