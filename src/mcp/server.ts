#!/usr/bin/env node
/**
 * Kilde MCP Server
 *
 * Exposes kilde commands via Model Context Protocol
 */

/* eslint-disable import/extensions */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { executeTool } from './tools.js';
import { getResources, readResource } from './resources.js';
import { getPrompts, getPrompt } from './prompts/index.js';
import { getLogger } from '../logging.js';
import winston from 'winston';
/* eslint-enable import/extensions */

async function main() {
    // Mark that we're running as MCP server
    process.env.KILDE_MCP_SERVER = 'true';

    // Remove console transports from logger
    const logger = getLogger();
    const transports = [...((logger as any).transports || [])];
    for (const transport of transports) {
        if (transport instanceof winston.transports.Console) {
            logger.remove(transport);
        }
    }

    // Initialize MCP server
    const server = new McpServer(
        {
            name: 'kilde',
            version: '0.1.0',
        },
        {
            capabilities: {
                tools: {},
                resources: {},
                prompts: {},
            },
        }
    );

    // ========================================================================
    // Tools Handlers
    // ========================================================================

    // Register kilde_commit
    server.tool(
        'kilde_commit',
        'Generate AI-powered commit message and optionally create the commit',
        {
            add: z.boolean().optional(),
            cached: z.boolean().optional(),
            sendit: z.boolean().optional(),
            interactive: z.boolean().optional(),
            amend: z.boolean().optional(),
            context: z.string().optional(),
            contextFiles: z.array(z.string()).optional(),
            dryRun: z.boolean().optional(),
            verbose: z.boolean().optional(),
            debug: z.boolean().optional(),
        },
        async (args) => {
            const context = {
                workingDirectory: process.cwd(),
                config: undefined,
                logger: getLogger(),
            };

            try {
                return await executeTool('kilde_commit', args, context);
            } catch (error: any) {
                logger.error(`Tool kilde_commit failed: ${error.message}`);
                return {
                    content: [{
                        type: 'text' as const,
                        text: `Error: ${error.message}`,
                    }],
                    isError: true,
                };
            }
        }
    );

    // Register kilde_release
    server.tool(
        'kilde_release',
        'Generate release notes from git commit history (tag-based)',
        {
            fromTag: z.string().optional(),
            toTag: z.string().optional(),
            version: z.string().optional(),
            output: z.string().optional(),
            interactive: z.boolean().optional(),
            focus: z.string().optional(),
            context: z.string().optional(),
            contextFiles: z.array(z.string()).optional(),
            dryRun: z.boolean().optional(),
            verbose: z.boolean().optional(),
            debug: z.boolean().optional(),
        },
        async (args) => {
            const context = {
                workingDirectory: process.cwd(),
                config: undefined,
                logger: getLogger(),
            };

            try {
                return await executeTool('kilde_release', args, context);
            } catch (error: any) {
                logger.error(`Tool kilde_release failed: ${error.message}`);
                return {
                    content: [{
                        type: 'text' as const,
                        text: `Error: ${error.message}`,
                    }],
                    isError: true,
                };
            }
        }
    );

    // ========================================================================
    // Resources Handlers
    // ========================================================================

    const resources = getResources();
    for (const resource of resources) {
        server.resource(
            resource.name,
            resource.uri,
            {
                description: resource.description || '',
            },
            async () => {
                const data = await readResource(resource.uri);
                return data;
            }
        );
    }

    // ========================================================================
    // Prompts Handlers
    // ========================================================================

    const prompts = getPrompts();
    for (const prompt of prompts) {
        // Convert prompt arguments to zod schema
        const promptArgs: Record<string, z.ZodTypeAny> = {};
        if (prompt.arguments) {
            for (const arg of prompt.arguments) {
                promptArgs[arg.name] = arg.required ? z.string() : z.string().optional();
            }
        }

        server.prompt(
            prompt.name,
            prompt.description,
            promptArgs,
            async (args, _extra) => {
                // Convert args to Record<string, string> for getPrompt
                const argsRecord: Record<string, string> = {};
                for (const [key, value] of Object.entries(args)) {
                    if (typeof value === 'string') {
                        argsRecord[key] = value;
                    }
                }
                const result = await getPrompt(prompt.name, argsRecord);
                return result;
            }
        );
    }

    // ========================================================================
    // Server Lifecycle
    // ========================================================================

    // Start the server with stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info('Kilde MCP server started');
}

// Run the server
main().catch((error) => {
    const logger = getLogger();
    logger.error(`MCP server failed: ${error.message}`);
    process.exit(1);
});
