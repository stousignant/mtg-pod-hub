import { useMemo } from 'react'
import type { GameHistoryEntry, DeckStatsEntry } from '@/data/mockData'
import { OUTCOME } from '@/constants/config'

interface UseDeckStatsByPodParams {
  gameHistory: GameHistoryEntry[]
  selectedPod: string
  allPodsValue: string
}

/**
 * Computes deck statistics filtered by pod from game history data.
 * Returns null when all pods are selected (use the global deck stats instead).
 */
export const useDeckStatsByPod = ({
  gameHistory,
  selectedPod,
  allPodsValue,
}: UseDeckStatsByPodParams): DeckStatsEntry[] | null => {
  return useMemo(() => {
    if (selectedPod === allPodsValue) {
      return null
    }

    const filteredHistory = gameHistory.filter(
      entry => entry.pod_name === selectedPod
    )

    const deckMap = new Map<
      string,
      {
        commander_name: string
        commander_image_url: string | null
        owner_name: string
        games: number
        wins: number
      }
    >()

    for (const entry of filteredHistory) {
      if (!deckMap.has(entry.deck_name)) {
        deckMap.set(entry.deck_name, {
          commander_name: entry.commander_name,
          commander_image_url: entry.commander_image_url,
          owner_name: entry.player_name,
          games: 0,
          wins: 0,
        })
      }

      const deckStats = deckMap.get(entry.deck_name)!
      deckStats.games++
      if (entry.outcome === OUTCOME.WIN) {
        deckStats.wins++
      }
    }

    return Array.from(deckMap.entries())
      .map(([deckName, stats]) => ({
        deck_name: deckName,
        commander_name: stats.commander_name,
        commander_image_url: stats.commander_image_url,
        owner_name: stats.owner_name,
        games_played: stats.games,
        wins: stats.wins,
        win_rate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0,
      }))
      .sort((a, b) => b.win_rate - a.win_rate)
  }, [gameHistory, selectedPod, allPodsValue])
}
