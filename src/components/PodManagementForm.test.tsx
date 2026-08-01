import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PodManagementForm } from './PodManagementForm'

const mocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
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

  it('validates, trims, creates, and resets a pod through the form', async () => {
    render(<PodManagementForm />)

    const nameInput = screen.getByRole('textbox', { name: 'Pod Name' })
    const submitButton = screen.getByRole('button', { name: 'Create Pod' })

    fireEvent.change(nameInput, { target: { value: '   ' } })
    fireEvent.click(submitButton)

    expect(await screen.findByText('Pod name is required')).toBeInTheDocument()
    expect(mocks.mutateAsync).not.toHaveBeenCalled()

    fireEvent.change(nameInput, { target: { value: '  Tuesday Commander  ' } })
    fireEvent.submit(submitButton.closest('form')!)

    await waitFor(() => {
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        name: 'Tuesday Commander',
      })
    })
    expect(mocks.success).toHaveBeenCalledWith('Pod created successfully!')
    expect(nameInput).toHaveValue('')
  })

  it('shows the mutation error when creation fails', async () => {
    mocks.mutateAsync.mockRejectedValue(new Error('Pod name already exists'))
    render(<PodManagementForm />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Pod Name' }), {
      target: { value: 'Existing Pod' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create Pod' }))

    await waitFor(() => {
      expect(mocks.error).toHaveBeenCalledWith('Pod name already exists')
    })
    expect(mocks.success).not.toHaveBeenCalled()
  })
})
