import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import { mockPlayers, type Player } from '@/data/mockData'
import { QUERY_KEYS, DB_TABLES } from '@/constants/config'

export const usePlayers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLAYERS],
    queryFn: async (): Promise<Player[]> => {
      if (isSupabaseConnected() && supabase) {
        const { data, error } = await supabase
          .from(DB_TABLES.PLAYERS)
          .select('id, name, avatar_url')
          .order('name')

        if (error) {
          throw new Error(error.message)
        }

        return data || []
      }

      return mockPlayers.sort((a, b) => a.name.localeCompare(b.name))
    },
  })
}
