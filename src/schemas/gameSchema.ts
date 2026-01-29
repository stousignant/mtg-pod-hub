import { z } from 'zod'
import { GAME_ENTRY } from '@/constants/config'

export const gameResultSchema = z.object({
  player_id: z.string().min(1, 'Player is required'),
  deck_id: z.string().min(1, 'Deck is required'),
  placement: z
    .number()
    .min(
      GAME_ENTRY.PLACEMENT.MIN,
      `Placement must be at least ${GAME_ENTRY.PLACEMENT.MIN}`
    )
    .max(
      GAME_ENTRY.PLACEMENT.MAX,
      `Placement must be at most ${GAME_ENTRY.PLACEMENT.MAX}`
    ),
})

export const gameFormSchema = z
  .object({
    pod_id: z.string().min(1, 'Pod is required'),
    game_date: z.string().min(1, 'Date is required'),
    results: z
      .array(gameResultSchema)
      .min(
        GAME_ENTRY.DEFAULT_PLAYER_COUNT,
        `At least ${GAME_ENTRY.DEFAULT_PLAYER_COUNT} players required`
      )
      .max(
        GAME_ENTRY.MAX_PLAYERS,
        `Maximum ${GAME_ENTRY.MAX_PLAYERS} players allowed`
      ),
  })
  .refine(
    data => {
      const placements = data.results.map(r => r.placement)
      const uniquePlacements = new Set(placements)
      return placements.length === uniquePlacements.size
    },
    {
      message: 'Each player must have a unique placement',
      path: ['results'],
    }
  )

export type GameFormData = z.infer<typeof gameFormSchema>
