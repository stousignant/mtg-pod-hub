import { OUTCOME } from '@/constants/config'
import type { GameHistoryEntry } from '@/data/mockData'

export interface DeckStreaks {
  deckId: string
  deckName: string
  currentStreak: number
  currentStreakType: 'win' | 'loss' | null
  bestWinStreak: number
  worstLoseStreak: number
}

export const calculateDeckStreaks = (
  gameHistory: GameHistoryEntry[]
): Map<string, DeckStreaks> => {
  const deckStreaksMap = new Map<string, DeckStreaks>()

  const deckGamesMap = new Map<string, GameHistoryEntry[]>()
  for (const entry of gameHistory) {
    const deckId = String(entry.deck_id)
    if (!deckGamesMap.has(deckId)) {
      deckGamesMap.set(deckId, [])
    }
    deckGamesMap.get(deckId)!.push(entry)
  }

  for (const [deckId, games] of deckGamesMap.entries()) {
    const sortedGames = [...games].sort((a, b) => {
      const dateCompare = a.played_at.localeCompare(b.played_at)
      if (dateCompare !== 0) return dateCompare
      return a.game_id - b.game_id
    })

    let currentStreak = 0
    let currentStreakType: 'win' | 'loss' | null = null
    let bestWinStreak = 0
    let worstLoseStreak = 0

    let tempWinStreak = 0
    let tempLoseStreak = 0

    for (const game of sortedGames) {
      const isWin = game.outcome === OUTCOME.WIN && !game.unsatisfying
      const isLoss = game.outcome === OUTCOME.LOSS
      const isDraw = game.outcome === OUTCOME.DRAW

      if (isWin) {
        tempWinStreak++
        tempLoseStreak = 0

        if (currentStreakType === 'win' || currentStreakType === null) {
          currentStreak = tempWinStreak
          currentStreakType = 'win'
        } else {
          currentStreak = 1
          currentStreakType = 'win'
        }

        bestWinStreak = Math.max(bestWinStreak, tempWinStreak)
      } else if (isLoss) {
        tempLoseStreak++
        tempWinStreak = 0

        if (currentStreakType === 'loss' || currentStreakType === null) {
          currentStreak = tempLoseStreak
          currentStreakType = 'loss'
        } else {
          currentStreak = 1
          currentStreakType = 'loss'
        }

        worstLoseStreak = Math.max(worstLoseStreak, tempLoseStreak)
      } else if (isDraw) {
        tempWinStreak = 0
        tempLoseStreak = 0
        currentStreak = 0
        currentStreakType = null
      }
    }

    deckStreaksMap.set(deckId, {
      deckId,
      deckName: sortedGames[0]?.deck_name || '',
      currentStreak,
      currentStreakType,
      bestWinStreak,
      worstLoseStreak,
    })
  }

  return deckStreaksMap
}
