import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DeckManagementForm } from './DeckManagementForm'

vi.mock('@/hooks/usePlayers', () => ({
  usePlayers: () => ({ data: [], isLoading: false }),
}))

vi.mock('@/hooks/useDecks', () => ({
  useDecks: () => ({
    data: [
      {
        id: 'deck-1',
        name: 'Eldrazi Menace',
        commander_name: 'Kozilek',
        owner_id: 'player-1',
        commander_image_url: null,
      },
    ],
    isLoading: false,
  }),
}))

vi.mock('@/hooks/useDeckMutations', () => ({
  useDeckMutations: () => ({
    createDeck: { isPending: false, mutateAsync: vi.fn() },
    updateDeck: { isPending: false, mutateAsync: vi.fn() },
  }),
}))

describe('DeckManagementForm', () => {
  it('offers a modify mode that requires selecting an existing deck', () => {
    render(<DeckManagementForm />)

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Modify Deck' }), {
      button: 0,
      ctrlKey: false,
    })

    expect(screen.getByText('Deck to modify')).toBeInTheDocument()
    expect(screen.getByText('Select a deck')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update Deck' })).toBeDisabled()
  })
})
