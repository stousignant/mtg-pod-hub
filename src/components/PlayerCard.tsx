import { cn } from '@/lib/utils'
import type { PodLeaderboardEntry } from '@/data/mockData'
import { WIN_RATE, UI } from '@/constants/config'

interface PlayerCardProps {
  player: PodLeaderboardEntry
  rank: number
}

const getWinRateColor = (winRate: number) => {
  if (winRate >= WIN_RATE.THRESHOLD.GOOD) return WIN_RATE.COLOR.GOOD
  if (winRate >= WIN_RATE.THRESHOLD.AVERAGE) return WIN_RATE.COLOR.AVERAGE
  return WIN_RATE.COLOR.POOR
}

const PlayerCard = ({ player, rank }: PlayerCardProps) => {
  const hasAvatar = !!player.avatar_url

  return (
    <div
      className="relative rounded-lg overflow-hidden border border-border/50 h-20 transition-all duration-200 hover:border-primary/30"
      style={{
        backgroundImage: hasAvatar ? `url(${player.avatar_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!hasAvatar && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-purple-950/80" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

      <div className="relative h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground font-bold text-lg w-8">
            {rank}
          </span>
          <span className="text-white font-medium truncate">
            {player.player_name}
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-sm">
          <span className="text-white/80 font-semibold hidden sm:inline">
            {player.points} pts
          </span>
          <span className="text-white/60 hidden md:inline">
            {player.wins}-{player.draws}-{player.losses}
          </span>
          <span
            className={cn('font-semibold', getWinRateColor(player.win_rate))}
          >
            {player.win_rate.toFixed(UI.DECIMAL_PLACES.WIN_RATE)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard
