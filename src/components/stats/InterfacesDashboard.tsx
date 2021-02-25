import { useEffect, useState } from 'react';
import { InterfaceTile } from './InterfaceTile';
import { StatsService } from '../../services/StatsService';
import { Dashboard } from '@dan-escott/react-dashboard';
import '@dan-escott/react-dashboard/dist/index.css'

export const InterfacesDashboard = (props: { statsService: StatsService }) => {
  const [tiles, setTiles] = useState<string[]>([]);

  useEffect(() => {
    if (tiles.length === 0) {
      setTiles(
        ['eth0', 'eth1', 'eth2', 'eth3', 'eth4']
      );
    }
  }, [tiles.length]);

  return <Dashboard>
      {
        tiles.map(tile => (
          <InterfaceTile key={tile} reverse={tile !== 'eth0'} id={tile} statsService={props.statsService} />
        ))
      }
  </Dashboard>
}
