import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Users } from 'lucide-react'
import { PLAYER_COUNT_FILTER } from '@/constants/config'

interface PlayerCountFilterProps {
  playerCounts: number[]
  selectedCount: string
  onCountChange: (count: string) => void
  isLoading: boolean
}

const PlayerCountFilter = ({
  playerCounts,
  selectedCount,
  onCountChange,
  isLoading,
}: PlayerCountFilterProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-muted-foreground" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
    )
  }

  const uniqueCounts = Array.from(new Set(playerCounts)).sort((a, b) => a - b)

  return (
    <div className="flex items-center gap-3">
      <Users className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedCount} onValueChange={onCountChange}>
        <SelectTrigger className="w-[180px] sm:w-[220px] bg-card border-primary/30 focus:ring-primary">
          <SelectValue placeholder="Player count" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem
            value={PLAYER_COUNT_FILTER.ALL_PLAYER_COUNTS}
            className="focus:bg-primary/20 focus:text-foreground"
          >
            All Player Counts
          </SelectItem>
          {uniqueCounts.map(count => (
            <SelectItem
              key={count}
              value={count.toString()}
              className="focus:bg-primary/20 focus:text-foreground"
            >
              {count} {count === 1 ? 'player' : 'players'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default PlayerCountFilter
