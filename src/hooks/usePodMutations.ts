import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import { DB_TABLES, QUERY_KEYS } from '@/constants/config'
import type { PodFormData } from '@/schemas/podSchema'

export const usePodMutations = () => {
  const queryClient = useQueryClient()

  const createPod = useMutation({
    mutationFn: async (input: PodFormData) => {
      if (!isSupabaseConnected() || !supabase) {
        throw new Error('Database not connected')
      }

      const { data, error } = await supabase
        .from(DB_TABLES.PODS)
        .insert({ name: input.name })
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PODS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POD_NAMES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POD_LEADERBOARD] })
    },
  })

  return { createPod }
}
