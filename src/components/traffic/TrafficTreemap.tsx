import React, { useEffect, useState } from 'react'
import { StatsService, StatsServiceEvent } from '../../services/StatsService'
import ChartComponent from 'react-chartjs-2'
import 'chartjs-chart-treemap'
import { TrafficData } from './TrafficData'
import {
  scaleThroughput,
  scaleDataVolume
} from '../../services/ThoughputUtilities'
import {
  HostnameService,
  HostnameServiceEvent
} from '../../services/HostnameService'
import styles from './TrafficTreemap.module.css'

export const Treemap = (props: {
  statsService: StatsService
  hostnameService: HostnameService
}): JSX.Element => {
  const [hostnameVersion, setHostnameVersion] = useState(0)
  const [treemapData, setTreemapData] = useState<unknown>()
  const [treemapOptions] = useState({
    maintainAspectRatio: false,
    plugins: { datalabels: false },
    title: { display: false },
    legend: { display: false },
    animation: { duration: 0 },
    tooltips: {
      callbacks: {
        title: function (
          item: { datasetIndex: number }[],
          data: { datasets: { key: string }[] }
        ) {
          return data.datasets[item[0].datasetIndex].key
        },
        label: function (
          item: { datasetIndex: number; index: number },
          data: {
            datasets: {
              data: {
                v: number
                _data: {
                  category: string
                  categoryGroup: string
                  hostname: string
                }
              }[]
            }[]
          }
        ) {
          const dataset = data.datasets[item.datasetIndex]
          const dataItem = dataset.data[item.index]
          const obj = dataItem._data
          const label = obj.category || obj.categoryGroup || obj.hostname
          return label + ': ' + dataItem.v.toFixed(0) + ' MB'
        }
      }
    }
  })

  const processData = (data: TrafficData): void => {
    const tree: {
      hostname: string
      category: string
      categoryGroup: string
      txRate: number
      txTotal: number
      rxRate: number
      rxTotal: number
      Rate: number
      Total: number
    }[] = []
    Object.keys(data).map((address) => {
      Object.keys(data[address]).map((category) => {
        tree.push({
          hostname: props.hostnameService.getName(address),
          category: props.hostnameService.getName(address) + category,
          categoryGroup:
            props.hostnameService.getName(address) + category.split('|')[1],
          txRate: scaleThroughput(data[address][category].tx_rate) / 8,
          txTotal: scaleDataVolume(data[address][category].tx_bytes) / 8,
          rxRate: scaleThroughput(data[address][category].rx_rate) / 8,
          rxTotal: scaleDataVolume(data[address][category].rx_bytes) / 8,
          Rate:
            scaleThroughput(data[address][category].tx_rate) +
            scaleThroughput(data[address][category].rx_rate),
          Total:
            scaleDataVolume(data[address][category].tx_bytes) +
            scaleDataVolume(data[address][category].rx_bytes)
        })
        return null
      })
      return null
    })

    setTreemapData({
      datasets: [
        {
          tree: tree,
          key: 'Total',
          groups: ['hostname', 'categoryGroup', 'category'],
          groupLabels: true,
          fontColor: 'black',
          backgroundColor: function (ctx: {
            dataIndex: number
            dataset: { data: { l: number; g: string }[] }
          }) {
            const item = ctx.dataset.data[ctx.dataIndex]
            if (!item) {
              return
            }
            let rgb: { r: number; g: number; b: number }
            switch (item.l) {
              case 0:
                switch (item.g) {
                  case 'Midwest':
                    rgb = { r: 67, g: 99, b: 216 }
                    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                  case 'Northeast':
                    rgb = { r: 70, g: 153, b: 144 }
                    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                  case 'South':
                    rgb = { r: 154, g: 99, b: 36 }
                    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                  case 'West':
                    rgb = { r: 245, g: 130, b: 49 }
                    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                  default:
                    rgb = { r: 230, g: 190, b: 255 }
                    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                }
              case 1:
                // next group header
                return 'rgb(255,255,255,0.3)' // Color('white').alpha(0.3).rgbString()
              default:
                // most granular item
                return `rgba(255, 255, 255, 0.3)` // Color('green').alpha(a).rgbString()
            }
          },
          spacing: -1,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.3)',
          color: '#FFF',
          hoverColor: 'blue',
          font: {
            family: 'Tahoma',
            size: 8,
            style: 'bold'
          },
          hoverFont: {
            family: 'Tahoma',
            size: 8,
            style: 'bold'
          }
        }
      ]
    })
  }

  const incrementHostnameVersion = () => {
    setHostnameVersion(hostnameVersion + 1)
  }

  useEffect(() => {
    if (treemapData) {
      return
    }

    const onStatusChange = (data: TrafficData) => {
      processData(data)

      // todo don't want to do this to get live stats
      props.statsService.removeListener(
        StatsServiceEvent.export,
        onStatusChange
      )
    }

    props.statsService.on(StatsServiceEvent.export, onStatusChange)
    props.hostnameService.on(
      HostnameServiceEvent.load,
      incrementHostnameVersion
    )

    props.hostnameService.load()

    return function cleanup() {
      props.statsService.removeListener(
        StatsServiceEvent.export,
        onStatusChange
      )
      props.hostnameService.removeListener(
        StatsServiceEvent.export,
        incrementHostnameVersion
      )
    }
  }, [props])

  if (!treemapData) {
    return <></>
  }

  return (
    <div>
      <h2>Treemap</h2>
      <div className={styles.trafficTreemap}>
        <ChartComponent
          data={treemapData}
          options={treemapOptions}
          height={10}
          width={10}
          type='treemap'
        />
      </div>
    </div>
  )
}
