import { useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart3, Gamepad2, Users, MapPin, Swords } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GameHistoryEntry } from '@/data/mockData'
import PlayerFilter from './PlayerFilter'
import { WIN_RATE, UI, OUTCOME } from '@/constants/config'

const ALL_PLAYERS_VALUE = '__all__'

interface OverviewStatsProps {
  data: GameHistoryEntry[]
  isLoading: boolean
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
      const streakLabel =
        streakOutcome === OUTCOME.WIN
          ? 'W'
          : streakOutcome === OUTCOME.LOSS
            ? 'L'
            : 'D'
      const MIN_STREAK_TO_DISPLAY = 2
      const streakWord =
        streakOutcome === OUTCOME.WIN
          ? 'win'
          : streakOutcome === OUTCOME.LOSS
            ? 'loss'
            : 'draw'
      const currentStreak =
        streakCount >= MIN_STREAK_TO_DISPLAY
          ? `${streakCount} ${streakWord} streak`
          : null

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

const OverviewStats = ({ data, isLoading }: OverviewStatsProps) => {
  const [selectedPlayer, setSelectedPlayer] =
    useState<string>(ALL_PLAYERS_VALUE)

  const globalStats = useMemo(() => computeGlobalStats(data), [data])
  const allPlayerStats = useMemo(() => computePlayerStats(data), [data])

  const playerNames = useMemo(
    () => allPlayerStats.map(p => p.playerName),
    [allPlayerStats]
  )

  const displayedPlayerStats = useMemo(() => {
    if (selectedPlayer === ALL_PLAYERS_VALUE) return allPlayerStats
    return allPlayerStats.filter(p => p.playerName === selectedPlayer)
  }, [allPlayerStats, selectedPlayer])

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
          <PlayerFilter
            players={playerNames}
            selectedPlayer={selectedPlayer}
            onPlayerChange={setSelectedPlayer}
            allPlayersValue={ALL_PLAYERS_VALUE}
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayedPlayerStats.map(player => {
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

                  <div className="bg-card/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">
                        {player.gamesPlayed} games
                      </span>
                      {player.currentStreak && (
                        <span className="text-muted-foreground font-mono text-xs bg-muted/50 px-2 py-1 rounded">
                          {player.currentStreak}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 text-sm">
                      <div className="flex gap-2">
                        <span className="text-emerald-400">{player.wins}W</span>
                        <span className="text-amber-400">{player.draws}D</span>
                        <span className="text-rose-400">{player.losses}L</span>
                      </div>
                      <span
                        className={cn(
                          'font-bold text-lg',
                          player.winRate >= WIN_RATE.THRESHOLD.GOOD
                            ? WIN_RATE.COLOR.GOOD
                            : player.winRate >= WIN_RATE.THRESHOLD.AVERAGE
                              ? WIN_RATE.COLOR.AVERAGE
                              : WIN_RATE.COLOR.POOR
                        )}
                      >
                        {player.winRate.toFixed(UI.DECIMAL_PLACES.WIN_RATE)}%
                      </span>
                    </div>
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
