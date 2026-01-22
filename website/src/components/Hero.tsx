import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
    return (
        <div className="hero">
            <div className="hero-content">
                <h1 className="hero-title">
          Universal Git Automation
                </h1>
                <p className="hero-subtitle">
          AI-powered commit messages and release notes for any git repository,
          regardless of programming language or hosting platform.
                </p>

                <div className="hero-features">
                    <div className="hero-feature">
                        <span className="feature-emoji">🌍</span>
                        <span>Language-Agnostic</span>
                    </div>
                    <div className="hero-feature">
                        <span className="feature-emoji">🤖</span>
                        <span>AI-Powered</span>
                    </div>
                    <div className="hero-feature">
                        <span className="feature-emoji">🔌</span>
                        <span>MCP Integration</span>
                    </div>
                </div>

                <div className="hero-actions">
                    <a href="https://www.npmjs.com/package/@grunnverk/kilde" className="button">
            Get Started
                    </a>
                    <a href="https://github.com/grunnverk/kilde" className="button button-secondary">
            View on GitHub
                    </a>
                </div>

                <div className="hero-install">
                    <div className="code-block">
                        <pre>npm install -g @grunnverk/kilde</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
