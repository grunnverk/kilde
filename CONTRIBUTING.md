# Contributing to Kilde

Thank you for your interest in contributing to Kilde! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory language
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js 24.0.0 or higher
- Git 2.0 or higher
- npm 10.0 or higher
- OpenAI API key for testing

### Finding Issues

Good places to start:

- [Issues labeled "good first issue"](https://github.com/grunnverk/kilde/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- [Issues labeled "help wanted"](https://github.com/grunnverk/kilde/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
- Documentation improvements
- Test coverage improvements

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/kilde.git
cd kilde

# Add upstream remote
git remote add upstream https://github.com/grunnverk/kilde.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

### 4. Build the Project

```bash
npm run build
```

### 5. Run Tests

```bash
npm test
```

### 6. Development Mode

For active development with auto-rebuild:

```bash
npm run watch
```

## Project Structure

```
kilde/
├── src/
│   ├── commands/          # Command implementations
│   │   └── release.ts     # Release notes command
│   ├── mcp/              # MCP server implementation
│   │   ├── server.ts     # MCP server
│   │   ├── tools.ts      # MCP tools
│   │   ├── resources.ts  # MCP resources
│   │   └── prompts/      # MCP prompts
│   ├── utils/            # Utility functions
│   │   └── config.ts     # Configuration handling
│   ├── application.ts    # CLI application
│   ├── constants.ts      # Constants and defaults
│   ├── logging.ts        # Logging setup
│   ├── main.ts          # Entry point
│   └── types.ts         # TypeScript types
├── tests/                # Test files
│   ├── mcp/             # MCP tests
│   ├── utils/           # Utility tests
│   └── *.test.ts        # Other tests
├── docs/                # Documentation
├── scripts/             # Build scripts
└── dist/                # Build output
```

## Making Changes

### 1. Create a Branch

```bash
# Update your fork
git fetch upstream
git checkout main
git merge upstream/main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `test/` - Test improvements
- `refactor/` - Code refactoring

### 2. Make Your Changes

Follow these guidelines:

#### Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused

#### Example

```typescript
/**
 * Load configuration from file system
 * @param cwd - Working directory to search from
 * @returns Loaded configuration or null if not found
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<Config | null> {
    // Implementation
}
```

#### Imports

```typescript
// External imports first
import { Command } from 'commander';
import winston from 'winston';

// Internal imports second
import { Config } from '@eldrforge/core';
import { getLogger } from './logging';

// Relative imports last
import { loadConfig } from './utils/config';
```

#### Error Handling

```typescript
try {
    const result = await someOperation();
    return result;
} catch (error: any) {
    logger.error(`Operation failed: ${error.message}`);
    throw error;
}
```

### 3. Write Tests

All new code must include tests:

```typescript
import { describe, it, expect } from 'vitest';

describe('myFunction', () => {
    it('should do something correctly', () => {
        const result = myFunction('input');
        expect(result).toBe('expected output');
    });

    it('should handle edge cases', () => {
        expect(() => myFunction(null)).toThrow();
    });
});
```

### 4. Update Documentation

- Update README.md if adding features
- Add JSDoc comments to new functions
- Update AI_GUIDE.md for MCP changes
- Create examples for new functionality

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test tests/utils/config.test.ts
```

### Coverage Requirements

- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%

### Writing Good Tests

1. **Test Behavior, Not Implementation**
   ```typescript
   // Good
   it('should return configuration from file', async () => {
       const config = await loadConfig();
       expect(config.verbose).toBeDefined();
   });

   // Avoid
   it('should call fs.readFile with correct path', async () => {
       await loadConfig();
       expect(mockReadFile).toHaveBeenCalledWith('/path');
   });
   ```

2. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('should return null when no config file exists', async () => {});

   // Avoid
   it('works correctly', async () => {});
   ```

3. **Test Edge Cases**
   ```typescript
   describe('loadConfig', () => {
       it('should handle missing file');
       it('should handle malformed JSON');
       it('should handle permission errors');
   });
   ```

## Documentation

### Code Comments

- Use JSDoc for public APIs
- Explain "why", not "what"
- Keep comments up to date

```typescript
/**
 * Execute a tool with the given name and arguments.
 *
 * This function builds the config from defaults and executes
 * the appropriate command (commit or release).
 *
 * @param name - Tool name ('kilde_commit' or 'kilde_release')
 * @param args - Tool arguments
 * @param context - Execution context
 * @returns Tool result with content array
 */
export async function executeTool(
    name: string,
    args: Record<string, any>,
    context: ToolContext
): Promise<ToolResult> {
    // Implementation
}
```

### README Updates

When adding features:

1. Add to Features section
2. Update Commands section
3. Add examples
4. Update configuration if needed

### AI Guide Updates

When changing MCP functionality:

1. Update tool parameters
2. Add new examples
3. Update best practices
4. Add troubleshooting tips

## Submitting Changes

### 1. Commit Your Changes

Follow conventional commit format:

```bash
# Format: <type>(<scope>): <description>

git commit -m "feat(mcp): add new resource for git tags"
git commit -m "fix(commit): handle empty diff gracefully"
git commit -m "docs: update AI integration guide"
git commit -m "test: add tests for config loading"
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `refactor` - Code refactoring
- `chore` - Maintenance

### 2. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request

1. Go to GitHub and create a pull request
2. Fill out the pull request template
3. Link related issues
4. Request review

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Coverage maintained/improved

## Checklist
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No breaking changes (or documented)
```

### 4. Code Review Process

- Address reviewer feedback promptly
- Keep discussions focused and professional
- Make requested changes in new commits
- Don't force-push during review

### 5. After Approval

Once approved, a maintainer will merge your PR.

## Release Process

Releases are handled by maintainers:

1. Version bump
2. Update CHANGELOG
3. Create git tag
4. Publish to npm
5. Create GitHub release

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## Getting Help

- [GitHub Discussions](https://github.com/grunnverk/kilde/discussions)
- [GitHub Issues](https://github.com/grunnverk/kilde/issues)
- [Discord Community](https://discord.gg/eldrforge) (coming soon)

## Recognition

Contributors are recognized in:

- CHANGELOG.md
- GitHub contributors page
- Release notes

Thank you for contributing to Kilde! 🎉

---

**Questions?** Open a [GitHub Discussion](https://github.com/grunnverk/kilde/discussions)
