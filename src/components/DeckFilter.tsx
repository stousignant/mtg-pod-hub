import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Layers } from 'lucide-react'

interface DeckFilterProps {
  decks: string[]
  selectedDeck: string
  onDeckChange: (deck: string) => void
  isLoading: boolean
  allDecksValue: string
}

const DeckFilter = ({
  decks,
  selectedDeck,
  onDeckChange,
  isLoading,
  allDecksValue,
}: DeckFilterProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Layers className="h-5 w-5 text-muted-foreground" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Layers className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedDeck} onValueChange={onDeckChange}>
        <SelectTrigger className="w-[200px] sm:w-[250px] bg-card border-primary/30 focus:ring-primary">
          <SelectValue placeholder="Select a deck" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem
            value={allDecksValue}
            className="focus:bg-primary/20 focus:text-foreground"
          >
            All Decks
          </SelectItem>
          {decks.map(deck => (
            <SelectItem
              key={deck}
              value={deck}
              className="focus:bg-primary/20 focus:text-foreground"
            >
              {deck}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default DeckFilter
