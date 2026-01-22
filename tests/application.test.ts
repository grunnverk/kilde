import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getVersionInfo, configureEarlyLogging } from '../src/application';
import { getLogger, setLogLevel } from '../src/logging';
import { VERSION, BUILD_HOSTNAME, BUILD_TIMESTAMP } from '../src/constants';

describe('application', () => {
    let originalArgv: string[];

    beforeEach(() => {
        originalArgv = [...process.argv];
    });

    afterEach(() => {
        process.argv = originalArgv;
        setLogLevel('info');
    });

    describe('getVersionInfo', () => {
        it('should return version information', () => {
            const info = getVersionInfo();

            expect(info.version).toBe(VERSION);
            expect(info.buildHostname).toBe(BUILD_HOSTNAME);
            expect(info.buildTimestamp).toBe(BUILD_TIMESTAMP);
            expect(info.formatted).toContain(VERSION);
        });

        it('should include build metadata in formatted string', () => {
            const info = getVersionInfo();

            expect(info.formatted).toContain('Built on:');
            expect(info.formatted).toContain('Build time:');
            expect(info.formatted).toContain(BUILD_HOSTNAME);
            expect(info.formatted).toContain(BUILD_TIMESTAMP);
        });

        it('should have all required fields', () => {
            const info = getVersionInfo();

            expect(info).toHaveProperty('version');
            expect(info).toHaveProperty('buildHostname');
            expect(info).toHaveProperty('buildTimestamp');
            expect(info).toHaveProperty('formatted');
        });

        it('should return string types for all fields', () => {
            const info = getVersionInfo();

            expect(typeof info.version).toBe('string');
            expect(typeof info.buildHostname).toBe('string');
            expect(typeof info.buildTimestamp).toBe('string');
            expect(typeof info.formatted).toBe('string');
        });
    });

    describe('configureEarlyLogging', () => {
        it('should set debug log level when --debug flag is present', () => {
            process.argv = ['node', 'kilde', '--debug'];
            configureEarlyLogging();

            const logger = getLogger() as any;
            expect(logger.level).toBe('debug');
        });

        it('should set debug log level when -d flag is present', () => {
            process.argv = ['node', 'kilde', '-d'];
            configureEarlyLogging();

            const logger = getLogger() as any;
            expect(logger.level).toBe('debug');
        });

        it('should set verbose log level when --verbose flag is present', () => {
            process.argv = ['node', 'kilde', '--verbose'];
            configureEarlyLogging();

            const logger = getLogger() as any;
            expect(logger.level).toBe('verbose');
        });

        it('should set verbose log level when -v flag is present', () => {
            process.argv = ['node', 'kilde', '-v'];
            configureEarlyLogging();

            const logger = getLogger() as any;
            expect(logger.level).toBe('verbose');
        });

        it('should prioritize debug over verbose when both are present', () => {
            process.argv = ['node', 'kilde', '--verbose', '--debug'];
            configureEarlyLogging();

            const logger = getLogger() as any;
            expect(logger.level).toBe('debug');
        });

        it('should not change log level when no flags are present', () => {
            setLogLevel('info');
            process.argv = ['node', 'kilde'];
            configureEarlyLogging();

            const logger = getLogger() as any;
            expect(logger.level).toBe('info');
        });

        it('should handle flags in any position', () => {
            process.argv = ['node', 'kilde', 'commit', '--debug', '--sendit'];
            configureEarlyLogging();

            const logger = getLogger() as any;
            expect(logger.level).toBe('debug');
        });
    });
});
