import React, { useState, useEffect, useRef } from 'react'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { Tile, TileStatus } from '@dan-escott/react-dashboard'
import { StatsService, StatsServiceEvent } from '../../services/StatsService'
import { TimeseriesCache } from '../../data/TimeseriesCache'
import { InterfacesData } from './InterfacesData'
import { scaleThroughput } from '../../services/ThoughputUtilities'

type InterfaceTileProps = {
  id: string
  name: string
  reverse: boolean
  statsService: StatsService
}

const historyTimespan = 5 * 60 * 1000

type HistoryValue = {
  x: Date
  y: number
}

const getSparklineData = (history: HistoryValue[][]) => {
  return {
    series: [
      {
        data: history[0],
        min: 0,
        max: 10
      },
      {
        data: history[1],
        min: 0,
        max: 10
      }
    ],
    xmin: new Date(Date.now() - historyTimespan),
    xmax: new Date()
  }
}

const getMetrics = (id: string, reverse: boolean, status?: InterfacesData) => {
  const metrics = []

  if (status) {
    const stats = status[id].stats
    const upstream = reverse ? stats.rx_bps : stats.tx_bps
    const downstream = reverse ? stats.tx_bps : stats.rx_bps
    metrics.push({
      id: 'Tx',
      value: scaleThroughput(upstream),
      uom: 'Mbps',
      icon: faArrowUp,
      formatter: (d: number) => d.toFixed(1)
    })
    metrics.push({
      id: 'Rx',
      value: scaleThroughput(downstream),
      uom: 'Mbps',
      icon: faArrowDown,
      formatter: (d: number) => d.toFixed(1)
    })
  }

  return metrics
}

export const InterfaceTile = (props: InterfaceTileProps): JSX.Element => {
  const [status, setStatus] = useState<InterfacesData>()
  const [healthy] = useState(true)
  const [history, setHistory] = useState<HistoryValue[][]>([[], []])
  const downstreamCache = useRef(
    new TimeseriesCache<number>(historyTimespan * 1.1)
  )
  const upstreamCache = useRef(
    new TimeseriesCache<number>(historyTimespan * 1.1)
  )

  useEffect(() => {
    const onStatusChange = (data: InterfacesData) => {
      const stats = data[props.id].stats
      const downstream = props.reverse ? stats.tx_bps : stats.rx_bps
      const upstream = props.reverse ? stats.rx_bps : stats.tx_bps

      downstreamCache.current.push({
        x: new Date(),
        y: scaleThroughput(downstream)
      })
      upstreamCache.current.push({
        x: new Date(),
        y: scaleThroughput(upstream)
      })
      setHistory([
        downstreamCache.current.history(),
        upstreamCache.current.history()
      ])
      setStatus(data)
    }

    props.statsService.on(StatsServiceEvent.interfaces, onStatusChange)

    return function cleanup() {
      props.statsService.removeListener(
        StatsServiceEvent.interfaces,
        onStatusChange
      )
    }
  }, [props])

  return (
    <Tile
      title={props.name}
      status={healthy ? undefined : TileStatus.Stale}
      metrics={{ data: getMetrics(props.id, props.reverse, status) }}
      sparkline={getSparklineData(history)}
    />
  )
}
