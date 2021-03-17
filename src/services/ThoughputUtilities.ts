export const scaleDataVolume = (n: number): number => n / 1000000

export const scaleThroughput = (n: number): number => (n * 8) / 1000000

export const formatThroughput = (n: number): string =>
  scaleThroughput(n).toFixed(1)
