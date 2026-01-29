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
import { UI, WIN_RATE, RANKING } from '@/constants/config'

interface DeckStatsTableProps {
  data: DeckStatsEntry[]
  isLoading: boolean
}

const DeckStatsTable = ({ data, isLoading }: DeckStatsTableProps) => {
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
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glow-purple border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Deck Statistics
        </CardTitle>
        <CardDescription>All decks ranked by win rate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((deck, index) => {
            const isFirst = index === RANKING.FIRST_PLACE_INDEX
            const hasImage = !!deck.commander_image_url

            return (
              <div
                key={`${deck.deck_name}-${deck.owner_name}`}
                className={cn(
                  'relative rounded-lg overflow-hidden border h-40 sm:h-44 transition-all duration-200 hover:border-primary/30',
                  isFirst ? 'border-gold' : 'border-border/50'
                )}
                style={{
                  backgroundImage: hasImage
                    ? `url(${deck.commander_image_url})`
                    : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                }}
              >
                {!hasImage && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-purple-950/80" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative h-full flex items-end justify-between px-4 pb-3">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={cn(
                        'font-bold text-base',
                        isFirst ? 'text-gold' : 'text-white'
                      )}
                    >
                      {deck.deck_name}
                    </span>
                    <span className="text-sm text-white/60">
                      {deck.commander_name}
                    </span>
                    <span className="text-xs text-white/40 hidden sm:inline">
                      {deck.owner_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 text-sm">
                    <span className="text-white/60 hidden md:inline">
                      {deck.games_played} games
                    </span>
                    <span className="text-white/60 hidden md:inline">
                      {deck.wins} wins
                    </span>
                    <span
                      className={cn(
                        'font-semibold text-base',
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
