import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import { QUERY_KEYS } from '@/constants/config'
import type { PodFormData } from '@/schemas/podSchema'

export const usePodMutations = () => {
  const queryClient = useQueryClient()

  const createPod = useMutation({
    mutationFn: async (input: PodFormData) => {
      if (!isSupabaseConnected() || !supabase) {
        throw new Error('Database not connected')
      }

      const { data, error } = await supabase.rpc('create_pod_with_players', {
        p_name: input.name,
        p_player_ids: input.player_ids.map(Number),
      })

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PODS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POD_NAMES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POD_LEADERBOARD] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POD_MEMBERS] })
    },
  })

  return { createPod }
}
