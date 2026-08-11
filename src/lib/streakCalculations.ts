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

const calculateStreakMetrics = (games: GameHistoryEntry[]) => {
  const sortedGames = [...games].sort((a, b) => {
    const dateCompare = a.played_at.localeCompare(b.played_at)
    if (dateCompare !== 0) return dateCompare
    return a.game_id - b.game_id
  })
  let bestWinStreak = 0
  let worstLoseStreak = 0
  let tempWinStreak = 0
  let tempLoseStreak = 0

  for (const game of sortedGames) {
    const isWin = game.outcome === OUTCOME.WIN && !game.unsatisfying
    const isLoss = game.outcome === OUTCOME.LOSS

    if (isWin) {
      tempWinStreak++
      tempLoseStreak = 0
      bestWinStreak = Math.max(bestWinStreak, tempWinStreak)
    } else if (isLoss) {
      tempLoseStreak++
      tempWinStreak = 0
      worstLoseStreak = Math.max(worstLoseStreak, tempLoseStreak)
    } else {
      tempWinStreak = 0
      tempLoseStreak = 0
    }
  }

  return {
    deckName: sortedGames[0]?.deck_name ?? '',
    currentStreak: Math.max(tempWinStreak, tempLoseStreak),
    currentStreakType:
      tempWinStreak > 0
        ? ('win' as const)
        : tempLoseStreak > 0
          ? ('loss' as const)
          : null,
    bestWinStreak,
    worstLoseStreak,
  }
}

export const calculateDeckStreaks = (
  gameHistory: GameHistoryEntry[]
): Map<string, DeckStreaks> => {
  const deckGames = new Map<string, GameHistoryEntry[]>()

  for (const entry of gameHistory) {
    const deckId = String(entry.deck_id)
    const games = deckGames.get(deckId)
    if (games) {
      games.push(entry)
    } else {
      deckGames.set(deckId, [entry])
    }
  }

  return new Map(
    [...deckGames.entries()].map(([deckId, games]) => [
      deckId,
      { deckId, ...calculateStreakMetrics(games) },
    ])
  )
}
