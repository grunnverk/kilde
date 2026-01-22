/**
 * MCP Tools for Kilde
 *
 * Exposes commit and release commands as MCP tools
 */

import * as CommandsGit from '@grunnverk/commands-git';
import * as ReleaseCommand from '../commands/release';
import { Config } from '@grunnverk/core';
import { getLogger } from '../logging';
import { createStorage } from '@grunnverk/shared';
import { DEFAULT_CONFIG_DIR } from '../constants';

export interface ToolContext {
    workingDirectory: string;
    config: Config | undefined;
    logger: any;
}

/**
 * Execute a tool with the given name and arguments
 */
export async function executeTool(
    name: string,
    args: Record<string, any>,
    context: ToolContext
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
    const logger = context.logger || getLogger();
    const storage = createStorage();

    // Build config from args with required fields
    const config: Config = {
        configDirectory: DEFAULT_CONFIG_DIR,
        discoveredConfigDirs: [],
        resolvedConfigDirs: [],
        ...(context.config || {}),
        dryRun: args.dryRun ?? false,
        verbose: args.verbose ?? false,
        debug: args.debug ?? false,
    } as Config;

    try {
        if (name === 'kilde_commit') {
            // Build commit config
            config.commit = {
                add: args.add ?? false,
                cached: args.cached ?? false,
                sendit: args.sendit ?? false,
                interactive: args.interactive ?? false,
                amend: args.amend ?? false,
                context: args.context,
                contextFiles: args.contextFiles,
            };

            // Execute commit command
            const summary = await CommandsGit.commit(config);

            return {
                content: [
                    {
                        type: 'text' as const,
                        text: summary
                    }
                ]
            };

        } else if (name === 'kilde_release') {
            // Build release config
            config.release = {
                from: args.fromTag,
                to: args.toTag ?? 'HEAD',
                interactive: args.interactive ?? false,
                focus: args.focus,
                context: args.context,
                contextFiles: args.contextFiles,
            };

            // Add non-standard fields
            if (args.version) (config.release as any).version = args.version;
            if (args.output) (config.release as any).output = args.output;

            // Execute release command
            const releaseSummary = await ReleaseCommand.execute(config);

            // If output file specified, write the result
            if (args.output) {
                const releaseNotesContent = `# ${releaseSummary.title}\n\n${releaseSummary.body}`;
                await storage.writeFile(args.output, releaseNotesContent, 'utf-8');
            }

            return {
                content: [
                    {
                        type: 'text' as const,
                        text: `# ${releaseSummary.title}\n\n${releaseSummary.body}`
                    }
                ]
            };

        } else {
            throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error: any) {
        logger.error(`Tool execution failed: ${error.message}`);
        throw error;
    }
}

/**
 * Get list of available tools
 */
export function getTools() {
    return [
        {
            name: 'kilde_commit',
            description: 'Generate AI-powered commit message and optionally create the commit',
            inputSchema: {
                type: 'object',
                properties: {
                    add: {
                        type: 'boolean',
                        description: 'Stage all changes before committing',
                    },
                    cached: {
                        type: 'boolean',
                        description: 'Only use staged changes',
                    },
                    sendit: {
                        type: 'boolean',
                        description: 'Automatically commit with generated message',
                    },
                    interactive: {
                        type: 'boolean',
                        description: 'Interactive mode for reviewing message',
                    },
                    amend: {
                        type: 'boolean',
                        description: 'Amend the previous commit',
                    },
                    context: {
                        type: 'string',
                        description: 'Additional context for commit message generation',
                    },
                    contextFiles: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Context files to include',
                    },
                    dryRun: {
                        type: 'boolean',
                        description: 'Preview without making changes',
                    },
                    verbose: {
                        type: 'boolean',
                        description: 'Enable verbose logging',
                    },
                    debug: {
                        type: 'boolean',
                        description: 'Enable debug logging',
                    },
                },
            },
        },
        {
            name: 'kilde_release',
            description: 'Generate release notes from git commit history (tag-based)',
            inputSchema: {
                type: 'object',
                properties: {
                    fromTag: {
                        type: 'string',
                        description: 'Start tag for release notes (default: last tag)',
                    },
                    toTag: {
                        type: 'string',
                        description: 'End tag for release notes (default: HEAD)',
                    },
                    version: {
                        type: 'string',
                        description: 'Version number for the release',
                    },
                    output: {
                        type: 'string',
                        description: 'Output file path for release notes',
                    },
                    interactive: {
                        type: 'boolean',
                        description: 'Interactive mode for reviewing notes',
                    },
                    focus: {
                        type: 'string',
                        description: 'Focus area for release notes (e.g., "breaking changes")',
                    },
                    context: {
                        type: 'string',
                        description: 'Additional context for release notes generation',
                    },
                    contextFiles: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Context files to include',
                    },
                    dryRun: {
                        type: 'boolean',
                        description: 'Preview without saving to file',
                    },
                    verbose: {
                        type: 'boolean',
                        description: 'Enable verbose logging',
                    },
                    debug: {
                        type: 'boolean',
                        description: 'Enable debug logging',
                    },
                },
            },
        },
    ];
}
