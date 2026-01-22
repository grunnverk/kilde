import React from 'react';

const Commands: React.FC = () => {
    return (
        <div className="section">
            <h2>Commands</h2>
            <p>
        Kilde provides two core commands for git automation: <code className="code-inline">commit</code> and{' '}
                <code className="code-inline">release</code>.
            </p>

            <h3>kilde commit</h3>
            <p>Generate AI-powered commit messages from staged changes.</p>

            <h4>Basic Usage</h4>
            <div className="code-block">
                <pre>{`# Generate message for staged changes
kilde commit

# Stage all changes and generate message
kilde commit --add

# Generate and commit immediately
kilde commit --add --sendit`}</pre>
            </div>

            <h4>Common Flags</h4>
            <div className="grid grid-2">
                <div className="card">
                    <h3>--add / -a</h3>
                    <p>Stage all modified and deleted files before generating the commit message.</p>
                    <div className="code-block">
                        <pre>kilde commit --add</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--sendit / -s</h3>
                    <p>Automatically commit without interactive review.</p>
                    <div className="code-block">
                        <pre>kilde commit --sendit</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--context / -c</h3>
                    <p>Provide additional context to the AI for better commit messages.</p>
                    <div className="code-block">
                        <pre>kilde commit -c "Fix bug #123"</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--interactive / -i</h3>
                    <p>Enable interactive mode to review and edit the generated message.</p>
                    <div className="code-block">
                        <pre>kilde commit --interactive</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--amend</h3>
                    <p>Amend the previous commit instead of creating a new one.</p>
                    <div className="code-block">
                        <pre>kilde commit --amend</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--dry-run</h3>
                    <p>Preview the generated message without committing.</p>
                    <div className="code-block">
                        <pre>kilde commit --dry-run</pre>
                    </div>
                </div>
            </div>

            <h3>kilde release</h3>
            <p>Generate release notes from git history.</p>

            <h4>Basic Usage</h4>
            <div className="code-block">
                <pre>{`# Generate notes for version 1.0.0
kilde release 1.0.0

# Generate notes between tags
kilde release --from v0.9.0 --to v1.0.0

# Generate notes from last tag to HEAD
kilde release`}</pre>
            </div>

            <h4>Common Flags</h4>
            <div className="grid grid-2">
                <div className="card">
                    <h3>--from &lt;ref&gt;</h3>
                    <p>Starting git reference (tag, commit, branch).</p>
                    <div className="code-block">
                        <pre>kilde release --from v1.0.0</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--to &lt;ref&gt;</h3>
                    <p>Ending git reference (tag, commit, branch).</p>
                    <div className="code-block">
                        <pre>kilde release --to HEAD</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--output / -o</h3>
                    <p>Write release notes to a file instead of stdout.</p>
                    <div className="code-block">
                        <pre>kilde release -o RELEASE.md</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--focus</h3>
                    <p>Focus on specific areas (comma-separated).</p>
                    <div className="code-block">
                        <pre>kilde release --focus security</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--interactive / -i</h3>
                    <p>Review and edit release notes before saving.</p>
                    <div className="code-block">
                        <pre>kilde release --interactive</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--dry-run</h3>
                    <p>Preview release notes without saving.</p>
                    <div className="code-block">
                        <pre>kilde release --dry-run</pre>
                    </div>
                </div>
            </div>

            <h3>Global Flags</h3>
            <div className="grid grid-2">
                <div className="card">
                    <h3>--debug</h3>
                    <p>Enable debug logging to see detailed execution information.</p>
                    <div className="code-block">
                        <pre>kilde commit --debug</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--config &lt;path&gt;</h3>
                    <p>Specify a custom configuration file location.</p>
                    <div className="code-block">
                        <pre>kilde commit --config custom.yaml</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--version</h3>
                    <p>Display the installed Kilde version.</p>
                    <div className="code-block">
                        <pre>kilde --version</pre>
                    </div>
                </div>

                <div className="card">
                    <h3>--help</h3>
                    <p>Display help information for any command.</p>
                    <div className="code-block">
                        <pre>kilde commit --help</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Commands;
