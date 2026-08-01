import { z } from 'zod'

export const podFormSchema = z.object({
  name: z.string().trim().min(1, 'Pod name is required'),
  player_ids: z.array(z.string()).min(1, 'Select at least one player'),
})

export type PodFormData = z.infer<typeof podFormSchema>
