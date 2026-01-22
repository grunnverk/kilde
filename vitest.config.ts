import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: false,
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        exclude: ['tests/commands/**/*.test.ts'], // Exclude command integration tests - require real git repo
        env: {
            TZ: 'America/New_York'
        },
        // Add pool configuration to prevent memory issues (moved from poolOptions in Vitest 4)
        pool: 'forks',
        maxForks: 2,
        minForks: 1,
        // Add test timeout and memory limits
        testTimeout: 30000,
        hookTimeout: 10000,
        teardownTimeout: 10000,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'html'],
            all: true,
            include: ['src/**/*.ts'],
            exclude: [
                'src/main.ts',
                'src/types/**/*.ts',
                'src/application.ts', // CLI integration - requires Commander parse
                'src/commands/release.ts', // Complex integration - requires git + AI
                'src/mcp/server.ts', // MCP server integration - requires stdio transport
            ],
            thresholds: {
                statements: 70,
                branches: 70,
                functions: 70,
                lines: 70,
            }
        },
    },
});
