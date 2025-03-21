import React from 'react';
import Dashboard from './Dashboard';
import './styles.css';
import SpaceStation from './SpaceStation';

function App() {
    return (
        <div className="container">
            <h1>🛰️ Space Station Control Center</h1>
            <SpaceStation />
            <Dashboard />
        </div>
    );
}

export default App;
