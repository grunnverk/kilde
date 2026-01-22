# Kilde

> **Universal Git Automation Tool** - AI-powered commit and release messages for any git repository

[![npm version](https://badge.fury.io/js/@grunnverk%2Fkilde.svg)](https://www.npmjs.com/package/@grunnverk/kilde)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen.svg)](https://nodejs.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen.svg)](https://github.com/grunnverk/kilde)

Kilde (Norwegian for "source") is a lightweight, language-agnostic Git automation tool that generates excellent commit messages and release notes using AI. Unlike platform-specific tools, Kilde works with **any git repository** regardless of programming language or hosting platform.

## Features

- 🤖 **AI-Powered Commit Messages** - Generate meaningful commit messages from staged changes
- 📝 **Git-Based Release Notes** - Create comprehensive release notes from git history
- 🌍 **Language Agnostic** - Works with Python, Go, Rust, Java, JavaScript, and more
- 🚀 **Pure Git** - No GitHub API required, works with any git host
- ⚡ **Fast** - Builds in under 30 seconds
- 🔌 **MCP Integration** - Expose tools via Model Context Protocol
- 🎨 **Interactive Mode** - Review and edit before committing
- ⚙️ **Flexible Configuration** - YAML/JSON config files with sensible defaults

## Installation

```bash
# Install globally
npm install -g @grunnverk/kilde

# Or use with npx
npx @grunnverk/kilde --version
```

## Requirements

- Node.js 24.0.0 or higher
- Git 2.0+
- OpenAI API key (set `OPENAI_API_KEY` environment variable)

## Quick Start

### Generate a Commit Message

```bash
# Preview commit message (dry-run)
kilde commit --cached

# Stage all changes and generate commit message
kilde commit --add

# Generate and commit automatically
kilde commit --add --sendit

# Interactive mode - review before committing
kilde commit --add --interactive
```

### Generate Release Notes

```bash
# Generate release notes from last tag to HEAD
kilde release

# Specify version and tag range
kilde release --version v2.0.0 --from-tag v1.0.0

# Save to file
kilde release --version v2.0.0 --output RELEASE_NOTES.md

# Focus on specific aspects
kilde release --focus "breaking changes"
```

## Commands

### `kilde commit`

Generate AI-powered commit messages from staged changes.

**Options:**
- `--add` - Stage all changes before committing
- `--cached` - Only use staged changes (default)
- `--sendit` - Automatically commit with generated message
- `--interactive` - Review message before committing
- `--amend` - Amend the previous commit
- `--push [remote]` - Push after committing (optionally specify remote)
- `--context <text>` - Additional context for commit message
- `--context-files <files...>` - Include specific files for context
- `--dry-run` - Preview without making changes
- `--verbose` - Enable verbose logging
- `--debug` - Enable debug logging

**Examples:**

```bash
# Stage changes and preview commit message
kilde commit --add --dry-run

# Interactive commit with context
kilde commit --add --interactive --context "Fixes issue #123"

# Commit and push to origin
kilde commit --add --sendit --push origin

# Use specific files for context
kilde commit --add --context-files CHANGELOG.md --sendit
```

### `kilde release`

Generate release notes from git commit history.

**Options:**
- `--from-tag <tag>` - Start tag for release notes (default: last tag)
- `--to-tag <tag>` - End tag for release notes (default: HEAD)
- `--version <version>` - Version number for the release
- `--output <file>` - Output file path for release notes
- `--interactive` - Review notes before saving
- `--focus <text>` - Focus area for release notes
- `--context <text>` - Additional context for generation
- `--context-files <files...>` - Include specific files for context
- `--dry-run` - Preview without saving to file
- `--verbose` - Enable verbose logging
- `--debug` - Enable debug logging

**Examples:**

```bash
# Generate release notes for next version
kilde release --version v2.0.0 --output RELEASE.md

# Focus on breaking changes
kilde release --focus "breaking changes" --version v2.0.0

# Compare specific tags
kilde release --from-tag v1.5.0 --to-tag v2.0.0

# Preview with verbose output
kilde release --dry-run --verbose
```

## Configuration

Kilde looks for configuration files in the following locations (in order):

1. `.kilde/config.yaml`
2. `.kilde/config.yml`
3. `.kilderc.yaml`
4. `.kilderc.yml`
5. `.kilderc.json`
6. `kilde.config.json`

### Example Configuration

```yaml
# Global settings
verbose: false
debug: false
model: gpt-4o-mini
openaiReasoning: low
outputDirectory: output/kilde

# Commit configuration
commit:
  sendit: false
  interactive: false
  messageLimit: 3
  maxDiffBytes: 20480

# Release configuration
release:
  interactive: false
  messageLimit: 3
  maxDiffBytes: 20480
```

### Generate Sample Config

```bash
# Create a sample configuration file
kilde config --init
```

## MCP Integration

Kilde includes a Model Context Protocol server for integration with AI assistants like Claude.

### Setup

Add to your MCP configuration (e.g., `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "kilde": {
      "command": "npx",
      "args": ["-y", "@grunnverk/kilde", "mcp"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "kilde": {
      "command": "kilde-mcp",
      "args": []
    }
  }
}
```

### Available MCP Tools

#### `kilde_commit`

Generate and create git commits with AI-powered messages.

**Parameters:**
- `add` (boolean) - Stage all changes
- `cached` (boolean) - Use only staged changes
- `sendit` (boolean) - Automatically commit
- `interactive` (boolean) - Interactive mode
- `amend` (boolean) - Amend previous commit
- `context` (string) - Additional context
- `contextFiles` (array) - Context files
- `dryRun` (boolean) - Preview only

#### `kilde_release`

Generate release notes from git history.

**Parameters:**
- `fromTag` (string) - Start tag
- `toTag` (string) - End tag (default: HEAD)
- `version` (string) - Version number
- `output` (string) - Output file path
- `interactive` (boolean) - Interactive mode
- `focus` (string) - Focus area
- `context` (string) - Additional context
- `contextFiles` (array) - Context files
- `dryRun` (boolean) - Preview only

### MCP Resources

- `kilde://config` - Current configuration
- `kilde://status` - Git repository status
- `kilde://workspace` - Workspace information

### MCP Prompts

- `commit-workflow` - Interactive commit workflow
- `release-workflow` - Interactive release workflow

See [docs/AI_GUIDE.md](docs/AI_GUIDE.md) for detailed AI integration instructions.

## Environment Variables

- `OPENAI_API_KEY` - OpenAI API key (required)
- `OPENAI_BASE_URL` - Custom OpenAI API base URL (optional)
- `OPENAI_ORG_ID` - OpenAI organization ID (optional)

## Advanced Usage

### Using with Context Files

Provide additional context from specific files:

```bash
kilde commit --add --context-files CHANGELOG.md ARCHITECTURE.md \
  --context "Refactoring authentication module"
```

### Custom AI Models

Specify different AI models:

```bash
kilde commit --add --model gpt-4o
kilde release --model gpt-4o --reasoning high
```

### Dry-Run Mode

Preview what would happen without making changes:

```bash
kilde commit --add --dry-run --verbose
kilde release --version v2.0.0 --dry-run
```

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
kilde commit --add --debug
```

Debug logs are saved to `output/kilde/debug/*.log`

## How It Works

1. **Analyze Changes**: Examines git diff and commit history
2. **Extract Context**: Reads relevant files and commit messages
3. **Generate Message**: Uses AI to create contextual messages
4. **Review & Commit**: Optionally review before committing

### Commit Message Generation

- Analyzes staged or uncommitted changes
- Considers recent commit history for style consistency
- Generates clear, descriptive messages
- Follows conventional commit format when appropriate

### Release Notes Generation

- Analyzes commits between two git refs
- Categorizes changes (features, fixes, breaking changes)
- Generates structured, readable release notes
- Highlights important changes

## Use Cases

### Solo Developer

```bash
# Quick commit workflow
kilde commit --add --sendit

# Generate release notes for npm publish
kilde release --version $(npm version patch) --output CHANGELOG.md
```

### Team Development

```bash
# Interactive commit with context
kilde commit --add --interactive --context "Feature from sprint planning"

# Generate release notes for code review
kilde release --from-tag v1.9.0 --focus "API changes"
```

### CI/CD Integration

```bash
# Generate release notes in pipeline
kilde release --version $VERSION --output release-notes.md
```

## Troubleshooting

### "Node.js version 24.0.0 or higher is required"

Upgrade your Node.js:

```bash
# Using nvm
nvm install 24
nvm use 24
```

### "OPENAI_API_KEY environment variable is not set"

Set your OpenAI API key:

```bash
# In shell profile
export OPENAI_API_KEY="sk-..."

# Or use .env file
echo "OPENAI_API_KEY=sk-..." > .env
```

### "Not a git repository"

Ensure you're in a git repository:

```bash
git status
cd /path/to/your/repo
```

## Development

```bash
# Clone repository
git clone https://github.com/grunnverk/kilde.git
cd kilde

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Development mode
npm run dev
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Why Kilde?

**Universal**: Works with any git repository, any language, any git host.

**Simple**: Two commands, minimal configuration.

**Fast**: Optimized for speed with fast builds.

**Pure Git**: No external APIs, works offline.

**MCP Native**: First-class AI assistant integration.

## License

Apache-2.0 - See [LICENSE](LICENSE) for details.

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and submit pull requests.

## Related Projects

- [kodrdriv](https://github.com/grunnverk/kodrdriv) - Full-featured GitHub automation tool
- [@grunnverk/commands-git](https://github.com/grunnverk/commands-git) - Reusable git command library
- [@grunnverk/ai-service](https://github.com/grunnverk/ai-service) - AI service library

## Links

- [GitHub Repository](https://github.com/grunnverk/kilde)
- [npm Package](https://www.npmjs.com/package/@grunnverk/kilde)
- [AI Integration Guide](docs/AI_GUIDE.md)
- [API Documentation](docs/API.md)

---

**Made with ❤️ by the grunnverk team**
