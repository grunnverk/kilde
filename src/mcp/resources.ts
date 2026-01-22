/**
 * MCP Resources for Kilde
 *
 * Provides access to configuration and status information
 */

import { createStorage } from '@eldrforge/shared';
import { getEffectiveConfig } from '../utils/config';
import { execSync } from 'child_process';

/**
 * Get list of available resources
 */
export function getResources() {
    return [
        {
            uri: 'kilde://config',
            name: 'Current configuration',
            description: 'Current kilde configuration (merged from defaults, config file, and CLI args)',
            mimeType: 'application/json',
        },
        {
            uri: 'kilde://status',
            name: 'Git repository status',
            description: 'Current git repository status and branch information',
            mimeType: 'text/plain',
        },
        {
            uri: 'kilde://workspace',
            name: 'Workspace information',
            description: 'Information about the current workspace (working directory, files, etc.)',
            mimeType: 'application/json',
        },
    ];
}

/**
 * Read a resource by URI
 */
export async function readResource(uri: string): Promise<{ contents: Array<{ uri: string; mimeType?: string; text: string }> }> {
    const storage = createStorage();

    if (uri === 'kilde://config') {
        // Return current configuration
        const config = await getEffectiveConfig();
        return {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(config, null, 2),
                },
            ],
        };
    } else if (uri === 'kilde://status') {
        // Return git status
        try {
            const status = execSync('git status', { encoding: 'utf-8', cwd: process.cwd() });
            const branch = execSync('git branch --show-current', { encoding: 'utf-8', cwd: process.cwd() }).trim();
            const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf-8', cwd: process.cwd() }).trim();

            const statusText = `Current Branch: ${branch}\nLast Commit: ${lastCommit}\n\n${status}`;

            return {
                contents: [
                    {
                        uri,
                        mimeType: 'text/plain',
                        text: statusText,
                    },
                ],
            };
        } catch (error: any) {
            return {
                contents: [
                    {
                        uri,
                        mimeType: 'text/plain',
                        text: `Error reading git status: ${error.message}`,
                    },
                ],
            };
        }
    } else if (uri === 'kilde://workspace') {
        // Return workspace information
        try {
            const workingDir = process.cwd();
            const isGitRepo = execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf-8', cwd: workingDir }).trim() === 'true';
            const gitRoot = isGitRepo ? execSync('git rev-parse --show-toplevel', { encoding: 'utf-8', cwd: workingDir }).trim() : null;

            const workspace = {
                workingDirectory: workingDir,
                isGitRepository: isGitRepo,
                gitRoot: gitRoot,
                configExists: await storage.exists('.kilde/config.yaml') || await storage.exists('.kilderc.yaml'),
            };

            return {
                contents: [
                    {
                        uri,
                        mimeType: 'application/json',
                        text: JSON.stringify(workspace, null, 2),
                    },
                ],
            };
        } catch (error: any) {
            return {
                contents: [
                    {
                        uri,
                        mimeType: 'application/json',
                        text: JSON.stringify({ error: error.message }, null, 2),
                    },
                ],
            };
        }
    } else {
        throw new Error(`Unknown resource URI: ${uri}`);
    }
}
