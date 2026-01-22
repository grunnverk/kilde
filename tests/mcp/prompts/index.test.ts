import { describe, it, expect } from 'vitest';
import { getPrompts, getPrompt } from '../../../src/mcp/prompts/index';

describe('MCP prompts', () => {
    describe('getPrompts', () => {
        it('should return array of prompt definitions', () => {
            const prompts = getPrompts();
            expect(Array.isArray(prompts)).toBe(true);
            expect(prompts.length).toBe(2);
        });

        it('should include commit-workflow prompt', () => {
            const prompts = getPrompts();
            const commitPrompt = prompts.find(p => p.name === 'commit-workflow');

            expect(commitPrompt).toBeDefined();
            expect(commitPrompt?.description).toContain('commit');
            expect(commitPrompt?.arguments).toBeDefined();
            expect(Array.isArray(commitPrompt?.arguments)).toBe(true);
        });

        it('should include release-workflow prompt', () => {
            const prompts = getPrompts();
            const releasePrompt = prompts.find(p => p.name === 'release-workflow');

            expect(releasePrompt).toBeDefined();
            expect(releasePrompt?.description).toContain('release');
            expect(releasePrompt?.arguments).toBeDefined();
            expect(Array.isArray(releasePrompt?.arguments)).toBe(true);
        });

        it('should define optional context argument for commit-workflow', () => {
            const prompts = getPrompts();
            const commitPrompt = prompts.find(p => p.name === 'commit-workflow');
            const contextArg = commitPrompt?.arguments?.find(a => a.name === 'context');

            expect(contextArg).toBeDefined();
            expect(contextArg?.required).toBe(false);
            expect(contextArg?.description).toContain('context');
        });

        it('should define optional arguments for release-workflow', () => {
            const prompts = getPrompts();
            const releasePrompt = prompts.find(p => p.name === 'release-workflow');

            const versionArg = releasePrompt?.arguments?.find(a => a.name === 'version');
            const fromTagArg = releasePrompt?.arguments?.find(a => a.name === 'fromTag');

            expect(versionArg).toBeDefined();
            expect(versionArg?.required).toBe(false);
            expect(fromTagArg).toBeDefined();
            expect(fromTagArg?.required).toBe(false);
        });
    });

    describe('getPrompt', () => {
        describe('commit-workflow', () => {
            it('should return commit workflow prompt', async () => {
                const result = await getPrompt('commit-workflow');

                expect(result.description).toContain('commit');
                expect(result.messages).toBeDefined();
                expect(Array.isArray(result.messages)).toBe(true);
                expect(result.messages.length).toBeGreaterThan(0);
            });

            it('should have user role message', async () => {
                const result = await getPrompt('commit-workflow');
                const userMessage = result.messages.find(m => m.role === 'user');

                expect(userMessage).toBeDefined();
                expect(userMessage?.content.type).toBe('text');
                expect(userMessage?.content.text).toContain('commit');
            });

            it('should include workflow steps', async () => {
                const result = await getPrompt('commit-workflow');
                const userMessage = result.messages.find(m => m.role === 'user');

                expect(userMessage?.content.text).toContain('Steps:');
                expect(userMessage?.content.text).toContain('kilde_commit');
                expect(userMessage?.content.text).toContain('dryRun=true');
            });

            it('should include context when provided', async () => {
                const result = await getPrompt('commit-workflow', { context: 'Bug fix for issue #123' });
                const userMessage = result.messages.find(m => m.role === 'user');

                expect(userMessage?.content.text).toContain('Bug fix for issue #123');
                expect(userMessage?.content.text).toContain('Additional context:');
            });

            it('should not include context section when not provided', async () => {
                const result = await getPrompt('commit-workflow');
                const userMessage = result.messages.find(m => m.role === 'user');

                expect(userMessage?.content.text).not.toContain('Additional context:');
            });
        });

        describe('release-workflow', () => {
            it('should return release workflow prompt', async () => {
                const result = await getPrompt('release-workflow');

                expect(result.description).toContain('release');
                expect(result.messages).toBeDefined();
                expect(Array.isArray(result.messages)).toBe(true);
                expect(result.messages.length).toBeGreaterThan(0);
            });

            it('should have user role message', async () => {
                const result = await getPrompt('release-workflow');
                const userMessage = result.messages.find(m => m.role === 'user');

                expect(userMessage).toBeDefined();
                expect(userMessage?.content.type).toBe('text');
                expect(userMessage?.content.text).toContain('release');
            });

            it('should include workflow steps', async () => {
                const result = await getPrompt('release-workflow');
                const userMessage = result.messages.find(m => m.role === 'user');

                expect(userMessage?.content.text).toContain('Steps:');
                expect(userMessage?.content.text).toContain('kilde_release');
                expect(userMessage?.content.text).toContain('dryRun=true');
            });

            it('should include version when provided', async () => {
                const result = await getPrompt('release-workflow', { version: 'v2.0.0' });
                const userMessage = result.messages.find(m => m.role === 'user');

                expect(userMessage?.content.text).toContain('v2.0.0');
                expect(userMessage?.content.text).toContain('version:');
            });

            it('should include fromTag when provided', async () => {
                const result = await getPrompt('release-workflow', { fromTag: 'v1.0.0' });
                const userMessage = result.messages.find(m => m.role === 'user');

                expect(userMessage?.content.text).toContain('v1.0.0');
                expect(userMessage?.content.text).toContain('fromTag:');
            });

            it('should include both version and fromTag when provided', async () => {
                const result = await getPrompt('release-workflow', {
                    version: 'v2.0.0',
                    fromTag: 'v1.0.0'
                });
                const userMessage = result.messages.find(m => m.role === 'user');

                expect(userMessage?.content.text).toContain('v2.0.0');
                expect(userMessage?.content.text).toContain('v1.0.0');
            });

            it('should not include version section when not provided', async () => {
                const result = await getPrompt('release-workflow');
                const userMessage = result.messages.find(m => m.role === 'user');

                expect(userMessage?.content.text).not.toContain('version:');
            });
        });

        describe('unknown prompt', () => {
            it('should throw error for unknown prompt name', async () => {
                await expect(getPrompt('unknown-prompt')).rejects.toThrow('Unknown prompt: unknown-prompt');
            });

            it('should throw error for empty prompt name', async () => {
                await expect(getPrompt('')).rejects.toThrow('Unknown prompt:');
            });
        });

        describe('type safety', () => {
            it('should return messages with correct type structure', async () => {
                const result = await getPrompt('commit-workflow');

                for (const message of result.messages) {
                    expect(['user', 'assistant']).toContain(message.role);
                    expect(message.content.type).toBe('text');
                    expect(typeof message.content.text).toBe('string');
                }
            });

            it('should use literal types for role', async () => {
                const result = await getPrompt('commit-workflow');
                const message = result.messages[0];

                // TypeScript should enforce this at compile time
                // This test verifies runtime behavior matches
                expect(message.role === 'user' || message.role === 'assistant').toBe(true);
            });

            it('should use literal type for content type', async () => {
                const result = await getPrompt('commit-workflow');
                const message = result.messages[0];

                expect(message.content.type).toBe('text');
            });
        });
    });
});
