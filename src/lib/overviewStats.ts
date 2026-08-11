import { OUTCOME } from '@/constants/config'
import type { GameHistoryEntry } from '@/data/mockData'

export interface GlobalStats {
  totalGames: number
  totalPlayers: number
  mostActivePod: string
  mostPlayedDeck: string
}

export interface PlayerStats {
  playerName: string
  avatarUrl: string | null
  gamesPlayed: number
  wins: number
  draws: number
  losses: number
  winRate: number
  favoriteDeck: string
  favoriteDeckGames: number
  bestDeck: string | null
  bestDeckWinRate: number
  currentStreak: number
  currentStreakType: 'win' | 'loss' | null
  longestWinStreak: number
  longestLossStreak: number
}

const MIN_GAMES_FOR_BEST_DECK = 2

export const computeGlobalStats = (data: GameHistoryEntry[]): GlobalStats => {
  const uniqueGames = new Set(data.map(entry => entry.game_id))
  const uniquePlayers = new Set(data.map(entry => entry.player_name))
  const podCounts = new Map<string, number>()
  const deckCounts = new Map<string, number>()

  for (const entry of data) {
    podCounts.set(entry.pod_name, (podCounts.get(entry.pod_name) ?? 0) + 1)
    deckCounts.set(entry.deck_name, (deckCounts.get(entry.deck_name) ?? 0) + 1)
  }

  return {
    totalGames: uniqueGames.size,
    totalPlayers: uniquePlayers.size,
    mostActivePod:
      [...podCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—',
    mostPlayedDeck:
      [...deckCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—',
  }
}

const isWin = (entry: GameHistoryEntry) =>
  entry.outcome === OUTCOME.WIN && !entry.unsatisfying

const computeLongestStreak = (
  entries: GameHistoryEntry[],
  targetOutcome: typeof OUTCOME.WIN | typeof OUTCOME.LOSS
): number => {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.played_at).getTime() - new Date(b.played_at).getTime()
  )
  let longest = 0
  let current = 0

  for (const entry of sorted) {
    const matchesTarget =
      targetOutcome === OUTCOME.WIN
        ? isWin(entry)
        : entry.outcome === targetOutcome

    if (matchesTarget) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 0
    }
  }

  return longest
}

const summarizeDecks = (entries: GameHistoryEntry[]) => {
  const deckCounts = new Map<string, number>()
  const deckWins = new Map<string, number>()

  for (const entry of entries) {
    deckCounts.set(entry.deck_name, (deckCounts.get(entry.deck_name) ?? 0) + 1)
    if (isWin(entry)) {
      deckWins.set(entry.deck_name, (deckWins.get(entry.deck_name) ?? 0) + 1)
    }
  }

  const [favoriteDeck, favoriteDeckGames] = [...deckCounts.entries()].sort(
    (a, b) => b[1] - a[1]
  )[0]
  const qualifiedDecks = [...deckCounts.entries()]
    .filter(([, games]) => games >= MIN_GAMES_FOR_BEST_DECK)
    .map(([name, games]) => ({
      name,
      winRate: ((deckWins.get(name) ?? 0) / games) * 100,
    }))
    .sort((a, b) => b.winRate - a.winRate)

  return {
    favoriteDeck,
    favoriteDeckGames,
    bestDeck: qualifiedDecks[0]?.name ?? null,
    bestDeckWinRate: qualifiedDecks[0]?.winRate ?? 0,
  }
}

const summarizeCurrentStreak = (entries: GameHistoryEntry[]) => {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
  )
  const latest = sorted[0]
  const currentStreakType = latest
    ? isWin(latest)
      ? ('win' as const)
      : latest.outcome === OUTCOME.LOSS
        ? ('loss' as const)
        : null
    : null

  if (!currentStreakType) {
    return { currentStreak: 0, currentStreakType: null }
  }

  let currentStreak = 0
  for (const entry of sorted) {
    const matchesCurrentStreak =
      currentStreakType === 'win'
        ? isWin(entry)
        : entry.outcome === OUTCOME.LOSS
    if (!matchesCurrentStreak) break
    currentStreak++
  }

  return { currentStreak, currentStreakType }
}

const computePlayerStat = (
  playerName: string,
  avatarUrl: string | null,
  entries: GameHistoryEntry[]
): PlayerStats => {
  const wins = entries.filter(isWin).length
  const gamesPlayed = entries.length

  return {
    playerName,
    avatarUrl,
    gamesPlayed,
    wins,
    draws: entries.filter(entry => entry.outcome === OUTCOME.DRAW).length,
    losses: entries.filter(entry => entry.outcome === OUTCOME.LOSS).length,
    winRate: gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0,
    ...summarizeDecks(entries),
    ...summarizeCurrentStreak(entries),
    longestWinStreak: computeLongestStreak(entries, OUTCOME.WIN),
    longestLossStreak: computeLongestStreak(entries, OUTCOME.LOSS),
  }
}

export const computePlayerStats = (data: GameHistoryEntry[]): PlayerStats[] => {
  const players = new Map<
    string,
    { avatarUrl: string | null; entries: GameHistoryEntry[] }
  >()

  for (const entry of data) {
    const existing = players.get(entry.player_name)
    if (existing) {
      existing.entries.push(entry)
    } else {
      players.set(entry.player_name, {
        avatarUrl: entry.player_avatar_url,
        entries: [entry],
      })
    }
  }

  return [...players.entries()]
    .map(([playerName, { avatarUrl, entries }]) =>
      computePlayerStat(playerName, avatarUrl, entries)
    )
    .sort((a, b) => b.winRate - a.winRate)
}
