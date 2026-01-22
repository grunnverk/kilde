import React from 'react';

const GettingStarted: React.FC = () => {
    return (
        <div className="section">
            <h2>Getting Started</h2>

            <div className="grid grid-3">
                <div className="card">
                    <div className="feature-icon">1️⃣</div>
                    <h3>Install</h3>
                    <p>Install Kilde globally via npm:</p>
                    <div className="code-block">
                        <pre>npm install -g @grunnverk/kilde</pre>
                    </div>
                </div>

                <div className="card">
                    <div className="feature-icon">2️⃣</div>
                    <h3>Configure</h3>
                    <p>Set your API key:</p>
                    <div className="code-block">
                        <pre>{`export OPENAI_API_KEY=sk-...`}</pre>
                    </div>
                </div>

                <div className="card">
                    <div className="feature-icon">3️⃣</div>
                    <h3>Use</h3>
                    <p>Generate your first commit:</p>
                    <div className="code-block">
                        <pre>kilde commit</pre>
                    </div>
                </div>
            </div>

            <h3>Quick Example</h3>
            <div className="code-block">
                <pre>{`# Make some changes
echo "export function hello() { return 'world'; }" > hello.ts

# Generate AI-powered commit message
kilde commit --add

# Generated message:
# feat: add hello world function
#
# Implement a basic hello() function that returns
# the string 'world' for greeting functionality.`}</pre>
            </div>

            <h3>Key Features</h3>
            <div className="grid grid-2">
                <div className="card">
                    <h3>🎯 Smart Commits</h3>
                    <p>
            AI analyzes your changes and generates meaningful commit messages
            following Conventional Commits format. Understands context from
            your codebase and suggests appropriate commit types and scopes.
                    </p>
                </div>

                <div className="card">
                    <h3>📝 Release Notes</h3>
                    <p>
            Generate comprehensive release notes from git history. Works with
            any git host, groups changes by type, and creates professional
            documentation automatically.
                    </p>
                </div>

                <div className="card">
                    <h3>🔌 MCP Integration</h3>
                    <p>
            Integrate with Claude Desktop or Claude Code via Model Context
            Protocol. Execute git operations through natural language
            conversation with AI assistants.
                    </p>
                </div>

                <div className="card">
                    <h3>⚙️ Flexible Config</h3>
                    <p>
            Configure via YAML or JSON files. Supports multiple locations,
            deep merge with defaults, and command-line overrides for maximum
            flexibility.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GettingStarted;
