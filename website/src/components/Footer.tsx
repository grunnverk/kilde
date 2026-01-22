import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Kilde</h3>
                    <p>Universal Git Automation Tool</p>
                    <p className="footer-version">Version 0.1.0</p>
                </div>

                <div className="footer-section">
                    <h4>Documentation</h4>
                    <ul>
                        <li>
                            <a href="https://github.com/grunnverk/kilde#readme" target="_blank" rel="noopener noreferrer">
                README
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/grunnverk/kilde/blob/main/docs/AI_GUIDE.md" target="_blank" rel="noopener noreferrer">
                AI Guide
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/grunnverk/kilde/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">
                Contributing
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Community</h4>
                    <ul>
                        <li>
                            <a href="https://github.com/grunnverk/kilde" target="_blank" rel="noopener noreferrer">
                GitHub
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/grunnverk/kilde/issues" target="_blank" rel="noopener noreferrer">
                Issues
                            </a>
                        </li>
                        <li>
                            <a href="https://www.npmjs.com/package/@grunnverk/kilde" target="_blank" rel="noopener noreferrer">
                npm Package
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Related</h4>
                    <ul>
                        <li>
                            <a href="https://www.conventionalcommits.org/" target="_blank" rel="noopener noreferrer">
                Conventional Commits
                            </a>
                        </li>
                        <li>
                            <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener noreferrer">
                Model Context Protocol
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/grunnverk" target="_blank" rel="noopener noreferrer">
                @grunnverk
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
          © {currentYear} Grunnverk. Licensed under{' '}
                    <a href="https://github.com/grunnverk/kilde/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
            Apache-2.0
                    </a>
                </p>
                <p className="footer-tagline">Built with Claude Sonnet 4.5</p>
            </div>
        </footer>
    );
};

export default Footer;
