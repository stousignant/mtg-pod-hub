import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OUTCOME, QUERY_KEYS } from '@/constants/config'
import { useGameMutations } from './useGameMutations'

const mocks = vi.hoisted(() => ({ rpc: vi.fn() }))

vi.mock('@/lib/supabaseClient', () => ({
  supabase: { rpc: mocks.rpc },
}))

const makeWrapper =
  (queryClient: QueryClient) =>
  ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

describe('useGameMutations updateGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.rpc.mockResolvedValue({ data: { id: 42 }, error: null })
  })

  it('sends the exact normalized RPC payload and invalidates every game consumer', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useGameMutations(), {
      wrapper: makeWrapper(queryClient),
    })
    const input = {
      pod_id: '7',
      game_date: '2026-07-31',
      notes: '',
      results: [
        {
          player_id: '11',
          deck_id: '101',
          outcome: OUTCOME.WIN,
          unsatisfying: true,
        },
        {
          player_id: '12',
          deck_id: '102',
          outcome: OUTCOME.LOSS,
          unsatisfying: false,
        },
      ],
    }

    await act(async () => {
      await result.current.updateGame.mutateAsync({ id: '42', input })
    })

    expect(mocks.rpc).toHaveBeenCalledWith('update_game_with_results', {
      p_game_id: '42',
      p_pod_id: '7',
      p_played_at: '2026-07-31',
      p_notes: null,
      p_results: input.results,
    })
    for (const key of [
      QUERY_KEYS.POD_LEADERBOARD,
      QUERY_KEYS.DECK_STATS,
      QUERY_KEYS.GAME_HISTORY,
      QUERY_KEYS.ADMIN_GAMES,
    ]) {
      expect(invalidate).toHaveBeenCalledWith({ queryKey: [key] })
    }
  })

  it('surfaces RPC errors', async () => {
    mocks.rpc.mockResolvedValue({
      data: null,
      error: { message: 'replacement rejected' },
    })
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const { result } = renderHook(() => useGameMutations(), {
      wrapper: makeWrapper(queryClient),
    })

    await expect(
      result.current.updateGame.mutateAsync({
        id: '42',
        input: {
          pod_id: '7',
          game_date: '2026-07-31',
          results: [],
        },
      })
    ).rejects.toThrow('replacement rejected')
  })
})
