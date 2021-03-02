import React, { useEffect, useState } from 'react'
import { StatsService } from '../../services/StatsService'
import { InterfacesData } from './InterfacesData'

export const InterfacesTable = (props: {
  statsService: StatsService
}): JSX.Element => {
  const [data, setData] = useState<InterfacesData>()

  useEffect(() => {
    if (!data) {
      props.statsService.on('interfaces', setData)
    }
    return function cleanup() {
      props.statsService.removeListener('listener', setData)
    }
  }, [data, props.statsService])

  if (!data) {
    return <></>
  }

  const formatThroughput = (n: number) => ((n * 8) / 1000000).toFixed(1)
  const formatInterface = (id: string) =>
    `Tx: ${formatThroughput(
      data.interfaces[id].stats.tx_bps
    )}  Rx: ${formatThroughput(data.interfaces[id].stats.rx_bps)}`
  const formatInterfaceRev = (id: string) =>
    `Tx: ${formatThroughput(
      data.interfaces[id].stats.rx_bps
    )}  Rx: ${formatThroughput(data.interfaces[id].stats.tx_bps)}`

  return (
    <div>
      <pre>{`WAN:    ${formatInterface('eth0')}`}</pre>
      <pre>{`Config: ${formatInterface('eth1')}`}</pre>
      <pre>{`Trunk:  ${formatInterfaceRev('eth2')}`}</pre>
      <pre>{`AP-H2:  ${formatInterfaceRev('eth3')}`}</pre>
      <pre>{`A/V:    ${formatInterfaceRev('eth4')}`}</pre>
    </div>
  )
}
