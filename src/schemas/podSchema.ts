import { z } from 'zod'

export const podFormSchema = z.object({
  name: z.string().trim().min(1, 'Pod name is required'),
})

export type PodFormData = z.infer<typeof podFormSchema>
