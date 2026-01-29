import { Trophy } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Podium from './Podium'
import PlayerCard from './PlayerCard'
import type { PodLeaderboardEntry } from '@/data/mockData'
import { UI, RANKING } from '@/constants/config'
import { formatPlayerCount } from '@/lib/utils'

interface LeaderboardProps {
  data: PodLeaderboardEntry[]
  isLoading: boolean
  selectedPod: string
  playerCount?: number
  gamesPlayed?: number
}

const Leaderboard = ({
  data,
  isLoading,
  selectedPod,
  playerCount,
  gamesPlayed,
}: LeaderboardProps) => {
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
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate Olympic-style ranks (tied players get same rank, next rank skips)
  const playersWithRanks: (PodLeaderboardEntry & { rank: number })[] = []
  let currentRank = 1

  for (let i = 0; i < data.length; i++) {
    if (i > 0 && data[i].points !== data[i - 1].points) {
      currentRank = i + 1
    }
    playersWithRanks.push({ ...data[i], rank: currentRank })
  }

  const podiumPlayers = playersWithRanks.slice(0, RANKING.PODIUM_SIZE)
  const remainingPlayers = playersWithRanks.slice(RANKING.PODIUM_SIZE)

  return (
    <Card className="glow-purple border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>
          {selectedPod}
          {(playerCount || gamesPlayed) && (
            <>
              {' ('}
              {playerCount ? formatPlayerCount(playerCount) : ''}
              {playerCount && gamesPlayed && ', '}
              {gamesPlayed && (
                <>
                  {gamesPlayed} {gamesPlayed === 1 ? 'game' : 'games'}
                </>
              )}
              {')'}
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {podiumPlayers.length > 0 && <Podium players={podiumPlayers} />}

        {remainingPlayers.length > 0 && (
          <div className="space-y-2">
            {remainingPlayers.map(player => (
              <PlayerCard
                key={`${player.player_name}-${player.pod_name}`}
                player={player}
                rank={player.rank}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Leaderboard
