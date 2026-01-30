import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import { mockDecks, type Deck } from '@/data/mockData'
import { QUERY_KEYS, DB_TABLES } from '@/constants/config'

export const useDecks = (playerId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DECKS, playerId],
    queryFn: async (): Promise<Deck[]> => {
      if (isSupabaseConnected() && supabase) {
        let query = supabase
          .from(DB_TABLES.DECKS)
          .select('id, name, commander_name, owner_id, commander_image_url')

        if (playerId) {
          query = query.eq('owner_id', playerId)
        }

        const { data, error } = await query.order('name')

        if (error) {
          throw new Error(error.message)
        }

        return data || []
      }

      const filteredDecks = playerId
        ? mockDecks.filter(deck => deck.owner_id === playerId)
        : mockDecks

      return filteredDecks.sort((a, b) => a.name.localeCompare(b.name))
    },
  })
}
