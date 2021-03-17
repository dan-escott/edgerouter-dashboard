import EventEmitter from 'events'
import { Hostnames } from './Hostnames'

export enum HostnameServiceEvent {
  load = 'load'
}

export class HostnameService extends EventEmitter {
  #hostnames: Hostnames = {}

  getName = (address: string): string => {
    return this.#hostnames[address] ? this.#hostnames[address] : address
  }

  load = (): void => {
    fetch(`${process.env.PUBLIC_URL}/config/hostnames.json`)
      .then((response) => response.json())
      .then((json: Hostnames) => {
        this.#hostnames = json
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
