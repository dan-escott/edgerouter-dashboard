import React, { useEffect, useState } from 'react';
import './App.css';
import { InterfacesDashboard } from './components/stats/InterfacesDashboard';
import { Login } from './components/Login';
import { StatsService } from './services/StatsService';

const statsService = new StatsService()

function App() {

  const [loggedIn, setLogggedIn] = useState(false);

  useEffect(
    () => {
      statsService.on('login', () => {
          setLogggedIn(true);
        }
      );
    }
  )

  const content = loggedIn ?
    (<InterfacesDashboard statsService={statsService} />) :
    (<Login statsService={statsService} />)

  return (
    <div className="App">
      {content}
    </div>
  );
}

export default App;
