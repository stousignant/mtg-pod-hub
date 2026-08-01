import { useQuery } from '@tanstack/react-query'
import { DB_TABLES, QUERY_KEYS, type Outcome } from '@/constants/config'
import { isSupabaseConnected, supabase } from '@/lib/supabaseClient'

export interface AdminGameResult {
  player_id: string
  deck_id: string
  outcome: Outcome
  unsatisfying: boolean
}

export interface AdminGame {
  id: string
  pod_id: string
  played_at: string
  notes: string | null
  results: AdminGameResult[]
}

interface RawAdminGame {
  id: string | number
  pod_id: string | number
  played_at: string
  notes: string | null
  game_results: Array<{
    player_id: string | number
    deck_id: string | number
    outcome: Outcome
    unsatisfying: boolean | null
  }> | null
}

export const mapAdminGames = (rows: RawAdminGame[]): AdminGame[] =>
  rows.map(game => ({
    id: String(game.id),
    pod_id: String(game.pod_id),
    played_at: game.played_at,
    notes: game.notes,
    results: (game.game_results ?? []).map(result => ({
      player_id: String(result.player_id),
      deck_id: String(result.deck_id),
      outcome: result.outcome,
      unsatisfying: result.unsatisfying ?? false,
    })),
  }))

export const useAdminGames = () =>
  useQuery({
    queryKey: [QUERY_KEYS.ADMIN_GAMES],
    queryFn: async (): Promise<AdminGame[]> => {
      // The aggregate history mock lacks canonical player IDs, so an empty list
      // is safer than exposing editable fake data while offline.
      if (!isSupabaseConnected() || !supabase) return []

      const { data, error } = await supabase
        .from(DB_TABLES.GAMES)
        .select(
          'id, pod_id, played_at, notes, game_results(player_id, deck_id, outcome, unsatisfying)'
        )
        .order('played_at', { ascending: false })
        .order('id', { ascending: false })

      if (error) throw new Error(error.message)

      return mapAdminGames((data ?? []) as RawAdminGame[])
    },
  })
