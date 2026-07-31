import { z } from 'zod'

export const playerFormSchema = z.object({
  name: z.string().min(1, 'Player name is required').max(100),
  avatar_url: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
})

export type PlayerFormData = z.infer<typeof playerFormSchema>
