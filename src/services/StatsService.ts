import EventEmitter from 'events'
import { BufferedReader } from './BufferedReader'

export enum StatsServiceEvent {
  export = 'export', // traffic by source IP
  discover = 'discover', // device info, IPs and MACs
  interfaces = 'interfaces',
  'system-stats' = 'system-stats',
  'num-routes' = 'num-routes',
  'config-change' = 'config-change',
  users = 'users'
}

export class StatsService extends EventEmitter {
  #buffer
  #ws?: WebSocket

  constructor() {
    super()

    this.#buffer = new BufferedReader()
    this.#buffer.on('message', this.#processData)
  }

  start = (session: string): void => {
    if (this.#ws) {
      console.info('Stats stream already started')
      return
    }

    const serverLocation = window.location
    const protocol = serverLocation.protocol === 'https:' ? 'wss:' : 'ws:'

    this.#ws = new WebSocket(`${protocol}//${serverLocation.host}/ws/stats`)
    this.#ws.onmessage = (event) => this.#buffer.receive(event.data)
    this.#ws.addEventListener('error', (err) => console.error(err))
    this.#ws.onopen = () => {
      this.#subscribe(session)
    }
  }

  stop = (): void => {
    if (this.#ws) {
      this.#ws.close()
      this.#ws = undefined
    }
  }

  #subscribe = (session: string): void => {
    const subscription = {
      SUBSCRIBE: [{ name: StatsServiceEvent.interfaces }],
      UNSUBSCRIBE: [],
      SESSION_ID: session
    }
    let subscriptionPayload = JSON.stringify(subscription)
    subscriptionPayload =
      subscriptionPayload.length + '\n' + subscriptionPayload

    this.#ws
      ? this.#ws.send(subscriptionPayload)
      : console.error('WebSocket is null')
  }

  #processData = (data: unknown): void => {
    const key = Object.keys(data as string)[0] as keyof typeof StatsServiceEvent
    const eventType = StatsServiceEvent[key]
    if (eventType === undefined) {
      console.warn(`Ignoring stats event key ${key}`)
      return
    }

    this.emit(StatsServiceEvent[key], data)
  }
}
