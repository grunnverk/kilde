import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getResources, readResource } from '../../src/mcp/resources';
import { execSync } from 'child_process';

// Mock dependencies
vi.mock('child_process', () => ({
    execSync: vi.fn(),
}));

vi.mock('@eldrforge/shared', () => ({
    createStorage: vi.fn(() => ({
        exists: vi.fn(),
        readFile: vi.fn(),
        writeFile: vi.fn(),
    })),
}));

vi.mock('../../src/utils/config', () => ({
    getEffectiveConfig: vi.fn(() => Promise.resolve({
        verbose: false,
        debug: false,
        model: 'gpt-4o-mini',
    })),
}));

describe('MCP resources', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getResources', () => {
        it('should return array of resource definitions', () => {
            const resources = getResources();
            expect(Array.isArray(resources)).toBe(true);
            expect(resources.length).toBe(3);
        });

        it('should include config resource', () => {
            const resources = getResources();
            const configResource = resources.find(r => r.uri === 'kilde://config');

            expect(configResource).toBeDefined();
            expect(configResource?.name).toContain('configuration');
            expect(configResource?.mimeType).toBe('application/json');
        });

        it('should include status resource', () => {
            const resources = getResources();
            const statusResource = resources.find(r => r.uri === 'kilde://status');

            expect(statusResource).toBeDefined();
            expect(statusResource?.name).toContain('status');
            expect(statusResource?.mimeType).toBe('text/plain');
        });

        it('should include workspace resource', () => {
            const resources = getResources();
            const workspaceResource = resources.find(r => r.uri === 'kilde://workspace');

            expect(workspaceResource).toBeDefined();
            expect(workspaceResource?.name).toContain('Workspace');
            expect(workspaceResource?.mimeType).toBe('application/json');
        });
    });

    describe('readResource', () => {
        describe('kilde://config', () => {
            it('should return current configuration as JSON', async () => {
                const result = await readResource('kilde://config');

                expect(result.contents).toHaveLength(1);
                expect(result.contents[0].uri).toBe('kilde://config');
                expect(result.contents[0].mimeType).toBe('application/json');

                const config = JSON.parse(result.contents[0].text);
                expect(config.verbose).toBeDefined();
                expect(config.debug).toBeDefined();
                expect(config.model).toBeDefined();
            });

            it('should return valid JSON format', async () => {
                const result = await readResource('kilde://config');
                expect(() => JSON.parse(result.contents[0].text)).not.toThrow();
            });
        });

        describe('kilde://status', () => {
            it('should return git status information', async () => {
                vi.mocked(execSync)
                    .mockReturnValueOnce('On branch main\nnothing to commit' as any)
                    .mockReturnValueOnce('main' as any)
                    .mockReturnValueOnce('abc1234 Latest commit' as any);

                const result = await readResource('kilde://status');

                expect(result.contents).toHaveLength(1);
                expect(result.contents[0].uri).toBe('kilde://status');
                expect(result.contents[0].mimeType).toBe('text/plain');
                expect(result.contents[0].text).toContain('Current Branch: main');
                expect(result.contents[0].text).toContain('Last Commit: abc1234 Latest commit');
            });

            it('should handle git command errors gracefully', async () => {
                vi.mocked(execSync).mockImplementation(() => {
                    throw new Error('Not a git repository');
                });

                const result = await readResource('kilde://status');

                expect(result.contents).toHaveLength(1);
                expect(result.contents[0].text).toContain('Error reading git status');
                expect(result.contents[0].text).toContain('Not a git repository');
            });
        });

        describe('kilde://workspace', () => {
            it('should return workspace information', async () => {
                vi.mocked(execSync)
                    .mockReturnValueOnce('true' as any)
                    .mockReturnValueOnce('/path/to/repo' as any);

                const result = await readResource('kilde://workspace');

                expect(result.contents).toHaveLength(1);
                expect(result.contents[0].uri).toBe('kilde://workspace');
                expect(result.contents[0].mimeType).toBe('application/json');

                const workspace = JSON.parse(result.contents[0].text);
                expect(workspace.workingDirectory).toBeDefined();
                expect(workspace.isGitRepository).toBe(true);
                expect(workspace.gitRoot).toBe('/path/to/repo');
            });

            it('should handle non-git directory', async () => {
                vi.mocked(execSync).mockImplementation(() => {
                    throw new Error('Not a git repository');
                });

                const result = await readResource('kilde://workspace');

                expect(result.contents).toHaveLength(1);
                const workspace = JSON.parse(result.contents[0].text);
                expect(workspace.error).toContain('Not a git repository');
            });

            it('should return valid JSON format', async () => {
                vi.mocked(execSync)
                    .mockReturnValueOnce('true' as any)
                    .mockReturnValueOnce('/path/to/repo' as any);

                const result = await readResource('kilde://workspace');
                expect(() => JSON.parse(result.contents[0].text)).not.toThrow();
            });
        });

        describe('unknown URI', () => {
            it('should throw error for unknown resource URI', async () => {
                await expect(readResource('kilde://unknown')).rejects.toThrow('Unknown resource URI');
            });

            it('should throw error for invalid URI format', async () => {
                await expect(readResource('invalid-uri')).rejects.toThrow('Unknown resource URI');
            });
        });
    });
});
