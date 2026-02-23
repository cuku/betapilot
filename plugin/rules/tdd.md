# TDD Workflow

Test-Driven Development is mandatory for all implementation tasks.

## The Cycle

1. **RED** - Write a failing test
2. **GREEN** - Write minimal code to pass
3. **REFACTOR** - Improve code while keeping tests passing

## Rules

### Before Writing Code

- Always write tests first
- Test file should be: `*.test.ts`, `*.spec.ts`, `*_test.py`, `*_test.go`
- Run tests after every change

### Test Structure

```python
# Python example
def test_feature():
    """Description of what this test verifies"""
    # Arrange
    expected = ...
    
    # Act
    result = my_function()
    
    # Assert
    assert result == expected
```

```typescript
// TypeScript example
describe('myFunction', () => {
  it('should do something specific', () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

## Running Tests

Use `/test` command:
```
/test
```

Or run directly:
```bash
npm test
```

## Coverage

- Aim for meaningful test coverage
- Focus on critical paths
- Test edge cases
- Don't test trivial code

## Enforced

The file_checker hook will warn if implementation files are modified without corresponding test changes.
