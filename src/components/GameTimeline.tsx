import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Clock, StickyNote } from 'lucide-react'
import { cn } from '@/lib/utils'
import PlaneswalkerAvatar from './PlaneswalkerAvatar'
import PodFilter from './PodFilter'
import type { GameHistoryEntry } from '@/data/mockData'
import { OUTCOME, UI } from '@/constants/config'

interface GameTimelineProps {
  data: GameHistoryEntry[]
  isLoading: boolean
  pods: string[]
  selectedPod: string
  onPodChange: (pod: string) => void
  podsLoading: boolean
}

interface GroupedGame {
  gameId: number
  playedAt: string
  podName: string
  results: GameHistoryEntry[]
  notes: string | null
}

const ALL_PODS_VALUE = '__all__'

const formatDate = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const OutcomeBadge = ({ outcome }: { outcome: string }) => {
  const config = {
    [OUTCOME.WIN]: {
      label: 'W',
      className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    [OUTCOME.LOSS]: {
      label: 'L',
      className: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
    [OUTCOME.DRAW]: {
      label: 'D',
      className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
  }

  const { label, className } = config[outcome] || config[OUTCOME.LOSS]

  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-bold px-2', className)}
    >
      {label}
    </Badge>
  )
}

const GameTimeline = ({
  data,
  isLoading,
  pods,
  selectedPod,
  onPodChange,
  podsLoading,
}: GameTimelineProps) => {
  const allPods = useMemo(() => [ALL_PODS_VALUE, ...pods], [pods])

  const groupedGames = useMemo(() => {
    const filtered =
      selectedPod === ALL_PODS_VALUE
        ? data
        : data.filter(entry => entry.pod_name === selectedPod)

    const gameMap = new Map<number, GroupedGame>()
    for (const entry of filtered) {
      if (!gameMap.has(entry.game_id)) {
        gameMap.set(entry.game_id, {
          gameId: entry.game_id,
          playedAt: entry.played_at,
          podName: entry.pod_name,
          results: [],
          notes: entry.notes,
        })
      }
      gameMap.get(entry.game_id)!.results.push(entry)
    }

    return [...gameMap.values()].sort(
      (a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime()
    )
  }, [data, selectedPod])

  const gamesByDate = useMemo(() => {
    const dateMap = new Map<string, GroupedGame[]>()
    for (const game of groupedGames) {
      const dateKey = game.playedAt
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push(game)
    }
    return [...dateMap.entries()]
  }, [groupedGames])

  if (isLoading) {
    return (
      <Card className="glow-purple">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(UI.SKELETON_LOADING_COUNT.LEADERBOARD)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glow-purple border-primary/20">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Game History
          </CardTitle>
          <CardDescription>Timeline of all games played</CardDescription>
        </div>
        <PodFilter
          pods={allPods}
          selectedPod={selectedPod}
          onPodChange={onPodChange}
          isLoading={podsLoading}
          allPodsValue={ALL_PODS_VALUE}
        />
      </CardHeader>
      <CardContent>
        {gamesByDate.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No games found
          </p>
        ) : (
          <div className="space-y-6">
            {gamesByDate.map(([date, games]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  {formatDate(date)}
                </h3>
                <div className="space-y-3">
                  {games.map(game => (
                    <div
                      key={game.gameId}
                      className="rounded-xl border border-border/50 overflow-hidden bg-card/50"
                    >
                      <div className="px-4 py-2 border-b border-border/30 flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="text-xs border-primary/30 text-primary"
                        >
                          {game.podName}
                        </Badge>
                      </div>
                      <div className="px-4 py-2 flex flex-wrap gap-2">
                        {game.results
                          .sort((a, b) => {
                            const order = {
                              [OUTCOME.WIN]: 0,
                              [OUTCOME.DRAW]: 1,
                              [OUTCOME.LOSS]: 2,
                            }
                            return (
                              (order[a.outcome] ?? 3) - (order[b.outcome] ?? 3)
                            )
                          })
                          .map(result => (
                            <div
                              key={`${game.gameId}-${result.player_name}`}
                              className={cn(
                                'flex items-center gap-2 rounded-lg px-2 py-1.5',
                                result.outcome === OUTCOME.WIN &&
                                  'bg-[hsl(var(--gold)/0.08)]'
                              )}
                            >
                              <PlaneswalkerAvatar
                                avatarUrl={result.player_avatar_url}
                                name={result.player_name}
                                isFirstPlace={result.outcome === OUTCOME.WIN}
                                className="h-7 w-7"
                              />
                              <span
                                className={cn(
                                  'font-medium text-sm',
                                  result.outcome === OUTCOME.WIN
                                    ? 'text-gold'
                                    : 'text-foreground'
                                )}
                              >
                                {result.player_name}
                              </span>
                              <span className="text-xs text-muted-foreground hidden sm:inline">
                                {result.deck_name}
                              </span>
                              <OutcomeBadge outcome={result.outcome} />
                            </div>
                          ))}
                      </div>
                      {game.notes && (
                        <div className="px-4 py-2 border-t border-border/30">
                          <div className="flex items-start gap-2">
                            <StickyNote className="h-3.5 w-3.5 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-muted-foreground italic">
                              {game.notes}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default GameTimeline
