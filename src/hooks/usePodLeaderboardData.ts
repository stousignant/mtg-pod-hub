import { useMemo } from 'react'
import type { PodLeaderboardEntry } from '@/data/mockData'
import type { GameHistoryEntry } from '@/data/mockData'
import type { PodOption } from '@/types/leaderboard'

interface UsePodLeaderboardDataParams {
  leaderboardData: PodLeaderboardEntry[]
  gameHistory: GameHistoryEntry[]
  selectedPlayerCount: string
  allPlayerCountsValue: string
  pods: string[]
}

export const usePodLeaderboardData = ({
  leaderboardData,
  gameHistory,
  selectedPlayerCount,
  allPlayerCountsValue,
  pods,
}: UsePodLeaderboardDataParams) => {
  const podPlayerCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const entry of leaderboardData) {
      counts[entry.pod_name] = (counts[entry.pod_name] || 0) + 1
    }
    return counts
  }, [leaderboardData])

  const totalGamesByPod = useMemo(() => {
    const gameIdsByPod: Record<string, Set<number>> = {}
    for (const entry of gameHistory) {
      if (!gameIdsByPod[entry.pod_name]) {
        gameIdsByPod[entry.pod_name] = new Set()
      }
      gameIdsByPod[entry.pod_name].add(entry.game_id)
    }

    const totals: Record<string, number> = {}
    for (const [podName, gameIds] of Object.entries(gameIdsByPod)) {
      totals[podName] = gameIds.size
    }
    return totals
  }, [gameHistory])

  const groupedByPod = useMemo(() => {
    const groups: Record<string, typeof leaderboardData> = {}
    for (const entry of leaderboardData) {
      if (!groups[entry.pod_name]) {
        groups[entry.pod_name] = []
      }
      groups[entry.pod_name].push(entry)
    }

    let entries = Object.entries(groups).sort(([podA], [podB]) => {
      const gamesA = totalGamesByPod[podA] || 0
      const gamesB = totalGamesByPod[podB] || 0
      return gamesB - gamesA
    })

    if (selectedPlayerCount !== allPlayerCountsValue) {
      const targetCount = parseInt(selectedPlayerCount, 10)
      entries = entries.filter(([podName]) => {
        return podPlayerCounts[podName] === targetCount
      })
    }

    return entries
  }, [
    leaderboardData,
    totalGamesByPod,
    selectedPlayerCount,
    allPlayerCountsValue,
    podPlayerCounts,
  ])

  const podFilterOptions: PodOption[] = useMemo(() => {
    return pods.map(pod => ({
      name: pod,
      playerCount: podPlayerCounts[pod] || 0,
      gamesPlayed: totalGamesByPod[pod] || 0,
    }))
  }, [pods, podPlayerCounts, totalGamesByPod])

  const availablePlayerCounts = useMemo(() => {
    return Object.values(podPlayerCounts)
  }, [podPlayerCounts])

  return {
    podPlayerCounts,
    totalGamesByPod,
    groupedByPod,
    podFilterOptions,
    availablePlayerCounts,
  }
}
