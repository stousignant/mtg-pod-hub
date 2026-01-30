import { z } from 'zod'
import { GAME_ENTRY, OUTCOME } from '@/constants/config'

const outcomeValues = [OUTCOME.WIN, OUTCOME.LOSS, OUTCOME.DRAW] as const

export const gameResultSchema = z.object({
  player_id: z.string().min(1, 'Player is required'),
  deck_id: z.string().min(1, 'Deck is required'),
  outcome: z.enum(outcomeValues, { required_error: 'Outcome is required' }),
})

export const gameFormSchema = z.object({
  pod_id: z.string().min(1, 'Pod is required'),
  game_date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
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

export type GameFormData = z.infer<typeof gameFormSchema>
