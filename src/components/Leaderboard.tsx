import { Trophy } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import PlaneswalkerAvatar from './PlaneswalkerAvatar'
import { cn } from '@/lib/utils'
import type { PodLeaderboardEntry } from '@/data/mockData'
import { UI, WIN_RATE, RANKING } from '@/constants/config'

interface LeaderboardProps {
  data: PodLeaderboardEntry[]
  isLoading: boolean
  selectedPod: string
}

const Leaderboard = ({ data, isLoading, selectedPod }: LeaderboardProps) => {
  if (isLoading) {
    return (
      <Card className="glow-purple">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(UI.SKELETON_LOADING_COUNT.LEADERBOARD)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glow-purple border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>{selectedPod}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-center hidden sm:table-cell">
                  Points
                </TableHead>
                <TableHead className="text-center hidden md:table-cell">
                  Record
                </TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((player, index) => {
                const isFirstPlace = index === RANKING.FIRST_PLACE_INDEX
                const rank = index + 1

                return (
                  <TableRow
                    key={`${player.player_name}-${player.pod_name}`}
                    className={cn(
                      'transition-colors',
                      isFirstPlace && 'bg-[hsl(var(--gold)/0.1)]'
                    )}
                  >
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {isFirstPlace ? (
                          <Trophy className="h-4 w-4 text-gold" />
                        ) : (
                          <span
                            className={cn(
                              'font-semibold',
                              isFirstPlace && 'text-gold'
                            )}
                          >
                            {rank}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <PlaneswalkerAvatar
                          avatarUrl={player.avatar_url}
                          name={player.player_name}
                          isFirstPlace={isFirstPlace}
                        />
                        <span
                          className={cn(
                            'font-medium',
                            isFirstPlace && 'text-gold'
                          )}
                        >
                          {player.player_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      <span
                        className={cn(
                          'font-bold text-lg',
                          isFirstPlace && 'text-gold'
                        )}
                      >
                        {player.points}
                      </span>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <span className="text-muted-foreground">
                        {player.wins}-{player.draws}-{player.losses}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          'font-semibold',
                          player.win_rate >= WIN_RATE.THRESHOLD.GOOD
                            ? WIN_RATE.COLOR.GOOD
                            : player.win_rate >= WIN_RATE.THRESHOLD.AVERAGE
                              ? WIN_RATE.COLOR.AVERAGE
                              : WIN_RATE.COLOR.POOR
                        )}
                      >
                        {player.win_rate.toFixed(UI.DECIMAL_PLACES.WIN_RATE)}%
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default Leaderboard
