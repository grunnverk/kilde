import { describe, it, expect } from 'vitest';
import {
    PROGRAM_NAME,
    VERSION,
    BUILD_HOSTNAME,
    BUILD_TIMESTAMP,
    COMMAND_COMMIT,
    COMMAND_RELEASE,
    DEFAULT_CONFIG_DIR,
    DEFAULT_EXCLUDED_PATTERNS,
    KILDE_DEFAULTS,
} from '../src/constants';

describe('constants', () => {
    describe('program metadata', () => {
        it('should have PROGRAM_NAME defined', () => {
            expect(PROGRAM_NAME).toBeDefined();
            expect(typeof PROGRAM_NAME).toBe('string');
            expect(PROGRAM_NAME).toBe('kilde');
        });

        it('should have VERSION defined', () => {
            expect(VERSION).toBeDefined();
            expect(typeof VERSION).toBe('string');
        });

        it('should have BUILD_HOSTNAME defined', () => {
            expect(BUILD_HOSTNAME).toBeDefined();
            expect(typeof BUILD_HOSTNAME).toBe('string');
        });

        it('should have BUILD_TIMESTAMP defined', () => {
            expect(BUILD_TIMESTAMP).toBeDefined();
            expect(typeof BUILD_TIMESTAMP).toBe('string');
        });
    });

    describe('commands', () => {
        it('should have COMMAND_COMMIT defined', () => {
            expect(COMMAND_COMMIT).toBe('commit');
        });

        it('should have COMMAND_RELEASE defined', () => {
            expect(COMMAND_RELEASE).toBe('release');
        });
    });

    describe('configuration', () => {
        it('should have DEFAULT_CONFIG_DIR defined', () => {
            expect(DEFAULT_CONFIG_DIR).toBeDefined();
            expect(typeof DEFAULT_CONFIG_DIR).toBe('string');
        });

        it('should have DEFAULT_EXCLUDED_PATTERNS defined', () => {
            expect(DEFAULT_EXCLUDED_PATTERNS).toBeDefined();
            expect(Array.isArray(DEFAULT_EXCLUDED_PATTERNS)).toBe(true);
            expect(DEFAULT_EXCLUDED_PATTERNS.length).toBeGreaterThan(0);
        });

        it('should exclude common patterns', () => {
            expect(DEFAULT_EXCLUDED_PATTERNS).toContain('node_modules');
            expect(DEFAULT_EXCLUDED_PATTERNS).toContain('.git');
            expect(DEFAULT_EXCLUDED_PATTERNS).toContain('dist');
        });
    });

    describe('KILDE_DEFAULTS', () => {
        it('should have all required config fields', () => {
            expect(KILDE_DEFAULTS.configDirectory).toBeDefined();
            expect(KILDE_DEFAULTS.discoveredConfigDirs).toBeDefined();
            expect(KILDE_DEFAULTS.resolvedConfigDirs).toBeDefined();
            expect(KILDE_DEFAULTS.excludedPatterns).toBeDefined();
        });

        it('should have boolean flags with default values', () => {
            expect(typeof KILDE_DEFAULTS.verbose).toBe('boolean');
            expect(typeof KILDE_DEFAULTS.debug).toBe('boolean');
            expect(typeof KILDE_DEFAULTS.dryRun).toBe('boolean');
        });

        it('should have model configuration', () => {
            expect(KILDE_DEFAULTS.model).toBeDefined();
            expect(typeof KILDE_DEFAULTS.model).toBe('string');
        });

        it('should have commit configuration', () => {
            expect(KILDE_DEFAULTS.commit).toBeDefined();
            expect(typeof KILDE_DEFAULTS.commit).toBe('object');
        });

        it('should have release configuration', () => {
            expect(KILDE_DEFAULTS.release).toBeDefined();
            expect(typeof KILDE_DEFAULTS.release).toBe('object');
        });

        it('should have sensible commit defaults', () => {
            expect(KILDE_DEFAULTS.commit?.sendit).toBe(false);
            expect(KILDE_DEFAULTS.commit?.interactive).toBe(false);
            expect(KILDE_DEFAULTS.commit?.add).toBe(false);
            expect(KILDE_DEFAULTS.commit?.cached).toBe(false);
        });

        it('should have sensible release defaults', () => {
            expect(KILDE_DEFAULTS.release?.interactive).toBe(false);
        });

        it('should use excluded patterns from DEFAULT_EXCLUDED_PATTERNS', () => {
            expect(KILDE_DEFAULTS.excludedPatterns).toEqual(DEFAULT_EXCLUDED_PATTERNS);
        });

        it('should have empty arrays for directory lists', () => {
            expect(Array.isArray(KILDE_DEFAULTS.discoveredConfigDirs)).toBe(true);
            expect(Array.isArray(KILDE_DEFAULTS.resolvedConfigDirs)).toBe(true);
            expect(KILDE_DEFAULTS.discoveredConfigDirs.length).toBe(0);
            expect(KILDE_DEFAULTS.resolvedConfigDirs.length).toBe(0);
        });
    });
});
