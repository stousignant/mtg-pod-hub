import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import { QUERY_KEYS, DB_TABLES } from '@/constants/config'
import type { PlayerFormData } from '@/schemas/playerSchema'

export const usePlayerMutations = () => {
  const queryClient = useQueryClient()

  const invalidatePlayerQueries = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYERS] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POD_LEADERBOARD] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DECK_STATS] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GAME_HISTORY] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POD_MEMBERS] })
  }

  const createPlayer = useMutation({
    mutationFn: async (input: PlayerFormData) => {
      if (!isSupabaseConnected() || !supabase) {
        throw new Error('Database not connected')
      }

      const { data, error } = await supabase
        .from(DB_TABLES.PLAYERS)
        .insert({
          name: input.name,
          avatar_url: input.avatar_url || null,
        })
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: invalidatePlayerQueries,
  })

  const updatePlayer = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: PlayerFormData
    }) => {
      if (!isSupabaseConnected() || !supabase) {
        throw new Error('Database not connected')
      }

      const { data, error } = await supabase
        .from(DB_TABLES.PLAYERS)
        .update({
          name: input.name,
          avatar_url: input.avatar_url || null,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: invalidatePlayerQueries,
  })

  return { createPlayer, updatePlayer }
}
