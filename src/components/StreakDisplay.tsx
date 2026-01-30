import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreakDisplayProps {
  currentStreak?: number
  currentStreakType?: 'win' | 'loss' | null
  bestWinStreak?: number
  worstLoseStreak?: number
  showTrashTestWarning?: boolean
}

export const StreakDisplay = ({
  currentStreak,
  currentStreakType,
  bestWinStreak,
  worstLoseStreak,
  showTrashTestWarning = false,
}: StreakDisplayProps) => {
  const hasAnyStreak =
    currentStreakType ||
    (bestWinStreak && bestWinStreak > 0) ||
    (worstLoseStreak && worstLoseStreak > 0)

  if (!hasAnyStreak) return null

  return (
    <div className="flex items-center gap-4 text-xs border-t border-border/30 pt-2">
      {/* Current Streak */}
      {currentStreakType && currentStreak && (
        <div
          className={cn(
            'flex items-center gap-1',
            showTrashTestWarning && 'text-rose-400'
          )}
        >
          {showTrashTestWarning && <AlertTriangle className="h-3.5 w-3.5" />}
          {currentStreakType === 'win' ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          <span className="text-muted-foreground">
            Current: {currentStreak} {currentStreakType === 'win' ? 'W' : 'L'}
          </span>
        </div>
      )}

      {/* Best Win Streak */}
      {bestWinStreak && bestWinStreak > 0 && (
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400/60" />
          <span className="text-muted-foreground">Best: {bestWinStreak} W</span>
        </div>
      )}

      {/* Worst Lose Streak */}
      {worstLoseStreak && worstLoseStreak > 0 && (
        <div className="flex items-center gap-1">
          <TrendingDown className="h-3.5 w-3.5 text-rose-400/60" />
          <span className="text-muted-foreground">
            Worst: {worstLoseStreak} L
          </span>
        </div>
      )}
    </div>
  )
}
