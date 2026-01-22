# Architecture Guide

Technical overview of Kilde's implementation, design decisions, and internal architecture.

## Overview

Kilde is a TypeScript-based CLI tool and MCP server built on the @eldrforge package ecosystem. It follows a modular architecture with clear separation of concerns and minimal dependencies.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
├─────────────────────────────────────────────────────────┤
│  CLI (Commander.js)  │  MCP Server (stdio transport)    │
├─────────────────────────────────────────────────────────┤
│                   Application Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Commands   │  │  MCP Tools   │  │     MCP      │  │
│  │              │  │              │  │  Resources   │  │
│  │ • commit     │  │ • kilde_     │  │              │  │
│  │ • release    │  │   commit     │  │ • config     │  │
│  │              │  │ • kilde_     │  │ • status     │  │
│  │              │  │   release    │  │ • workspace  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    Service Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ AI Service   │  │  Git Tools   │  │    Config    │  │
│  │              │  │              │  │              │  │
│  │ • OpenAI     │  │ • git ops    │  │ • loading    │  │
│  │ • Anthropic  │  │ • diff       │  │ • merging    │  │
│  │ • formatting │  │ • log        │  │ • validation │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│                  Core Infrastructure                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Logging    │  │     Types    │  │  Constants   │  │
│  │              │  │              │  │              │  │
│  │ • Winston    │  │ • Config     │  │ • defaults   │  │
│  │ • transports │  │ • Command    │  │ • paths      │  │
│  │ • formatters │  │ • MCP types  │  │ • messages   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
kilde/
├── src/
│   ├── main.ts                 # CLI entry point
│   ├── application.ts          # CLI application setup
│   ├── constants.ts            # Constants and defaults
│   ├── logging.ts              # Logging configuration
│   ├── types.ts                # TypeScript type definitions
│   ├── commands/
│   │   └── release.ts          # Release notes command
│   ├── mcp/
│   │   ├── server.ts           # MCP server implementation
│   │   ├── tools.ts            # MCP tool handlers
│   │   ├── resources.ts        # MCP resource handlers
│   │   └── prompts/
│   │       └── index.ts        # MCP prompt workflows
│   └── utils/
│       └── config.ts           # Configuration utilities
├── tests/                      # Test suites
├── docs/                       # Documentation
└── guide/                      # User guides
```

## Core Components

### CLI Application (`src/application.ts`)

Entry point for the command-line interface.

**Responsibilities**:
- Parse command-line arguments with Commander.js
- Route commands to appropriate handlers
- Merge configuration from multiple sources
- Initialize logging based on flags
- Handle global flags (--debug, --config, --version)

**Key Code**:
```typescript
export async function createApplication(): Promise<Command> {
    const program = new Command();

    program
        .name('kilde')
        .description('Universal Git Automation Tool')
        .version(VERSION);

    // Global flags
    program.option('--debug', 'Enable debug logging');
    program.option('--config <path>', 'Path to config file');

    // Commands
    program
        .command('commit')
        .description('Generate and create commits')
        .action(async (options) => {
            const config = await loadConfig(options);
            await commitCommand(config);
        });

    return program;
}
```

**Design Decisions**:
- Commander.js for consistent CLI patterns
- Lazy-load commands for faster startup
- Early logging initialization for debugging
- Node.js version check at startup (requires 24+)

### Configuration System (`src/utils/config.ts`)

Flexible configuration loading and merging.

**Responsibilities**:
- Search multiple locations for config files
- Parse YAML and JSON formats
- Deep merge with defaults
- Validate configuration schema
- Apply environment variable overrides

**Search Order**:
1. CLI `--config` flag
2. `.kilde/config.yaml` (project)
3. `.kilderc.yaml` (project root)
4. `~/.kilde/config.yaml` (user home)

**Key Code**:
```typescript
export async function loadConfig(cliOptions: any): Promise<Config> {
    const configs: Config[] = [];

    // Load from all locations
    for (const location of CONFIG_LOCATIONS) {
        const config = await loadConfigFile(location);
        if (config) configs.push(config);
    }

    // Merge: defaults < user home < project < CLI
    return deepMerge(KILDE_DEFAULTS, ...configs, cliOptions);
}
```

**Design Decisions**:
- YAML as primary format (more human-readable)
- Deep merge allows partial overrides
- No validation errors for unknown fields (forward compatibility)
- Config from @eldrforge/core provides base types

### Logging System (`src/logging.ts`)

Structured logging with Winston.

**Responsibilities**:
- Initialize Winston loggers
- Configure transports (console, file)
- Format log messages
- Handle debug mode
- Redact sensitive information

**Log Levels**:
- `error`: Critical errors
- `warn`: Warnings and recoverable errors
- `info`: Informational messages (default)
- `debug`: Detailed execution information

**Key Code**:
```typescript
export function createLogger(options: LoggerOptions): Logger {
    return winston.createLogger({
        level: options.debug ? 'debug' : 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: path.join(options.logDir, 'kilde.log')
            })
        ]
    });
}
```

**Design Decisions**:
- Winston for production-ready logging
- JSON format for machine parsing
- File logs for debugging
- Sensitive data redaction (API keys, tokens)

### Commit Command

Delegates to `@eldrforge/commands-git` for implementation.

**Flow**:
1. Load configuration
2. Check git status
3. Stage changes if `--add`
4. Generate diff
5. Call AI service for message
6. Review in interactive mode (optional)
7. Create commit
8. Push if `--push`

**Integration**:
```typescript
import { commitCommand } from '@eldrforge/commands-git';

// Kilde delegates to shared implementation
await commitCommand(config);
```

**Design Decisions**:
- Reuse @eldrforge/commands-git (no duplication)
- Kilde provides configuration layer only
- All logic in shared package

### Release Command (`src/commands/release.ts`)

Pure git-based release notes generation.

**Responsibilities**:
- Determine tag range (from/to)
- Fetch commit history between tags
- Parse conventional commits
- Group by type/scope
- Format as markdown
- Generate with AI assistance

**Flow**:
1. Determine `from` and `to` references
2. Get commits: `git log from..to`
3. Parse commit messages
4. Group and categorize
5. Generate release notes with AI
6. Review (interactive) or save (output file)

**Key Code**:
```typescript
export async function releaseCommand(config: Config): Promise<void> {
    const from = config.release?.from ?? await getLastTag();
    const to = config.release?.to ?? 'HEAD';

    const commits = await getCommitsBetween(from, to);
    const grouped = groupCommits(commits);
    const notes = await generateReleaseNotes(grouped, config);

    if (config.release?.output) {
        await fs.writeFile(config.release.output, notes);
    } else {
        console.log(notes);
    }
}
```

**Design Decisions**:
- Pure git (no GitHub API)
- Works with any git host
- AI-enhanced formatting
- Conventional commit parsing
- Flexible grouping strategies

### MCP Server (`src/mcp/server.ts`)

Model Context Protocol server implementation.

**Responsibilities**:
- Implement MCP protocol via SDK
- Expose tools, resources, prompts
- Handle stdio transport
- Route requests to handlers
- Manage server lifecycle

**Key Code**:
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
    {
        name: 'kilde',
        version: '0.1.0'
    },
    {
        capabilities: {
            tools: {},
            resources: {},
            prompts: {}
        }
    }
);

// Register handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: AVAILABLE_TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await executeTool(request.params.name, request.params.arguments);
});

// Start with stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Design Decisions**:
- MCP SDK for protocol compliance
- stdio transport (standard for MCP)
- Delegate to command implementations
- Type-safe with literal types (`'text' as const`)

### MCP Tools (`src/mcp/tools.ts`)

Tool execution handlers.

**Available Tools**:
- `kilde_commit`: Execute commit command via MCP
- `kilde_release`: Execute release command via MCP

**Key Code**:
```typescript
export async function executeTool(
    name: string,
    args: Record<string, any>,
    context: ToolContext
): Promise<ToolResult> {
    if (name === 'kilde_commit') {
        const config = buildConfig(args, context);
        const result = await commitCommand(config);
        return {
            content: [{
                type: 'text' as const,
                text: formatCommitResult(result)
            }]
        };
    }
    // ...
}
```

**Design Decisions**:
- Reuse command implementations
- Build Config from MCP parameters
- Return formatted results
- Handle errors gracefully

### MCP Resources (`src/mcp/resources.ts`)

Read-only resource providers.

**Available Resources**:
- `kilde://config`: Current configuration
- `kilde://status`: Git repository status
- `kilde://workspace`: Workspace information

**Key Code**:
```typescript
export async function readResource(uri: string): Promise<ResourceContents> {
    if (uri === 'kilde://config') {
        const config = await loadConfig({});
        return {
            contents: [{
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(config, null, 2)
            }]
        };
    }
    // ...
}
```

**Design Decisions**:
- URI-based addressing
- JSON for structured data
- Real-time data (no caching)
- Read-only access

### MCP Prompts (`src/mcp/prompts/index.ts`)

Predefined workflow prompts.

**Available Prompts**:
- `commit-workflow`: Guided commit creation
- `release-workflow`: Guided release creation

**Key Code**:
```typescript
export async function getPrompt(
    name: string,
    args?: Record<string, string>
): Promise<GetPromptResult> {
    if (name === 'commit-workflow') {
        return {
            messages: [{
                role: 'user' as const,
                content: {
                    type: 'text' as const,
                    text: buildCommitWorkflowPrompt(args)
                }
            }]
        };
    }
    // ...
}
```

**Design Decisions**:
- Template-based prompts
- Parameterized workflows
- LLM-friendly formatting
- Step-by-step guidance

## Package Dependencies

### Core Dependencies

#### `@eldrforge/commands-git`
Provides `commitCommand` implementation.

**Why**: Shared commit logic across tools

#### `@eldrforge/core`
Core types (Config, ReleaseConfig, etc.) and utilities.

**Why**: Consistent types across ecosystem

#### `@eldrforge/ai-service`
AI model integration (OpenAI, Anthropic).

**Why**: Shared AI client with rate limiting, retries

#### `@eldrforge/git-tools`
Git operations (status, diff, log, etc.).

**Why**: Consistent git command execution

#### `@eldrforge/shared`
Shared utilities (logging, formatting, etc.).

**Why**: Common functionality across packages

#### `@modelcontextprotocol/sdk`
MCP protocol implementation.

**Why**: Standard MCP server implementation

#### `@riotprompt/riotprompt`
Prompt formatting for LLMs.

**Why**: Structured prompt generation

#### `commander`
CLI argument parsing.

**Why**: Industry-standard CLI framework

#### `winston`
Logging infrastructure.

**Why**: Production-ready logging with transports

#### `js-yaml`
YAML parsing for config files.

**Why**: Human-friendly config format

### Development Dependencies

- `typescript`: Type checking and compilation
- `vite`: Build system
- `vitest`: Unit testing
- `@swc/core`: Fast TypeScript compilation
- `eslint`, `prettier`: Code quality

## Build System

### Vite Configuration (`vite.config.ts`)

Fast builds with tree-shaking and optimization.

**Key Features**:
- SWC for TypeScript compilation (faster than tsc)
- Tree-shaking to reduce bundle size
- Git metadata injection (branch, commit hash)
- Executable permissions for binaries
- Source maps for debugging

**Configuration**:
```typescript
export default defineConfig({
    build: {
        lib: {
            entry: {
                'main': './src/main.ts',
                'mcp-server': './src/mcp/server.ts'
            },
            formats: ['es']
        },
        target: 'node24',
        rollupOptions: {
            external: [/^node:/, 'commander', 'winston', ...]
        }
    },
    plugins: [
        swc.vite(),
        gitMetadata()
    ]
});
```

**Build Output**:
- `dist/main.js`: CLI entry point
- `dist/mcp-server.js`: MCP server entry point
- Both with executable permissions

**Design Decisions**:
- Vite for speed (<30s builds)
- SWC over tsc (5x faster)
- External dependencies (not bundled)
- ESM format (modern Node.js)

## Testing Strategy

### Test Structure

```
tests/
├── utils/
│   └── config.test.ts          # Configuration tests
├── mcp/
│   ├── tools.test.ts           # MCP tool tests
│   ├── resources.test.ts       # MCP resource tests
│   └── prompts/
│       └── index.test.ts       # MCP prompt tests
├── application.test.ts         # CLI application tests
├── constants.test.ts           # Constants tests
├── logging.test.ts             # Logging tests
└── commands/
    ├── commit.test.ts          # Integration tests (excluded from CI)
    └── release.test.ts         # Integration tests (excluded from CI)
```

### Test Coverage

Target: **70%+** across all metrics

Current: **85%+** achieved

**Coverage Exclusions**:
- `src/main.ts`: Entry point (no logic)
- `src/types.ts`: Type definitions
- `src/application.ts`: CLI integration (requires Commander parse)
- `src/commands/release.ts`: Complex integration (requires git + AI)
- `src/mcp/server.ts`: MCP server integration (requires stdio)

**Vitest Configuration**:
```typescript
export default defineConfig({
    test: {
        globals: false,
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        exclude: ['tests/commands/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            thresholds: {
                statements: 70,
                branches: 70,
                functions: 70,
                lines: 70
            }
        }
    }
});
```

**Design Decisions**:
- Vitest for speed and modern features
- V8 coverage for accuracy
- Exclude integration tests (require git repo)
- Mock external dependencies (@eldrforge packages)

### Mocking Strategy

Mock external dependencies for unit tests:

```typescript
vi.mock('@eldrforge/commands-git', () => ({
    commitCommand: vi.fn()
}));

vi.mock('@eldrforge/git-tools', () => ({
    getGitStatus: vi.fn(),
    getGitDiff: vi.fn()
}));
```

**Why**: Isolate units, fast tests, no side effects

## Type System

### Type Alignment

Kilde aligns with @eldrforge/core types:

```typescript
import { Config, ReleaseConfig } from '@eldrforge/core';

// Use core types throughout
export async function releaseCommand(config: Config): Promise<void> {
    const releaseConfig = config.release as ReleaseConfig;
    // ...
}
```

**Design Decisions**:
- Import types from core (single source of truth)
- Use type assertions for non-standard fields
- TypeScript strict mode for safety
- Literal types for MCP protocol (`'text' as const`)

### MCP Type Safety

MCP requires literal types for protocol compliance:

```typescript
// Wrong
return { type: 'text', text: '...' };

// Right
return { type: 'text' as const, text: '...' };
```

**Why**: TypeScript unions require exact literals

## Error Handling

### Strategy

1. **Catch at boundaries**: CLI, MCP tools
2. **Log all errors**: With stack traces in debug mode
3. **User-friendly messages**: No stack traces in production
4. **Exit codes**: Standard codes for automation

**Example**:
```typescript
try {
    await commitCommand(config);
} catch (error) {
    logger.error('Commit failed', { error });

    if (config.debug) {
        console.error(error);
    } else {
        console.error(`Error: ${error.message}`);
    }

    process.exit(1);
}
```

## Performance

### Build Performance

- **Target**: <30 seconds
- **Achieved**: ~30 seconds
- **Optimization**: SWC compilation, parallel builds

### Runtime Performance

- **Lazy loading**: Load dependencies only when needed
- **Streaming**: Stream large git outputs
- **Caching**: Cache config parsing (in-memory)

## Security

### API Key Management

- Store in environment variables
- Redact in logs
- Never commit to git

### Git Operations

- Validate repository before operations
- Check for clean state
- Use `--dry-run` for testing

### AI Service

- Sanitize prompts (remove secrets)
- Rate limit API calls
- Handle API errors gracefully

## Design Principles

### 1. Simplicity
Two commands, clear purpose, minimal options.

### 2. Reusability
Leverage @eldrforge ecosystem, avoid duplication.

### 3. Flexibility
Configuration-driven behavior, CLI overrides.

### 4. Safety
Interactive mode by default, dry-run for testing.

### 5. Transparency
Clear logging, reviewable operations.

### 6. Language-Agnostic
Pure git operations, works with any language.

### 7. Host-Agnostic
No GitHub API dependencies, works with any git host.

## Future Architecture

### Extensibility

Potential plugin system:

```typescript
interface KildePlugin {
    name: string;
    commands?: Command[];
    mcpTools?: Tool[];
    mcpResources?: Resource[];
}

// Load plugins
const plugins = await loadPlugins();
for (const plugin of plugins) {
    registerPlugin(plugin);
}
```

### Additional AI Providers

Support for more AI models:

```typescript
interface AIProvider {
    name: string;
    generateCommitMessage(diff: string): Promise<string>;
    generateReleaseNotes(commits: Commit[]): Promise<string>;
}

// Register providers
registerProvider(new OpenAIProvider());
registerProvider(new AnthropicProvider());
registerProvider(new LocalModelProvider());
```

## Next Steps

- [Overview Guide](./overview.md) - High-level overview
- [Commands Guide](./commands.md) - Command reference
- [Configuration Guide](./configuration.md) - Configuration options
- [MCP Integration Guide](./mcp-integration.md) - MCP setup

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development setup and guidelines.
