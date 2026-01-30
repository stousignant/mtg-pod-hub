import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart3, Gamepad2, Users, MapPin, Swords } from 'lucide-react'
import type { GameHistoryEntry } from '@/data/mockData'
import PodFilter from './PodFilter'
import { UI, OUTCOME } from '@/constants/config'

const ALL_PODS_VALUE = '__all__'

interface OverviewStatsProps {
  data: GameHistoryEntry[]
  isLoading: boolean
  pods: string[]
  selectedPod: string
  onPodChange: (pod: string) => void
  podsLoading: boolean
}

interface PlayerStats {
  playerName: string
  avatarUrl: string | null
  gamesPlayed: number
  wins: number
  draws: number
  losses: number
  winRate: number
  favoriteDeck: string
  favoriteDeckGames: number
  bestDeck: string | null
  bestDeckWinRate: number
  currentStreak: string | null
  longestWinStreak: number
  longestLossStreak: number
}

const computeGlobalStats = (data: GameHistoryEntry[]) => {
  const uniqueGames = new Set(data.map(entry => entry.game_id))
  const uniquePlayers = new Set(data.map(entry => entry.player_name))

  const podCounts = new Map<string, number>()
  const deckCounts = new Map<string, number>()

  for (const entry of data) {
    podCounts.set(entry.pod_name, (podCounts.get(entry.pod_name) ?? 0) + 1)
    deckCounts.set(entry.deck_name, (deckCounts.get(entry.deck_name) ?? 0) + 1)
  }

  const mostActivePod =
    [...podCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  const mostPlayedDeck =
    [...deckCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  return {
    totalGames: uniqueGames.size,
    totalPlayers: uniquePlayers.size,
    mostActivePod,
    mostPlayedDeck,
  }
}

const computeLongestStreak = (
  entries: GameHistoryEntry[],
  targetOutcome: string
): number => {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.played_at).getTime() - new Date(b.played_at).getTime()
  )
  let longest = 0
  let current = 0
  for (const entry of sorted) {
    if (entry.outcome === targetOutcome) {
      current++
      if (current > longest) longest = current
    } else {
      current = 0
    }
  }
  return longest
}

const computePlayerStats = (data: GameHistoryEntry[]): PlayerStats[] => {
  const playerMap = new Map<
    string,
    {
      avatarUrl: string | null
      entries: GameHistoryEntry[]
    }
  >()

  for (const entry of data) {
    const existing = playerMap.get(entry.player_name)
    if (existing) {
      existing.entries.push(entry)
    } else {
      playerMap.set(entry.player_name, {
        avatarUrl: entry.player_avatar_url,
        entries: [entry],
      })
    }
  }

  return [...playerMap.entries()]
    .map(([playerName, { avatarUrl, entries }]) => {
      const gamesPlayed = entries.length
      const wins = entries.filter(e => e.outcome === OUTCOME.WIN).length
      const draws = entries.filter(e => e.outcome === OUTCOME.DRAW).length
      const losses = entries.filter(e => e.outcome === OUTCOME.LOSS).length
      const winRate = gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0

      const deckCounts = new Map<string, number>()
      const deckWins = new Map<string, number>()
      for (const e of entries) {
        deckCounts.set(e.deck_name, (deckCounts.get(e.deck_name) ?? 0) + 1)
        if (e.outcome === OUTCOME.WIN) {
          deckWins.set(e.deck_name, (deckWins.get(e.deck_name) ?? 0) + 1)
        }
      }
      const favoriteDeckEntry = [...deckCounts.entries()].sort(
        (a, b) => b[1] - a[1]
      )[0]
      const favoriteDeck = favoriteDeckEntry?.[0] ?? '—'
      const favoriteDeckGames = favoriteDeckEntry?.[1] ?? 0

      const MIN_GAMES_FOR_BEST_DECK = 2
      const qualifiedDecks = [...deckCounts.entries()]
        .filter(([, games]) => games >= MIN_GAMES_FOR_BEST_DECK)
        .map(([name, games]) => ({
          name,
          winRate: ((deckWins.get(name) ?? 0) / games) * 100,
        }))
        .sort((a, b) => b.winRate - a.winRate)
      const bestDeck = qualifiedDecks[0]?.name ?? null
      const bestDeckWinRate = qualifiedDecks[0]?.winRate ?? 0

      const sortedByDate = [...entries].sort(
        (a, b) =>
          new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
      )
      const streakOutcome = sortedByDate[0]?.outcome
      let streakCount = 0
      for (const e of sortedByDate) {
        if (e.outcome === streakOutcome) {
          streakCount++
        } else {
          break
        }
      }
      const MIN_STREAK_TO_DISPLAY = 2
      const streakAbbreviation =
        streakOutcome === OUTCOME.WIN
          ? 'W'
          : streakOutcome === OUTCOME.LOSS
            ? 'L'
            : 'D'
      const currentStreak =
        streakCount >= MIN_STREAK_TO_DISPLAY
          ? `${streakCount}${streakAbbreviation}`
          : null

      const longestWinStreak = computeLongestStreak(entries, OUTCOME.WIN)
      const longestLossStreak = computeLongestStreak(entries, OUTCOME.LOSS)

      return {
        playerName,
        avatarUrl,
        gamesPlayed,
        wins,
        draws,
        losses,
        winRate,
        favoriteDeck,
        favoriteDeckGames,
        bestDeck,
        bestDeckWinRate,
        currentStreak,
        longestWinStreak,
        longestLossStreak,
      }
    })
    .sort((a, b) => b.winRate - a.winRate)
}

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: React.ElementType
}) => (
  <Card className="glow-purple border-primary/20">
    <CardContent className="flex items-center gap-4 p-4">
      <div className="rounded-lg bg-primary/10 p-2">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
)

const OverviewStats = ({
  data,
  isLoading,
  pods,
  selectedPod,
  onPodChange,
  podsLoading,
}: OverviewStatsProps) => {
  const filteredData = useMemo(() => {
    if (selectedPod === ALL_PODS_VALUE) return data
    return data.filter(entry => entry.pod_name === selectedPod)
  }, [data, selectedPod])

  const globalStats = useMemo(
    () => computeGlobalStats(filteredData),
    [filteredData]
  )
  const allPlayerStats = useMemo(
    () => computePlayerStats(filteredData),
    [filteredData]
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Card className="glow-purple">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Games"
          value={globalStats.totalGames}
          icon={Gamepad2}
        />
        <StatCard
          label="Total Players"
          value={globalStats.totalPlayers}
          icon={Users}
        />
        <StatCard
          label="Most Active Pod"
          value={globalStats.mostActivePod}
          icon={MapPin}
        />
        <StatCard
          label="Most Played Deck"
          value={globalStats.mostPlayedDeck}
          icon={Swords}
        />
      </div>

      <Card className="glow-purple border-primary/20">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Player Breakdown
            </CardTitle>
            <CardDescription>Per-player performance overview</CardDescription>
          </div>
          <PodFilter
            pods={[ALL_PODS_VALUE, ...pods]}
            selectedPod={selectedPod}
            onPodChange={onPodChange}
            isLoading={podsLoading}
            allPodsValue={ALL_PODS_VALUE}
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allPlayerStats.map(player => {
              const hasAvatar = !!player.avatarUrl

              return (
                <div
                  key={player.playerName}
                  className="relative rounded-xl overflow-hidden border-2 border-border/50 transition-all duration-200 hover:border-primary/30"
                >
                  <div
                    className="relative h-48 sm:h-72"
                    style={{
                      backgroundImage: hasAvatar
                        ? `url(${player.avatarUrl})`
                        : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center 25%',
                    }}
                  >
                    {!hasAvatar && (
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 to-purple-950 flex items-center justify-center">
                        <span className="text-5xl font-black text-primary/40">
                          {player.playerName[0]}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-black text-xl sm:text-2xl text-white">
                        {player.playerName}
                      </h3>
                      <p className="text-white/70 text-sm">
                        Favorite: {player.favoriteDeck} (
                        {player.favoriteDeckGames} games)
                      </p>
                      {player.bestDeck && (
                        <p className="text-white/70 text-sm">
                          Best: {player.bestDeck} (
                          {player.bestDeckWinRate.toFixed(
                            UI.DECIMAL_PLACES.WIN_RATE
                          )}
                          % WR)
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-card/90 backdrop-blur-sm px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {player.gamesPlayed} games
                      </span>
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex gap-2">
                          <span className="text-emerald-400">
                            {player.wins}W
                          </span>
                          <span className="text-amber-400">
                            {player.draws}D
                          </span>
                          <span className="text-rose-400">
                            {player.losses}L
                          </span>
                        </div>
                        <span className="font-bold text-lg text-amber-400">
                          {player.winRate.toFixed(UI.DECIMAL_PLACES.WIN_RATE)}%
                        </span>
                      </div>
                    </div>

                    {(player.longestWinStreak > 0 ||
                      player.longestLossStreak > 0 ||
                      player.currentStreak) && (
                      <div className="flex items-center gap-3 flex-wrap text-xs">
                        <span className="text-muted-foreground">Streaks:</span>
                        {player.longestWinStreak > 0 && (
                          <span className="text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded">
                            Best W: {player.longestWinStreak}
                          </span>
                        )}
                        {player.longestLossStreak > 0 && (
                          <span className="text-rose-400 font-mono bg-rose-500/10 px-2 py-1 rounded">
                            Worst L: {player.longestLossStreak}
                          </span>
                        )}
                        {player.currentStreak && (
                          <span className="text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                            Current: {player.currentStreak}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OverviewStats
