import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { OUTCOME } from '@/constants/config'
import { GameEntryForm } from './GameEntryForm'

const mocks = vi.hoisted(() => ({
  createGame: vi.fn(),
  updateGame: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: { success: mocks.success, error: mocks.error },
}))
vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({
    checked,
    onCheckedChange,
    ...props
  }: {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={event => onCheckedChange?.(event.target.checked)}
      {...props}
    />
  ),
}))
vi.mock('@/hooks/usePods', () => ({
  usePods: () => ({
    data: [{ id: '7', name: 'Tuesday Pod' }],
    isLoading: false,
  }),
}))
vi.mock('@/hooks/useAdminGames', () => ({
  useAdminGames: () => ({
    data: [
      {
        id: '42',
        pod_id: '7',
        played_at: '2026-07-31T00:00:00Z',
        notes: 'Original notes',
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
      },
    ],
    isLoading: false,
  }),
}))
vi.mock('@/hooks/usePodPlayers', () => ({
  usePodPlayers: () => ({
    data: [
      { id: 11, name: 'Alice', avatar_url: null },
      { id: 12, name: 'Bob', avatar_url: null },
    ],
    isLoading: false,
  }),
}))
vi.mock('@/hooks/useDecks', () => ({
  useDecks: (playerId?: string) => ({
    data:
      playerId === '11'
        ? [
            {
              id: '101',
              name: 'Alice Deck',
              commander_name: 'A',
              owner_id: '11',
            },
          ]
        : playerId === '12'
          ? [
              {
                id: '102',
                name: 'Bob Deck',
                commander_name: 'B',
                owner_id: '12',
              },
            ]
          : [],
    isLoading: false,
  }),
}))
vi.mock('@/hooks/useGameMutations', () => ({
  useGameMutations: () => ({
    createGame: { isPending: false, mutateAsync: mocks.createGame },
    updateGame: { isPending: false, mutateAsync: mocks.updateGame },
  }),
}))

describe('GameEntryForm modify mode', () => {
  beforeAll(() => {
    // jsdom does not implement this browser method used by Radix Select.
    HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.updateGame.mockResolvedValue({ id: 42 })
  })

  it('requires selection, preloads every result without clearing deck IDs, and submits the selected game', async () => {
    render(<GameEntryForm />)

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Modify Game' }), {
      button: 0,
      ctrlKey: false,
    })
    expect(screen.getByRole('button', { name: 'Update Game' })).toBeDisabled()

    const gameSelect = screen.getByRole('combobox', { name: 'Game to modify' })
    fireEvent.keyDown(gameSelect, { key: 'ArrowDown' })
    const option = await screen.findByRole('option', {
      name: '2026-07-31 — Tuesday Pod — Game #42',
    })
    fireEvent.click(option)

    expect(screen.getByLabelText('Date')).toHaveValue('2026-07-31')
    expect(screen.getByLabelText('Notes (Optional)')).toHaveValue(
      'Original notes'
    )
    expect(screen.getAllByText('Alice Deck (A)').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Bob Deck (B)').length).toBeGreaterThan(0)
    expect(screen.getByRole('checkbox')).toBeChecked()

    fireEvent.change(screen.getByLabelText('Notes (Optional)'), {
      target: { value: 'Edited notes' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Update Game' }))

    await waitFor(() =>
      expect(mocks.updateGame).toHaveBeenCalledWith({
        id: '42',
        input: {
          pod_id: '7',
          game_date: '2026-07-31',
          notes: 'Edited notes',
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
        },
      })
    )
    expect(mocks.success).toHaveBeenCalledWith('Game updated successfully!')
  })
})
