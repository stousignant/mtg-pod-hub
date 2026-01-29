import type { PodLeaderboardEntry, DeckStatsEntry } from '@/data/mockData'

export type RankedPlayer = PodLeaderboardEntry & { rank: number }

export type DeckStatsWithPodInfo = DeckStatsEntry

export interface PodOption {
  name: string
  playerCount: number
  gamesPlayed?: number
}

export interface FilterProps {
  selected: string
  onChange: (value: string) => void
  isLoading: boolean
}

export interface PodFilterConfig extends FilterProps {
  pods: (string | PodOption)[]
  allPodsValue?: string
  showAllPods?: boolean
}

export interface PlayerFilterConfig extends FilterProps {
  players: string[]
  allPlayersValue: string
}
