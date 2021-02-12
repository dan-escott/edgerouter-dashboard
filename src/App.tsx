import React from 'react';
import './App.css';
import { Login } from './components/Login';
import { Interfaces } from './components/stats/Interfaces';
import StatsService from './services/StatsService';

export const stats = new StatsService()

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Login statsService={stats} />
        <Interfaces statsService={stats} />
      </header>
    </div>
  );
}

export default App;
