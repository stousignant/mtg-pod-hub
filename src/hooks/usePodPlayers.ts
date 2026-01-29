import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConnected } from '@/lib/supabaseClient'
import { QUERY_KEYS } from '@/constants/config'

interface PodPlayer {
  id: number
  name: string
  avatar_url: string | null
}

export const usePodPlayers = (podId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLAYERS, 'pod', podId],
    queryFn: async (): Promise<PodPlayer[]> => {
      if (!podId || !isSupabaseConnected() || !supabase) {
        return []
      }

      const { data, error } = await supabase
        .from('game_results')
        .select(
          'player_id, players!inner(id, name, avatar_url), games!inner(pod_id)'
        )
        .eq('games.pod_id', podId)

      if (error) {
        throw new Error(error.message)
      }

      const uniquePlayers = new Map<number, PodPlayer>()
      for (const row of data || []) {
        const player = row.players as unknown as PodPlayer
        if (!uniquePlayers.has(player.id)) {
          uniquePlayers.set(player.id, player)
        }
      }

      return Array.from(uniquePlayers.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    },
    enabled: !!podId,
  })
}
