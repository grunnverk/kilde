# Kilde Overview

## What is Kilde?

Kilde is a **universal Git automation tool** that provides AI-powered commit messages and release notes for any git repository, regardless of programming language or hosting platform. The name "kilde" means "source" in Norwegian, reflecting its role as a foundational tool for managing your source code history.

## Key Features

### Language-Agnostic
Kilde works with any programming language because it operates purely on git primitives. Whether you're working with:
- JavaScript/TypeScript
- Python
- Go
- Rust
- Java
- Ruby
- PHP
- Or any other language

Kilde provides the same high-quality automation.

### Host-Agnostic
Unlike many git automation tools, Kilde doesn't depend on any specific hosting platform's API:
- GitHub
- GitLab
- Bitbucket
- Self-hosted git servers
- Local repositories

All work equally well because Kilde uses pure git operations.

### AI-Powered
Kilde leverages AI models to:
- Generate meaningful commit messages from your changes
- Create comprehensive release notes from git history
- Understand context from your codebase
- Follow conventional commit formats
- Suggest improvements to your workflow

### MCP Integration
Kilde includes a Model Context Protocol (MCP) server, allowing AI assistants like Claude to:
- Execute git operations on your behalf
- Access repository status and configuration
- Generate commits and releases through natural language
- Provide guided workflows for common tasks

## Core Commands

### `kilde commit`
Generate AI-powered commit messages from staged changes.

```bash
# Generate and review a commit message
kilde commit

# Stage all changes and commit
kilde commit --add --sendit

# Include additional context
kilde commit --context "Fixing authentication bug from issue #123"
```

### `kilde release`
Generate release notes from git history.

```bash
# Generate notes for version 1.0.0
kilde release 1.0.0

# Generate notes between two tags
kilde release --from v0.9.0 --to v1.0.0

# Focus on specific areas
kilde release 1.0.0 --focus "security,performance"
```

## Architecture

### Package Structure
Kilde is built on the @eldrforge package ecosystem, reusing battle-tested components:

- **@eldrforge/commands-git**: Core git commit functionality
- **@eldrforge/core**: Shared types and utilities
- **@eldrforge/ai-service**: AI model integration
- **@eldrforge/git-tools**: Git operations and utilities
- **@eldrforge/shared**: Common functionality

This architecture ensures:
- Zero code duplication
- Consistent behavior across tools
- Easy maintenance and updates
- Shared configuration and conventions

### Technology Stack
- **TypeScript**: Type-safe implementation with strict mode
- **Commander.js**: CLI argument parsing and routing
- **Winston**: Structured logging with multiple transports
- **Vite**: Fast build system with SWC compilation
- **Vitest**: Unit testing with coverage reporting
- **MCP SDK**: Model Context Protocol server implementation
- **RiotPrompt**: AI prompt formatting and management

## Configuration

Kilde uses a flexible configuration system supporting:
- Multiple file formats (YAML, JSON)
- Multiple locations (.kilde/, project root, home directory)
- Deep merge with sensible defaults
- Command-line overrides
- Environment variables

See the [Configuration Guide](./configuration.md) for details.

## Use Cases

### Individual Developers
- Generate commit messages that follow team conventions
- Create release notes without manual changelog maintenance
- Improve commit quality and consistency
- Save time on repetitive git tasks

### Teams
- Enforce commit message standards automatically
- Generate consistent release documentation
- Share configuration across the team
- Integrate with existing workflows

### Open Source Projects
- Generate professional release notes
- Maintain high-quality commit history
- Save maintainer time on releases
- Improve contributor experience

### AI Assistants
- Execute git operations through MCP integration
- Provide guided commit workflows
- Access repository context and status
- Generate commits from natural language descriptions

## Comparison with Other Tools

### vs Conventional Commits
Kilde generates messages that follow Conventional Commits format, but goes further:
- Understands your actual code changes
- Suggests appropriate commit types
- Includes relevant context automatically
- Works with any language

### vs GitHub Releases
Kilde generates release notes without GitHub API dependencies:
- Works with any git host
- Operates on git history only
- No API rate limits
- Full control over output format

### vs Manual Commits
Kilde augments your workflow without replacing it:
- Review and edit all generated content
- Interactive mode for full control
- Dry-run previews before committing
- Falls back to standard git when needed

## Getting Started

1. **Install Kilde**
   ```bash
   npm install -g @eldrforge/kilde
   ```

2. **Generate your first commit**
   ```bash
   # Make some changes
   echo "console.log('Hello')" > test.js

   # Generate commit message
   kilde commit --add
   ```

3. **Configure for your project**
   ```bash
   # Create config file
   mkdir -p .kilde
   cat > .kilde/config.yaml << EOF
   commit:
     type: conventional
     ai:
       model: gpt-4
   EOF
   ```

4. **Set up MCP integration** (optional)
   See the [MCP Integration Guide](./mcp-integration.md) for Claude Desktop/Code setup.

## Philosophy

Kilde is designed around these principles:

### Simplicity
Two core commands (`commit`, `release`) that do one thing well. No feature bloat, no unnecessary complexity.

### Transparency
All operations are reviewable before execution. Dry-run modes, interactive prompts, and clear logging keep you in control.

### Flexibility
Works with your workflow, not against it. Configure what you need, ignore what you don't.

### Quality
High test coverage (85%+), strict TypeScript, comprehensive error handling. Production-ready from day one.

### Openness
Apache-2.0 licensed, built on open standards (git, MCP), works with any platform.

## Next Steps

- [Commands Guide](./commands.md) - Detailed command reference
- [Configuration Guide](./configuration.md) - Configuration options and examples
- [MCP Integration Guide](./mcp-integration.md) - Set up Claude integration
- [Architecture Guide](./architecture.md) - Technical implementation details

## Support

- **Documentation**: [README.md](../README.md)
- **Issues**: [GitHub Issues](https://github.com/grunnverk/kilde/issues)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **License**: Apache-2.0
