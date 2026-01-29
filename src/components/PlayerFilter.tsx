import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User } from 'lucide-react'

interface PlayerFilterProps {
  players: string[]
  selectedPlayer: string
  onPlayerChange: (player: string) => void
  allPlayersValue: string
}

const PlayerFilter = ({
  players,
  selectedPlayer,
  onPlayerChange,
  allPlayersValue,
}: PlayerFilterProps) => {
  return (
    <div className="flex items-center gap-3">
      <User className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedPlayer} onValueChange={onPlayerChange}>
        <SelectTrigger className="w-[200px] sm:w-[250px] bg-card border-primary/30 focus:ring-primary">
          <SelectValue placeholder="Filter by player" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem
            value={allPlayersValue}
            className="focus:bg-primary/20 focus:text-foreground"
          >
            All Players
          </SelectItem>
          {players.map(player => (
            <SelectItem
              key={player}
              value={player}
              className="focus:bg-primary/20 focus:text-foreground"
            >
              {player}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default PlayerFilter
