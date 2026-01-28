// Mock data matching the exact Supabase view schemas

export interface PodLeaderboardEntry {
  player_name: string
  avatar_url: string | null
  pod_name: string
  player_count: number
  total_games: number
  wins: number
  draws: number
  losses: number
  points: number
  win_rate: number
}

export interface DeckStatsEntry {
  deck_name: string
  commander_name: string
  owner_name: string
  games_played: number
  wins: number
  win_rate: number
}

export const mockPodLeaderboard: PodLeaderboardEntry[] = [
  {
    player_name: 'Archmage Viktor',
    avatar_url: null,
    pod_name: 'Friday Night Chaos',
    player_count: 4,
    total_games: 12,
    wins: 8,
    draws: 1,
    losses: 3,
    points: 25,
    win_rate: 66.7,
  },
  {
    player_name: "Liliana's Heir",
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liliana',
    pod_name: 'Friday Night Chaos',
    player_count: 4,
    total_games: 12,
    wins: 6,
    draws: 2,
    losses: 4,
    points: 20,
    win_rate: 50.0,
  },
  {
    player_name: "Jace's Apprentice",
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jace',
    pod_name: 'Friday Night Chaos',
    player_count: 4,
    total_games: 12,
    wins: 5,
    draws: 1,
    losses: 6,
    points: 16,
    win_rate: 41.7,
  },
  {
    player_name: 'Goblin King',
    avatar_url: null,
    pod_name: 'Friday Night Chaos',
    player_count: 4,
    total_games: 12,
    wins: 3,
    draws: 0,
    losses: 9,
    points: 9,
    win_rate: 25.0,
  },
  {
    player_name: 'Nissa Worldwaker',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nissa',
    pod_name: 'Sunday Showdown',
    player_count: 4,
    total_games: 8,
    wins: 6,
    draws: 0,
    losses: 2,
    points: 18,
    win_rate: 75.0,
  },
  {
    player_name: 'Chandra Ablaze',
    avatar_url: null,
    pod_name: 'Sunday Showdown',
    player_count: 4,
    total_games: 8,
    wins: 4,
    draws: 1,
    losses: 3,
    points: 13,
    win_rate: 50.0,
  },
  {
    player_name: 'Eldrazi Spawn',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eldrazi',
    pod_name: 'Sunday Showdown',
    player_count: 4,
    total_games: 8,
    wins: 3,
    draws: 1,
    losses: 4,
    points: 10,
    win_rate: 37.5,
  },
  {
    player_name: 'Sorin Markov',
    avatar_url: null,
    pod_name: 'Sunday Showdown',
    player_count: 4,
    total_games: 8,
    wins: 2,
    draws: 0,
    losses: 6,
    points: 6,
    win_rate: 25.0,
  },
  {
    player_name: 'Tezzeret',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tezzeret',
    pod_name: 'Competitive League',
    player_count: 6,
    total_games: 15,
    wins: 11,
    draws: 0,
    losses: 4,
    points: 33,
    win_rate: 73.3,
  },
  {
    player_name: 'Karn Liberated',
    avatar_url: null,
    pod_name: 'Competitive League',
    player_count: 6,
    total_games: 15,
    wins: 9,
    draws: 2,
    losses: 4,
    points: 29,
    win_rate: 60.0,
  },
  {
    player_name: 'Ugin Spirit',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ugin',
    pod_name: 'Competitive League',
    player_count: 6,
    total_games: 15,
    wins: 7,
    draws: 1,
    losses: 7,
    points: 22,
    win_rate: 46.7,
  },
]

export const mockDeckStats: DeckStatsEntry[] = [
  {
    deck_name: 'Eldrazi Menace',
    commander_name: 'Kozilek, the Great Distortion',
    owner_name: 'Tezzeret',
    games_played: 15,
    wins: 11,
    win_rate: 73.3,
  },
  {
    deck_name: 'Selesnya Tokens',
    commander_name: 'Rhys the Redeemed',
    owner_name: 'Nissa Worldwaker',
    games_played: 8,
    wins: 6,
    win_rate: 75.0,
  },
  {
    deck_name: 'Dimir Control',
    commander_name: 'Scarab God',
    owner_name: 'Archmage Viktor',
    games_played: 12,
    wins: 8,
    win_rate: 66.7,
  },
  {
    deck_name: 'Grixis Reanimator',
    commander_name: 'Sedris, the Traitor King',
    owner_name: "Liliana's Heir",
    games_played: 12,
    wins: 6,
    win_rate: 50.0,
  },
  {
    deck_name: 'Artifact Combo',
    commander_name: 'Urza, Lord High Artificer',
    owner_name: 'Karn Liberated',
    games_played: 15,
    wins: 9,
    win_rate: 60.0,
  },
  {
    deck_name: 'Mono Blue Tempo',
    commander_name: 'Baral, Chief of Compliance',
    owner_name: "Jace's Apprentice",
    games_played: 12,
    wins: 5,
    win_rate: 41.7,
  },
  {
    deck_name: 'Burn Everything',
    commander_name: 'Purphoros, God of the Forge',
    owner_name: 'Chandra Ablaze',
    games_played: 8,
    wins: 4,
    win_rate: 50.0,
  },
  {
    deck_name: 'Krenko Goblins',
    commander_name: 'Krenko, Mob Boss',
    owner_name: 'Goblin King',
    games_played: 12,
    wins: 3,
    win_rate: 25.0,
  },
  {
    deck_name: 'Vampire Aristocrats',
    commander_name: 'Edgar Markov',
    owner_name: 'Sorin Markov',
    games_played: 8,
    wins: 2,
    win_rate: 25.0,
  },
  {
    deck_name: 'Spirit Tribal',
    commander_name: 'Ugin, the Spirit Dragon',
    owner_name: 'Ugin Spirit',
    games_played: 15,
    wins: 7,
    win_rate: 46.7,
  },
]

// Helper to get unique pod names
export const getUniquePods = (data: PodLeaderboardEntry[]): string[] => {
  return [...new Set(data.map(entry => entry.pod_name))]
}

// Helper to filter leaderboard by pod
export const filterByPod = (
  data: PodLeaderboardEntry[],
  podName: string
): PodLeaderboardEntry[] => {
  return data
    .filter(entry => entry.pod_name === podName)
    .sort((a, b) => b.points - a.points)
}
