import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import { mockDeckStats, type DeckStatsEntry } from '@/data/mockData'
import { QUERY_KEYS, DB_TABLES, DB_COLUMNS, SORT } from '@/constants/config'

export const useDeckStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DECK_STATS],
    queryFn: async (): Promise<DeckStatsEntry[]> => {
      if (isSupabaseConnected() && supabase) {
        const { data, error } = await supabase
          .from(DB_TABLES.DECK_STATS)
          .select('*')
          .order(DB_COLUMNS.DECK_STATS.WIN_RATE, {
            ascending: SORT.DIRECTION.ASCENDING,
          })

        if (error) {
          throw new Error(error.message)
        }

        return data || []
      }

      // Use mock data when Supabase is not connected
      return [...mockDeckStats].sort((a, b) => b.win_rate - a.win_rate)
    },
  })
}
