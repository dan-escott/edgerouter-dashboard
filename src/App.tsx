import React, { useEffect, useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { InterfacesDashboard } from './components/stats/InterfacesDashboard'
import { Login } from './components/Login'
import { StatsService } from './services/StatsService'
import { Session, SessionEvent } from './services/Session'
import { TopHosts } from './components/traffic/TopHosts'
import { Treemap } from './components/traffic/TrafficTreemap'
import { HostnameService } from './services/HostnameService'

import 'react-tabs/style/react-tabs.css'
import './App.css'

const session = new Session()
const statsService = new StatsService()
const hostnameService = new HostnameService()

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
    <>
      <Tabs>
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>Analysis</Tab>
        </TabList>
        <TabPanel forceRender>
          <InterfacesDashboard statsService={statsService} />
          <TopHosts
            statsService={statsService}
            hostnameService={hostnameService}
          />
        </TabPanel>
        <TabPanel>
          <Treemap
            statsService={statsService}
            hostnameService={hostnameService}
          />
        </TabPanel>
      </Tabs>
    </>
  ) : (
    <Login session={session} />
  )

  return <div className='App'>{content}</div>
}

export default App
