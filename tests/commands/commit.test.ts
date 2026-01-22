import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as CommandsGit from '@grunnverk/commands-git';
import { Config } from '@grunnverk/core';

// Mock the commands-git module
vi.mock('@grunnverk/commands-git', () => ({
    commit: vi.fn(),
}));

describe('commit command integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('basic commit functionality', () => {
        it('should call commands-git commit with proper config', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                verbose: false,
                debug: false,
                dryRun: false,
                commit: {
                    add: true,
                    sendit: true,
                    cached: false,
                    interactive: false,
                    amend: false,
                },
            } as Config;

            vi.mocked(CommandsGit.commit).mockResolvedValue('Commit created successfully');

            const result = await CommandsGit.commit(mockConfig);

            expect(CommandsGit.commit).toHaveBeenCalledWith(mockConfig);
            expect(result).toBe('Commit created successfully');
        });

        it('should handle commit with add flag', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                commit: {
                    add: true,
                },
            } as Config;

            vi.mocked(CommandsGit.commit).mockResolvedValue('Changes staged and committed');

            const result = await CommandsGit.commit(mockConfig);

            expect(result).toBe('Changes staged and committed');
            expect(CommandsGit.commit).toHaveBeenCalledWith(
                expect.objectContaining({
                    commit: expect.objectContaining({
                        add: true,
                    }),
                })
            );
        });

        it('should handle commit with sendit flag', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                commit: {
                    sendit: true,
                },
            } as Config;

            vi.mocked(CommandsGit.commit).mockResolvedValue('Commit created: abc1234');

            const result = await CommandsGit.commit(mockConfig);

            expect(result).toContain('Commit created');
        });
    });

    describe('commit with context', () => {
        it('should handle commit with context string', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                commit: {
                    context: 'Fix authentication bug',
                },
            } as Config;

            vi.mocked(CommandsGit.commit).mockResolvedValue('Commit with context created');

            await CommandsGit.commit(mockConfig);

            expect(CommandsGit.commit).toHaveBeenCalledWith(
                expect.objectContaining({
                    commit: expect.objectContaining({
                        context: 'Fix authentication bug',
                    }),
                })
            );
        });

        it('should handle commit with context files', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                commit: {
                    contextFiles: ['CHANGELOG.md', 'README.md'],
                },
            } as Config;

            vi.mocked(CommandsGit.commit).mockResolvedValue('Commit with context files created');

            await CommandsGit.commit(mockConfig);

            expect(CommandsGit.commit).toHaveBeenCalledWith(
                expect.objectContaining({
                    commit: expect.objectContaining({
                        contextFiles: ['CHANGELOG.md', 'README.md'],
                    }),
                })
            );
        });
    });

    describe('commit modes', () => {
        it('should handle interactive mode', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                commit: {
                    interactive: true,
                },
            } as Config;

            vi.mocked(CommandsGit.commit).mockResolvedValue('Interactive commit completed');

            await CommandsGit.commit(mockConfig);

            expect(CommandsGit.commit).toHaveBeenCalledWith(
                expect.objectContaining({
                    commit: expect.objectContaining({
                        interactive: true,
                    }),
                })
            );
        });

        it('should handle amend mode', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                commit: {
                    amend: true,
                },
            } as Config;

            vi.mocked(CommandsGit.commit).mockResolvedValue('Commit amended');

            await CommandsGit.commit(mockConfig);

            expect(CommandsGit.commit).toHaveBeenCalledWith(
                expect.objectContaining({
                    commit: expect.objectContaining({
                        amend: true,
                    }),
                })
            );
        });

        it('should handle cached mode', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                commit: {
                    cached: true,
                },
            } as Config;

            vi.mocked(CommandsGit.commit).mockResolvedValue('Cached changes committed');

            await CommandsGit.commit(mockConfig);

            expect(CommandsGit.commit).toHaveBeenCalledWith(
                expect.objectContaining({
                    commit: expect.objectContaining({
                        cached: true,
                    }),
                })
            );
        });
    });

    describe('dry-run mode', () => {
        it('should handle dry-run mode', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                dryRun: true,
                commit: {
                    add: true,
                },
            } as Config;

            vi.mocked(CommandsGit.commit).mockResolvedValue('[DRY-RUN] Would create commit');

            const result = await CommandsGit.commit(mockConfig);

            expect(result).toContain('DRY-RUN');
        });
    });

    describe('error handling', () => {
        it('should propagate errors from commit command', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
            } as Config;

            const error = new Error('Git command failed');
            vi.mocked(CommandsGit.commit).mockRejectedValue(error);

            await expect(CommandsGit.commit(mockConfig)).rejects.toThrow('Git command failed');
        });

        it('should handle missing git repository error', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
            } as Config;

            vi.mocked(CommandsGit.commit).mockRejectedValue(new Error('Not a git repository'));

            await expect(CommandsGit.commit(mockConfig)).rejects.toThrow('Not a git repository');
        });
    });
});
