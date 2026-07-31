import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PlayerManagementForm } from './PlayerManagementForm'

vi.mock('@/hooks/usePlayers', () => ({
  usePlayers: () => ({
    data: [
      {
        id: 'player-1',
        name: 'Archmage Viktor',
        avatar_url: 'https://example.com/viktor.png',
      },
    ],
    isLoading: false,
  }),
}))

vi.mock('@/hooks/usePlayerMutations', () => ({
  usePlayerMutations: () => ({
    createPlayer: { isPending: false, mutateAsync: vi.fn() },
    updatePlayer: { isPending: false, mutateAsync: vi.fn() },
  }),
}))

describe('PlayerManagementForm', () => {
  it('offers a modify mode that requires selecting an existing player', () => {
    render(<PlayerManagementForm />)

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Modify Player' }), {
      button: 0,
      ctrlKey: false,
    })

    expect(screen.getByText('Player to modify')).toBeInTheDocument()
    expect(screen.getByText('Select a player')).toBeInTheDocument()
    expect(screen.getByLabelText('Player Name')).toBeDisabled()
    expect(screen.getByLabelText(/Avatar URL/)).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Update Player' })).toBeDisabled()

    fireEvent.keyDown(screen.getByLabelText('Player to modify'), {
      key: 'ArrowDown',
    })
    fireEvent.click(screen.getByRole('option', { name: 'Archmage Viktor' }))

    expect(screen.getByLabelText('Player Name')).toHaveValue('Archmage Viktor')
    expect(screen.getByLabelText(/Avatar URL/)).toHaveValue(
      'https://example.com/viktor.png'
    )
    expect(screen.getByRole('button', { name: 'Update Player' })).toBeEnabled()
  })
})
