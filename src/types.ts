import { z } from "zod";

/**
 * Configuration schema for Kilde
 * Simplified for commit and release commands only
 */
export const ConfigSchema = z.object({
    dryRun: z.boolean().optional(),
    verbose: z.boolean().optional(),
    debug: z.boolean().optional(),
    model: z.string().optional(),
    openaiReasoning: z.enum(['low', 'medium', 'high']).optional(),
    openaiMaxOutputTokens: z.number().optional(),
    outputDirectory: z.string().optional(),
    configDirectory: z.string().optional(),
    discoveredConfigDirs: z.array(z.string()).optional(),
    resolvedConfigDirs: z.array(z.string()).optional(),
    excludedPatterns: z.array(z.string()).optional(),
    contextDirectories: z.array(z.string()).optional(),
    overrides: z.boolean().optional(),
    stopContext: z.any().optional(),

    // Commit configuration
    commit: z.object({
        add: z.boolean().optional(),
        cached: z.boolean().optional(),
        sendit: z.boolean().optional(),
        interactive: z.boolean().optional(),
        amend: z.boolean().optional(),
        push: z.union([z.boolean(), z.string()]).optional(),
        messageLimit: z.number().optional(),
        context: z.string().optional(),
        contextFiles: z.array(z.string()).optional(),
        direction: z.string().optional(),
        skipFileCheck: z.boolean().optional(),
        maxDiffBytes: z.number().optional(),
        model: z.string().optional(),
        openaiReasoning: z.enum(['low', 'medium', 'high']).optional(),
        openaiMaxOutputTokens: z.number().optional(),
        maxAgenticIterations: z.number().optional(),
        allowCommitSplitting: z.boolean().optional(),
        autoSplit: z.boolean().optional(),
        toolTimeout: z.number().optional(),
        selfReflection: z.boolean().optional(),
    }).optional(),

    // Release configuration (pure git only)
    release: z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        fromTag: z.string().optional(),
        toTag: z.string().optional(),
        version: z.string().optional(),
        output: z.string().optional(),
        messageLimit: z.number().optional(),
        context: z.string().optional(),
        contextFiles: z.array(z.string()).optional(),
        interactive: z.boolean().optional(),
        focus: z.string().optional(),
        maxDiffBytes: z.number().optional(),
        model: z.string().optional(),
        openaiReasoning: z.enum(['low', 'medium', 'high']).optional(),
        openaiMaxOutputTokens: z.number().optional(),
        maxAgenticIterations: z.number().optional(),
        selfReflection: z.boolean().optional(),
    }).optional(),
});

export const SecureConfigSchema = z.object({
    openaiApiKey: z.string().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;
export type SecureConfig = z.infer<typeof SecureConfigSchema>;

/**
 * Commit configuration type
 */
export type CommitConfig = {
    add?: boolean;
    cached?: boolean;
    sendit?: boolean;
    interactive?: boolean;
    amend?: boolean;
    push?: string | boolean;
    messageLimit?: number;
    context?: string;
    contextFiles?: string[];
    direction?: string;
    skipFileCheck?: boolean;
    maxDiffBytes?: number;
    model?: string;
    openaiReasoning?: 'low' | 'medium' | 'high';
    openaiMaxOutputTokens?: number;
    maxAgenticIterations?: number;
    allowCommitSplitting?: boolean;
    autoSplit?: boolean;
    toolTimeout?: number;
    selfReflection?: boolean;
}

/**
 * Release configuration type (pure git only)
 */
export type ReleaseConfig = {
    from?: string;
    to?: string;
    fromTag?: string;
    toTag?: string;
    version?: string;
    output?: string;
    context?: string;
    contextFiles?: string[];
    interactive?: boolean;
    focus?: string;
    messageLimit?: number;
    maxDiffBytes?: number;
    model?: string;
    openaiReasoning?: 'low' | 'medium' | 'high';
    openaiMaxOutputTokens?: number;
    maxAgenticIterations?: number;
    selfReflection?: boolean;
}

/**
 * Release summary returned by AI
 */
export type ReleaseSummary = {
    title: string;
    body: string;
}
