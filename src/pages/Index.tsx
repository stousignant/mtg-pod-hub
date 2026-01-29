import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import Leaderboard from '@/components/Leaderboard'
import PodFilter from '@/components/PodFilter'
import {
  PlayerCountFilter,
  ALL_PLAYER_COUNTS,
} from '@/components/PlayerCountFilter'
import { useLeaderboard, usePodNames } from '@/hooks/useLeaderboard'
import { useGameHistory } from '@/hooks/useGameHistory'
import { POD_FILTER } from '@/constants/config'

const Index = () => {
  const { data: pods = [], isLoading: podsLoading } = usePodNames()
  const [selectedPod, setSelectedPod] = useState<string>(POD_FILTER.ALL_PODS)
  const [selectedPlayerCount, setSelectedPlayerCount] =
    useState<string>(ALL_PLAYER_COUNTS)

  const { data: leaderboardData = [], isLoading: leaderboardLoading } =
    useLeaderboard(
      selectedPod === POD_FILTER.ALL_PODS ? undefined : selectedPod
    )

  const { data: gameHistory = [] } = useGameHistory()

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

    if (selectedPlayerCount !== ALL_PLAYER_COUNTS) {
      const targetCount = parseInt(selectedPlayerCount, 10)
      entries = entries.filter(([podName]) => {
        return podPlayerCounts[podName] === targetCount
      })
    }

    return entries
  }, [leaderboardData, totalGamesByPod, selectedPlayerCount, podPlayerCounts])

  const isAllPods = selectedPod === POD_FILTER.ALL_PODS
  const isLoading = leaderboardLoading || podsLoading

  const podFilterOptions = useMemo(() => {
    return pods.map(pod => ({
      name: pod,
      playerCount: podPlayerCounts[pod] || 0,
      gamesPlayed: totalGamesByPod[pod] || 0,
    }))
  }, [pods, podPlayerCounts, totalGamesByPod])

  const availablePlayerCounts = useMemo(() => {
    return Object.values(podPlayerCounts)
  }, [podPlayerCounts])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pod Standings
          </h2>
          <p className="text-muted-foreground mb-6">
            Track your league performance and rankings
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <PodFilter
              pods={podFilterOptions}
              selectedPod={selectedPod}
              onPodChange={setSelectedPod}
              isLoading={podsLoading}
              showAllPods={true}
            />
            <PlayerCountFilter
              playerCounts={availablePlayerCounts}
              selectedCount={selectedPlayerCount}
              onCountChange={setSelectedPlayerCount}
              isLoading={podsLoading}
            />
          </div>
        </div>

        {isAllPods ? (
          <div className="space-y-6">
            {groupedByPod.map(([podName, podData]) => (
              <Leaderboard
                key={podName}
                data={podData}
                isLoading={isLoading}
                selectedPod={podName}
                playerCount={podPlayerCounts[podName] || 0}
                gamesPlayed={totalGamesByPod[podName] || 0}
              />
            ))}
          </div>
        ) : (
          <Leaderboard
            data={leaderboardData}
            isLoading={isLoading}
            selectedPod={selectedPod}
            playerCount={podPlayerCounts[selectedPod] || 0}
            gamesPlayed={totalGamesByPod[selectedPod] || 0}
          />
        )}
      </main>
    </div>
  )
}

export default Index
