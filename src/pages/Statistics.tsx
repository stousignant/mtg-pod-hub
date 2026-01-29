import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import DeckStatsTable from '@/components/DeckStatsTable'
import GameTimeline from '@/components/GameTimeline'
import OverviewStats from '@/components/OverviewStats'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePodNames } from '@/hooks/useLeaderboard'
import { useDeckStats } from '@/hooks/useDeckStats'
import { useGameHistory } from '@/hooks/useGameHistory'
import WinRateTrendChart from '@/components/WinRateTrendChart'
import { BarChart3, Clock, Layers, TrendingUp } from 'lucide-react'
import { OUTCOME } from '@/constants/config'

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

  const ownerNames = useMemo(() => {
    const unique = [...new Set(deckStatsData.map(d => d.owner_name))]
    return unique.sort()
  }, [deckStatsData])

  const computeDeckStatsFromGameHistory = useMemo(() => {
    if (selectedDeckStatsPod === ALL_PODS_VALUE) {
      return null
    }

    const filteredHistory = gameHistoryData.filter(
      entry => entry.pod_name === selectedDeckStatsPod
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
  }, [gameHistoryData, selectedDeckStatsPod])

  const filteredDeckStats = useMemo(() => {
    let filtered =
      selectedDeckStatsPod !== ALL_PODS_VALUE && computeDeckStatsFromGameHistory
        ? computeDeckStatsFromGameHistory
        : deckStatsData

    if (selectedPlayer !== ALL_PLAYERS_VALUE) {
      filtered = filtered.filter(d => d.owner_name === selectedPlayer)
    }
    if (hideLowPlayDecks) {
      filtered = filtered.filter(d => d.games_played > 1)
    }
    return filtered
  }, [
    deckStatsData,
    computeDeckStatsFromGameHistory,
    selectedPlayer,
    selectedDeckStatsPod,
    hideLowPlayDecks,
  ])

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
              players={ownerNames}
              selectedPlayer={selectedPlayer}
              onPlayerChange={setSelectedPlayer}
              allPlayersValue={ALL_PLAYERS_VALUE}
              hideLowPlayDecks={hideLowPlayDecks}
              onHideLowPlayDecksChange={setHideLowPlayDecks}
              pods={pods}
              selectedPod={selectedDeckStatsPod}
              onPodChange={setSelectedDeckStatsPod}
              allPodsValue={ALL_PODS_VALUE}
              podsLoading={podsLoading}
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
