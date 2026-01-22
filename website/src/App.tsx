import React, { useState } from 'react';
import './App.css';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import GettingStarted from './components/GettingStarted';
import Commands from './components/Commands';
import Configuration from './components/Configuration';
import Examples from './components/Examples';
import Footer from './components/Footer';

function App() {
    const [activeSection, setActiveSection] = useState('home');

    return (
        <div className="app">
            <Navigation activeSection={activeSection} onNavigate={setActiveSection} />

            {activeSection === 'home' && (
                <>
                    <Hero />
                    <GettingStarted />
                </>
            )}

            {activeSection === 'commands' && <Commands />}
            {activeSection === 'configuration' && <Configuration />}
            {activeSection === 'examples' && <Examples />}

            <Footer />
        </div>
    );
}

export default App;
