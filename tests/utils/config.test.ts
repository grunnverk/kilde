import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import * as path from 'path';
import { tmpdir } from 'os';
import {
    loadConfig,
    getDefaultConfig,
    mergeWithDefaults,
    getEffectiveConfig,
    createSampleConfig,
    saveSampleConfig,
    configFileExists,
} from '../../src/utils/config';
import { KILDE_DEFAULTS } from '../../src/constants';

describe('config utilities', () => {
    let testDir: string;

    beforeEach(async () => {
        testDir = await fs.mkdtemp(path.join(tmpdir(), 'kilde-test-'));
    });

    afterEach(async () => {
        await fs.rm(testDir, { recursive: true, force: true });
    });

    describe('loadConfig', () => {
        it('should return null when no config file exists', async () => {
            const config = await loadConfig(testDir);
            expect(config).toBeNull();
        });

        it('should load YAML config from .kilde/config.yaml', async () => {
            const configDir = path.join(testDir, '.kilde');
            await fs.mkdir(configDir, { recursive: true });
            const configPath = path.join(configDir, 'config.yaml');
            await fs.writeFile(configPath, 'verbose: true\nmodel: gpt-4o', 'utf-8');

            const config = await loadConfig(testDir);
            expect(config).not.toBeNull();
            expect(config?.verbose).toBe(true);
            expect(config?.model).toBe('gpt-4o');
        });

        it('should load JSON config from .kilderc.json', async () => {
            const configPath = path.join(testDir, '.kilderc.json');
            await fs.writeFile(configPath, JSON.stringify({ verbose: true, debug: true }), 'utf-8');

            const config = await loadConfig(testDir);
            expect(config).not.toBeNull();
            expect(config?.verbose).toBe(true);
            expect(config?.debug).toBe(true);
        });

        it('should prioritize .kilde/config.yaml over other files', async () => {
            // Create multiple config files
            const configDir = path.join(testDir, '.kilde');
            await fs.mkdir(configDir, { recursive: true });
            await fs.writeFile(path.join(configDir, 'config.yaml'), 'verbose: true\nmodel: gpt-4o', 'utf-8');
            await fs.writeFile(path.join(testDir, '.kilderc.json'), JSON.stringify({ verbose: false }), 'utf-8');

            const config = await loadConfig(testDir);
            expect(config?.verbose).toBe(true);
            expect(config?.model).toBe('gpt-4o');
        });

        it('should handle malformed config gracefully', async () => {
            const configPath = path.join(testDir, '.kilderc.json');
            await fs.writeFile(configPath, 'not valid json', 'utf-8');

            const config = await loadConfig(testDir);
            expect(config).toBeNull();
        });
    });

    describe('getDefaultConfig', () => {
        it('should return KILDE_DEFAULTS', () => {
            const config = getDefaultConfig();
            expect(config).toEqual(KILDE_DEFAULTS);
        });

        it('should include required fields', () => {
            const config = getDefaultConfig();
            expect(config.configDirectory).toBeDefined();
            expect(config.discoveredConfigDirs).toBeDefined();
            expect(config.resolvedConfigDirs).toBeDefined();
            expect(config.verbose).toBeDefined();
            expect(config.debug).toBeDefined();
            expect(config.dryRun).toBeDefined();
        });
    });

    describe('mergeWithDefaults', () => {
        it('should return defaults when config is null', () => {
            const merged = mergeWithDefaults(null);
            expect(merged).toEqual(KILDE_DEFAULTS);
        });

        it('should merge config with defaults', () => {
            const config = { verbose: true, model: 'gpt-4o' } as any;
            const merged = mergeWithDefaults(config);

            expect(merged.verbose).toBe(true);
            expect(merged.model).toBe('gpt-4o');
            expect(merged.debug).toBe(KILDE_DEFAULTS.debug);
            expect(merged.configDirectory).toBe(KILDE_DEFAULTS.configDirectory);
        });

        it('should deep merge nested objects', () => {
            const config = {
                commit: {
                    sendit: true,
                    add: false,
                }
            } as any;
            const merged = mergeWithDefaults(config);

            expect(merged.commit?.sendit).toBe(true);
            expect(merged.commit?.add).toBe(false);
            expect(merged.commit?.cached).toBe(KILDE_DEFAULTS.commit?.cached);
        });

        it('should not merge arrays', () => {
            const config = {
                discoveredConfigDirs: ['custom-dir']
            } as any;
            const merged = mergeWithDefaults(config);

            expect(merged.discoveredConfigDirs).toEqual(['custom-dir']);
        });
    });

    describe('getEffectiveConfig', () => {
        it('should return defaults when no config file exists', async () => {
            const config = await getEffectiveConfig(testDir);
            expect(config).toEqual(KILDE_DEFAULTS);
        });

        it('should merge loaded config with defaults', async () => {
            const configPath = path.join(testDir, '.kilderc.json');
            await fs.writeFile(configPath, JSON.stringify({ verbose: true }), 'utf-8');

            const config = await getEffectiveConfig(testDir);
            expect(config.verbose).toBe(true);
            expect(config.debug).toBe(KILDE_DEFAULTS.debug);
        });
    });

    describe('createSampleConfig', () => {
        it('should return valid YAML config string', () => {
            const yaml = createSampleConfig();
            expect(yaml).toContain('verbose:');
            expect(yaml).toContain('debug:');
            expect(yaml).toContain('model:');
            expect(yaml).toContain('commit:');
            expect(yaml).toContain('release:');
        });

        it('should have correct default values', () => {
            const yaml = createSampleConfig();
            expect(yaml).toContain('verbose: false');
            expect(yaml).toContain('debug: false');
            expect(yaml).toContain('model: gpt-4o-mini');
        });
    });

    describe('saveSampleConfig', () => {
        it('should create .kilde directory', async () => {
            await saveSampleConfig(testDir);
            const configDir = path.join(testDir, '.kilde');
            const stats = await fs.stat(configDir);
            expect(stats.isDirectory()).toBe(true);
        });

        it('should create config.yaml file', async () => {
            const configPath = await saveSampleConfig(testDir);
            expect(configPath).toBe(path.join(testDir, '.kilde', 'config.yaml'));

            const content = await fs.readFile(configPath, 'utf-8');
            expect(content).toContain('verbose:');
            expect(content).toContain('model:');
        });

        it('should return the config path', async () => {
            const configPath = await saveSampleConfig(testDir);
            expect(configPath).toMatch(/\.kilde\/config\.yaml$/);
        });
    });

    describe('configFileExists', () => {
        it('should return false when no config file exists', async () => {
            const exists = await configFileExists(testDir);
            expect(exists).toBe(false);
        });

        it('should return true when .kilde/config.yaml exists', async () => {
            const configDir = path.join(testDir, '.kilde');
            await fs.mkdir(configDir, { recursive: true });
            await fs.writeFile(path.join(configDir, 'config.yaml'), 'verbose: true', 'utf-8');

            const exists = await configFileExists(testDir);
            expect(exists).toBe(true);
        });

        it('should return true when .kilderc.json exists', async () => {
            await fs.writeFile(path.join(testDir, '.kilderc.json'), '{}', 'utf-8');

            const exists = await configFileExists(testDir);
            expect(exists).toBe(true);
        });
    });
});
