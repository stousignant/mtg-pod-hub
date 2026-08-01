import type { PropsWithChildren } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OUTCOME } from '@/constants/config'
import { useAdminGames } from './useAdminGames'

const mocks = vi.hoisted(() => ({
  isSupabaseConnected: vi.fn(),
  from: vi.fn(),
  select: vi.fn(),
  firstOrder: vi.fn(),
  secondOrder: vi.fn(),
}))

vi.mock('@/lib/supabaseClient', () => ({
  isSupabaseConnected: mocks.isSupabaseConnected,
  supabase: { from: mocks.from },
}))

describe('useAdminGames', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.isSupabaseConnected.mockReturnValue(true)
    mocks.secondOrder.mockResolvedValue({
      data: [
        {
          id: 9,
          pod_id: 2,
          played_at: '2026-08-01T00:00:00Z',
          notes: 'Latest',
          game_results: [
            {
              player_id: 4,
              deck_id: 8,
              outcome: OUTCOME.WIN,
              unsatisfying: null,
            },
          ],
        },
      ],
      error: null,
    })
    mocks.firstOrder.mockReturnValue({ order: mocks.secondOrder })
    mocks.select.mockReturnValue({ order: mocks.firstOrder })
    mocks.from.mockReturnValue({ select: mocks.select })
  })

  it('queries canonical nested rows newest-first and maps database IDs', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    const { result } = renderHook(() => useAdminGames(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mocks.select).toHaveBeenCalledWith(
      'id, pod_id, played_at, notes, game_results(player_id, deck_id, outcome, unsatisfying)'
    )
    expect(mocks.firstOrder).toHaveBeenCalledWith('played_at', {
      ascending: false,
    })
    expect(mocks.secondOrder).toHaveBeenCalledWith('id', { ascending: false })
    expect(result.current.data).toEqual([
      {
        id: '9',
        pod_id: '2',
        played_at: '2026-08-01T00:00:00Z',
        notes: 'Latest',
        results: [
          {
            player_id: '4',
            deck_id: '8',
            outcome: OUTCOME.WIN,
            unsatisfying: false,
          },
        ],
      },
    ])
  })
})
