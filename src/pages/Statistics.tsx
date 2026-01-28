import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import PodFilter from '@/components/PodFilter'
import WinRateChart from '@/components/WinRateChart'
import DeckStatsTable from '@/components/DeckStatsTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLeaderboard, usePodNames } from '@/hooks/useLeaderboard'
import { useDeckStats } from '@/hooks/useDeckStats'
import { BarChart3, Layers } from 'lucide-react'

const Statistics = () => {
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
  const { data: deckStatsData = [], isLoading: deckStatsLoading } =
    useDeckStats()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Statistics
          </h2>
          <p className="text-muted-foreground mb-6">
            Dive deeper into player and deck performance
          </p>
        </div>

        <Tabs defaultValue="pod-stats" className="space-y-6">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger
              value="pod-stats"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Pod Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="deck-stats"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Deck Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pod-stats" className="space-y-6">
            <PodFilter
              pods={pods}
              selectedPod={selectedPod}
              onPodChange={setSelectedPod}
              isLoading={podsLoading}
            />
            <WinRateChart
              data={leaderboardData}
              isLoading={leaderboardLoading || podsLoading}
              selectedPod={selectedPod}
            />
          </TabsContent>

          <TabsContent value="deck-stats">
            <DeckStatsTable data={deckStatsData} isLoading={deckStatsLoading} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default Statistics
