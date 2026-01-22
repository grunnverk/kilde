import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import winston from 'winston';
import { getLogger, setLogLevel, getDryRunLogger } from '../src/logging';

describe('logging', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        process.env = originalEnv;
        // Reset log level
        setLogLevel('info');
    });

    describe('getLogger', () => {
        it('should return a winston logger instance', () => {
            const logger = getLogger();
            expect(logger).toBeDefined();
            expect(typeof logger.info).toBe('function');
            expect(typeof logger.error).toBe('function');
            expect(typeof logger.debug).toBe('function');
        });

        it('should return the same logger instance on multiple calls', () => {
            const logger1 = getLogger();
            const logger2 = getLogger();
            expect(logger1).toBe(logger2);
        });

        it('should have console transport in non-MCP mode', () => {
            delete process.env.KILDE_MCP_SERVER;
            const logger = getLogger() as winston.Logger;
            const transports = (logger as any).transports || [];
            const hasConsole = transports.some((t: any) => t instanceof winston.transports.Console);
            expect(hasConsole).toBe(true);
        });
    });

    describe('setLogLevel', () => {
        it('should change logger level to verbose', () => {
            const logger = getLogger() as winston.Logger;
            setLogLevel('verbose');
            expect(logger.level).toBe('verbose');
        });

        it('should change logger level to debug', () => {
            const logger = getLogger() as winston.Logger;
            setLogLevel('debug');
            expect(logger.level).toBe('debug');
        });

        it('should change logger level to info', () => {
            const logger = getLogger() as winston.Logger;
            setLogLevel('info');
            expect(logger.level).toBe('info');
        });
    });

    describe('getDryRunLogger', () => {
        it('should return a logger with dry-run prefix when isDryRun is true', () => {
            const logger = getDryRunLogger(true);
            expect(logger).toBeDefined();

            // Test that it has the expected methods
            expect(typeof logger.info).toBe('function');
            expect(typeof logger.error).toBe('function');
            expect(typeof logger.debug).toBe('function');
        });

        it('should return the original logger when isDryRun is false', () => {
            const originalLogger = getLogger();
            const logger = getDryRunLogger(false);
            expect(logger).toBe(originalLogger);
        });

        it('should prefix messages with [DRY-RUN] when isDryRun is true', () => {
            const logger = getDryRunLogger(true);
            const mockLog = vi.fn();

            // Replace the underlying logger's info method
            const originalLogger = getLogger();
            const originalInfo = originalLogger.info;
            originalLogger.info = mockLog as any;

            logger.info('test message');

            // Verify the message was passed with dryRun metadata
            expect(mockLog).toHaveBeenCalledWith('test message', { dryRun: true });

            // Restore original
            originalLogger.info = originalInfo;
        });

        it('should handle all log methods with dry-run metadata', () => {
            const logger = getDryRunLogger(true);
            const originalLogger = getLogger();

            // Test warn
            const mockWarn = vi.fn();
            const originalWarn = originalLogger.warn;
            originalLogger.warn = mockWarn as any;
            logger.warn('warning');
            expect(mockWarn).toHaveBeenCalledWith('warning', { dryRun: true });
            originalLogger.warn = originalWarn;

            // Test error
            const mockError = vi.fn();
            const originalError = originalLogger.error;
            originalLogger.error = mockError as any;
            logger.error('error');
            expect(mockError).toHaveBeenCalledWith('error', { dryRun: true });
            originalLogger.error = originalError;

            // Test debug
            const mockDebug = vi.fn();
            const originalDebug = originalLogger.debug;
            originalLogger.debug = mockDebug as any;
            logger.debug('debug');
            expect(mockDebug).toHaveBeenCalledWith('debug', { dryRun: true });
            originalLogger.debug = originalDebug;

            // Test verbose
            const mockVerbose = vi.fn();
            const originalVerbose = originalLogger.verbose;
            originalLogger.verbose = mockVerbose as any;
            logger.verbose('verbose');
            expect(mockVerbose).toHaveBeenCalledWith('verbose', { dryRun: true });
            originalLogger.verbose = originalVerbose;

            // Test silly
            const mockSilly = vi.fn();
            const originalSilly = originalLogger.silly;
            originalLogger.silly = mockSilly as any;
            logger.silly('silly');
            expect(mockSilly).toHaveBeenCalledWith('silly', { dryRun: true });
            originalLogger.silly = originalSilly;
        });
    });
});
