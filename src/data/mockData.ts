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

export interface GameHistoryEntry {
  game_id: number
  played_at: string
  pod_name: string
  outcome: string
  unsatisfying: boolean
  player_name: string
  player_avatar_url: string | null
  deck_name: string
  deck_id: string
  commander_name: string
  commander_image_url: string | null
  notes: string | null
}

export interface DeckStatsEntry {
  deck_name: string
  commander_name: string
  commander_image_url: string | null
  owner_name: string
  games_played: number
  wins: number
  win_rate: number
}

export interface Player {
  id: string
  name: string
  avatar_url: string | null
}

export interface Pod {
  id: string
  name: string
}

export interface Deck {
  id: string
  name: string
  commander_name: string
  owner_id: string
  commander_image_url: string | null
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
    commander_image_url:
      'https://cards.scryfall.io/art_crop/front/f/1/f1aa6f27-adb5-4802-98e6-6b9683ec8c55.jpg',
    owner_name: 'Tezzeret',
    games_played: 15,
    wins: 11,
    win_rate: 73.3,
  },
  {
    deck_name: 'Selesnya Tokens',
    commander_name: 'Rhys the Redeemed',
    commander_image_url:
      'https://cards.scryfall.io/art_crop/front/b/6/b6e657c7-3672-43a0-bf32-a29f1e456e3b.jpg',
    owner_name: 'Nissa Worldwaker',
    games_played: 8,
    wins: 6,
    win_rate: 75.0,
  },
  {
    deck_name: 'Dimir Control',
    commander_name: 'Scarab God',
    commander_image_url:
      'https://cards.scryfall.io/art_crop/front/d/7/d79ee141-0ea6-45d6-a682-96a37d703394.jpg',
    owner_name: 'Archmage Viktor',
    games_played: 12,
    wins: 8,
    win_rate: 66.7,
  },
  {
    deck_name: 'Grixis Reanimator',
    commander_name: 'Sedris, the Traitor King',
    commander_image_url:
      'https://cards.scryfall.io/art_crop/front/7/0/70206cff-9f54-4e27-982c-b0093a51d8d6.jpg',
    owner_name: "Liliana's Heir",
    games_played: 12,
    wins: 6,
    win_rate: 50.0,
  },
  {
    deck_name: 'Artifact Combo',
    commander_name: 'Urza, Lord High Artificer',
    commander_image_url:
      'https://cards.scryfall.io/art_crop/front/9/e/9e7fb3c0-5159-4d1f-8490-ce4c9a60f567.jpg',
    owner_name: 'Karn Liberated',
    games_played: 15,
    wins: 9,
    win_rate: 60.0,
  },
  {
    deck_name: 'Mono Blue Tempo',
    commander_name: 'Baral, Chief of Compliance',
    commander_image_url:
      'https://cards.scryfall.io/art_crop/front/6/0/60e16d94-1166-4050-8554-686e153a7f80.jpg',
    owner_name: "Jace's Apprentice",
    games_played: 12,
    wins: 5,
    win_rate: 41.7,
  },
  {
    deck_name: 'Burn Everything',
    commander_name: 'Purphoros, God of the Forge',
    commander_image_url:
      'https://cards.scryfall.io/art_crop/front/7/b/7bf6baf2-d20b-467d-8929-abefcf7dfa99.jpg',
    owner_name: 'Chandra Ablaze',
    games_played: 8,
    wins: 4,
    win_rate: 50.0,
  },
  {
    deck_name: 'Krenko Goblins',
    commander_name: 'Krenko, Mob Boss',
    commander_image_url:
      'https://cards.scryfall.io/art_crop/front/c/d/cd9f4b7f-71fb-461c-b7f3-6bc802624765.jpg',
    owner_name: 'Goblin King',
    games_played: 12,
    wins: 3,
    win_rate: 25.0,
  },
  {
    deck_name: 'Vampire Aristocrats',
    commander_name: 'Edgar Markov',
    commander_image_url:
      'https://cards.scryfall.io/art_crop/front/8/d/8d94b8ec-ecda-43c8-a60e-1ba33e6a54a4.jpg',
    owner_name: 'Sorin Markov',
    games_played: 8,
    wins: 2,
    win_rate: 25.0,
  },
  {
    deck_name: 'Spirit Tribal',
    commander_name: 'Ugin, the Spirit Dragon',
    commander_image_url:
      'https://cards.scryfall.io/art_crop/front/5/8/58c1e824-c8a9-4312-8e4c-a29a26d189a4.jpg',
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

export const mockGameHistory: GameHistoryEntry[] = [
  {
    game_id: 1,
    played_at: '2025-01-25',
    pod_name: 'Friday Night Chaos',
    outcome: 'WIN',
    player_name: 'Tezzeret',
    player_avatar_url:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=tezzeret',
    deck_name: 'Eldrazi Menace',
    commander_name: 'Kozilek, the Great Distortion',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 1,
    played_at: '2025-01-25',
    pod_name: 'Friday Night Chaos',
    outcome: 'LOSS',
    player_name: 'Archmage Viktor',
    player_avatar_url: null,
    deck_name: 'Dimir Control',
    commander_name: 'Scarab God',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 1,
    played_at: '2025-01-25',
    pod_name: 'Friday Night Chaos',
    outcome: 'LOSS',
    player_name: 'Karn Liberated',
    player_avatar_url: null,
    deck_name: 'Artifact Combo',
    commander_name: 'Urza, Lord High Artificer',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 1,
    played_at: '2025-01-25',
    pod_name: 'Friday Night Chaos',
    outcome: 'LOSS',
    player_name: 'Goblin King',
    player_avatar_url: null,
    deck_name: 'Krenko Goblins',
    commander_name: 'Krenko, Mob Boss',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 2,
    played_at: '2025-01-24',
    pod_name: 'Sunday Showdown',
    outcome: 'WIN',
    player_name: 'Nissa Worldwaker',
    player_avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nissa',
    deck_name: 'Selesnya Tokens',
    commander_name: 'Rhys the Redeemed',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 2,
    played_at: '2025-01-24',
    pod_name: 'Sunday Showdown',
    outcome: 'LOSS',
    player_name: 'Chandra Ablaze',
    player_avatar_url: null,
    deck_name: 'Burn Everything',
    commander_name: 'Purphoros, God of the Forge',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 2,
    played_at: '2025-01-24',
    pod_name: 'Sunday Showdown',
    outcome: 'LOSS',
    player_name: 'Sorin Markov',
    player_avatar_url: null,
    deck_name: 'Vampire Aristocrats',
    commander_name: 'Edgar Markov',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 3,
    played_at: '2025-01-20',
    pod_name: 'Friday Night Chaos',
    outcome: 'DRAW',
    player_name: 'Archmage Viktor',
    player_avatar_url: null,
    deck_name: 'Dimir Control',
    commander_name: 'Scarab God',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 3,
    played_at: '2025-01-20',
    pod_name: 'Friday Night Chaos',
    outcome: 'DRAW',
    player_name: "Liliana's Heir",
    player_avatar_url:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=liliana',
    deck_name: 'Grixis Reanimator',
    commander_name: 'Sedris, the Traitor King',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 3,
    played_at: '2025-01-20',
    pod_name: 'Friday Night Chaos',
    outcome: 'LOSS',
    player_name: 'Ugin Spirit',
    player_avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ugin',
    deck_name: 'Spirit Tribal',
    commander_name: 'Ugin, the Spirit Dragon',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 3,
    played_at: '2025-01-20',
    pod_name: 'Friday Night Chaos',
    outcome: 'LOSS',
    player_name: "Jace's Apprentice",
    player_avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jace',
    deck_name: 'Mono Blue Tempo',
    commander_name: 'Baral, Chief of Compliance',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 4,
    played_at: '2025-01-18',
    pod_name: 'Competitive League',
    outcome: 'WIN',
    player_name: 'Karn Liberated',
    player_avatar_url: null,
    deck_name: 'Artifact Combo',
    commander_name: 'Urza, Lord High Artificer',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 4,
    played_at: '2025-01-18',
    pod_name: 'Competitive League',
    outcome: 'LOSS',
    player_name: 'Eldrazi Spawn',
    player_avatar_url:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=eldrazi',
    deck_name: 'Eldrazi Menace',
    commander_name: 'Kozilek, the Great Distortion',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
  {
    game_id: 4,
    played_at: '2025-01-18',
    pod_name: 'Competitive League',
    outcome: 'LOSS',
    player_name: 'Tezzeret',
    player_avatar_url:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=tezzeret',
    deck_name: 'Eldrazi Menace',
    commander_name: 'Kozilek, the Great Distortion',
    commander_image_url: null,
    unsatisfying: false,
    deck_id: '1',
    notes: null,
  },
]

export const mockPlayers: Player[] = [
  { id: '1', name: 'Archmage Viktor', avatar_url: null },
  {
    id: '2',
    name: "Liliana's Heir",
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liliana',
  },
  {
    id: '3',
    name: "Jace's Apprentice",
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jace',
  },
  { id: '4', name: 'Goblin King', avatar_url: null },
  {
    id: '5',
    name: 'Nissa Worldwaker',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nissa',
  },
  { id: '6', name: 'Chandra Ablaze', avatar_url: null },
  {
    id: '7',
    name: 'Eldrazi Spawn',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eldrazi',
  },
  { id: '8', name: 'Sorin Markov', avatar_url: null },
  {
    id: '9',
    name: 'Tezzeret',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tezzeret',
  },
  { id: '10', name: 'Karn Liberated', avatar_url: null },
  {
    id: '11',
    name: 'Ugin Spirit',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ugin',
  },
]

export const mockPods: Pod[] = [
  { id: '1', name: 'Friday Night Chaos' },
  { id: '2', name: 'Sunday Showdown' },
  { id: '3', name: 'Competitive League' },
]

export interface PodMember {
  pod_id: string
  player_id: string
}

export const mockPodMembers: PodMember[] = [
  // Friday Night Chaos (pod 1): players 1-4
  { pod_id: '1', player_id: '1' },
  { pod_id: '1', player_id: '2' },
  { pod_id: '1', player_id: '3' },
  { pod_id: '1', player_id: '4' },
  // Sunday Showdown (pod 2): players 5-8
  { pod_id: '2', player_id: '5' },
  { pod_id: '2', player_id: '6' },
  { pod_id: '2', player_id: '7' },
  { pod_id: '2', player_id: '8' },
  // Competitive League (pod 3): players 9-11
  { pod_id: '3', player_id: '9' },
  { pod_id: '3', player_id: '10' },
  { pod_id: '3', player_id: '11' },
]

export const mockDecks: Deck[] = [
  {
    id: '1',
    name: 'Dimir Control',
    commander_name: 'Scarab God',
    owner_id: '1',
    commander_image_url: null,
  },
  {
    id: '2',
    name: 'Grixis Reanimator',
    commander_name: 'Sedris, the Traitor King',
    owner_id: '2',
    commander_image_url: null,
  },
  {
    id: '3',
    name: 'Mono Blue Tempo',
    commander_name: 'Baral, Chief of Compliance',
    owner_id: '3',
    commander_image_url: null,
  },
  {
    id: '4',
    name: 'Krenko Goblins',
    commander_name: 'Krenko, Mob Boss',
    owner_id: '4',
    commander_image_url: null,
  },
  {
    id: '5',
    name: 'Selesnya Tokens',
    commander_name: 'Rhys the Redeemed',
    owner_id: '5',
    commander_image_url: null,
  },
  {
    id: '6',
    name: 'Burn Everything',
    commander_name: 'Purphoros, God of the Forge',
    owner_id: '6',
    commander_image_url: null,
  },
  {
    id: '7',
    name: 'Eldrazi Menace',
    commander_name: 'Kozilek, the Great Distortion',
    owner_id: '9',
    commander_image_url: null,
  },
  {
    id: '8',
    name: 'Vampire Aristocrats',
    commander_name: 'Edgar Markov',
    owner_id: '8',
    commander_image_url: null,
  },
  {
    id: '9',
    name: 'Artifact Combo',
    commander_name: 'Urza, Lord High Artificer',
    owner_id: '10',
    commander_image_url: null,
  },
  {
    id: '10',
    name: 'Spirit Tribal',
    commander_name: 'Ugin, the Spirit Dragon',
    owner_id: '11',
    commander_image_url: null,
  },
]
