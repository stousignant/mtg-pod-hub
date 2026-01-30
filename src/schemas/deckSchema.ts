import { z } from 'zod'

export const deckFormSchema = z.object({
  name: z.string().min(1, 'Deck name is required').max(100),
  commander_name: z.string().min(1, 'Commander name is required').max(100),
  owner_id: z.string().min(1, 'Owner is required'),
  commander_image_url: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
})

export type DeckFormData = z.infer<typeof deckFormSchema>
