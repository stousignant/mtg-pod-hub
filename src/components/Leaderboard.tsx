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

interface LeaderboardProps {
  data: PodLeaderboardEntry[]
  isLoading: boolean
  selectedPod: string
  playerCount?: number
}

const Leaderboard = ({
  data,
  isLoading,
  selectedPod,
  playerCount,
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

  const podiumPlayers = data.slice(0, RANKING.PODIUM_SIZE)
  const remainingPlayers = data.slice(RANKING.PODIUM_SIZE)

  return (
    <Card className="glow-purple border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>
          {selectedPod}
          {playerCount ? ` (${playerCount})` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {podiumPlayers.length > 0 && <Podium players={podiumPlayers} />}

        {remainingPlayers.length > 0 && (
          <div className="space-y-2">
            {remainingPlayers.map((player, index) => (
              <PlayerCard
                key={`${player.player_name}-${player.pod_name}`}
                player={player}
                rank={index + RANKING.PODIUM_SIZE + 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Leaderboard
