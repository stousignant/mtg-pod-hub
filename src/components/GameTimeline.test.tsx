import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import GameTimeline from './GameTimeline'
import type { GameHistoryEntry } from '@/data/mockData'

const makeGame = (
  gameId: number,
  playerName: string,
  deckName: string
): GameHistoryEntry => ({
  game_id: gameId,
  played_at: '2026-07-15',
  pod_name: 'Core',
  outcome: 'WIN',
  unsatisfying: false,
  player_name: playerName,
  player_avatar_url: null,
  deck_name: deckName,
  deck_id: `deck-${gameId}`,
  commander_name: deckName,
  commander_image_url: null,
  notes: null,
})

describe('GameTimeline', () => {
  it('shows the newest entry first when games share the same played date', () => {
    const { container } = render(
      <GameTimeline
        data={[
          makeGame(81, 'Earlier Winner', 'Earlier Deck'),
          makeGame(82, 'Later Winner', 'Later Deck'),
        ]}
        isLoading={false}
        pods={['Core']}
        selectedPod="__all__"
        onPodChange={vi.fn()}
        podsLoading={false}
        decks={['Earlier Deck', 'Later Deck']}
        selectedDeck="__all__"
        onDeckChange={vi.fn()}
        decksLoading={false}
      />
    )

    const timelineText = container.textContent ?? ''
    expect(timelineText.indexOf('Later Winner')).toBeLessThan(
      timelineText.indexOf('Earlier Winner')
    )
  })
})
