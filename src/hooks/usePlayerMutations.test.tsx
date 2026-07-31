import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QUERY_KEYS } from '@/constants/config'
import { usePlayerMutations } from './usePlayerMutations'

const mocks = vi.hoisted(() => ({
  isSupabaseConnected: vi.fn(),
  from: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  eq: vi.fn(),
  select: vi.fn(),
  single: vi.fn(),
}))

vi.mock('@/lib/supabaseClient', () => ({
  isSupabaseConnected: mocks.isSupabaseConnected,
  supabase: { from: mocks.from },
}))

describe('usePlayerMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.isSupabaseConnected.mockReturnValue(true)
    mocks.single.mockResolvedValue({ data: { id: 'player-1' }, error: null })
    mocks.select.mockReturnValue({ single: mocks.single })
    mocks.eq.mockReturnValue({ select: mocks.select })
    mocks.insert.mockReturnValue({ select: mocks.select })
    mocks.update.mockReturnValue({ eq: mocks.eq })
    mocks.from.mockReturnValue({ insert: mocks.insert, update: mocks.update })
  })

  it('creates a player with an empty avatar URL stored as null', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    const { result } = renderHook(() => usePlayerMutations(), { wrapper })

    await act(async () => {
      await result.current.createPlayer.mutateAsync({
        name: 'New Player',
        avatar_url: '',
      })
    })

    expect(mocks.insert).toHaveBeenCalledWith({
      name: 'New Player',
      avatar_url: null,
    })
  })

  it('updates the selected player and invalidates player-related queries', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    const { result } = renderHook(() => usePlayerMutations(), { wrapper })
    const input = {
      name: 'Updated Player',
      avatar_url: '',
    }

    await act(async () => {
      await result.current.updatePlayer.mutateAsync({ id: 'player-1', input })
    })

    expect(mocks.update).toHaveBeenCalledWith({
      name: 'Updated Player',
      avatar_url: null,
    })
    expect(mocks.eq).toHaveBeenCalledWith('id', 'player-1')
    for (const queryKey of [
      QUERY_KEYS.PLAYERS,
      QUERY_KEYS.POD_LEADERBOARD,
      QUERY_KEYS.DECK_STATS,
      QUERY_KEYS.GAME_HISTORY,
      QUERY_KEYS.POD_MEMBERS,
    ]) {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: [queryKey] })
    }
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
    const { result } = renderHook(() => usePlayerMutations(), { wrapper })

    await expect(
      result.current.updatePlayer.mutateAsync({
        id: 'player-1',
        input: { name: 'Updated Player', avatar_url: '' },
      })
    ).rejects.toThrow('new row violates row-level security policy')
  })
})
