import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeTool, getTools } from '../../src/mcp/tools';
import * as CommandsGit from '@grunnverk/commands-git';
import * as ReleaseCommand from '../../src/commands/release';

// Mock the dependencies
vi.mock('@grunnverk/commands-git', () => ({
    commit: vi.fn(),
}));

vi.mock('../../src/commands/release', () => ({
    execute: vi.fn(),
}));

vi.mock('@grunnverk/shared', () => ({
    createStorage: vi.fn(() => ({
        writeFile: vi.fn(),
        readFile: vi.fn(),
    })),
}));

describe('MCP tools', () => {
    const mockLogger = {
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
        warn: vi.fn(),
        verbose: vi.fn(),
    };

    const mockContext = {
        workingDirectory: '/test/dir',
        config: undefined,
        logger: mockLogger,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('executeTool', () => {
        describe('kilde_commit', () => {
            it('should execute commit command with default args', async () => {
                const mockSummary = 'Commit created successfully';
                vi.mocked(CommandsGit.commit).mockResolvedValue(mockSummary);

                const result = await executeTool('kilde_commit', {}, mockContext);

                expect(CommandsGit.commit).toHaveBeenCalled();
                expect(result.content).toHaveLength(1);
                expect(result.content[0].type).toBe('text');
                expect(result.content[0].text).toBe(mockSummary);
            });

            it('should pass commit options to config', async () => {
                vi.mocked(CommandsGit.commit).mockResolvedValue('Success');

                await executeTool('kilde_commit', {
                    add: true,
                    cached: true,
                    sendit: true,
                    interactive: false,
                    amend: true,
                    context: 'Test context',
                    contextFiles: ['file1.ts', 'file2.ts'],
                    dryRun: true,
                    verbose: true,
                    debug: false,
                }, mockContext);

                const callArgs = vi.mocked(CommandsGit.commit).mock.calls[0][0];
                expect(callArgs.commit?.add).toBe(true);
                expect(callArgs.commit?.cached).toBe(true);
                expect(callArgs.commit?.sendit).toBe(true);
                expect(callArgs.commit?.interactive).toBe(false);
                expect(callArgs.commit?.amend).toBe(true);
                expect(callArgs.commit?.context).toBe('Test context');
                expect(callArgs.commit?.contextFiles).toEqual(['file1.ts', 'file2.ts']);
                expect(callArgs.dryRun).toBe(true);
                expect(callArgs.verbose).toBe(true);
                expect(callArgs.debug).toBe(false);
            });

            it('should handle errors gracefully', async () => {
                const error = new Error('Commit failed');
                vi.mocked(CommandsGit.commit).mockRejectedValue(error);

                await expect(executeTool('kilde_commit', {}, mockContext)).rejects.toThrow('Commit failed');
                expect(mockLogger.error).toHaveBeenCalled();
            });
        });

        describe('kilde_release', () => {
            it('should execute release command with default args', async () => {
                const mockRelease = {
                    title: 'Release v1.0.0',
                    body: 'Release notes body',
                };
                vi.mocked(ReleaseCommand.execute).mockResolvedValue(mockRelease);

                const result = await executeTool('kilde_release', {}, mockContext);

                expect(ReleaseCommand.execute).toHaveBeenCalled();
                expect(result.content).toHaveLength(1);
                expect(result.content[0].type).toBe('text');
                expect(result.content[0].text).toContain('Release v1.0.0');
                expect(result.content[0].text).toContain('Release notes body');
            });

            it('should pass release options to config', async () => {
                vi.mocked(ReleaseCommand.execute).mockResolvedValue({
                    title: 'Release',
                    body: 'Notes',
                });

                await executeTool('kilde_release', {
                    fromTag: 'v1.0.0',
                    toTag: 'v2.0.0',
                    version: 'v2.0.0',
                    output: 'RELEASE.md',
                    interactive: true,
                    focus: 'breaking changes',
                    context: 'Migration guide',
                    contextFiles: ['CHANGELOG.md'],
                    dryRun: false,
                    verbose: true,
                    debug: true,
                }, mockContext);

                const callArgs = vi.mocked(ReleaseCommand.execute).mock.calls[0][0];
                expect(callArgs.release?.from).toBe('v1.0.0');
                expect(callArgs.release?.to).toBe('v2.0.0');
                expect(callArgs.release?.interactive).toBe(true);
                expect(callArgs.release?.focus).toBe('breaking changes');
                expect(callArgs.release?.context).toBe('Migration guide');
                expect(callArgs.release?.contextFiles).toEqual(['CHANGELOG.md']);
                expect((callArgs.release as any)?.version).toBe('v2.0.0');
                expect((callArgs.release as any)?.output).toBe('RELEASE.md');
                expect(callArgs.dryRun).toBe(false);
                expect(callArgs.verbose).toBe(true);
                expect(callArgs.debug).toBe(true);
            });

            it('should handle errors gracefully', async () => {
                const error = new Error('Release failed');
                vi.mocked(ReleaseCommand.execute).mockRejectedValue(error);

                await expect(executeTool('kilde_release', {}, mockContext)).rejects.toThrow('Release failed');
                expect(mockLogger.error).toHaveBeenCalled();
            });

            it('should use HEAD as default toTag', async () => {
                vi.mocked(ReleaseCommand.execute).mockResolvedValue({
                    title: 'Release',
                    body: 'Notes',
                });

                await executeTool('kilde_release', { fromTag: 'v1.0.0' }, mockContext);

                const callArgs = vi.mocked(ReleaseCommand.execute).mock.calls[0][0];
                expect(callArgs.release?.to).toBe('HEAD');
            });
        });

        describe('unknown tool', () => {
            it('should throw error for unknown tool name', async () => {
                await expect(executeTool('unknown_tool', {}, mockContext)).rejects.toThrow('Unknown tool: unknown_tool');
            });
        });
    });

    describe('getTools', () => {
        it('should return array of tool definitions', () => {
            const tools = getTools();
            expect(Array.isArray(tools)).toBe(true);
            expect(tools.length).toBe(2);
        });

        it('should include kilde_commit tool', () => {
            const tools = getTools();
            const commitTool = tools.find(t => t.name === 'kilde_commit');

            expect(commitTool).toBeDefined();
            expect(commitTool?.description).toContain('commit');
            expect(commitTool?.inputSchema.properties.add).toBeDefined();
            expect(commitTool?.inputSchema.properties.sendit).toBeDefined();
            expect(commitTool?.inputSchema.properties.cached).toBeDefined();
        });

        it('should include kilde_release tool', () => {
            const tools = getTools();
            const releaseTool = tools.find(t => t.name === 'kilde_release');

            expect(releaseTool).toBeDefined();
            expect(releaseTool?.description).toContain('release');
            expect(releaseTool?.inputSchema.properties.fromTag).toBeDefined();
            expect(releaseTool?.inputSchema.properties.toTag).toBeDefined();
            expect(releaseTool?.inputSchema.properties.version).toBeDefined();
        });

        it('should have correct input schema types', () => {
            const tools = getTools();
            const commitTool = tools.find(t => t.name === 'kilde_commit');

            expect(commitTool?.inputSchema.type).toBe('object');
            expect(commitTool?.inputSchema.properties?.add?.type).toBe('boolean');
            expect(commitTool?.inputSchema.properties?.context?.type).toBe('string');
            expect(commitTool?.inputSchema.properties?.contextFiles?.type).toBe('array');
        });
    });
});
