import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DeckStatsEntry } from '@/data/mockData'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import PlayerFilter from './PlayerFilter'
import { UI, WIN_RATE, RANKING } from '@/constants/config'

interface DeckStatsTableProps {
  data: DeckStatsEntry[]
  isLoading: boolean
  players: string[]
  selectedPlayer: string
  onPlayerChange: (player: string) => void
  allPlayersValue: string
  hideLowPlayDecks: boolean
  onHideLowPlayDecksChange: (value: boolean) => void
}

const DeckStatsTable = ({
  data,
  isLoading,
  players,
  selectedPlayer,
  onPlayerChange,
  allPlayersValue,
  hideLowPlayDecks,
  onHideLowPlayDecksChange,
}: DeckStatsTableProps) => {
  if (isLoading) {
    return (
      <Card className="glow-purple">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(UI.SKELETON_LOADING_COUNT.DECK_STATS)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glow-purple border-primary/20">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Deck Statistics
          </CardTitle>
          <CardDescription>All decks ranked by win rate</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="hide-low-play"
              checked={hideLowPlayDecks}
              onCheckedChange={onHideLowPlayDecksChange}
            />
            <Label
              htmlFor="hide-low-play"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Hide low play decks
            </Label>
          </div>
          <PlayerFilter
            players={players}
            selectedPlayer={selectedPlayer}
            onPlayerChange={onPlayerChange}
            allPlayersValue={allPlayersValue}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((deck, index) => {
            const isFirst = index === RANKING.FIRST_PLACE_INDEX
            const hasImage = !!deck.commander_image_url

            return (
              <div
                key={`${deck.deck_name}-${deck.owner_name}`}
                className={cn(
                  'relative rounded-xl overflow-hidden border-2 transition-all duration-200 hover:border-primary/30',
                  isFirst ? 'border-gold' : 'border-border/50'
                )}
              >
                {/* Commander art section */}
                <div
                  className="relative h-48 sm:h-72"
                  style={{
                    backgroundImage: hasImage
                      ? `url(${deck.commander_image_url})`
                      : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 25%',
                  }}
                >
                  {!hasImage && (
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 to-purple-950" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                  {/* Deck name overlaid at bottom of image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3
                      className={cn(
                        'font-black text-xl sm:text-2xl',
                        isFirst ? 'text-gold' : 'text-white'
                      )}
                    >
                      {deck.deck_name}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base">
                      {deck.commander_name}
                    </p>
                  </div>
                </div>

                {/* Stats bar */}
                <div className="bg-card/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {deck.owner_name}
                  </span>

                  <div className="flex items-center gap-4 sm:gap-6 text-sm">
                    <div className="flex gap-3 text-muted-foreground">
                      <span>{deck.games_played} games</span>
                      <span>{deck.wins} wins</span>
                    </div>
                    <span
                      className={cn(
                        'font-bold text-lg',
                        deck.win_rate >= WIN_RATE.THRESHOLD.GOOD
                          ? WIN_RATE.COLOR.GOOD
                          : deck.win_rate >= WIN_RATE.THRESHOLD.AVERAGE
                            ? WIN_RATE.COLOR.AVERAGE
                            : WIN_RATE.COLOR.POOR
                      )}
                    >
                      {deck.win_rate.toFixed(UI.DECIMAL_PLACES.WIN_RATE)}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default DeckStatsTable
