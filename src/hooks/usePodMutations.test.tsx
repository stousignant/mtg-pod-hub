import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DB_TABLES, QUERY_KEYS } from '@/constants/config'
import { usePodMutations } from './usePodMutations'

const mocks = vi.hoisted(() => ({
  isSupabaseConnected: vi.fn(),
  from: vi.fn(),
  insert: vi.fn(),
  select: vi.fn(),
  single: vi.fn(),
}))

vi.mock('@/lib/supabaseClient', () => ({
  isSupabaseConnected: mocks.isSupabaseConnected,
  supabase: { from: mocks.from },
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
    mocks.single.mockResolvedValue({
      data: { id: 'pod-1', name: 'Tuesday Commander' },
      error: null,
    })
    mocks.select.mockReturnValue({ single: mocks.single })
    mocks.insert.mockReturnValue({ select: mocks.select })
    mocks.from.mockReturnValue({ insert: mocks.insert })
  })

  it('inserts a pod and invalidates pod-derived queries', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => usePodMutations(), {
      wrapper: createWrapper(queryClient),
    })

    await act(async () => {
      await result.current.createPod.mutateAsync({ name: 'Tuesday Commander' })
    })

    expect(mocks.from).toHaveBeenCalledWith(DB_TABLES.PODS)
    expect(mocks.insert).toHaveBeenCalledWith({ name: 'Tuesday Commander' })
    for (const queryKey of [
      QUERY_KEYS.PODS,
      QUERY_KEYS.POD_NAMES,
      QUERY_KEYS.POD_LEADERBOARD,
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
      result.current.createPod.mutateAsync({ name: 'Tuesday Commander' })
    ).rejects.toThrow('Database not connected')
    expect(mocks.from).not.toHaveBeenCalled()
  })

  it('surfaces Supabase insert errors as user-readable errors', async () => {
    mocks.single.mockResolvedValue({
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
      result.current.createPod.mutateAsync({ name: 'Tuesday Commander' })
    ).rejects.toThrow('new row violates row-level security policy')
  })
})
