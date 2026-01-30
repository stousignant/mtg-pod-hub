import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPlayerCount(count: number): string {
  const plural = count === 1 ? 'player' : 'players'
  return `${count} ${plural}`
}

/**
 * Calculate Olympic-style ranks where tied entries get the same rank
 * and the next rank skips accordingly (e.g., 1, 1, 3, 4)
 */
export function calculateOlympicRanks<T extends { points: number }>(
  data: T[]
): (T & { rank: number })[] {
  const rankedData: (T & { rank: number })[] = []
  let currentRank = 1

  for (let i = 0; i < data.length; i++) {
    if (i > 0 && data[i].points !== data[i - 1].points) {
      currentRank = i + 1
    }
    rankedData.push({ ...data[i], rank: currentRank })
  }

  return rankedData
}

/**
 * Calculate the percentile value from an array of numbers
 * Uses linear interpolation between closest ranks
 */
export function calculatePercentile(
  values: number[],
  percentile: number
): number {
  if (values.length === 0) return 0

  const sorted = [...values].sort((a, b) => a - b)
  const index = (percentile / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower

  if (lower === upper) return sorted[lower]
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}
