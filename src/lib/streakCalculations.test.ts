import { describe, expect, it } from 'vitest'
import type { GameHistoryEntry } from '@/data/mockData'
import { calculateDeckStreaks } from './streakCalculations'

const makeGame = (
  gameId: number,
  overrides: Partial<GameHistoryEntry> = {}
): GameHistoryEntry => ({
  game_id: gameId,
  played_at: `2026-01-${String(gameId).padStart(2, '0')}`,
  pod_name: 'Friday Pod',
  outcome: 'WIN',
  unsatisfying: false,
  player_name: 'Alice',
  player_avatar_url: null,
  deck_name: 'Deck A',
  deck_id: 'deck-a',
  commander_name: 'Commander A',
  commander_image_url: null,
  notes: null,
  ...overrides,
})

describe('calculateDeckStreaks', () => {
  it('returns an empty map for an empty game history', () => {
    expect(calculateDeckStreaks([])).toEqual(new Map())
  })

  it('groups decks and calculates streaks in chronological order', () => {
    const result = calculateDeckStreaks([
      makeGame(4, { outcome: 'LOSS' }),
      makeGame(2),
      makeGame(3, { outcome: 'DRAW' }),
      makeGame(1),
      makeGame(11, {
        played_at: '2026-02-01',
        outcome: 'LOSS',
        deck_id: 'deck-b',
        deck_name: 'Deck B',
      }),
      makeGame(10, {
        played_at: '2026-02-01',
        deck_id: 'deck-b',
        deck_name: 'Deck B',
      }),
    ])

    expect(result.get('deck-a')).toEqual({
      deckId: 'deck-a',
      deckName: 'Deck A',
      currentStreak: 1,
      currentStreakType: 'loss',
      bestWinStreak: 2,
      worstLoseStreak: 1,
    })
    expect(result.get('deck-b')).toEqual({
      deckId: 'deck-b',
      deckName: 'Deck B',
      currentStreak: 1,
      currentStreakType: 'loss',
      bestWinStreak: 1,
      worstLoseStreak: 1,
    })
  })

  it('treats unsatisfying wins as neutral results that break a streak', () => {
    const result = calculateDeckStreaks([
      makeGame(1),
      makeGame(2, { unsatisfying: true }),
    ]).get('deck-a')

    expect(result).toEqual({
      deckId: 'deck-a',
      deckName: 'Deck A',
      currentStreak: 0,
      currentStreakType: null,
      bestWinStreak: 1,
      worstLoseStreak: 0,
    })
  })
})
