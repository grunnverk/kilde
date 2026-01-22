import React from 'react';

const Examples: React.FC = () => {
    return (
        <div className="section">
            <h2>Examples</h2>
            <p>Real-world examples of using Kilde in different workflows.</p>

            <h3>Quick Commit Workflow</h3>
            <div className="card">
                <p>Fast iteration with automatic staging and committing:</p>
                <div className="code-block">
                    <pre>{`# Make changes
echo "export const API_URL = 'https://api.example.com';" > config.ts

# Quick commit
kilde commit --add --sendit

# Generated commit:
# feat(config): add API URL configuration
#
# Define API_URL constant for external service integration.`}</pre>
                </div>
            </div>

            <h3>Interactive Review</h3>
            <div className="card">
                <p>Review and edit AI-generated messages:</p>
                <div className="code-block">
                    <pre>{`# Stage changes
git add .

# Generate and review
kilde commit --interactive

# Interactive prompt shows:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# fix(auth): resolve session timeout issue
#
# Update session refresh logic to handle
# edge cases properly.
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# [a] Accept  [e] Edit  [r] Regenerate  [c] Cancel`}</pre>
                </div>
            </div>

            <h3>Commit with Context</h3>
            <div className="card">
                <p>Provide additional context for better messages:</p>
                <div className="code-block">
                    <pre>{`# Complex change that needs context
kilde commit --add --context "Implement rate limiting per issue #456"

# Generated commit:
# feat(api): implement rate limiting
#
# Add rate limiting middleware to prevent API abuse.
# Implements the solution proposed in issue #456 with
# a token bucket algorithm.`}</pre>
                </div>
            </div>

            <h3>Release Notes Generation</h3>
            <div className="card">
                <p>Generate release notes for a new version:</p>
                <div className="code-block">
                    <pre>{`# Generate notes for v2.0.0
kilde release 2.0.0 --output RELEASE_NOTES.md

# Generated content in RELEASE_NOTES.md:
# # Release v2.0.0
#
# ## Features
# - Add OAuth2 authentication
# - Implement user profile management
# - Add role-based access control
#
# ## Bug Fixes
# - Fix session timeout handling
# - Resolve memory leak in auth service
#
# ## Breaking Changes
# - API endpoints now require authentication
# - Update minimum Node.js version to 18`}</pre>
                </div>
            </div>

            <h3>Release Notes Between Tags</h3>
            <div className="card">
                <p>Generate notes for a specific range:</p>
                <div className="code-block">
                    <pre>{`# Notes between two versions
kilde release --from v1.9.0 --to v2.0.0 --interactive

# Focus on security changes
kilde release 2.0.0 --focus security,breaking`}</pre>
                </div>
            </div>

            <h3>MCP Integration with Claude</h3>
            <div className="card">
                <p>Use Kilde through Claude Desktop:</p>
                <div className="code-block">
                    <pre>{`You: Create a commit for my staged changes

Claude: I'll generate a commit message using Kilde.

[Uses kilde_commit tool]

Generated commit message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
feat(auth): add OAuth2 authentication

Implement OAuth2 flow with support for
Google and GitHub providers. Includes
token refresh and secure storage.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Would you like me to create this commit?

You: Yes

Claude: Commit created successfully!`}</pre>
                </div>
            </div>

            <h3>Amend Previous Commit</h3>
            <div className="card">
                <p>Fix or update the last commit:</p>
                <div className="code-block">
                    <pre>{`# Made a mistake in last commit
echo "// Fixed typo" >> auth.ts

# Amend the commit
kilde commit --add --amend

# The AI will generate an updated message
# that incorporates both the original and new changes`}</pre>
                </div>
            </div>

            <h3>Dry Run Testing</h3>
            <div className="card">
                <p>Preview generated messages without committing:</p>
                <div className="code-block">
                    <pre>{`# Test commit message generation
kilde commit --add --dry-run

# Output shows:
# - Generated commit message
# - Affected files
# - Diff summary
# - Configuration used
#
# No actual commit is created`}</pre>
                </div>
            </div>

            <h3>Complete Release Workflow</h3>
            <div className="card">
                <p>Full release process with tagging and pushing:</p>
                <div className="code-block">
                    <pre>{`# 1. Ensure all changes are committed
git status

# 2. Generate release notes interactively
kilde release 1.5.0 --interactive --output RELEASE_NOTES.md

# 3. Review and commit release notes
git add RELEASE_NOTES.md
kilde commit --sendit

# 4. Create and push tag
git tag v1.5.0
git push origin main --tags

# 5. Create GitHub release (optional)
gh release create v1.5.0 --notes-file RELEASE_NOTES.md`}</pre>
                </div>
            </div>

            <h3>Language-Agnostic Usage</h3>
            <div className="card">
                <p>Works with any programming language:</p>
                <div className="code-block">
                    <pre>{`# Python project
cd my-python-app
kilde commit --add

# Go project
cd my-go-service
kilde commit --add

# Rust project
cd my-rust-lib
kilde commit --add

# Java project
cd my-java-api
kilde commit --add

# All generate appropriate commit messages
# based on the actual code changes, regardless
# of the programming language`}</pre>
                </div>
            </div>

            <h3>Team Configuration</h3>
            <div className="card">
                <p>Share configuration across your team:</p>
                <div className="code-block">
                    <pre>{`# Commit team config to repository
# .kilde/config.yaml
commit:
  type: conventional
  format:
    maxLineLength: 72
    scopeRequired: true
  contextFiles:
    - ARCHITECTURE.md

# Individual developers can override in ~/.kilde/config.yaml
commit:
  autoStage: true  # Personal preference
  ai:
    model: gpt-3.5-turbo  # Faster for dev work`}</pre>
                </div>
            </div>
        </div>
    );
};

export default Examples;
