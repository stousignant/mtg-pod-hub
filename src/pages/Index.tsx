import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Leaderboard from '@/components/Leaderboard'
import PodFilter from '@/components/PodFilter'
import { useLeaderboard, usePodNames } from '@/hooks/useLeaderboard'

const Index = () => {
  const { data: pods = [], isLoading: podsLoading } = usePodNames()
  const [selectedPod, setSelectedPod] = useState<string>('')

  // Set default pod when pods load
  useEffect(() => {
    if (pods.length > 0 && !selectedPod) {
      setSelectedPod(pods[0])
    }
  }, [pods, selectedPod])

  const { data: leaderboardData = [], isLoading: leaderboardLoading } =
    useLeaderboard(selectedPod)

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
            pods={pods}
            selectedPod={selectedPod}
            onPodChange={setSelectedPod}
            isLoading={podsLoading}
          />
        </div>

        <Leaderboard
          data={leaderboardData}
          isLoading={leaderboardLoading || podsLoading}
          selectedPod={selectedPod}
        />
      </main>
    </div>
  )
}

export default Index
