import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { getLogger } from '../logging';
import { Config } from '@grunnverk/core';
import { KILDE_DEFAULTS } from '../constants';

const CONFIG_FILES = [
    '.kilde/config.yaml',
    '.kilde/config.yml',
    '.kilderc.yaml',
    '.kilderc.yml',
    '.kilderc.json',
    'kilde.config.json',
];

/**
 * Load configuration from file
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<Config | null> {
    const logger = getLogger();

    for (const filename of CONFIG_FILES) {
        const configPath = path.join(cwd, filename);

        try {
            const content = await fs.readFile(configPath, 'utf-8');

            let config: any;
            if (filename.endsWith('.json')) {
                config = JSON.parse(content);
            } else if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
                config = yaml.load(content);
            } else {
                // Try JSON first, then YAML
                try {
                    config = JSON.parse(content);
                } catch {
                    config = yaml.load(content);
                }
            }

            // Return config as-is
            logger.verbose(`Loaded configuration from ${configPath}`);
            return config as Config;
        } catch (error: any) {
            if (error.code !== 'ENOENT') {
                logger.warn(`CONFIG_LOAD_FAILED: Failed to load configuration file | Path: ${configPath} | Error: ${error.message} | Action: Using defaults`);
            }
        }
    }

    logger.verbose('No configuration file found, using defaults');
    return null;
}

/**
 * Get default configuration
 */
export function getDefaultConfig(): Config {
    return KILDE_DEFAULTS;
}

/**
 * Deep merge two objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const result = { ...target };

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = result[key];

            if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) &&
                targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
                result[key] = deepMerge(targetValue, sourceValue) as any;
            } else if (sourceValue !== undefined) {
                result[key] = sourceValue as any;
            }
        }
    }

    return result;
}

/**
 * Merge loaded config with defaults
 */
export function mergeWithDefaults(config: Config | null): Config {
    const defaults = getDefaultConfig();

    if (!config) {
        return defaults;
    }

    return deepMerge(defaults, config);
}

/**
 * Get effective configuration (loaded + defaults)
 */
export async function getEffectiveConfig(cwd: string = process.cwd()): Promise<Config> {
    const loaded = await loadConfig(cwd);
    return mergeWithDefaults(loaded);
}

/**
 * Create a sample configuration file
 */
export function createSampleConfig(): string {
    const config = {
        // Global settings
        verbose: false,
        debug: false,
        model: 'gpt-4o-mini',
        openaiReasoning: 'low',
        outputDirectory: 'output/kilde',

        // Commit configuration
        commit: {
            sendit: false,
            interactive: false,
            messageLimit: 3,
            maxDiffBytes: 20480,
        },

        // Release configuration
        release: {
            interactive: false,
            messageLimit: 3,
            maxDiffBytes: 20480,
        },
    };

    return yaml.dump(config, {
        indent: 2,
        lineWidth: 100,
        noRefs: true,
    });
}

/**
 * Save sample configuration to file
 */
export async function saveSampleConfig(cwd: string = process.cwd()): Promise<string> {
    const logger = getLogger();
    const configDir = path.join(cwd, '.kilde');
    const configPath = path.join(configDir, 'config.yaml');

    try {
        // Create directory if it doesn't exist
        await fs.mkdir(configDir, { recursive: true });

        // Write sample config
        const sampleConfig = createSampleConfig();
        await fs.writeFile(configPath, sampleConfig, 'utf-8');

        logger.info(`Created sample configuration file at ${configPath}`);
        return configPath;
    } catch (error: any) {
        logger.error(`Failed to create sample configuration: ${error.message}`);
        throw error;
    }
}

/**
 * Check if configuration file exists
 */
export async function configFileExists(cwd: string = process.cwd()): Promise<boolean> {
    for (const filename of CONFIG_FILES) {
        const configPath = path.join(cwd, filename);
        try {
            await fs.access(configPath);
            return true;
        } catch {
            // File doesn't exist, continue checking
        }
    }
    return false;
}
