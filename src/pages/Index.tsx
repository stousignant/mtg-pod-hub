import { useState } from 'react'
import Header from '@/components/Header'
import Leaderboard from '@/components/Leaderboard'
import PodFilter from '@/components/PodFilter'
import PlayerCountFilter from '@/components/PlayerCountFilter'
import { useLeaderboard, usePodNames } from '@/hooks/useLeaderboard'
import { useGameHistory } from '@/hooks/useGameHistory'
import { usePodLeaderboardData } from '@/hooks/usePodLeaderboardData'
import { POD_FILTER, PLAYER_COUNT_FILTER } from '@/constants/config'

const Index = () => {
  const { data: pods = [], isLoading: podsLoading } = usePodNames()
  const [selectedPod, setSelectedPod] = useState<string>(POD_FILTER.ALL_PODS)
  const [selectedPlayerCount, setSelectedPlayerCount] = useState<string>(
    PLAYER_COUNT_FILTER.ALL_PLAYER_COUNTS
  )

  const { data: leaderboardData = [], isLoading: leaderboardLoading } =
    useLeaderboard(
      selectedPod === POD_FILTER.ALL_PODS ? undefined : selectedPod
    )

  const { data: gameHistory = [] } = useGameHistory()

  const {
    podPlayerCounts,
    totalGamesByPod,
    groupedByPod,
    podFilterOptions,
    availablePlayerCounts,
  } = usePodLeaderboardData({
    leaderboardData,
    gameHistory,
    selectedPlayerCount,
    allPlayerCountsValue: PLAYER_COUNT_FILTER.ALL_PLAYER_COUNTS,
    pods,
  })

  const isAllPods = selectedPod === POD_FILTER.ALL_PODS
  const isLoading = leaderboardLoading || podsLoading

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
