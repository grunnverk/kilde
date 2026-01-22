import { describe, it, expect, vi, beforeEach } from 'vitest';
import { execute } from '../../src/commands/release';
import { Config, Log, Diff } from '@eldrforge/core';
import * as GitTools from '@eldrforge/git-tools';

// Mock dependencies
vi.mock('@eldrforge/git-tools', () => ({
    getDefaultFromRef: vi.fn(),
    getCurrentBranch: vi.fn(),
}));

vi.mock('@eldrforge/core', async () => {
    const actual = await vi.importActual('@eldrforge/core');
    return {
        ...actual,
        Log: {
            create: vi.fn(),
        },
        Diff: {
            create: vi.fn(),
        },
    };
});

vi.mock('@eldrforge/ai-service', () => ({
    runAgenticRelease: vi.fn(),
    getDryRunLogger: vi.fn((isDryRun) => ({
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
        warn: vi.fn(),
    })),
}));

vi.mock('@eldrforge/shared', () => ({
    createStorage: vi.fn(() => ({
        writeFile: vi.fn(),
        readFile: vi.fn(),
        exists: vi.fn(),
    })),
}));

describe('release command integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('basic release functionality', () => {
        it('should generate release notes with default config', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                release: {},
            } as Config;

            vi.mocked(GitTools.getCurrentBranch).mockResolvedValue('main');
            vi.mocked(GitTools.getDefaultFromRef).mockResolvedValue('v1.0.0');

            vi.mocked(Log.create).mockResolvedValue({
                toString: () => 'commit log content',
                commits: [],
            } as any);

            vi.mocked(Diff.create).mockResolvedValue({
                toString: () => 'diff content',
                files: [],
            } as any);

            const { runAgenticRelease } = await import('@eldrforge/ai-service');
            vi.mocked(runAgenticRelease).mockResolvedValue({
                title: 'Release v2.0.0',
                body: 'Release notes content',
            } as any);

            const result = await execute(mockConfig);

            expect(result).toEqual({
                title: 'Release v2.0.0',
                body: 'Release notes content',
            });
        });

        it('should use specified tag range', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                release: {
                    from: 'v1.0.0',
                    to: 'v2.0.0',
                },
            } as Config;

            vi.mocked(GitTools.getCurrentBranch).mockResolvedValue('main');

            vi.mocked(Log.create).mockResolvedValue({
                toString: () => 'log between tags',
                commits: [],
            } as any);

            vi.mocked(Diff.create).mockResolvedValue({
                toString: () => 'diff between tags',
                files: [],
            } as any);

            const { runAgenticRelease } = await import('@eldrforge/ai-service');
            vi.mocked(runAgenticRelease).mockResolvedValue({
                title: 'Release v2.0.0',
                body: 'Changes from v1.0.0 to v2.0.0',
            } as any);

            const result = await execute(mockConfig);

            expect(Log.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    from: 'v1.0.0',
                    to: 'v2.0.0',
                })
            );
        });
    });

    describe('release with version', () => {
        it('should include version in release notes', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                release: {
                    from: 'v1.0.0',
                } as any,
            } as Config;

            (mockConfig.release as any).version = 'v2.0.0';

            vi.mocked(GitTools.getCurrentBranch).mockResolvedValue('main');
            vi.mocked(GitTools.getDefaultFromRef).mockResolvedValue('v1.0.0');

            vi.mocked(Log.create).mockResolvedValue({
                toString: () => 'commit log',
                commits: [],
            } as any);

            vi.mocked(Diff.create).mockResolvedValue({
                toString: () => 'diff content',
                files: [],
            } as any);

            const { runAgenticRelease } = await import('@eldrforge/ai-service');
            vi.mocked(runAgenticRelease).mockResolvedValue({
                title: 'Release v2.0.0',
                body: 'Version 2.0.0 release notes',
            } as any);

            await execute(mockConfig);

            expect(runAgenticRelease).toHaveBeenCalledWith(
                expect.objectContaining({
                    targetVersion: 'v2.0.0',
                })
            );
        });
    });

    describe('release with focus', () => {
        it('should use focus parameter for targeted release notes', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                release: {
                    focus: 'breaking changes',
                },
            } as Config;

            vi.mocked(GitTools.getCurrentBranch).mockResolvedValue('main');
            vi.mocked(GitTools.getDefaultFromRef).mockResolvedValue('v1.0.0');

            vi.mocked(Log.create).mockResolvedValue({
                toString: () => 'commit log',
                commits: [],
            } as any);

            vi.mocked(Diff.create).mockResolvedValue({
                toString: () => 'diff content',
                files: [],
            } as any);

            const { runAgenticRelease } = await import('@eldrforge/ai-service');
            vi.mocked(runAgenticRelease).mockResolvedValue({
                title: 'Release Notes',
                body: 'Breaking changes highlighted',
            } as any);

            await execute(mockConfig);

            expect(runAgenticRelease).toHaveBeenCalledWith(
                expect.objectContaining({
                    releaseFocus: 'breaking changes',
                })
            );
        });
    });

    describe('release with context', () => {
        it('should include user context in generation', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                release: {
                    context: 'Major refactoring release',
                },
            } as Config;

            vi.mocked(GitTools.getCurrentBranch).mockResolvedValue('main');
            vi.mocked(GitTools.getDefaultFromRef).mockResolvedValue('v1.0.0');

            vi.mocked(Log.create).mockResolvedValue({
                toString: () => 'commit log',
                commits: [],
            } as any);

            vi.mocked(Diff.create).mockResolvedValue({
                toString: () => 'diff content',
                files: [],
            } as any);

            const { runAgenticRelease } = await import('@eldrforge/ai-service');
            vi.mocked(runAgenticRelease).mockResolvedValue({
                title: 'Release Notes',
                body: 'Notes with context',
            } as any);

            await execute(mockConfig);

            expect(runAgenticRelease).toHaveBeenCalledWith(
                expect.objectContaining({
                    userContext: 'Major refactoring release',
                })
            );
        });
    });

    describe('dry-run mode', () => {
        it('should preview release notes without saving', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                dryRun: true,
                release: {},
            } as Config;

            vi.mocked(GitTools.getCurrentBranch).mockResolvedValue('main');
            vi.mocked(GitTools.getDefaultFromRef).mockResolvedValue('v1.0.0');

            vi.mocked(Log.create).mockResolvedValue({
                toString: () => 'commit log',
                commits: [],
            } as any);

            vi.mocked(Diff.create).mockResolvedValue({
                toString: () => 'diff content',
                files: [],
            } as any);

            const { runAgenticRelease } = await import('@eldrforge/ai-service');
            vi.mocked(runAgenticRelease).mockResolvedValue({
                title: 'Preview Release',
                body: 'Preview content',
            } as any);

            const result = await execute(mockConfig);

            expect(result.title).toBe('Preview Release');
            // In dry-run, files should not be written
        });
    });

    describe('error handling', () => {
        it('should handle git log errors', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                release: {},
            } as Config;

            vi.mocked(GitTools.getCurrentBranch).mockResolvedValue('main');
            vi.mocked(GitTools.getDefaultFromRef).mockResolvedValue('v1.0.0');
            vi.mocked(Log.create).mockRejectedValue(new Error('Git log failed'));

            await expect(execute(mockConfig)).rejects.toThrow();
        });

        it('should handle AI service errors', async () => {
            const mockConfig: Config = {
                configDirectory: '/test/.kilde',
                discoveredConfigDirs: [],
                resolvedConfigDirs: [],
                release: {},
            } as Config;

            vi.mocked(GitTools.getCurrentBranch).mockResolvedValue('main');
            vi.mocked(GitTools.getDefaultFromRef).mockResolvedValue('v1.0.0');

            vi.mocked(Log.create).mockResolvedValue({
                toString: () => 'log',
                commits: [],
            } as any);

            vi.mocked(Diff.create).mockResolvedValue({
                toString: () => 'diff',
                files: [],
            } as any);

            const { runAgenticRelease } = await import('@eldrforge/ai-service');
            vi.mocked(runAgenticRelease).mockRejectedValue(new Error('AI service error'));

            await expect(execute(mockConfig)).rejects.toThrow();
        });
    });
});
