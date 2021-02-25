import { TimeseriesCache } from "./TimeseriesCache"

it('should prune everything if oldest date is in the future', () => {
    const cache = new TimeseriesCache(0)
    cache.push({ x: new Date(), y: 1 })
    cache.prune(new Date(Date.now() + 1000))

    expect(cache.history().length).toBe(0);
})

it('should prune nothing if oldest date is older than data', () => {
    const cache = new TimeseriesCache(0)
    cache.push({ x: new Date(Date.now() + 1000), y: 1 })
    cache.prune(new Date())

    expect(cache.history().length).toBe(1);
})

it('should prune data older than oldest date', () => {
    const cache = new TimeseriesCache(0)
    cache.push({ x: new Date(Date.now() + 1000), y: 1 })
    cache.push({ x: new Date(Date.now() + 2000), y: 1 })
    
    cache.prune(new Date(Date.now() + 1500))

    expect(cache.history().length).toBe(1);
})