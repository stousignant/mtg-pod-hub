/**
 * Application-wide constants
 * Centralized configuration to avoid magic numbers and strings
 */

// ==================== UI Configuration ====================

export const UI = {
  SKELETON_LOADING_COUNT: {
    LEADERBOARD: 4,
    DECK_STATS: 6,
  },
  ICON_SIZE: {
    SMALL: 4,
    MEDIUM: 5,
  },
  DECIMAL_PLACES: {
    WIN_RATE: 1,
  },
} as const

// ==================== Win Rate Thresholds ====================

export const WIN_RATE = {
  THRESHOLD: {
    GOOD: 60, // >= 60% is good (green)
    AVERAGE: 40, // >= 40% is average (amber), < 40% is poor (red)
  },
  COLOR: {
    GOOD: 'text-emerald-400',
    AVERAGE: 'text-amber-400',
    POOR: 'text-rose-400',
  },
} as const

// ==================== Chart Configuration ====================

export const CHART = {
  HEIGHT: 300,
  HEIGHT_WITH_LEGEND: 600,
  MARGIN: {
    TOP: 20,
    RIGHT: 30,
    LEFT: 20,
    BOTTOM: 60,
  },
  AXIS: {
    FONT_SIZE: 12,
    X_LABEL_ANGLE: -45,
    X_LABEL_HEIGHT: 60,
    Y_DOMAIN_MIN: 0,
    Y_DOMAIN_MAX: 100,
    Y_AUTO_PADDING: 5,
  },
  TOOLTIP: {
    BORDER_RADIUS: 8,
  },
  BAR: {
    CORNER_RADIUS: [4, 4, 0, 0] as [number, number, number, number],
  },
  GRADIENT_COLORS: [
    'hsl(270, 80%, 55%)',
    'hsl(250, 75%, 55%)',
    'hsl(230, 70%, 55%)',
    'hsl(220, 70%, 55%)',
    'hsl(340, 75%, 55%)',
    'hsl(160, 70%, 45%)',
    'hsl(40, 85%, 55%)',
    'hsl(190, 75%, 50%)',
  ],
  PLAYER_COLORS: [
    'hsl(280, 85%, 60%)', // Vivid purple
    'hsl(45, 95%, 55%)', // Gold/yellow
    'hsl(160, 75%, 45%)', // Teal
    'hsl(350, 85%, 60%)', // Rose/red
    'hsl(200, 90%, 55%)', // Sky blue
    'hsl(25, 90%, 55%)', // Orange
    'hsl(120, 60%, 45%)', // Green
    'hsl(310, 75%, 65%)', // Pink/magenta
  ],
  LINE: {
    STROKE_WIDTH: 2,
    DOT_RADIUS: 3,
    ACTIVE_DOT_RADIUS: 5,
  },
  GRID: {
    STROKE_DASHARRAY: '3 3',
  },
} as const

// ==================== Ranking Configuration ====================

export const RANKING = {
  FIRST_PLACE_INDEX: 0,
  PODIUM_SIZE: 3,
  PODIUM_HEIGHT: {
    FIRST: 360,
    SECOND: 300,
    THIRD: 260,
  },
} as const

// ==================== Query Keys ====================

export const QUERY_KEYS = {
  POD_LEADERBOARD: 'pod_leaderboard',
  POD_NAMES: 'pod_names',
  DECK_STATS: 'deck_stats',
  PLAYERS: 'players',
  PODS: 'pods',
  DECKS: 'decks',
  USER_PROFILE: 'user_profile',
  GAME_HISTORY: 'game_history',
} as const

// ==================== Database Tables ====================

export const DB_TABLES = {
  POD_LEADERBOARD: 'pod_leaderboard',
  DECK_STATS: 'deck_stats',
  USER_PROFILES: 'user_profiles',
  PLAYERS: 'players',
  PODS: 'pods',
  DECKS: 'decks',
  GAMES: 'games',
  GAME_RESULTS: 'game_results',
  GAME_HISTORY: 'game_history',
} as const

// ==================== Database Columns ====================

export const DB_COLUMNS = {
  POD_LEADERBOARD: {
    POD_NAME: 'pod_name',
    POINTS: 'points',
  },
  DECK_STATS: {
    WIN_RATE: 'win_rate',
  },
} as const

// ==================== Sorting ====================

export const SORT = {
  DIRECTION: {
    ASCENDING: true,
    DESCENDING: false,
  },
} as const

// ==================== Authentication ====================

export const AUTH = {
  REDIRECT_PATH: {
    AFTER_LOGIN: '/',
    ADMIN_DASHBOARD: '/admin',
  },
} as const

// ==================== Routes ====================

export const ROUTES = {
  HOME: '/',
  STATISTICS: '/statistics',
  ADMIN: '/admin',
  LOGIN: '/login',
} as const

// ==================== Game Entry ====================

export const GAME_ENTRY = {
  DEFAULT_PLAYER_COUNT: 2,
  MAX_PLAYERS: 4,
} as const

export const OUTCOME = {
  WIN: 'WIN',
  LOSS: 'LOSS',
  DRAW: 'DRAW',
} as const

export type Outcome = (typeof OUTCOME)[keyof typeof OUTCOME]
