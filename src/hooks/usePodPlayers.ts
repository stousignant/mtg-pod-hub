import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import { QUERY_KEYS, DB_TABLES } from '@/constants/config'
import { mockPodMembers, mockPlayers } from '@/data/mockData'

interface PodPlayer {
  id: number
  name: string
  avatar_url: string | null
}

export const usePodPlayers = (podId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POD_MEMBERS, podId],
    queryFn: async (): Promise<PodPlayer[]> => {
      if (!podId) {
        return []
      }

      if (!isSupabaseConnected() || !supabase) {
        const memberPlayerIds = mockPodMembers
          .filter(member => member.pod_id === podId)
          .map(member => member.player_id)

        return mockPlayers
          .filter(player => memberPlayerIds.includes(player.id))
          .map(player => ({ ...player, id: Number(player.id) }))
          .sort((a, b) => a.name.localeCompare(b.name))
      }

      const { data, error } = await supabase
        .from(DB_TABLES.POD_MEMBERS)
        .select('players(id, name, avatar_url)')
        .eq('pod_id', podId)

      if (error) {
        throw new Error(error.message)
      }

      return (data || [])
        .map(row => row.players as unknown as PodPlayer)
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    enabled: !!podId,
  })
}
