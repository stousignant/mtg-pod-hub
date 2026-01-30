import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import { QUERY_KEYS, DB_TABLES } from '@/constants/config'
import type { DeckFormData } from '@/schemas/deckSchema'

export const useDeckMutations = () => {
  const queryClient = useQueryClient()

  const createDeck = useMutation({
    mutationFn: async (input: DeckFormData) => {
      if (!isSupabaseConnected() || !supabase) {
        throw new Error('Database not connected')
      }

      const { data, error } = await supabase
        .from(DB_TABLES.DECKS)
        .insert({
          name: input.name,
          commander_name: input.commander_name,
          owner_id: input.owner_id,
          commander_image_url: input.commander_image_url || null,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DECKS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DECK_STATS] })
    },
  })

  return { createDeck }
}
