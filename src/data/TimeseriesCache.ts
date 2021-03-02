export class TimeseriesCache<T> {
  #maxAge: number
  #history: { x: Date; y: T }[] = []

  constructor(maxAge: number) {
    this.#maxAge = maxAge
  }

  push = (value: { x: Date; y: T }) => {
    this.prune()
    this.#history.push(value)
  }

  history = () => this.#history

  prune = (oldestDateToKeep = new Date(Date.now() - this.#maxAge)) => {
    const oldestItemToKeep = this.#history.findIndex(
      (o) => o.x > oldestDateToKeep
    )
    this.#history =
      oldestItemToKeep < 0
        ? []
        : this.#history.slice(oldestItemToKeep, this.#history.length)
  }
}
