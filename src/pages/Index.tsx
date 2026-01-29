import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import Leaderboard from '@/components/Leaderboard'
import PodFilter from '@/components/PodFilter'
import { useLeaderboard, usePodNames } from '@/hooks/useLeaderboard'
import { useGameHistory } from '@/hooks/useGameHistory'
import { POD_FILTER } from '@/constants/config'

const Index = () => {
  const { data: pods = [], isLoading: podsLoading } = usePodNames()
  const [selectedPod, setSelectedPod] = useState<string>(POD_FILTER.ALL_PODS)

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
    const totals: Record<string, number> = {}
    for (const entry of gameHistory) {
      totals[entry.pod_name] = (totals[entry.pod_name] || 0) + 1
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

    return Object.entries(groups).sort(([podA], [podB]) => {
      const gamesA = totalGamesByPod[podA] || 0
      const gamesB = totalGamesByPod[podB] || 0
      return gamesB - gamesA
    })
  }, [leaderboardData, totalGamesByPod])

  const isAllPods = selectedPod === POD_FILTER.ALL_PODS
  const isLoading = leaderboardLoading || podsLoading

  const podFilterOptions = useMemo(() => {
    return pods.map(pod => ({
      name: pod,
      playerCount: podPlayerCounts[pod] || 0,
    }))
  }, [pods, podPlayerCounts])

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
          <PodFilter
            pods={podFilterOptions}
            selectedPod={selectedPod}
            onPodChange={setSelectedPod}
            isLoading={podsLoading}
            showAllPods={true}
          />
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
              />
            ))}
          </div>
        ) : (
          <Leaderboard
            data={leaderboardData}
            isLoading={isLoading}
            selectedPod={selectedPod}
            playerCount={podPlayerCounts[selectedPod] || 0}
          />
        )}
      </main>
    </div>
  )
}

export default Index
