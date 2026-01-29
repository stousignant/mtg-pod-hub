import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import { mockPods, type Pod } from '@/data/mockData'
import { QUERY_KEYS, DB_TABLES } from '@/constants/config'

export const usePods = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PODS],
    queryFn: async (): Promise<Pod[]> => {
      if (isSupabaseConnected() && supabase) {
        const { data, error } = await supabase
          .from(DB_TABLES.PODS)
          .select('id, pod_name')
          .order('pod_name')

        if (error) {
          throw new Error(error.message)
        }

        return data || []
      }

      return mockPods.sort((a, b) => a.pod_name.localeCompare(b.pod_name))
    },
  })
}
