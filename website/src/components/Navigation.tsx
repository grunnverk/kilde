import React from 'react';
import './Navigation.css';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate }) => {
    return (
        <nav className="navigation">
            <div className="nav-container">
                <div className="nav-brand">
                    <h1>Kilde</h1>
                    <span className="nav-tagline">Universal Git Automation</span>
                </div>

                <div className="nav-links">
                    <button
                        className={activeSection === 'home' ? 'active' : ''}
                        onClick={() => onNavigate('home')}
                    >
            Home
                    </button>
                    <button
                        className={activeSection === 'commands' ? 'active' : ''}
                        onClick={() => onNavigate('commands')}
                    >
            Commands
                    </button>
                    <button
                        className={activeSection === 'configuration' ? 'active' : ''}
                        onClick={() => onNavigate('configuration')}
                    >
            Configuration
                    </button>
                    <button
                        className={activeSection === 'examples' ? 'active' : ''}
                        onClick={() => onNavigate('examples')}
                    >
            Examples
                    </button>
                    <a
                        href="https://github.com/grunnverk/kilde"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-github"
                    >
            GitHub
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
