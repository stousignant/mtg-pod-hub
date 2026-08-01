import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PodManagementForm } from './PodManagementForm'

const mocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}))

vi.mock('@/hooks/usePlayers', () => ({
  usePlayers: () => ({
    data: [
      { id: 'player-1', name: 'Archmage Viktor', avatar_url: null },
      { id: 'player-2', name: "Liliana's Heir", avatar_url: null },
    ],
    isLoading: false,
  }),
}))

vi.mock('@/hooks/usePodMutations', () => ({
  usePodMutations: () => ({
    createPod: { isPending: false, mutateAsync: mocks.mutateAsync },
  }),
}))

vi.mock('sonner', () => ({
  toast: { success: mocks.success, error: mocks.error },
}))

describe('PodManagementForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.mutateAsync.mockResolvedValue({ id: 'pod-1' })
  })

  it('requires players, creates the pod with selected memberships, and resets', async () => {
    render(<PodManagementForm />)

    const nameInput = screen.getByRole('textbox', { name: 'Pod Name' })
    const viktor = screen.getByRole('checkbox', { name: 'Archmage Viktor' })
    const liliana = screen.getByRole('checkbox', { name: "Liliana's Heir" })
    const submitButton = screen.getByRole('button', { name: 'Create Pod' })

    fireEvent.change(nameInput, { target: { value: '  Tuesday Commander  ' } })
    fireEvent.click(submitButton)

    expect(
      await screen.findByText('Select at least one player')
    ).toBeInTheDocument()
    expect(mocks.mutateAsync).not.toHaveBeenCalled()

    fireEvent.click(viktor)
    fireEvent.click(liliana)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        name: 'Tuesday Commander',
        player_ids: ['player-1', 'player-2'],
      })
    })
    expect(mocks.success).toHaveBeenCalledWith('Pod created successfully!')
    expect(nameInput).toHaveValue('')
    expect(viktor).not.toBeChecked()
    expect(liliana).not.toBeChecked()
  })

  it('shows the mutation error when creation fails', async () => {
    mocks.mutateAsync.mockRejectedValue(new Error('Pod name already exists'))
    render(<PodManagementForm />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Pod Name' }), {
      target: { value: 'Existing Pod' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Archmage Viktor' }))
    fireEvent.click(screen.getByRole('button', { name: 'Create Pod' }))

    await waitFor(() => {
      expect(mocks.error).toHaveBeenCalledWith('Pod name already exists')
    })
    expect(mocks.success).not.toHaveBeenCalled()
  })
})
