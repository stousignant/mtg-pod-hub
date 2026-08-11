import { describe, expect, it } from 'vitest'
import type { GameHistoryEntry } from '@/data/mockData'
import { computeGlobalStats, computePlayerStats } from './overviewStats'

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

describe('computeGlobalStats', () => {
  it('counts unique games and players while ranking pods and decks', () => {
    const data = [
      makeGame(1),
      makeGame(1, { player_name: 'Bob', deck_name: 'Deck B' }),
      makeGame(2, { pod_name: 'Sunday Pod', deck_name: 'Deck B' }),
    ]

    expect(computeGlobalStats(data)).toEqual({
      totalGames: 2,
      totalPlayers: 2,
      mostActivePod: 'Friday Pod',
      mostPlayedDeck: 'Deck B',
    })
  })

  it('returns display-safe defaults for an empty history', () => {
    expect(computeGlobalStats([])).toEqual({
      totalGames: 0,
      totalPlayers: 0,
      mostActivePod: '—',
      mostPlayedDeck: '—',
    })
  })
})

describe('computePlayerStats', () => {
  it('calculates deck preferences, win rates, and current and longest streaks', () => {
    const stats = computePlayerStats([
      makeGame(1),
      makeGame(2),
      makeGame(3, { outcome: 'LOSS', deck_name: 'Deck B', deck_id: 'deck-b' }),
      makeGame(4, { outcome: 'LOSS', deck_name: 'Deck B', deck_id: 'deck-b' }),
      makeGame(5, { outcome: 'LOSS', deck_name: 'Deck B', deck_id: 'deck-b' }),
    ])

    expect(stats).toEqual([
      expect.objectContaining({
        playerName: 'Alice',
        gamesPlayed: 5,
        wins: 2,
        draws: 0,
        losses: 3,
        winRate: 40,
        favoriteDeck: 'Deck B',
        favoriteDeckGames: 3,
        bestDeck: 'Deck A',
        bestDeckWinRate: 100,
        currentStreak: 3,
        currentStreakType: 'loss',
        longestWinStreak: 2,
        longestLossStreak: 3,
      }),
    ])
  })

  it('treats an unsatisfying win as a streak break and excludes it from wins', () => {
    const stats = computePlayerStats([
      makeGame(1),
      makeGame(2, { unsatisfying: true }),
      makeGame(3),
    ])[0]

    expect(stats).toEqual(
      expect.objectContaining({
        gamesPlayed: 3,
        wins: 2,
        currentStreak: 1,
        currentStreakType: 'win',
        longestWinStreak: 1,
      })
    )
    expect(stats.winRate).toBeCloseTo(200 / 3)
  })

  it('sorts players by descending win rate', () => {
    const stats = computePlayerStats([
      makeGame(1, { player_name: 'Alice', outcome: 'LOSS' }),
      makeGame(2, { player_name: 'Bob' }),
    ])

    expect(stats.map(player => player.playerName)).toEqual(['Bob', 'Alice'])
  })
})
