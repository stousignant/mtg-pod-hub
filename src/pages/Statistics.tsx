import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import DeckStatsTable from '@/components/DeckStatsTable'
import GameTimeline from '@/components/GameTimeline'
import OverviewStats from '@/components/OverviewStats'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePodNames } from '@/hooks/useLeaderboard'
import { useDeckStats } from '@/hooks/useDeckStats'
import { useGameHistory } from '@/hooks/useGameHistory'
import { useDeckStatsByPod } from '@/hooks/useDeckStatsByPod'
import WinRateTrendChart from '@/components/WinRateTrendChart'
import { BarChart3, Clock, Layers, TrendingUp } from 'lucide-react'

const ALL_PLAYERS_VALUE = '__all__'
const ALL_PODS_VALUE = '__all__'

const Statistics = () => {
  const { data: pods = [], isLoading: podsLoading } = usePodNames()
  const [selectedPod, setSelectedPod] = useState<string>(ALL_PODS_VALUE)
  const [selectedOverviewPod, setSelectedOverviewPod] =
    useState<string>(ALL_PODS_VALUE)
  const [selectedTrendPod, setSelectedTrendPod] =
    useState<string>(ALL_PODS_VALUE)
  const [selectedDeckStatsPod, setSelectedDeckStatsPod] =
    useState<string>(ALL_PODS_VALUE)
  const [selectedPlayer, setSelectedPlayer] =
    useState<string>(ALL_PLAYERS_VALUE)
  const [hideLowPlayDecks, setHideLowPlayDecks] = useState(true)

  const { data: deckStatsData = [], isLoading: deckStatsLoading } =
    useDeckStats()
  const { data: gameHistoryData = [], isLoading: gameHistoryLoading } =
    useGameHistory()

  const deckStatsByPod = useDeckStatsByPod({
    gameHistory: gameHistoryData,
    selectedPod: selectedDeckStatsPod,
    allPodsValue: ALL_PODS_VALUE,
  })

  const ownerNames = useMemo(() => {
    const baseData = deckStatsByPod || deckStatsData
    const unique = [...new Set(baseData.map(d => d.owner_name))]
    return unique.sort()
  }, [deckStatsData, deckStatsByPod])

  const filteredDeckStats = useMemo(() => {
    let filtered = deckStatsByPod || deckStatsData

    if (selectedPlayer !== ALL_PLAYERS_VALUE) {
      filtered = filtered.filter(d => d.owner_name === selectedPlayer)
    }
    if (hideLowPlayDecks) {
      filtered = filtered.filter(d => d.games_played > 1)
    }
    return filtered
  }, [deckStatsData, deckStatsByPod, selectedPlayer, hideLowPlayDecks])

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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="game-history"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <Clock className="h-4 w-4" />
              <span className="inline">Game History</span>
            </TabsTrigger>
            <TabsTrigger
              value="deck-stats"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <Layers className="h-4 w-4" />
              <span className="inline">Deck Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="inline">Trends</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewStats
              data={gameHistoryData}
              isLoading={gameHistoryLoading}
              pods={pods}
              selectedPod={selectedOverviewPod}
              onPodChange={setSelectedOverviewPod}
              podsLoading={podsLoading}
            />
          </TabsContent>

          <TabsContent value="game-history">
            <GameTimeline
              data={gameHistoryData}
              isLoading={gameHistoryLoading}
              pods={pods}
              selectedPod={selectedPod}
              onPodChange={setSelectedPod}
              podsLoading={podsLoading}
            />
          </TabsContent>

          <TabsContent value="deck-stats">
            <DeckStatsTable
              data={filteredDeckStats}
              isLoading={deckStatsLoading}
              playerFilter={{
                players: ownerNames,
                selected: selectedPlayer,
                onChange: setSelectedPlayer,
                allPlayersValue: ALL_PLAYERS_VALUE,
                isLoading: false,
              }}
              podFilter={{
                pods: pods,
                selected: selectedDeckStatsPod,
                onChange: setSelectedDeckStatsPod,
                allPodsValue: ALL_PODS_VALUE,
                isLoading: podsLoading,
              }}
              hideLowPlayDecks={hideLowPlayDecks}
              onHideLowPlayDecksChange={setHideLowPlayDecks}
            />
          </TabsContent>

          <TabsContent value="trends">
            <WinRateTrendChart
              data={gameHistoryData}
              isLoading={gameHistoryLoading}
              pods={pods}
              selectedPod={selectedTrendPod}
              onPodChange={setSelectedTrendPod}
              podsLoading={podsLoading}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default Statistics
