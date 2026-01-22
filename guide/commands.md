# Commands Guide

Complete reference for all Kilde commands, flags, and options.

## Global Flags

These flags work with all commands:

### `--debug`
Enable debug logging to see detailed execution information.

```bash
kilde commit --debug
```

Debug logs include:
- Configuration loading and merging
- Git operations executed
- AI API calls and responses
- File system operations
- Timing information

### `--config <path>`
Specify a custom configuration file location.

```bash
kilde commit --config /path/to/custom-config.yaml
```

Useful for:
- Testing different configurations
- Per-branch or per-feature settings
- CI/CD with custom config

### `--help`
Display help information for any command.

```bash
kilde --help
kilde commit --help
kilde release --help
```

### `--version`
Display the installed Kilde version.

```bash
kilde --version
```

## `kilde commit`

Generate AI-powered commit messages from staged changes.

### Basic Usage

```bash
# Generate message for staged changes
kilde commit

# Stage all changes and generate message
kilde commit --add

# Generate and commit immediately
kilde commit --add --sendit
```

### Flags

#### `--add` / `-a`
Stage all modified and deleted files before generating the commit message.

```bash
kilde commit --add
```

Equivalent to running `git add -A` before committing. Does not add untracked files.

#### `--sendit` / `-s`
Automatically commit without interactive review.

```bash
kilde commit --sendit
```

**Warning**: Use with caution. Always review generated messages when possible.

#### `--interactive` / `-i`
Enable interactive mode to review and edit the generated message.

```bash
kilde commit --interactive
```

In interactive mode you can:
- Review the generated message
- Edit the message
- Accept or reject the commit
- Add additional context

#### `--amend`
Amend the previous commit instead of creating a new one.

```bash
kilde commit --amend
```

Useful for:
- Fixing typos in the last commit
- Adding forgotten changes
- Updating commit message

#### `--push`
Push to remote after committing.

```bash
kilde commit --add --sendit --push
```

Equivalent to running `git push` after the commit succeeds.

#### `--context <text>` / `-c <text>`
Provide additional context to the AI for better commit messages.

```bash
kilde commit --context "Fixing bug #123 reported by user"
kilde commit -c "Performance optimization for large datasets"
```

Context helps the AI understand:
- Why the change was made
- What problem it solves
- Related issues or tickets
- Performance implications

#### `--context-files <paths>` / `-f <paths>`
Provide additional files for context (comma-separated).

```bash
kilde commit --context-files "CHANGELOG.md,docs/api.md"
kilde commit -f "README.md,ARCHITECTURE.md"
```

Useful when:
- Changes relate to documentation
- Implementation follows specifications
- Need architectural context

#### `--dry-run`
Preview the generated message without committing.

```bash
kilde commit --dry-run
```

Shows:
- Generated commit message
- Affected files
- Diff summary
- Configuration used

#### `--issue <number>`
Reference a GitHub/GitLab issue number for context.

```bash
kilde commit --issue 123
```

The AI will include the issue reference in the commit message.

### Examples

#### Basic commit workflow
```bash
# Make changes
echo "export function hello() { return 'world'; }" > src/hello.ts

# Generate and review commit
kilde commit --add --interactive
```

#### Quick commit with context
```bash
# Fix a bug with context
kilde commit --add --sendit --context "Fix null pointer in user authentication"
```

#### Amend with additional changes
```bash
# Made a typo in the last commit
echo "// Fixed typo" >> src/hello.ts
kilde commit --add --amend
```

#### Commit and push
```bash
# Complete workflow
kilde commit --add --sendit --push
```

#### Dry-run for testing
```bash
# Test commit message generation
kilde commit --add --dry-run
```

### Interactive Mode

When using `--interactive`, you'll see:

```
Generated Commit Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
feat(hello): add hello world function

Add a new hello() function that returns 'world'.
This provides a basic greeting functionality.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:
  [a] Accept and commit
  [e] Edit message
  [r] Regenerate
  [c] Cancel

Your choice:
```

### Configuration

Commit behavior can be configured in `.kilde/config.yaml`:

```yaml
commit:
  # Commit message format
  type: conventional  # 'conventional' or 'simple'

  # Automatically stage changes
  autoStage: false

  # Skip interactive review
  autoCommit: false

  # Push after commit
  autoPush: false

  # AI configuration
  ai:
    model: gpt-4
    temperature: 0.7
    maxTokens: 500

  # Context files to always include
  contextFiles:
    - CHANGELOG.md
    - README.md
```

## `kilde release`

Generate release notes from git history.

### Basic Usage

```bash
# Generate notes for version 1.0.0
kilde release 1.0.0

# Generate notes between tags
kilde release --from v0.9.0 --to v1.0.0

# Generate notes from last tag to HEAD
kilde release
```

### Arguments

#### `<version>`
The version number for the release (optional).

```bash
kilde release 1.0.0
kilde release v2.1.3
```

If not provided, Kilde will:
- Use the latest tag as the "from" reference
- Use HEAD as the "to" reference

### Flags

#### `--from <ref>`
Starting git reference (tag, commit, branch).

```bash
kilde release --from v1.0.0
kilde release --from abc123
kilde release --from main
```

Default: Last tag or first commit if no tags exist.

#### `--to <ref>`
Ending git reference (tag, commit, branch).

```bash
kilde release --to v2.0.0
kilde release --to HEAD
kilde release --to feature-branch
```

Default: HEAD

#### `--output <path>` / `-o <path>`
Write release notes to a file instead of stdout.

```bash
kilde release 1.0.0 --output RELEASE_NOTES.md
kilde release -o docs/releases/v1.0.0.md
```

Useful for:
- Automating release documentation
- Maintaining historical records
- Integration with CI/CD

#### `--focus <areas>`
Focus on specific areas (comma-separated).

```bash
kilde release 1.0.0 --focus "security,performance"
kilde release --focus "api,documentation,testing"
```

Common focus areas:
- `security`: Security fixes and improvements
- `performance`: Performance optimizations
- `api`: API changes and additions
- `breaking`: Breaking changes
- `bugfixes`: Bug fixes
- `features`: New features
- `documentation`: Documentation updates
- `testing`: Test improvements

#### `--interactive` / `-i`
Review and edit release notes before saving.

```bash
kilde release 1.0.0 --interactive
```

Allows you to:
- Review generated notes
- Add manual sections
- Reorder items
- Remove irrelevant entries

#### `--context <text>` / `-c <text>`
Provide additional context for release notes generation.

```bash
kilde release 1.0.0 --context "Major rewrite of authentication system"
```

#### `--dry-run`
Preview release notes without saving.

```bash
kilde release 1.0.0 --dry-run
```

### Examples

#### Generate notes for new version
```bash
kilde release 1.0.0
```

Output:
```markdown
# Release v1.0.0

## Features
- Add user authentication system
- Implement role-based access control
- Add OAuth2 integration

## Bug Fixes
- Fix null pointer in user profile
- Resolve race condition in session management

## Performance
- Optimize database queries
- Add caching layer
```

#### Generate notes between tags
```bash
kilde release --from v0.9.0 --to v1.0.0
```

#### Save to file
```bash
kilde release 1.0.0 --output docs/releases/v1.0.0.md
```

#### Focus on security
```bash
kilde release 1.0.0 --focus security
```

#### Complete release workflow
```bash
# Generate notes interactively
kilde release 1.0.0 --interactive --output RELEASE_NOTES.md

# Tag the release
git tag v1.0.0

# Push with tags
git push origin main --tags
```

### Configuration

Release behavior can be configured in `.kilde/config.yaml`:

```yaml
release:
  # Output format
  format: markdown  # 'markdown' or 'plain'

  # Default focus areas
  focus:
    - features
    - bugfixes
    - breaking

  # Include commit hashes
  includeHashes: true

  # Include authors
  includeAuthors: true

  # AI configuration
  ai:
    model: gpt-4
    temperature: 0.7
    maxTokens: 2000

  # Grouping strategy
  groupBy: type  # 'type', 'scope', or 'none'
```

## `kilde-mcp`

Start the MCP (Model Context Protocol) server for AI assistant integration.

### Usage

```bash
# Start MCP server (stdio mode)
kilde-mcp

# Start with custom config
kilde-mcp --config /path/to/config.yaml

# Start with debug logging
kilde-mcp --debug
```

The MCP server is typically not run directly but configured in AI assistants like Claude Desktop or Claude Code.

See the [MCP Integration Guide](./mcp-integration.md) for setup instructions.

### Configuration

MCP server configuration in `.kilde/config.yaml`:

```yaml
mcp:
  # Server name
  name: kilde

  # Server version
  version: 0.1.0

  # Tools to expose
  tools:
    - kilde_commit
    - kilde_release

  # Resources to expose
  resources:
    - config
    - status
    - workspace

  # Prompts to expose
  prompts:
    - commit-workflow
    - release-workflow
```

## Exit Codes

Kilde uses standard exit codes:

- `0`: Success
- `1`: General error
- `2`: Configuration error
- `3`: Git operation failed
- `4`: AI service error
- `130`: Interrupted by user (Ctrl+C)

## Environment Variables

### `KILDE_CONFIG_DIR`
Override the default config directory.

```bash
export KILDE_CONFIG_DIR=/custom/config/path
kilde commit
```

### `KILDE_LOG_LEVEL`
Set log level (debug, info, warn, error).

```bash
export KILDE_LOG_LEVEL=debug
kilde commit
```

### `OPENAI_API_KEY`
OpenAI API key for AI services.

```bash
export OPENAI_API_KEY=sk-...
kilde commit
```

### `ANTHROPIC_API_KEY`
Anthropic API key for Claude models.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
kilde commit
```

## Tips and Best Practices

### Commit Messages
1. Always review generated messages before committing
2. Use `--context` for complex changes
3. Include relevant issue numbers
4. Use `--dry-run` to test configuration changes

### Release Notes
1. Generate notes from stable branches
2. Use `--focus` to highlight important changes
3. Review and edit in interactive mode
4. Save notes to version-controlled files

### Configuration
1. Start with defaults, customize as needed
2. Use project-specific config files
3. Share team configuration via git
4. Override per-command when needed

### Debugging
1. Enable `--debug` to troubleshoot issues
2. Check configuration with `--dry-run`
3. Verify git status before operations
4. Review logs in `.kilde/logs/`

## Next Steps

- [Configuration Guide](./configuration.md) - Detailed configuration reference
- [MCP Integration Guide](./mcp-integration.md) - Set up AI assistant integration
- [Architecture Guide](./architecture.md) - Technical implementation details
