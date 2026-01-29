import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { QUERY_KEYS, DB_TABLES } from '@/constants/config'

interface GameResult {
  player_id: string
  deck_id: string
  placement: number
}

interface CreateGameInput {
  pod_id: string
  game_date: string
  results: GameResult[]
}

export const useGameMutations = () => {
  const queryClient = useQueryClient()

  const createGame = useMutation({
    mutationFn: async (input: CreateGameInput) => {
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
          game_date: input.game_date,
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
        placement: result.placement,
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
    },
  })

  return {
    createGame,
  }
}
