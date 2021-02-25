import React from 'react';
import './App.css';
import { InterfacesDashboard } from './components/stats/InterfacesDashboard';
import { Login } from './components/Login';
import { StatsService } from './services/StatsService';

const statsService = new StatsService()

function App() {
  return (
    <div className="App">
      <Login statsService={statsService} />
      <br />
      <InterfacesDashboard statsService={statsService} />
    </div>
  );
}

export default App;
