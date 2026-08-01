import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { QUERY_KEYS, DB_TABLES, type Outcome } from '@/constants/config'

interface GameResult {
  player_id: string
  deck_id: string
  outcome: Outcome
  unsatisfying: boolean
}

export interface GameInput {
  pod_id: string
  game_date: string
  notes?: string
  results: GameResult[]
}

interface UpdateGameInput {
  id: string
  input: GameInput
}

export const useGameMutations = () => {
  const queryClient = useQueryClient()

  const createGame = useMutation({
    mutationFn: async (input: GameInput) => {
      if (!supabase) {
        throw new Error('Supabase not configured')
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data: gameData, error: gameError } = await supabase
        .from(DB_TABLES.GAMES)
        .insert({
          pod_id: input.pod_id,
          played_at: input.game_date,
          notes: input.notes || null,
          created_by: user.id,
        })
        .select()
        .single()

      if (gameError) {
        throw new Error(gameError.message)
      }

      const gameResultsData = input.results.map(result => ({
        game_id: gameData.id,
        player_id: result.player_id,
        deck_id: result.deck_id,
        outcome: result.outcome,
        unsatisfying: result.unsatisfying,
      }))

      const { error: resultsError } = await supabase
        .from(DB_TABLES.GAME_RESULTS)
        .insert(gameResultsData)

      if (resultsError) {
        await supabase.from(DB_TABLES.GAMES).delete().eq('id', gameData.id)
        throw new Error(resultsError.message)
      }

      return gameData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POD_LEADERBOARD] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DECK_STATS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GAME_HISTORY] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_GAMES] })
    },
  })

  const updateGame = useMutation({
    mutationFn: async ({ id, input }: UpdateGameInput) => {
      if (!supabase) throw new Error('Supabase not configured')

      const { data, error } = await supabase.rpc('update_game_with_results', {
        p_game_id: id,
        p_pod_id: input.pod_id,
        p_played_at: input.game_date,
        p_notes: input.notes || null,
        p_results: input.results.map(result => ({
          player_id: result.player_id,
          deck_id: result.deck_id,
          outcome: result.outcome,
          unsatisfying: result.unsatisfying,
        })),
      })

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POD_LEADERBOARD] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DECK_STATS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GAME_HISTORY] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_GAMES] })
    },
  })

  return { createGame, updateGame }
}
