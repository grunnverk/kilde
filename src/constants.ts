import os from 'os';
import path from 'path';

/**
 * Version and build information (replaced at build time)
 */
export const VERSION = '__VERSION__ (__GIT_BRANCH__/__GIT_COMMIT__ __GIT_TAGS__ __GIT_COMMIT_DATE__) __SYSTEM_INFO__';
export const BUILD_HOSTNAME = '__BUILD_HOSTNAME__';
export const BUILD_TIMESTAMP = '__BUILD_TIMESTAMP__';

/**
 * Program identification
 */
export const PROGRAM_NAME = 'kilde';

/**
 * Character encodings
 */
export const DEFAULT_CHARACTER_ENCODING = 'utf-8';
export const DEFAULT_BINARY_TO_TEXT_ENCODING = 'base64';

/**
 * Global defaults
 */
export const DEFAULT_VERBOSE = false;
export const DEFAULT_DRY_RUN = false;
export const DEFAULT_DEBUG = false;
export const DEFAULT_MODEL = 'gpt-4o-mini';
export const DEFAULT_MODEL_STRONG = 'gpt-4o';
export const DEFAULT_OPENAI_REASONING = 'low';
export const DEFAULT_OPENAI_MAX_OUTPUT_TOKENS = 10000;
export const DEFAULT_OUTPUT_DIRECTORY = 'output/kilde';

/**
 * Buffer size for git commands that may produce large output
 */
export const DEFAULT_GIT_COMMAND_MAX_BUFFER = 50 * 1024 * 1024; // 50MB

/**
 * Configuration directories
 */
export const DEFAULT_CONFIG_DIR = '.kilde';
export const DEFAULT_PREFERENCES_DIRECTORY = path.join(os.homedir(), '.kilde');

/**
 * Git commit aliases
 */
export const DEFAULT_FROM_COMMIT_ALIAS = 'main';
export const DEFAULT_TO_COMMIT_ALIAS = 'HEAD';

/**
 * Commit command defaults
 */
export const DEFAULT_ADD = false;
export const DEFAULT_CACHED = false;
export const DEFAULT_SENDIT_MODE = false;
export const DEFAULT_INTERACTIVE_MODE = false;
export const DEFAULT_AMEND_MODE = false;
// CRITICAL: Keep this low (3-5) to prevent log context contamination.
// The LLM tends to pattern-match against recent commits instead of describing
// the actual diff when it sees too much commit history. Set to 0 to disable.
export const DEFAULT_MESSAGE_LIMIT = 3;
export const DEFAULT_MAX_DIFF_BYTES = 20480; // 20KB limit per file

/**
 * Excluded patterns for git operations
 */
export const DEFAULT_EXCLUDED_PATTERNS = [
    'node_modules', 'package-lock.json', 'yarn.lock', 'bun.lockb',
    'composer.lock', 'Cargo.lock', 'Gemfile.lock',
    'dist', 'build', 'out', '.next', '.nuxt', 'coverage',
    '.vscode', '.idea', '.DS_Store', '.git', '.gitignore',
    'logs', 'tmp', '.cache', '*.log', '.env', '.env.*',
    '*.pem', '*.crt', '*.key', '*.sqlite', '*.db',
    '*.zip', '*.tar', '*.gz', '*.exe', '*.bin'
];

/**
 * Available commands
 */
export const COMMAND_COMMIT = 'commit';
export const COMMAND_RELEASE = 'release';

export const ALLOWED_COMMANDS = [
    COMMAND_COMMIT,
    COMMAND_RELEASE,
];

export const DEFAULT_COMMAND = COMMAND_COMMIT;

/**
 * Default ignore patterns for file operations
 */
export const DEFAULT_IGNORE_PATTERNS = [
    'node_modules/**',
    '**/*.log',
    '.git/**',
    'dist/**',
    'build/**',
    'coverage/**',
    'output/**',
    '.DS_Store',
    '*.tmp',
    '*.cache',
    '**/.kilde-*.json',
];

/**
 * Directory prefix for kilde internal files
 */
export const DEFAULT_DIRECTORY_PREFIX = '.kilde';

/**
 * Date formats
 */
export const DATE_FORMAT_YEAR_MONTH_DAY = 'YYYY-MM-DD';
export const DATE_FORMAT_YEAR_MONTH_DAY_HOURS_MINUTES_SECONDS = 'YYYY-MM-DD-HHmmss';
export const INTERNAL_DATETIME_FORMAT = 'YYYY-MM-DD_HH-mm-ss';

/**
 * Kilde defaults configuration object
 */
export const KILDE_DEFAULTS = {
    dryRun: DEFAULT_DRY_RUN,
    verbose: DEFAULT_VERBOSE,
    debug: DEFAULT_DEBUG,
    model: DEFAULT_MODEL,
    openaiReasoning: DEFAULT_OPENAI_REASONING as 'low' | 'medium' | 'high',
    openaiMaxOutputTokens: DEFAULT_OPENAI_MAX_OUTPUT_TOKENS,
    outputDirectory: DEFAULT_OUTPUT_DIRECTORY,
    configDirectory: DEFAULT_CONFIG_DIR,
    discoveredConfigDirs: [] as string[],
    resolvedConfigDirs: [] as string[],
    excludedPatterns: DEFAULT_EXCLUDED_PATTERNS,
    contextDirectories: [] as string[],
    overrides: false,

    commit: {
        add: DEFAULT_ADD,
        cached: DEFAULT_CACHED,
        sendit: DEFAULT_SENDIT_MODE,
        interactive: DEFAULT_INTERACTIVE_MODE,
        amend: DEFAULT_AMEND_MODE,
        messageLimit: DEFAULT_MESSAGE_LIMIT,
        skipFileCheck: false,
        maxDiffBytes: DEFAULT_MAX_DIFF_BYTES,
        contextFiles: undefined,
        openaiReasoning: DEFAULT_OPENAI_REASONING as 'low' | 'medium' | 'high',
        openaiMaxOutputTokens: DEFAULT_OPENAI_MAX_OUTPUT_TOKENS,
    },

    release: {
        fromTag: undefined,
        toTag: 'HEAD',
        messageLimit: DEFAULT_MESSAGE_LIMIT,
        interactive: DEFAULT_INTERACTIVE_MODE,
        maxDiffBytes: DEFAULT_MAX_DIFF_BYTES,
        contextFiles: undefined,
        openaiReasoning: DEFAULT_OPENAI_REASONING as 'low' | 'medium' | 'high',
        openaiMaxOutputTokens: DEFAULT_OPENAI_MAX_OUTPUT_TOKENS,
    },
};
