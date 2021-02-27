import { useState, useEffect, useRef } from 'react';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { Tile, TileStatus } from '@dan-escott/react-dashboard';
import { StatsService } from '../../services/StatsService';
import { TimeseriesCache } from '../../data/TimeseriesCache';
import { InterfacesData } from "./InterfacesData";

type InterfaceTileProps = {
  id: string;
  name: string;
  reverse: boolean;
  statsService: StatsService;
}

const historyTimespan = 5 * 60 * 1000;

export const InterfaceTile =  (props: InterfaceTileProps) => {

  const [status, setStatus] = useState<InterfacesData>();
  const [healthy] = useState(true);
  const [history, setHistory] = useState<any[][]>([[], []]);
  const downstreamCache = useRef(new TimeseriesCache<Number>(historyTimespan * 1.1));
  const upstreamCache = useRef(new TimeseriesCache<Number>(historyTimespan * 1.1));

  useEffect(
    () => {
      
      const onStatusChange = (data: InterfacesData) => {
        const stats = data.interfaces[props.id].stats;
        const downstream = props.reverse ? stats.tx_bps : stats.rx_bps;
        const upstream = props.reverse ? stats.rx_bps : stats.tx_bps;

        downstreamCache.current.push({ x: new Date(), y: formatThroughput(downstream) });
        upstreamCache.current.push({ x: new Date(), y: formatThroughput(upstream) });
        setHistory([downstreamCache.current.history(), upstreamCache.current.history()]);
        setStatus(data);
      }

      props.statsService.on('interfaces', onStatusChange);

      return function cleanup() {
        props.statsService.removeListener('interfaces', onStatusChange);
      };
    }, [props]
  )

  return (
    <Tile
      title={props.id}
      status={healthy ? undefined : TileStatus.Stale}
      metrics={{ data: getMetrics(props.id, props.reverse, status) }}
      sparkline={getSparklineData(history)} />
  );
}

const getSparklineData = (history: any[]) => {
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
    }],
    xmin: new Date(Date.now() - historyTimespan),
    xmax: new Date()
  }
};

const formatThroughput = (n: number) => (n * 8 / 1000000);

const getMetrics = (id: string, reverse: boolean, status?: InterfacesData) => {
    
  const metrics = [];
  
  if (status) {
    const stats = status.interfaces[id].stats;
    const upstream = reverse ? stats.rx_bps : stats.tx_bps;
    const downstream = reverse ? stats.tx_bps : stats.rx_bps;
    metrics.push({ id: "Tx", value: formatThroughput(upstream), uom: "Mbps", icon: faArrowUp, formatter: (d: Number) => d.toFixed(1) })
    metrics.push({ id: "Rx", value: formatThroughput(downstream), uom: "Mbps", icon: faArrowDown, formatter: (d: Number) => d.toFixed(1) })
  }

  return metrics;
}
