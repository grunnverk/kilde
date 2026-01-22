// Load .env file if it exists, but NEVER override existing environment variables
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ override: false, debug: false });

import { setLogger as setGitLogger } from '@eldrforge/git-tools';
import { initializeTemplates } from '@eldrforge/ai-service';
import { Config } from '@eldrforge/core';
import { Command } from 'commander';

// Import commands
import * as CommandsGit from '@eldrforge/commands-git';
import * as ReleaseCommand from './commands/release';

import {
    COMMAND_COMMIT,
    COMMAND_RELEASE,
    VERSION,
    BUILD_HOSTNAME,
    BUILD_TIMESTAMP,
    KILDE_DEFAULTS,
    PROGRAM_NAME
} from './constants';
import { getLogger, setLogLevel } from './logging';
import { getEffectiveConfig } from './utils/config';

/**
 * Check Node.js version and exit with clear error message if version is too old.
 */
function checkNodeVersion(): void {
    const requiredMajorVersion = 24;
    const currentVersion = process.version;
    const majorVersion = parseInt(currentVersion.slice(1).split('.')[0], 10);

    if (majorVersion < requiredMajorVersion) {
        // eslint-disable-next-line no-console
        console.error(`\n❌ ERROR: Node.js version ${requiredMajorVersion}.0.0 or higher is required.`);
        // eslint-disable-next-line no-console
        console.error(`   Current version: ${currentVersion}`);
        // eslint-disable-next-line no-console
        console.error(`   Please upgrade your Node.js version to continue.\n`);
        process.exit(1);
    }
}

/**
 * Get formatted version information including build metadata.
 */
export function getVersionInfo(): { version: string; buildHostname: string; buildTimestamp: string; formatted: string } {
    return {
        version: VERSION,
        buildHostname: BUILD_HOSTNAME,
        buildTimestamp: BUILD_TIMESTAMP,
        formatted: `${VERSION}\nBuilt on: ${BUILD_HOSTNAME}\nBuild time: ${BUILD_TIMESTAMP}`
    };
}

/**
 * Parse command line arguments and merge with config
 */
async function parseArguments(): Promise<{ commandName: string; config: Config }> {
    const program = new Command();

    program
        .name(PROGRAM_NAME)
        .description('Universal Git Automation Tool - AI-powered commit and release messages')
        .version(VERSION)
        .option('-v, --verbose', 'Enable verbose logging')
        .option('-d, --debug', 'Enable debug logging')
        .option('--dry-run', 'Preview without making changes')
        .option('--model <model>', 'AI model to use (default: gpt-4o-mini)')
        .option('--reasoning <level>', 'OpenAI reasoning level: low, medium, high (default: low)');

    // Commit command
    program
        .command('commit')
        .description('Generate AI-powered commit message')
        .option('--add', 'Stage all changes before committing')
        .option('--cached', 'Only use staged changes')
        .option('--sendit', 'Automatically commit with generated message')
        .option('--interactive', 'Interactive mode for reviewing message')
        .option('--amend', 'Amend the previous commit')
        .option('--push [remote]', 'Push after committing (optionally specify remote)')
        .option('--issue <number>', 'Reference issue number')
        .option('--context <text>', 'Additional context for commit message')
        .option('--context-files <files...>', 'Context files to include')
        .action(async (options) => {
            const config = await buildConfig('commit', options);
            await executeCommand(COMMAND_COMMIT, config);
        });

    // Release command
    program
        .command('release')
        .description('Generate release notes from git history')
        .option('--from-tag <tag>', 'Start tag for release notes')
        .option('--to-tag <tag>', 'End tag for release notes (default: HEAD)')
        .option('--version <version>', 'Version number for release')
        .option('--output <file>', 'Output file path')
        .option('--interactive', 'Interactive mode for reviewing notes')
        .option('--focus <text>', 'Focus area for release notes')
        .option('--context <text>', 'Additional context for release notes')
        .option('--context-files <files...>', 'Context files to include')
        .action(async (options) => {
            const config = await buildConfig('release', options);
            await executeCommand(COMMAND_RELEASE, config);
        });

    program.parse();

    // Return empty config if help or version was shown
    return { commandName: '', config: KILDE_DEFAULTS };
}

/**
 * Build final configuration from defaults, config file, and CLI arguments
 */
async function buildConfig(commandName: string, cliOptions: any): Promise<Config> {
    // Load config from file
    const fileConfig = await getEffectiveConfig();

    // Start with defaults
    const config: Config = { ...KILDE_DEFAULTS };

    // Merge file config
    Object.assign(config, fileConfig);

    // Merge CLI global options
    if (cliOptions.parent.verbose !== undefined) config.verbose = cliOptions.parent.verbose;
    if (cliOptions.parent.debug !== undefined) config.debug = cliOptions.parent.debug;
    if (cliOptions.parent.dryRun !== undefined) config.dryRun = cliOptions.parent.dryRun;
    if (cliOptions.parent.model) config.model = cliOptions.parent.model;
    if (cliOptions.parent.reasoning) config.openaiReasoning = cliOptions.parent.reasoning;

    // Merge command-specific options
    if (commandName === 'commit') {
        config.commit = config.commit || {};
        if (cliOptions.add !== undefined) config.commit.add = cliOptions.add;
        if (cliOptions.cached !== undefined) config.commit.cached = cliOptions.cached;
        if (cliOptions.sendit !== undefined) config.commit.sendit = cliOptions.sendit;
        if (cliOptions.interactive !== undefined) config.commit.interactive = cliOptions.interactive;
        if (cliOptions.amend !== undefined) config.commit.amend = cliOptions.amend;
        if (cliOptions.push !== undefined) config.commit.push = cliOptions.push;
        if (cliOptions.context) config.commit.context = cliOptions.context;
        if (cliOptions.contextFiles) config.commit.contextFiles = cliOptions.contextFiles;
    } else if (commandName === 'release') {
        config.release = config.release || {};
        if (cliOptions.fromTag) config.release.from = cliOptions.fromTag;
        if (cliOptions.toTag) config.release.to = cliOptions.toTag;
        if (cliOptions.interactive !== undefined) config.release.interactive = cliOptions.interactive;
        if (cliOptions.focus) config.release.focus = cliOptions.focus;
        if (cliOptions.context) config.release.context = cliOptions.context;
        if (cliOptions.contextFiles) config.release.contextFiles = cliOptions.contextFiles;
        // Add non-standard fields as any
        if (cliOptions.version) (config.release as any).version = cliOptions.version;
        if (cliOptions.output) (config.release as any).output = cliOptions.output;
    }

    // Return config (no validation needed - already built from defaults)
    return config as unknown as Config;
}

/**
 * Execute the specified command
 */
async function executeCommand(commandName: string, runConfig: Config): Promise<void> {
    const logger = getLogger();

    // Configure logging level
    if (runConfig.verbose) {
        setLogLevel('verbose');
    }
    if (runConfig.debug) {
        setLogLevel('debug');
    }

    // Configure external packages to use our logger
    setGitLogger(logger);

    logger.info('APPLICATION_STARTING: Kilde application initializing | Version: %s | BuildHost: %s | BuildTime: %s | Status: starting',
        VERSION, BUILD_HOSTNAME, BUILD_TIMESTAMP);

    logger.debug(`Executing command: ${commandName}`);

    let summary: string = '';

    try {
        if (commandName === COMMAND_COMMIT) {
            summary = await CommandsGit.commit(runConfig);
        } else if (commandName === COMMAND_RELEASE) {
            const releaseSummary = await ReleaseCommand.execute(runConfig);
            summary = `Release notes generated:\nTitle: ${releaseSummary.title}\n\n${releaseSummary.body}`;
        } else {
            throw new Error(`Unknown command: ${commandName}`);
        }

        if (summary) {
            logger.info('COMMAND_COMPLETE: Command executed successfully | Status: success');
            if (runConfig.verbose || runConfig.debug) {
                logger.info('COMMAND_SUMMARY: %s', summary);
            }
        }

    } catch (error: any) {
        // Handle user cancellation gracefully
        if (error.name === 'UserCancellationError' || error.message?.includes('cancelled')) {
            logger.info('COMMAND_CANCELLED: Command cancelled by user | Status: cancelled');
            return;
        }

        // Log and re-throw other errors
        logger.error('COMMAND_FAILED: Command execution failed | Error: %s | Status: error', error.message);
        throw error;
    }
}

/**
 * Configure early logging based on command line flags.
 */
export function configureEarlyLogging(): void {
    const hasVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');
    const hasDebug = process.argv.includes('--debug') || process.argv.includes('-d');

    // Set log level based on early flag detection
    if (hasDebug) {
        setLogLevel('debug');
    } else if (hasVerbose) {
        setLogLevel('verbose');
    }
}

/**
 * Main application entry point
 */
export async function runApplication(): Promise<void> {
    // Check Node.js version first
    checkNodeVersion();

    // Configure logging early
    configureEarlyLogging();

    // Initialize RiotPrompt templates for ai-service
    initializeTemplates();

    // Parse arguments and execute command
    await parseArguments();
}
