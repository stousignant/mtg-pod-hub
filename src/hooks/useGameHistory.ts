import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import { mockGameHistory, type GameHistoryEntry } from '@/data/mockData'
import { QUERY_KEYS, DB_TABLES } from '@/constants/config'

export const useGameHistory = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GAME_HISTORY],
    queryFn: async (): Promise<GameHistoryEntry[]> => {
      if (isSupabaseConnected() && supabase) {
        const { data, error } = await supabase
          .from(DB_TABLES.GAME_HISTORY)
          .select('*')

        if (error) {
          throw new Error(error.message)
        }

        return data || []
      }

      return mockGameHistory
    },
  })
}
