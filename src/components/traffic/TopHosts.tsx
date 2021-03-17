import React, { useEffect, useState } from 'react'
import {
  HostnameService,
  HostnameServiceEvent
} from '../../services/HostnameService'
import { StatsService, StatsServiceEvent } from '../../services/StatsService'
import { formatThroughput } from '../../services/ThoughputUtilities'
import { AddressCategoryData } from './AddressCategoryData'
import { AddressData } from './AddressData'
import { TrafficData } from './TrafficData'

type HostData = {
  address: string
  txBytes: number
  rxBytes: number
  txRate: number
  rxRate: number
  totalRate: number
}

export const TopHosts = (props: {
  statsService: StatsService
  hostnameService: HostnameService
}): JSX.Element => {
  const [data, setData] = useState<HostData[]>()
  const [pinnedHosts, setPinnedHosts] = useState<{ [key: string]: Date }>({})
  const [hostnameVersion, setHostnameVersion] = useState(0)

  const rateThreshold = 10000 // bps
  const retentionPeriod = 30 // seconds

  const incrementHostnameVersion = () => {
    setHostnameVersion(hostnameVersion + 1)
  }

  const onLoadData = (rawData: TrafficData) => {
    const sumData = (
      data: AddressData,
      getValue: (o: AddressCategoryData) => number
    ): number => {
      return Object.values(data).reduce((a, b) => a + (getValue(b) - 0), 0)
    }

    const data = Object.keys(rawData).map((address) => {
      const hostData = {
        address: address,
        txBytes: sumData(rawData[address], (b) => b.tx_bytes),
        rxBytes: sumData(rawData[address], (b) => b.rx_bytes),
        txRate: sumData(rawData[address], (b) => b.tx_rate),
        rxRate: sumData(rawData[address], (b) => b.rx_rate),
        totalRate: sumData(
          rawData[address],
          (b) => b.tx_rate - 0 + (b.rx_rate - 0)
        )
      }
      return hostData
    })

    setData(data)
  }

  useEffect(() => {
    const updatedPinnedHosts = { ...pinnedHosts }
    data?.map((hostData) => {
      if (hostData.totalRate > rateThreshold) {
        updatedPinnedHosts[hostData.address] = new Date(
          Date.now() + retentionPeriod * 1000
        )
      }
      return null
    })
    setPinnedHosts(updatedPinnedHosts)
  }, [data])

  useEffect(() => {
    props.statsService.on(StatsServiceEvent.export, onLoadData)
    props.hostnameService.on(
      HostnameServiceEvent.load,
      incrementHostnameVersion
    )

    props.hostnameService.load()

    return function cleanup() {
      props.statsService.removeListener(StatsServiceEvent.export, onLoadData)
      props.hostnameService.removeListener(
        HostnameServiceEvent.load,
        incrementHostnameVersion
      )
    }
  }, [props])

  if (!data) {
    return <></>
  }

  return (
    <div>
      <h2>Top hosts (Tx/Rx)</h2>
      <ul>
        {data
          .filter(
            (o) =>
              o.totalRate > rateThreshold ||
              (pinnedHosts[o.address] && pinnedHosts[o.address] > new Date())
          )
          .sort((o1, o2) => {
            return o1.totalRate > o2.totalRate ? 1 : -1
          })
          .reverse()
          .map((row) => {
            return (
              <li key={row.address}>
                {props.hostnameService.getName(row.address)} -{' '}
                {formatThroughput(row.txRate)} / {formatThroughput(row.rxRate)}
              </li>
            )
          })}
      </ul>
    </div>
  )
}
