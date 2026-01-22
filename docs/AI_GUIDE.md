# Kilde AI Integration Guide

This guide explains how to integrate Kilde with AI assistants like Claude using the Model Context Protocol (MCP).

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Using with Claude Desktop](#using-with-claude-desktop)
- [Using with Claude Code](#using-with-claude-code)
- [Available Tools](#available-tools)
- [Available Resources](#available-resources)
- [Available Prompts](#available-prompts)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

Kilde implements the Model Context Protocol (MCP), allowing AI assistants to:

- Generate and create git commits with AI-powered messages
- Generate release notes from git history
- Access repository configuration and status
- Follow guided workflows for common git tasks

The MCP server runs as a separate process and communicates with AI assistants via stdio.

## Setup

### Prerequisites

- Node.js 24.0.0 or higher
- Kilde installed (`npm install -g @grunnverk/kilde`)
- Git repository
- OpenAI API key set in environment

### Installation Methods

#### Method 1: Global Installation

```bash
npm install -g @grunnverk/kilde
```

Then reference `kilde-mcp` in your MCP configuration.

#### Method 2: npx

Use `npx` to run Kilde without global installation:

```json
{
  "command": "npx",
  "args": ["-y", "@grunnverk/kilde", "mcp"]
}
```

## Using with Claude Desktop

### Configuration

Add Kilde to your Claude Desktop MCP configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Linux**: `~/.config/Claude/claude_desktop_config.json`

### Example Configuration

```json
{
  "mcpServers": {
    "kilde": {
      "command": "npx",
      "args": ["-y", "@grunnverk/kilde", "mcp"],
      "env": {
        "OPENAI_API_KEY": "sk-..."
      }
    }
  }
}
```

Or with global installation:

```json
{
  "mcpServers": {
    "kilde": {
      "command": "kilde-mcp",
      "env": {
        "OPENAI_API_KEY": "sk-..."
      }
    }
  }
}
```

### Restart Claude Desktop

After updating the configuration, restart Claude Desktop for changes to take effect.

## Using with Claude Code

### Configuration

Add Kilde to your Claude Code MCP settings:

**File**: `~/.config/claude-code/settings.json`

```json
{
  "mcp": {
    "servers": {
      "kilde": {
        "command": "npx",
        "args": ["-y", "@grunnverk/kilde", "mcp"]
      }
    }
  }
}
```

### Usage in Claude Code

Once configured, Claude Code can automatically use Kilde tools when working with git repositories:

```
User: "Create a commit with the changes I've staged"
Claude: [Uses kilde_commit tool to generate and create commit]

User: "Generate release notes for v2.0.0"
Claude: [Uses kilde_release tool to create release notes]
```

## Available Tools

### `kilde_commit`

Generate AI-powered commit messages and create commits.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `add` | boolean | No | Stage all changes before committing |
| `cached` | boolean | No | Only use staged changes |
| `sendit` | boolean | No | Automatically commit with generated message |
| `interactive` | boolean | No | Interactive mode for reviewing message |
| `amend` | boolean | No | Amend the previous commit |
| `context` | string | No | Additional context for commit message |
| `contextFiles` | array | No | Context files to include |
| `dryRun` | boolean | No | Preview without making changes |
| `verbose` | boolean | No | Enable verbose logging |
| `debug` | boolean | No | Enable debug logging |

**Example Usage:**

```javascript
// Preview commit message
{
  "add": true,
  "dryRun": true
}

// Create commit with context
{
  "add": true,
  "sendit": true,
  "context": "Fixes authentication bug reported in issue #123"
}

// Interactive commit
{
  "cached": true,
  "interactive": true
}
```

**Response Format:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "✓ Commit created: abc1234 - feat: add user authentication\n\nCommit message:\nfeat: add user authentication\n\nImplements secure login flow with JWT tokens..."
    }
  ]
}
```

### `kilde_release`

Generate release notes from git commit history.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fromTag` | string | No | Start tag for release notes |
| `toTag` | string | No | End tag (default: HEAD) |
| `version` | string | No | Version number for release |
| `output` | string | No | Output file path |
| `interactive` | boolean | No | Interactive mode |
| `focus` | string | No | Focus area (e.g., "breaking changes") |
| `context` | string | No | Additional context |
| `contextFiles` | array | No | Context files to include |
| `dryRun` | boolean | No | Preview without saving |
| `verbose` | boolean | No | Enable verbose logging |
| `debug` | boolean | No | Enable debug logging |

**Example Usage:**

```javascript
// Generate release notes for version
{
  "version": "v2.0.0",
  "fromTag": "v1.0.0",
  "output": "RELEASE_NOTES.md"
}

// Focus on breaking changes
{
  "version": "v2.0.0",
  "focus": "breaking changes and migration guide"
}

// Preview release notes
{
  "fromTag": "v1.5.0",
  "toTag": "HEAD",
  "dryRun": true
}
```

**Response Format:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "# Release v2.0.0\n\n## Features\n- Add user authentication\n- Implement caching layer\n\n## Breaking Changes\n- Remove deprecated API endpoints..."
    }
  ]
}
```

## Available Resources

Resources provide read-only access to repository information.

### `kilde://config`

Current Kilde configuration (merged from defaults, config file, and CLI args).

**MIME Type**: `application/json`

**Example Response:**

```json
{
  "verbose": false,
  "debug": false,
  "model": "gpt-4o-mini",
  "commit": {
    "sendit": false,
    "interactive": false
  },
  "release": {
    "interactive": false
  }
}
```

### `kilde://status`

Git repository status and branch information.

**MIME Type**: `text/plain`

**Example Response:**

```
Current Branch: main
Last Commit: abc1234 feat: add authentication

On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/auth.ts
```

### `kilde://workspace`

Workspace information including working directory and git repository status.

**MIME Type**: `application/json`

**Example Response:**

```json
{
  "workingDirectory": "/Users/user/project",
  "isGitRepository": true,
  "gitRoot": "/Users/user/project",
  "configExists": true
}
```

## Available Prompts

Prompts provide interactive workflows with step-by-step guidance.

### `commit-workflow`

Interactive workflow for creating commits with AI-generated messages.

**Arguments:**
- `context` (optional): Additional context for the commit

**Workflow Steps:**
1. Preview commit message with `kilde_commit` (dryRun=true)
2. Review the generated message
3. If approved, create commit with `kilde_commit` (sendit=true)
4. If adjustments needed, provide feedback and regenerate

**Example Usage:**

```
User: Use the commit-workflow prompt with context "Bug fix for login"
Claude: [Initiates commit workflow with guided steps]
```

### `release-workflow`

Interactive workflow for generating release notes.

**Arguments:**
- `version` (optional): Version number for the release
- `fromTag` (optional): Starting tag for release notes

**Workflow Steps:**
1. Preview release notes with `kilde_release` (dryRun=true)
2. Review the generated notes
3. If approved, save with `kilde_release` (output specified)
4. If adjustments needed, use `focus` parameter to guide generation

**Example Usage:**

```
User: Use the release-workflow prompt for version v2.0.0
Claude: [Initiates release workflow with guided steps]
```

## Best Practices

### Commit Messages

1. **Add Context**: Use the `context` parameter to provide background
   ```javascript
   {
     "add": true,
     "sendit": true,
     "context": "Implements feature from sprint planning meeting"
   }
   ```

2. **Review First**: Use `dryRun` to preview before committing
   ```javascript
   {
     "add": true,
     "dryRun": true
   }
   ```

3. **Include Relevant Files**: Use `contextFiles` for additional context
   ```javascript
   {
     "add": true,
     "contextFiles": ["ARCHITECTURE.md", "CHANGELOG.md"]
   }
   ```

### Release Notes

1. **Specify Version**: Always include version number
   ```javascript
   {
     "version": "v2.0.0",
     "output": "RELEASE_NOTES.md"
   }
   ```

2. **Focus on Key Changes**: Use `focus` parameter for specific aspects
   ```javascript
   {
     "version": "v2.0.0",
     "focus": "breaking changes and migration steps"
   }
   ```

3. **Compare Tags**: Specify tag range for accurate notes
   ```javascript
   {
     "fromTag": "v1.5.0",
     "toTag": "v2.0.0"
   }
   ```

### Error Handling

Always check tool responses for errors:

```javascript
if (response.isError) {
  // Handle error
  console.error(response.content[0].text);
}
```

## Examples

### Example 1: Quick Commit

**User Request**: "Create a commit with my staged changes"

**Claude Response**:
```
I'll create a commit with your staged changes.
[Calls kilde_commit with {"cached": true, "sendit": true}]

✓ Commit created successfully
Message: "feat: add user profile page

Implements new user profile view with avatar upload
and bio editing functionality."
```

### Example 2: Release Notes for Specific Version

**User Request**: "Generate release notes for v2.0.0 from v1.0.0"

**Claude Response**:
```
I'll generate release notes for version 2.0.0.
[Calls kilde_release with {
  "version": "v2.0.0",
  "fromTag": "v1.0.0",
  "output": "RELEASE_NOTES.md"
}]

✓ Release notes generated and saved to RELEASE_NOTES.md

# Release v2.0.0

## Breaking Changes
- Removed deprecated /api/v1 endpoints
- Changed authentication token format

## Features
- New user dashboard
- Real-time notifications
...
```

### Example 3: Interactive Commit with Context

**User Request**: "Create a commit for the authentication refactoring"

**Claude Response**:
```
I'll create a commit with context about the authentication refactoring.
Let me first preview the commit message.

[Calls kilde_commit with {
  "add": true,
  "dryRun": true,
  "context": "Refactoring authentication module for better security"
}]

Here's the proposed commit message:
"refactor: improve authentication security

- Switch to bcrypt for password hashing
- Add rate limiting to login endpoint
- Implement JWT token rotation"

Should I create this commit? [Then calls with sendit=true if approved]
```

### Example 4: Focus on Breaking Changes

**User Request**: "Generate release notes focusing on breaking changes"

**Claude Response**:
```
I'll generate release notes with a focus on breaking changes.

[Calls kilde_release with {
  "version": "v2.0.0",
  "focus": "breaking changes with migration guide",
  "output": "RELEASE_NOTES.md"
}]

✓ Release notes generated with emphasis on breaking changes

# Release v2.0.0

## Breaking Changes

### API Endpoint Changes
- REMOVED: `/api/v1/users` - Use `/api/v2/users` instead
- CHANGED: Authentication header format...

## Migration Guide
1. Update API endpoint URLs...
```

## Troubleshooting

### "MCP server not responding"

1. Check that Kilde is installed:
   ```bash
   npm list -g @grunnverk/kilde
   ```

2. Verify MCP configuration path
3. Check Claude logs for error messages
4. Restart Claude Desktop

### "OPENAI_API_KEY not set"

Ensure your MCP configuration includes the API key:

```json
{
  "mcpServers": {
    "kilde": {
      "command": "kilde-mcp",
      "env": {
        "OPENAI_API_KEY": "sk-your-key-here"
      }
    }
  }
}
```

### "Not a git repository"

Kilde requires being run in a git repository. Ensure Claude is working in the correct directory:

```
User: "Change to my project directory first"
Claude: [Changes directory, then uses Kilde tools]
```

### "Tool execution failed"

Enable debug mode to see detailed logs:

```javascript
{
  "add": true,
  "debug": true,
  "verbose": true
}
```

Check debug logs at `output/kilde/debug/*.log`

## Advanced Usage

### Custom Workflows

You can create custom workflows by chaining multiple tool calls:

1. Check repository status (`kilde://status`)
2. Preview commit (`kilde_commit` with `dryRun`)
3. Create commit (`kilde_commit` with `sendit`)
4. Generate release notes (`kilde_release`)

### Integration with Other Tools

Kilde MCP tools can be combined with other MCP servers:

```json
{
  "mcpServers": {
    "kilde": {
      "command": "kilde-mcp"
    },
    "github": {
      "command": "mcp-server-github"
    }
  }
}
```

Then chain operations:
1. Use Kilde to create commit
2. Use GitHub MCP to create pull request

## Support

- [GitHub Issues](https://github.com/grunnverk/kilde/issues)
- [Documentation](https://github.com/grunnverk/kilde)
- [MCP Specification](https://modelcontextprotocol.io/)

---

**Last Updated**: 2026-01-21
