import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PodLeaderboardEntry } from '@/data/mockData'
import { RANKING, UI } from '@/constants/config'

interface PodiumProps {
  players: (PodLeaderboardEntry & { rank: number })[]
}

const RANK_STYLES = {
  1: {
    height: RANKING.PODIUM_HEIGHT.FIRST,
    mobileHeight: 240,
    borderColor: 'border-gold',
    glowColor: 'shadow-gold/30',
    rankColor: 'text-gold',
  },
  2: {
    height: RANKING.PODIUM_HEIGHT.SECOND,
    mobileHeight: 180,
    borderColor: 'border-gray-400',
    glowColor: 'shadow-gray-400/30',
    rankColor: 'text-gray-300',
  },
  3: {
    height: RANKING.PODIUM_HEIGHT.THIRD,
    mobileHeight: 180,
    borderColor: 'border-amber-700',
    glowColor: 'shadow-amber-700/30',
    rankColor: 'text-amber-600',
  },
}

const getStyleForRank = (rank: number) => {
  if (rank === 1) return RANK_STYLES[1]
  if (rank === 2) return RANK_STYLES[2]
  return RANK_STYLES[3]
}

const getRankLabel = (rank: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const value = rank % 100
  return rank + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
}

const PodiumCard = ({
  player,
}: {
  player: PodLeaderboardEntry & { rank: number }
}) => {
  const hasAvatar = !!player.avatar_url
  const rankLabel = getRankLabel(player.rank)
  const style = getStyleForRank(player.rank)

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden border-2 h-full',
        'transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105',
        style.borderColor,
        `shadow-lg ${style.glowColor}`,
        player.rank === 1 && 'foil-effect'
      )}
      style={{
        backgroundImage: hasAvatar ? `url(${player.avatar_url})` : undefined,
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
          {player.rank === 1 && <Trophy className="h-8 w-8 text-gold" />}
          <span className={cn('text-3xl font-black', style.rankColor)}>
            {rankLabel}
          </span>
        </div>

        <h3 className="text-white font-bold text-base sm:text-lg truncate">
          {player.player_name}
        </h3>

        <div className="flex flex-col gap-0.5 mt-1 text-sm">
          <span className="text-white/80 font-semibold">
            {player.points} pts
          </span>
          <div className="flex gap-2 text-white/60">
            <span>W: {player.wins}</span>
            <span>D: {player.draws}</span>
            <span>L: {player.losses}</span>
          </div>
          <span className="font-semibold text-amber-400">
            {player.win_rate.toFixed(UI.DECIMAL_PLACES.WIN_RATE)}%
          </span>
        </div>
      </div>
    </div>
  )
}

const Podium = ({ players }: PodiumProps) => {
  // For desktop: arrange in Olympic podium order (2-1-3) when no ties, otherwise display in order
  const hasTies = players.length >= 2 && players[0].rank === players[1].rank
  const desktopOrder = hasTies
    ? players
    : [players[1], players[0], players[2]].filter(Boolean)

  return (
    <div className="mb-8">
      {/* Mobile: stacked layout */}
      <div className="flex flex-col gap-3 sm:hidden">
        {players.map((player, index) => {
          const style = getStyleForRank(player.rank)
          return (
            <div
              key={`${player.player_name}-${index}`}
              style={{ height: `${style.mobileHeight}px` }}
            >
              <PodiumCard player={player} />
            </div>
          )
        })}
      </div>

      {/* Desktop: Olympic podium layout */}
      <div className="hidden sm:flex items-end justify-center gap-6">
        {desktopOrder.map((player, index) => {
          const style = getStyleForRank(player.rank)
          return (
            <div
              key={`${player.player_name}-${index}`}
              className="flex-1 max-w-[280px]"
              style={{ height: `${style.height}px` }}
            >
              <PodiumCard player={player} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Podium
