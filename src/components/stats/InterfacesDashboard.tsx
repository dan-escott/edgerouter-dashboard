import React, { useEffect, useState } from 'react'
import { InterfaceTile } from './InterfaceTile'
import { StatsService } from '../../services/StatsService'
import { Dashboard } from '@dan-escott/react-dashboard'
import '@dan-escott/react-dashboard/dist/index.css'
import { Configuration } from '../../services/Configuration'

type TileInfo = {
  id: string
  name: string
}

export const InterfacesDashboard = (props: {
  statsService: StatsService
}): JSX.Element => {
  const [tiles, setTiles] = useState<TileInfo[]>([])

  useEffect(() => {
    if (tiles.length === 0) {
      fetch('/api/edge/get.json')
        .then((response) => response.json())
        .then((json: Configuration) => {
          setTiles(
            Object.keys(json.GET.interfaces.ethernet).map((id) => {
              return {
                id: id,
                name: `${id} - ${json.GET.interfaces.ethernet[id].description}`
              }
            })
          )
        })
    }
  }, [tiles.length])

  return (
    <Dashboard>
      {tiles.map((tile) => (
        <InterfaceTile
          key={tile.id}
          reverse={tile.id !== 'eth0'}
          id={tile.id}
          name={tile.name}
          statsService={props.statsService}
        />
      ))}
    </Dashboard>
  )
}
