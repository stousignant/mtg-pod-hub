import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QUERY_KEYS } from '@/constants/config'
import { usePodMutations } from './usePodMutations'

const mocks = vi.hoisted(() => ({
  isSupabaseConnected: vi.fn(),
  rpc: vi.fn(),
}))

vi.mock('@/lib/supabaseClient', () => ({
  isSupabaseConnected: mocks.isSupabaseConnected,
  supabase: { rpc: mocks.rpc },
}))

const createWrapper = (queryClient: QueryClient) =>
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

describe('usePodMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.isSupabaseConnected.mockReturnValue(true)
    mocks.rpc.mockResolvedValue({
      data: { id: 'pod-1', name: 'Tuesday Commander' },
      error: null,
    })
  })

  it('atomically creates a pod with players and invalidates pod-derived queries', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => usePodMutations(), {
      wrapper: createWrapper(queryClient),
    })

    await act(async () => {
      await result.current.createPod.mutateAsync({
        name: 'Tuesday Commander',
        player_ids: ['1', '2'],
      })
    })

    expect(mocks.rpc).toHaveBeenCalledWith('create_pod_with_players', {
      p_name: 'Tuesday Commander',
      p_player_ids: [1, 2],
    })
    for (const queryKey of [
      QUERY_KEYS.PODS,
      QUERY_KEYS.POD_NAMES,
      QUERY_KEYS.POD_LEADERBOARD,
      QUERY_KEYS.POD_MEMBERS,
    ]) {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: [queryKey] })
    }
  })

  it('rejects creation when the database is disconnected', async () => {
    mocks.isSupabaseConnected.mockReturnValue(false)
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const { result } = renderHook(() => usePodMutations(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.createPod.mutateAsync({
        name: 'Tuesday Commander',
        player_ids: ['1'],
      })
    ).rejects.toThrow('Database not connected')
    expect(mocks.rpc).not.toHaveBeenCalled()
  })

  it('surfaces RPC errors as user-readable errors', async () => {
    mocks.rpc.mockResolvedValue({
      data: null,
      error: { message: 'new row violates row-level security policy' },
    })
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const { result } = renderHook(() => usePodMutations(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.createPod.mutateAsync({
        name: 'Tuesday Commander',
        player_ids: ['1'],
      })
    ).rejects.toThrow('new row violates row-level security policy')
  })
})
