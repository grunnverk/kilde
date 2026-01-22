# Configuration Guide

Complete guide to configuring Kilde for your workflow.

## Configuration Files

Kilde supports multiple configuration file formats and locations.

### File Formats

#### YAML (Recommended)
```yaml
# .kilde/config.yaml
commit:
  type: conventional
  autoStage: false
  ai:
    model: gpt-4
    temperature: 0.7

release:
  format: markdown
  includeHashes: true
```

#### JSON
```json
{
  "commit": {
    "type": "conventional",
    "autoStage": false,
    "ai": {
      "model": "gpt-4",
      "temperature": 0.7
    }
  },
  "release": {
    "format": "markdown",
    "includeHashes": true
  }
}
```

### File Locations

Kilde searches for configuration files in this order:

1. **Command-line specified**: `--config /path/to/config.yaml`
2. **Project config**: `.kilde/config.yaml` or `.kilde/config.json`
3. **Project root**: `.kilderc.yaml`, `.kilderc.json`, `.kilderc`
4. **User home**: `~/.kilde/config.yaml`, `~/.kilderc.yaml`

Files are merged with later files taking precedence. This allows:
- Global defaults in home directory
- Project-specific settings in repository
- Command-specific overrides via CLI

### Creating a Config File

Generate a sample configuration:

```bash
mkdir -p .kilde
cat > .kilde/config.yaml << 'EOF'
commit:
  type: conventional
  ai:
    model: gpt-4
    temperature: 0.7

release:
  format: markdown
  includeHashes: true
EOF
```

## Configuration Schema

### Top-Level Structure

```yaml
# General settings
logLevel: info          # debug, info, warn, error
configDirectory: .kilde # Config directory name

# Command-specific settings
commit: { }
release: { }
mcp: { }
```

## Commit Configuration

### `commit.type`

Commit message format style.

**Type**: `string`
**Default**: `conventional`
**Options**: `conventional`, `simple`

```yaml
commit:
  type: conventional
```

**conventional**: Follows [Conventional Commits](https://www.conventionalcommits.org/)
```
feat(auth): add OAuth2 support

Implement OAuth2 authentication flow with support
for multiple providers.
```

**simple**: Plain commit messages
```
Add OAuth2 support

Implement OAuth2 authentication flow with support
for multiple providers.
```

### `commit.autoStage`

Automatically stage changes before committing.

**Type**: `boolean`
**Default**: `false`

```yaml
commit:
  autoStage: true
```

Equivalent to `git add -A` before generating commit message.

### `commit.autoCommit`

Skip interactive review and commit immediately.

**Type**: `boolean`
**Default**: `false`

```yaml
commit:
  autoCommit: true
```

**Warning**: Use with caution. Recommended to keep `false` for safety.

### `commit.autoPush`

Push to remote after successful commit.

**Type**: `boolean`
**Default**: `false`

```yaml
commit:
  autoPush: true
```

### `commit.contextFiles`

Files to always include for context.

**Type**: `string[]`
**Default**: `[]`

```yaml
commit:
  contextFiles:
    - CHANGELOG.md
    - README.md
    - docs/ARCHITECTURE.md
```

Useful for providing consistent context to the AI.

### `commit.ai`

AI model configuration for commit messages.

```yaml
commit:
  ai:
    model: gpt-4           # Model name
    temperature: 0.7       # 0.0 to 1.0
    maxTokens: 500         # Max response length
    provider: openai       # openai, anthropic
```

#### `commit.ai.model`

AI model to use.

**Type**: `string`
**Default**: `gpt-4`

**OpenAI Models**:
- `gpt-4`: Best quality, slower
- `gpt-3.5-turbo`: Faster, good quality
- `gpt-4-turbo`: Fast and high quality

**Anthropic Models**:
- `claude-3-opus`: Highest quality
- `claude-3-sonnet`: Balanced
- `claude-3-haiku`: Fastest

```yaml
commit:
  ai:
    model: claude-3-sonnet
    provider: anthropic
```

#### `commit.ai.temperature`

Creativity level for AI responses.

**Type**: `number` (0.0 to 1.0)
**Default**: `0.7`

- `0.0-0.3`: More focused and deterministic
- `0.4-0.7`: Balanced creativity
- `0.8-1.0`: More creative and varied

```yaml
commit:
  ai:
    temperature: 0.5  # More consistent messages
```

#### `commit.ai.maxTokens`

Maximum length of generated message.

**Type**: `number`
**Default**: `500`

```yaml
commit:
  ai:
    maxTokens: 800  # Allow longer messages
```

### `commit.format`

Commit message formatting options.

```yaml
commit:
  format:
    maxLineLength: 72      # Wrap at 72 characters
    includeScope: true     # Include scope in type
    scopeRequired: false   # Require scope
    breakingPrefix: "!"    # Breaking change indicator
```

### Example Commit Configurations

#### Minimal
```yaml
commit:
  type: conventional
```

#### Team Standard
```yaml
commit:
  type: conventional
  autoStage: false
  autoCommit: false
  ai:
    model: gpt-4
    temperature: 0.5
  contextFiles:
    - CHANGELOG.md
  format:
    maxLineLength: 72
    scopeRequired: true
```

#### Fast Workflow
```yaml
commit:
  type: simple
  autoStage: true
  autoCommit: true
  autoPush: true
  ai:
    model: gpt-3.5-turbo
    temperature: 0.7
```

## Release Configuration

### `release.format`

Output format for release notes.

**Type**: `string`
**Default**: `markdown`
**Options**: `markdown`, `plain`

```yaml
release:
  format: markdown
```

### `release.includeHashes`

Include commit hashes in release notes.

**Type**: `boolean`
**Default**: `true`

```yaml
release:
  includeHashes: true
```

Output with hashes:
```markdown
## Features
- feat(auth): add OAuth2 support (abc123)
```

Output without hashes:
```markdown
## Features
- feat(auth): add OAuth2 support
```

### `release.includeAuthors`

Include commit authors in release notes.

**Type**: `boolean`
**Default**: `true`

```yaml
release:
  includeAuthors: true
```

Output:
```markdown
## Features
- feat(auth): add OAuth2 support (@username)
```

### `release.focus`

Default focus areas for release notes.

**Type**: `string[]`
**Default**: `[]`

```yaml
release:
  focus:
    - features
    - bugfixes
    - breaking
    - security
```

### `release.groupBy`

How to group commits in release notes.

**Type**: `string`
**Default**: `type`
**Options**: `type`, `scope`, `none`

```yaml
release:
  groupBy: type
```

**type**: Group by commit type (feat, fix, docs, etc.)
```markdown
## Features
- Add OAuth2 support
- Add user profile page

## Bug Fixes
- Fix login redirect
```

**scope**: Group by scope (auth, ui, api, etc.)
```markdown
## auth
- Add OAuth2 support
- Fix login redirect

## ui
- Add user profile page
```

**none**: No grouping, chronological order

### `release.ai`

AI configuration for release notes.

```yaml
release:
  ai:
    model: gpt-4
    temperature: 0.7
    maxTokens: 2000
    provider: openai
```

Configuration works the same as `commit.ai`.

### Example Release Configurations

#### Minimal
```yaml
release:
  format: markdown
```

#### Detailed
```yaml
release:
  format: markdown
  includeHashes: true
  includeAuthors: true
  groupBy: type
  focus:
    - features
    - breaking
    - security
  ai:
    model: gpt-4
    temperature: 0.5
```

#### Simple
```yaml
release:
  format: plain
  includeHashes: false
  includeAuthors: false
  groupBy: none
```

## MCP Configuration

Configuration for the Model Context Protocol server.

### `mcp.name`

Server name for MCP.

**Type**: `string`
**Default**: `kilde`

```yaml
mcp:
  name: kilde
```

### `mcp.version`

Server version.

**Type**: `string`
**Default**: Package version

```yaml
mcp:
  version: 0.1.0
```

### `mcp.tools`

Tools to expose via MCP.

**Type**: `string[]`
**Default**: `["kilde_commit", "kilde_release"]`

```yaml
mcp:
  tools:
    - kilde_commit
    - kilde_release
```

### `mcp.resources`

Resources to expose via MCP.

**Type**: `string[]`
**Default**: `["config", "status", "workspace"]`

```yaml
mcp:
  resources:
    - config
    - status
    - workspace
```

### `mcp.prompts`

Workflow prompts to expose.

**Type**: `string[]`
**Default**: `["commit-workflow", "release-workflow"]`

```yaml
mcp:
  prompts:
    - commit-workflow
    - release-workflow
```

## Environment Variables

### `OPENAI_API_KEY`

OpenAI API key for GPT models.

```bash
export OPENAI_API_KEY=sk-...
```

Required when using OpenAI models (gpt-4, gpt-3.5-turbo).

### `ANTHROPIC_API_KEY`

Anthropic API key for Claude models.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Required when using Anthropic models (claude-3-*).

### `KILDE_CONFIG_DIR`

Override default config directory.

```bash
export KILDE_CONFIG_DIR=/custom/path
```

Default: `.kilde`

### `KILDE_LOG_LEVEL`

Override log level.

```bash
export KILDE_LOG_LEVEL=debug
```

Options: `debug`, `info`, `warn`, `error`

### `KILDE_DEBUG`

Enable debug mode (alternative to --debug flag).

```bash
export KILDE_DEBUG=1
```

## Configuration Precedence

Configuration is merged in this order (later overrides earlier):

1. **Built-in defaults**
2. **User home config** (`~/.kilde/config.yaml`)
3. **Project root config** (`.kilderc.yaml`)
4. **Project .kilde config** (`.kilde/config.yaml`)
5. **Environment variables**
6. **Command-line flags**

### Example Merge

**Built-in defaults**:
```yaml
commit:
  type: conventional
  autoStage: false
  ai:
    model: gpt-4
    temperature: 0.7
```

**Project config** (`.kilde/config.yaml`):
```yaml
commit:
  autoStage: true
  ai:
    model: gpt-3.5-turbo
```

**Command-line**:
```bash
kilde commit --context "Fix bug"
```

**Effective configuration**:
```yaml
commit:
  type: conventional      # from defaults
  autoStage: true         # from project config
  ai:
    model: gpt-3.5-turbo  # from project config
    temperature: 0.7      # from defaults
  context: "Fix bug"      # from CLI
```

## Validation

Kilde validates configuration files on load. Common errors:

### Invalid Type
```yaml
commit:
  type: invalid  # Error: must be 'conventional' or 'simple'
```

### Invalid Value
```yaml
commit:
  ai:
    temperature: 2.0  # Error: must be between 0.0 and 1.0
```

### Unknown Field
```yaml
commit:
  unknownField: value  # Warning: unknown field (ignored)
```

## Best Practices

### Team Configuration

**Commit team config to git**:
```bash
# .kilde/config.yaml (committed)
commit:
  type: conventional
  format:
    maxLineLength: 72
    scopeRequired: true

# Developer overrides in ~/.kilde/config.yaml (not committed)
commit:
  autoStage: true
  ai:
    model: gpt-3.5-turbo  # Faster for development
```

### Per-Branch Configuration

Use different configs for different workflows:

```bash
# Feature branch
git checkout feature/auth
cat > .kilde/config.yaml << EOF
commit:
  contextFiles:
    - docs/auth-spec.md
  ai:
    temperature: 0.8  # More creative for new features
EOF

# Bugfix branch
git checkout bugfix/login
cat > .kilde/config.yaml << EOF
commit:
  contextFiles:
    - BUGS.md
  ai:
    temperature: 0.3  # More focused for bug fixes
EOF
```

### CI/CD Configuration

```yaml
# .kilde/config.yaml
commit:
  # Production settings
  autoCommit: false
  ai:
    model: gpt-4

# CI overrides via environment
# In CI: KILDE_LOG_LEVEL=debug kilde commit
```

### Configuration Templates

Create templates for common scenarios:

```bash
# .kilde/templates/feature.yaml
commit:
  type: conventional
  contextFiles:
    - ARCHITECTURE.md
  ai:
    temperature: 0.8

# .kilde/templates/bugfix.yaml
commit:
  type: conventional
  contextFiles:
    - BUGS.md
  ai:
    temperature: 0.3

# Use template
cp .kilde/templates/feature.yaml .kilde/config.yaml
```

## Troubleshooting

### Config Not Loading

**Check search paths**:
```bash
kilde commit --debug
# Look for "Loading config from..." messages
```

**Verify file syntax**:
```bash
# For YAML
yamllint .kilde/config.yaml

# For JSON
jq . .kilde/config.json
```

### API Keys Not Working

**Check environment variables**:
```bash
echo $OPENAI_API_KEY
echo $ANTHROPIC_API_KEY
```

**Verify in debug mode**:
```bash
kilde commit --debug
# Look for "Using AI provider: ..." message
```

### Unexpected Behavior

**Dump effective configuration**:
```bash
kilde commit --dry-run --debug
# Shows merged configuration
```

**Test with minimal config**:
```bash
kilde commit --config /dev/null
# Uses only built-in defaults
```

## Next Steps

- [Commands Guide](./commands.md) - Command reference
- [MCP Integration Guide](./mcp-integration.md) - Set up AI assistant integration
- [Architecture Guide](./architecture.md) - Technical implementation details
