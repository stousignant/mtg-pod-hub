import { useMemo } from 'react'
import type { GameHistoryEntry } from '@/data/mockData'
import {
  calculateDeckStreaks,
  type DeckStreaks,
} from '@/lib/streakCalculations'

export const useDeckStreaks = (
  gameHistory: GameHistoryEntry[]
): DeckStreaks[] => {
  return useMemo(() => {
    const streaksMap = calculateDeckStreaks(gameHistory)
    return Array.from(streaksMap.values())
  }, [gameHistory])
}
