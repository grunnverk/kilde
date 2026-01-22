import React from 'react';

const Configuration: React.FC = () => {
    return (
        <div className="section">
            <h2>Configuration</h2>
            <p>
        Kilde supports flexible configuration via YAML or JSON files in multiple locations.
            </p>

            <h3>Configuration Locations</h3>
            <p>Kilde searches for configuration files in this order:</p>
            <div className="card">
                <ol style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)' }}>
                    <li>CLI <code className="code-inline">--config</code> flag</li>
                    <li>Project config: <code className="code-inline">.kilde/config.yaml</code></li>
                    <li>Project root: <code className="code-inline">.kilderc.yaml</code></li>
                    <li>User home: <code className="code-inline">~/.kilde/config.yaml</code></li>
                </ol>
                <p style={{ marginTop: '1rem' }}>
          Files are merged with later files taking precedence, allowing global defaults with project-specific overrides.
                </p>
            </div>

            <h3>Basic Configuration</h3>
            <div className="code-block">
                <pre>{`# .kilde/config.yaml
commit:
  type: conventional
  autoStage: false
  ai:
    model: gpt-4
    temperature: 0.7

release:
  format: markdown
  includeHashes: true`}</pre>
            </div>

            <h3>Commit Configuration</h3>
            <div className="grid grid-2">
                <div className="card">
                    <h3>commit.type</h3>
                    <p>Commit message format style.</p>
                    <div className="code-block">
                        <pre>{`commit:
  type: conventional  # or 'simple'`}</pre>
                    </div>
                    <p>
                        <strong>conventional</strong>: Follows Conventional Commits format
                        <br />
                        <strong>simple</strong>: Plain commit messages
                    </p>
                </div>

                <div className="card">
                    <h3>commit.autoStage</h3>
                    <p>Automatically stage changes before committing.</p>
                    <div className="code-block">
                        <pre>{`commit:
  autoStage: true`}</pre>
                    </div>
                    <p>Equivalent to <code className="code-inline">git add -A</code> before generating message.</p>
                </div>

                <div className="card">
                    <h3>commit.ai.model</h3>
                    <p>AI model to use for commit messages.</p>
                    <div className="code-block">
                        <pre>{`commit:
  ai:
    model: gpt-4  # or gpt-3.5-turbo`}</pre>
                    </div>
                    <p>Supports OpenAI and Anthropic models.</p>
                </div>

                <div className="card">
                    <h3>commit.ai.temperature</h3>
                    <p>Creativity level for AI responses (0.0 to 1.0).</p>
                    <div className="code-block">
                        <pre>{`commit:
  ai:
    temperature: 0.5  # More focused`}</pre>
                    </div>
                    <p>Lower values are more deterministic.</p>
                </div>

                <div className="card">
                    <h3>commit.contextFiles</h3>
                    <p>Files to always include for context.</p>
                    <div className="code-block">
                        <pre>{`commit:
  contextFiles:
    - CHANGELOG.md
    - README.md`}</pre>
                    </div>
                    <p>Provides consistent context to the AI.</p>
                </div>
            </div>

            <h3>Release Configuration</h3>
            <div className="grid grid-2">
                <div className="card">
                    <h3>release.format</h3>
                    <p>Output format for release notes.</p>
                    <div className="code-block">
                        <pre>{`release:
  format: markdown  # or 'plain'`}</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>release.includeHashes</h3>
                    <p>Include commit hashes in release notes.</p>
                    <div className="code-block">
                        <pre>{`release:
  includeHashes: true`}</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>release.groupBy</h3>
                    <p>How to group commits in release notes.</p>
                    <div className="code-block">
                        <pre>{`release:
  groupBy: type  # or 'scope', 'none'`}</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>release.focus</h3>
                    <p>Default focus areas for release notes.</p>
                    <div className="code-block">
                        <pre>{`release:
  focus:
    - features
    - security`}</pre>
                    </div>
                </div>
            </div>

            <h3>Environment Variables</h3>
            <div className="card">
                <h3>API Keys</h3>
                <div className="code-block">
                    <pre>{`# OpenAI
export OPENAI_API_KEY=sk-...

# Anthropic
export ANTHROPIC_API_KEY=sk-ant-...`}</pre>
                </div>

                <h3>Other Variables</h3>
                <div className="code-block">
                    <pre>{`# Override config directory
export KILDE_CONFIG_DIR=/custom/path

# Set log level
export KILDE_LOG_LEVEL=debug`}</pre>
                </div>
            </div>

            <h3>Complete Example</h3>
            <div className="code-block">
                <pre>{`# .kilde/config.yaml
commit:
  type: conventional
  autoStage: false
  autoCommit: false
  autoPush: false
  contextFiles:
    - CHANGELOG.md
    - ARCHITECTURE.md
  ai:
    model: gpt-4
    temperature: 0.7
    maxTokens: 500
  format:
    maxLineLength: 72
    scopeRequired: true

release:
  format: markdown
  includeHashes: true
  includeAuthors: true
  groupBy: type
  focus:
    - features
    - breaking
    - security
  ai:
    model: gpt-4
    temperature: 0.5
    maxTokens: 2000

mcp:
  name: kilde
  version: 0.1.0
  tools:
    - kilde_commit
    - kilde_release
  resources:
    - config
    - status
    - workspace
  prompts:
    - commit-workflow
    - release-workflow`}</pre>
            </div>
        </div>
    );
};

export default Configuration;
