import React, { useEffect, useState } from 'react'
import './App.css'
import { InterfacesDashboard } from './components/stats/InterfacesDashboard'
import { Login } from './components/Login'
import { StatsService } from './services/StatsService'
import { Session, SessionEvent } from './services/Session'

const session = new Session()
const statsService = new StatsService()

const App = (): JSX.Element => {
  const [loggedIn, setLogggedIn] = useState(false)

  useEffect(() => {
    session.on(SessionEvent.Login, (data) => {
      setLogggedIn(true)
      statsService.start(data)
    })

    session.on(SessionEvent.Logout, () => {
      setLogggedIn(false)
      statsService.stop()
    })
  })

  const content = loggedIn ? (
    <InterfacesDashboard statsService={statsService} />
  ) : (
    <Login session={session} />
  )

  return <div className='App'>{content}</div>
}

export default App
