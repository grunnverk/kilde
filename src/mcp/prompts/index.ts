/**
 * MCP Prompts for Kilde
 *
 * Provides workflow templates for common operations
 */

/**
 * Get list of available prompts
 */
export function getPrompts() {
    return [
        {
            name: 'commit-workflow',
            description: 'Complete workflow for generating and creating a commit',
            arguments: [
                {
                    name: 'context',
                    description: 'Additional context for the commit message',
                    required: false,
                },
            ],
        },
        {
            name: 'release-workflow',
            description: 'Complete workflow for generating release notes',
            arguments: [
                {
                    name: 'version',
                    description: 'Version number for the release',
                    required: false,
                },
                {
                    name: 'fromTag',
                    description: 'Start tag for release notes',
                    required: false,
                },
            ],
        },
    ];
}

/**
 * Get a specific prompt by name
 */
export async function getPrompt(
    name: string,
    args?: Record<string, string>
): Promise<{ description?: string; messages: Array<{ role: 'user' | 'assistant'; content: { type: 'text'; text: string } }> }> {
    if (name === 'commit-workflow') {
        const context = args?.context || '';
        const contextPart = context ? `\n\nAdditional context: ${context}` : '';

        return {
            description: 'Workflow for generating AI-powered commit messages',
            messages: [
                {
                    role: 'user' as const,
                    content: {
                        type: 'text' as const,
                        text: `I need to create a commit. Please help me generate a good commit message based on my staged changes.${contextPart}

Steps:
1. First, use kilde_commit with cached=true and dryRun=true to preview the commit message
2. Review the generated message
3. If it looks good, use kilde_commit with sendit=true to create the commit
4. If adjustments are needed, provide feedback and regenerate`
                    }
                }
            ]
        };
    } else if (name === 'release-workflow') {
        const version = args?.version || '';
        const fromTag = args?.fromTag || '';
        const versionPart = version ? `\n- version: "${version}"` : '';
        const fromTagPart = fromTag ? `\n- fromTag: "${fromTag}"` : '';

        return {
            description: 'Workflow for generating release notes from git history',
            messages: [
                {
                    role: 'user' as const,
                    content: {
                        type: 'text' as const,
                        text: `I need to generate release notes for a new release.${versionPart}${fromTagPart}

Steps:
1. Use kilde_release with dryRun=true to preview the release notes
2. Review the generated notes
3. If they look good, use kilde_release with output="RELEASE_NOTES.md" to save them
4. If adjustments are needed, use the focus parameter to guide the generation`
                    }
                }
            ]
        };
    } else {
        throw new Error(`Unknown prompt: ${name}`);
    }
}
