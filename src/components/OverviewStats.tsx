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
import { StreakDisplay } from './StreakDisplay'
import { UI } from '@/constants/config'
import { computeGlobalStats, computePlayerStats } from '@/lib/overviewStats'

const ALL_PODS_VALUE = '__all__'

interface OverviewStatsProps {
  data: GameHistoryEntry[]
  isLoading: boolean
  pods: string[]
  selectedPod: string
  onPodChange: (pod: string) => void
  podsLoading: boolean
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

                    <StreakDisplay
                      currentStreak={player.currentStreak}
                      currentStreakType={player.currentStreakType}
                      bestWinStreak={player.longestWinStreak}
                      worstLoseStreak={player.longestLossStreak}
                    />
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
