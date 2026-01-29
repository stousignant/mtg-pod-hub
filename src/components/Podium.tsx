import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PodLeaderboardEntry } from '@/data/mockData'
import { RANKING, WIN_RATE, UI } from '@/constants/config'

interface PodiumProps {
  players: PodLeaderboardEntry[]
}

const PODIUM_CONFIG = [
  {
    rank: 2,
    index: 1,
    height: RANKING.PODIUM_HEIGHT.SECOND,
    borderColor: 'border-gray-400',
    glowColor: 'shadow-gray-400/30',
    rankColor: 'text-gray-300',
    label: '2nd',
  },
  {
    rank: 1,
    index: 0,
    height: RANKING.PODIUM_HEIGHT.FIRST,
    borderColor: 'border-gold',
    glowColor: 'shadow-gold/30',
    rankColor: 'text-gold',
    label: '1st',
  },
  {
    rank: 3,
    index: 2,
    height: RANKING.PODIUM_HEIGHT.THIRD,
    borderColor: 'border-amber-700',
    glowColor: 'shadow-amber-700/30',
    rankColor: 'text-amber-600',
    label: '3rd',
  },
]

const getWinRateColor = (winRate: number) => {
  if (winRate >= WIN_RATE.THRESHOLD.GOOD) return WIN_RATE.COLOR.GOOD
  if (winRate >= WIN_RATE.THRESHOLD.AVERAGE) return WIN_RATE.COLOR.AVERAGE
  return WIN_RATE.COLOR.POOR
}

const Podium = ({ players }: PodiumProps) => {
  return (
    <div className="flex items-end justify-center gap-3 sm:gap-4 mb-8">
      {PODIUM_CONFIG.map(config => {
        const player = players[config.index]
        if (!player) return null

        const hasAvatar = !!player.avatar_url

        return (
          <div
            key={player.player_name}
            className={cn(
              'relative rounded-xl overflow-hidden border-2 flex-1 max-w-[200px]',
              'transition-all duration-300 hover:scale-105',
              config.borderColor,
              `shadow-lg ${config.glowColor}`
            )}
            style={{
              height: `${config.height}px`,
              backgroundImage: hasAvatar
                ? `url(${player.avatar_url})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {!hasAvatar && (
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 to-purple-950" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

            <div className="relative h-full flex flex-col justify-end p-3 sm:p-4">
              <div className="flex items-center gap-1 mb-1">
                {config.rank === 1 && <Trophy className="h-5 w-5 text-gold" />}
                <span className={cn('text-sm font-bold', config.rankColor)}>
                  {config.label}
                </span>
              </div>

              <h3 className="text-white font-bold text-sm sm:text-base truncate">
                {player.player_name}
              </h3>

              <div className="flex flex-col gap-0.5 mt-1 text-xs sm:text-sm">
                <span className="text-white/80 font-semibold">
                  {player.points} pts
                </span>
                <span className="text-white/60">
                  {player.wins}-{player.draws}-{player.losses}
                </span>
                <span
                  className={cn(
                    'font-semibold',
                    getWinRateColor(player.win_rate)
                  )}
                >
                  {player.win_rate.toFixed(UI.DECIMAL_PLACES.WIN_RATE)}%
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Podium
