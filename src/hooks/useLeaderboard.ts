import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import {
  mockPodLeaderboard,
  getUniquePods,
  filterByPod,
  type PodLeaderboardEntry,
} from '@/data/mockData'
import { QUERY_KEYS, DB_TABLES, DB_COLUMNS, SORT } from '@/constants/config'

export const useLeaderboard = (selectedPod?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POD_LEADERBOARD, selectedPod],
    queryFn: async (): Promise<PodLeaderboardEntry[]> => {
      if (isSupabaseConnected() && supabase) {
        let query = supabase.from(DB_TABLES.POD_LEADERBOARD).select('*')

        if (selectedPod) {
          query = query.eq(DB_COLUMNS.POD_LEADERBOARD.POD_NAME, selectedPod)
        }

        const { data, error } = await query.order(
          DB_COLUMNS.POD_LEADERBOARD.POINTS,
          {
            ascending: SORT.DIRECTION.ASCENDING,
          }
        )

        if (error) {
          throw new Error(error.message)
        }

        return data || []
      }

      // Use mock data when Supabase is not connected
      if (selectedPod) {
        return filterByPod(mockPodLeaderboard, selectedPod)
      }
      return mockPodLeaderboard.sort((a, b) => b.points - a.points)
    },
  })
}

export const usePodNames = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.POD_NAMES],
    queryFn: async (): Promise<string[]> => {
      if (isSupabaseConnected() && supabase) {
        const { data, error } = await supabase
          .from(DB_TABLES.POD_LEADERBOARD)
          .select(DB_COLUMNS.POD_LEADERBOARD.POD_NAME)

        if (error) {
          throw new Error(error.message)
        }

        return [...new Set((data || []).map(d => d.pod_name))]
      }

      // Use mock data when Supabase is not connected
      return getUniquePods(mockPodLeaderboard)
    },
  })
}
