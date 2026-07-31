import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QUERY_KEYS } from '@/constants/config'
import { useDeckMutations } from './useDeckMutations'

const mocks = vi.hoisted(() => ({
  isSupabaseConnected: vi.fn(),
  from: vi.fn(),
  update: vi.fn(),
  eq: vi.fn(),
  select: vi.fn(),
  single: vi.fn(),
}))

vi.mock('@/lib/supabaseClient', () => ({
  isSupabaseConnected: mocks.isSupabaseConnected,
  supabase: { from: mocks.from },
}))

describe('useDeckMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.isSupabaseConnected.mockReturnValue(true)
    mocks.single.mockResolvedValue({ data: { id: 'deck-1' }, error: null })
    mocks.select.mockReturnValue({ single: mocks.single })
    mocks.eq.mockReturnValue({ select: mocks.select })
    mocks.update.mockReturnValue({ eq: mocks.eq })
    mocks.from.mockReturnValue({ update: mocks.update })
  })

  it('updates the selected deck and invalidates deck queries', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    const { result } = renderHook(() => useDeckMutations(), { wrapper })
    const input = {
      name: 'Updated Deck',
      commander_name: 'Updated Commander',
      owner_id: 'player-2',
      commander_image_url: '',
    }

    await act(async () => {
      await result.current.updateDeck.mutateAsync({ id: 'deck-1', input })
    })

    expect(mocks.update).toHaveBeenCalledWith({
      name: 'Updated Deck',
      commander_name: 'Updated Commander',
      owner_id: 'player-2',
      commander_image_url: null,
    })
    expect(mocks.eq).toHaveBeenCalledWith('id', 'deck-1')
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: [QUERY_KEYS.DECKS],
    })
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: [QUERY_KEYS.DECK_STATS],
    })
  })

  it('surfaces Supabase update errors as user-readable errors', async () => {
    mocks.single.mockResolvedValue({
      data: null,
      error: { message: 'new row violates row-level security policy' },
    })
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    const { result } = renderHook(() => useDeckMutations(), { wrapper })

    await expect(
      result.current.updateDeck.mutateAsync({
        id: 'deck-1',
        input: {
          name: 'Updated Deck',
          commander_name: 'Updated Commander',
          owner_id: 'player-2',
          commander_image_url: '',
        },
      })
    ).rejects.toThrow('new row violates row-level security policy')
  })
})
