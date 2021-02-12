import { useEffect, useState } from 'react';
import StatsService from '../../services/StatsService';

type InterfacesData = {
  interfaces: {
    [key: string]: {
      stats: {
        tx_bps: number,
        rx_bps: number
      }
    }
  }
}

export function Interfaces(props: { statsService: StatsService }) {
  const [data, setData] = useState<InterfacesData>();

  useEffect(
    () => {
      if (!data) {
        props.statsService.on('interfaces', setData)
      }
      return function cleanup() {
        props.statsService.removeListener('listener', setData)
      };
    }
  )

  if (!data) {
    return (
      <></>
    );
  }

  const formatThroughput = (n: number) => (n * 8 / 1000000).toFixed(1);
  const formatInterface    = (id: string) => `Tx: ${formatThroughput(data.interfaces[id].stats.tx_bps)}  Rx: ${formatThroughput(data.interfaces[id].stats.rx_bps)}`;
  const formatInterfaceRev = (id: string) => `Tx: ${formatThroughput(data.interfaces[id].stats.rx_bps)}  Rx: ${formatThroughput(data.interfaces[id].stats.tx_bps)}`;

  return (
    <div>
      <pre>{`WAN:    ${formatInterface('eth0')}`}</pre>
      <pre>{`Config: ${formatInterface('eth1')}`}</pre>
      <pre>{`Trunk:  ${formatInterfaceRev('eth2')}`}</pre>
      <pre>{`AP-H2:  ${formatInterfaceRev('eth3')}`}</pre>
      <pre>{`A/V:    ${formatInterfaceRev('eth4')}`}</pre>
    </div>
  );
}
