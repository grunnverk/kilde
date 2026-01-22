# MCP Integration Guide

Complete guide to integrating Kilde with AI assistants via the Model Context Protocol (MCP).

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io/) is an open protocol that enables AI assistants to securely access external tools, data sources, and services. Kilde implements an MCP server that exposes its git automation capabilities to AI assistants like Claude.

### Benefits

- **Natural Language Git Operations**: Execute git tasks through conversation
- **Context-Aware**: AI has access to repository status and configuration
- **Guided Workflows**: Predefined prompts for common tasks
- **Safe Execution**: Review all operations before they execute
- **Universal**: Works with any MCP-compatible AI assistant

## Supported Clients

### Claude Desktop

Official desktop app for macOS and Windows with built-in MCP support.

**Download**: [claude.ai/download](https://claude.ai/download)

### Claude Code

VSCode extension with MCP integration.

**Install**: Search "Claude Code" in VSCode extensions

### Custom Clients

Any application using the MCP SDK can connect to Kilde's server.

## Installation

### Prerequisites

1. **Node.js 24+**: Required for Kilde
   ```bash
   node --version  # Should be 24.x or higher
   ```

2. **Kilde**: Install globally
   ```bash
   npm install -g @eldrforge/kilde
   ```

3. **AI Assistant**: Install Claude Desktop or Claude Code

4. **API Keys**: OpenAI or Anthropic API key
   ```bash
   export OPENAI_API_KEY=sk-...
   # or
   export ANTHROPIC_API_KEY=sk-ant-...
   ```

## Setup: Claude Desktop

### 1. Locate Configuration File

**macOS**:
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows**:
```
%APPDATA%\Claude\claude_desktop_config.json
```

### 2. Add Kilde Server

Edit the configuration file:

```json
{
  "mcpServers": {
    "kilde": {
      "command": "kilde-mcp",
      "args": [],
      "env": {
        "OPENAI_API_KEY": "sk-..."
      }
    }
  }
}
```

**With custom config**:
```json
{
  "mcpServers": {
    "kilde": {
      "command": "kilde-mcp",
      "args": ["--config", "/path/to/.kilde/config.yaml"],
      "env": {
        "OPENAI_API_KEY": "sk-...",
        "KILDE_LOG_LEVEL": "debug"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

Quit and restart Claude Desktop for changes to take effect.

### 4. Verify Connection

In Claude Desktop, start a new conversation:

```
You: What Kilde tools are available?

Claude: I have access to the following Kilde tools:
- kilde_commit: Generate AI-powered commit messages
- kilde_release: Generate release notes from git history
```

## Setup: Claude Code

### 1. Install Extension

In VSCode:
1. Open Extensions (Cmd+Shift+X / Ctrl+Shift+X)
2. Search "Claude Code"
3. Click Install

### 2. Configure MCP Server

Open VSCode settings (`Cmd+,` / `Ctrl+,`):

1. Search "Claude Code MCP"
2. Edit `settings.json`:

```json
{
  "claudeCode.mcpServers": {
    "kilde": {
      "command": "kilde-mcp",
      "args": [],
      "env": {
        "OPENAI_API_KEY": "sk-..."
      }
    }
  }
}
```

### 3. Reload Window

Reload VSCode window (Cmd+R / Ctrl+R) or restart VSCode.

### 4. Verify Connection

Open Claude Code panel and type:

```
What Kilde tools are available?
```

## MCP Components

Kilde exposes three types of MCP components:

### Tools

Executable operations that perform actions.

#### `kilde_commit`

Generate and create git commits with AI-powered messages.

**Parameters**:
```json
{
  "directory": "/path/to/repo",    // Optional: working directory
  "add": true,                     // Optional: stage changes
  "sendit": false,                 // Optional: auto-commit
  "context": "Fix login bug",      // Optional: additional context
  "contextFiles": ["BUGS.md"],     // Optional: context files
  "interactive": true,             // Optional: review mode
  "amend": false,                  // Optional: amend last commit
  "push": false,                   // Optional: push after commit
  "dryRun": true                   // Optional: preview only
}
```

**Usage in Claude**:
```
Generate a commit message for the staged changes in the current directory
```

```
Create a commit for all changes with context: "Implement user authentication"
```

#### `kilde_release`

Generate release notes from git history.

**Parameters**:
```json
{
  "directory": "/path/to/repo",    // Optional: working directory
  "version": "1.0.0",              // Optional: version number
  "from": "v0.9.0",                // Optional: start reference
  "to": "HEAD",                    // Optional: end reference
  "output": "RELEASE.md",          // Optional: output file
  "focus": "security,performance", // Optional: focus areas
  "context": "Major rewrite",      // Optional: additional context
  "interactive": true,             // Optional: review mode
  "dryRun": true                   // Optional: preview only
}
```

**Usage in Claude**:
```
Generate release notes for version 1.0.0
```

```
Create release notes from v0.9.0 to HEAD focusing on security changes
```

### Resources

Read-only data sources that provide context.

#### `kilde://config`

Current Kilde configuration.

**Content**: JSON representation of merged configuration.

**Usage**:
```
What is my current Kilde configuration?
```

**Example Response**:
```json
{
  "commit": {
    "type": "conventional",
    "autoStage": false,
    "ai": {
      "model": "gpt-4",
      "temperature": 0.7
    }
  }
}
```

#### `kilde://status`

Git repository status.

**Content**: Current branch, staged/unstaged changes, recent commits.

**Usage**:
```
What is the git status?
```

**Example Response**:
```
Current branch: main
Staged changes: 3 files
Unstaged changes: 1 file
Recent commits:
  - abc123 feat(auth): add OAuth2
  - def456 fix(ui): resolve button alignment
```

#### `kilde://workspace`

Workspace information.

**Content**: Repository path, config location, available commands.

**Usage**:
```
Show me the Kilde workspace information
```

### Prompts

Predefined workflows for common tasks.

#### `commit-workflow`

Guided workflow for creating commits.

**Parameters**:
- `commitType`: Type of commit (feat, fix, docs, etc.)
- `scope`: Optional scope

**Usage**:
```
Help me create a commit using the commit workflow
```

**Workflow**:
1. Analyze staged changes
2. Suggest commit type and scope
3. Generate message
4. Review and confirm
5. Execute commit

#### `release-workflow`

Guided workflow for creating releases.

**Parameters**:
- `version`: Version number
- `releaseType`: major, minor, patch

**Usage**:
```
Help me create a release using the release workflow
```

**Workflow**:
1. Determine version number
2. Generate release notes
3. Review and edit
4. Tag release
5. Push to remote

## Usage Examples

### Basic Commit

```
You: Create a commit for my staged changes

Claude: I'll generate a commit message for your staged changes.

[Uses kilde_commit tool]

Generated commit message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
feat(auth): add OAuth2 authentication

Implement OAuth2 flow with support for
Google and GitHub providers.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Would you like me to create this commit?
```

### Commit with Context

```
You: Create a commit for all changes with context: "Fixes bug reported in issue #123"

Claude: I'll stage all changes and generate a commit message with that context.

[Uses kilde_commit with add=true and context]

Generated commit message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
fix(auth): resolve session timeout issue

Fix session timeout bug reported in #123.
Update session refresh logic to properly
handle edge cases.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Shall I create this commit?
```

### Release Notes

```
You: Generate release notes for version 2.0.0

Claude: I'll generate release notes from the last tag to HEAD.

[Uses kilde_release tool]

Release Notes for v2.0.0:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Features
- OAuth2 authentication
- User profile management
- Role-based access control

## Bug Fixes
- Session timeout handling
- Memory leak in auth service

## Breaking Changes
- API endpoints now require authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Would you like me to save these to a file?
```

### Check Configuration

```
You: What's my Kilde configuration?

Claude: [Accesses kilde://config resource]

Your Kilde configuration:
- Commit type: conventional
- Auto-stage: false
- AI model: gpt-4
- Temperature: 0.7
- Max tokens: 500
```

### Guided Commit Workflow

```
You: Help me create a commit using the commit workflow

Claude: [Uses commit-workflow prompt]

I'll guide you through creating a commit. First, let me analyze your staged changes.

[Analyzes changes]

Based on your changes, I suggest:
- Type: feat (new feature)
- Scope: auth

Would you like me to proceed with this suggestion?

You: Yes

Claude: [Generates and creates commit]

Commit created successfully!
```

## Configuration

Configure MCP server behavior in `.kilde/config.yaml`:

```yaml
mcp:
  # Server identification
  name: kilde
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

  # Tool defaults
  defaults:
    commit:
      interactive: true    # Always review commits
      dryRun: false
    release:
      interactive: true
      dryRun: false
```

## Security Considerations

### API Keys

Store API keys securely:

**Environment variables** (recommended):
```bash
export OPENAI_API_KEY=sk-...
```

**MCP config** (less secure):
```json
{
  "mcpServers": {
    "kilde": {
      "env": {
        "OPENAI_API_KEY": "sk-..."
      }
    }
  }
}
```

**Never** commit API keys to git.

### Command Execution

Kilde executes git commands on your behalf. To stay safe:

1. **Review operations**: Use interactive mode by default
2. **Use dry-run**: Preview changes before executing
3. **Check workspace**: Verify you're in the correct repository
4. **Limit permissions**: Don't run with elevated privileges

### Network Access

Kilde makes API calls to:
- OpenAI (if using GPT models)
- Anthropic (if using Claude models)

Data sent to APIs:
- Git diffs (for commits)
- Commit history (for releases)
- Context you provide

Data **not** sent:
- Entire codebase
- Credentials or secrets
- Files not related to the operation

## Troubleshooting

### Server Not Connecting

**Check installation**:
```bash
which kilde-mcp
kilde-mcp --version
```

**Check MCP config**:
```bash
# macOS
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Windows
type %APPDATA%\Claude\claude_desktop_config.json
```

**Enable debug logging**:
```json
{
  "mcpServers": {
    "kilde": {
      "command": "kilde-mcp",
      "args": ["--debug"],
      "env": {
        "KILDE_LOG_LEVEL": "debug"
      }
    }
  }
}
```

**Check logs**:
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows
type %LOCALAPPDATA%\Claude\Logs\mcp*.log
```

### Tools Not Available

**Restart AI assistant**: Quit and restart completely.

**Verify server running**:
```bash
# Test server manually
kilde-mcp
# Should wait for input (stdio mode)
```

**Check tool permissions**: Some AI assistants require explicit tool approval.

### API Errors

**Check API key**:
```bash
echo $OPENAI_API_KEY
```

**Test API access**:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Check rate limits**: You may have exceeded API rate limits.

### Git Errors

**Verify git repository**:
```bash
cd /path/to/repo
git status
```

**Check git configuration**:
```bash
git config --list
```

**Ensure clean state**: Resolve any merge conflicts or locks.

## Advanced Usage

### Multiple Repositories

Configure different MCP servers for different repositories:

```json
{
  "mcpServers": {
    "kilde-project-a": {
      "command": "kilde-mcp",
      "args": ["--config", "/path/to/project-a/.kilde/config.yaml"]
    },
    "kilde-project-b": {
      "command": "kilde-mcp",
      "args": ["--config", "/path/to/project-b/.kilde/config.yaml"]
    }
  }
}
```

### Custom Commands

Extend Kilde with custom MCP tools by modifying `src/mcp/tools.ts` and rebuilding.

### Automation

Combine MCP tools with other automation:

```
You: Create a commit, generate release notes, and create a GitHub release

Claude: [Orchestrates multiple tools]
1. Creating commit...
2. Generating release notes...
3. Creating GitHub release...
```

## Best Practices

### Interactive Mode

Always use interactive mode for important operations:

```yaml
mcp:
  defaults:
    commit:
      interactive: true
    release:
      interactive: true
```

### Context Files

Configure context files for better AI understanding:

```yaml
commit:
  contextFiles:
    - ARCHITECTURE.md
    - CONTRIBUTING.md
```

### Commit Messages

Review all generated commit messages before accepting.

### Dry-Run First

Test with dry-run before executing:

```
You: Create a commit with dry-run enabled

Claude: [Uses dryRun=true]

Preview of commit message (not executed):
...
```

## Next Steps

- [Commands Guide](./commands.md) - Command reference
- [Configuration Guide](./configuration.md) - Configuration options
- [Architecture Guide](./architecture.md) - Technical implementation

## Resources

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop](https://claude.ai/download)
- [Kilde GitHub](https://github.com/grunnverk/kilde)
