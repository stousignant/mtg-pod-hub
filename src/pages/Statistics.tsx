import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import DeckStatsTable from '@/components/DeckStatsTable'
import GameTimeline from '@/components/GameTimeline'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePodNames } from '@/hooks/useLeaderboard'
import { useDeckStats } from '@/hooks/useDeckStats'
import { useGameHistory } from '@/hooks/useGameHistory'
import { Clock, Layers } from 'lucide-react'

const ALL_PLAYERS_VALUE = '__all__'
const ALL_PODS_VALUE = '__all__'

const Statistics = () => {
  const { data: pods = [], isLoading: podsLoading } = usePodNames()
  const [selectedPod, setSelectedPod] = useState<string>(ALL_PODS_VALUE)
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

  const filteredDeckStats = useMemo(() => {
    let filtered = deckStatsData
    if (selectedPlayer !== ALL_PLAYERS_VALUE) {
      filtered = filtered.filter(d => d.owner_name === selectedPlayer)
    }
    if (hideLowPlayDecks) {
      filtered = filtered.filter(d => d.games_played > 1)
    }
    return filtered
  }, [deckStatsData, selectedPlayer, hideLowPlayDecks])

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

        <Tabs defaultValue="game-history" className="space-y-6">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger
              value="game-history"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Game History</span>
            </TabsTrigger>
            <TabsTrigger
              value="deck-stats"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Deck Stats</span>
            </TabsTrigger>
          </TabsList>

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
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default Statistics
