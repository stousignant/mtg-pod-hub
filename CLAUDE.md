# MTG Pod Hub - Project Guide

## Project Overview

**MTG Pod Tracker** is a React-based web application for tracking Magic: The Gathering competitive pod league performance. Players can view leaderboards by pod, analyze win rates, and explore deck statistics with a dark mystical MTG-themed UI.

**Key Features:**

- Pod-based leaderboards with player rankings
- Win rate analytics and visualizations
- Deck statistics tracking
- Real-time data sync via Supabase
- Mock data fallback for offline development

## Technology Stack

### Frontend

- **React 18.3.1** with TypeScript 5.8.3
- **Vite 5.4.19** (build tool with SWC)
- **React Router DOM 6.30.1** (client-side routing)
- **TanStack React Query 5.83.0** (server state management)
- **shadcn/ui** with Radix UI primitives (50+ components)
- **Tailwind CSS 3.4.17** (utility-first styling)

### Backend & Data

- **Supabase 2.93.2** (PostgreSQL + real-time)
- **Zod 3.25.76** (schema validation)
- **React Hook Form 7.61.1** (form management)

### Visualization & UI

- **Recharts 2.15.4** (charting)
- **Lucide React 0.462.0** (icons)
- **Sonner 1.7.4** (toast notifications)

### Testing

- **Vitest 3.2.4** (unit testing)
- **@testing-library/react 16.0.0** (component testing)

## Architecture Patterns

### State Management Strategy

**Server State:** TanStack React Query

- All data fetching uses React Query hooks
- Automatic caching and background synchronization
- No Redux or global state needed

**UI State:** Local component state (useState)

- Ephemeral UI state (dropdowns, dialogs)
- Component-scoped, not shared globally

### Data Flow

```
Component
  ↓
Custom Hook (useLeaderboard, useDeckStats)
  ↓
React Query (caching, refetching)
  ↓
Supabase Client → PostgreSQL
  ↓ (fallback)
Mock Data (offline development)
```

### Component Architecture

```
src/
├── pages/           # Route components (Index, Statistics, NotFound)
├── components/
│   ├── ui/          # shadcn/ui primitives (50+ components)
│   └── *.tsx        # Feature components (Leaderboard, WinRateChart)
├── hooks/           # Custom React Query hooks
├── lib/             # Utilities (supabaseClient, cn)
└── data/            # Mock data and TypeScript interfaces
```

### Custom Hooks Pattern

All data-fetching hooks follow this pattern:

```typescript
export const useLeaderboard = (podName?: string) => {
  return useQuery({
    queryKey: ['leaderboard', podName],
    queryFn: async () => {
      if (!isSupabaseConnected()) {
        return mockLeaderboardData // Fallback
      }
      // Supabase query
    },
  })
}
```

**Key Points:**

- Always check Supabase connection with `isSupabaseConnected()`
- Return mock data as fallback
- Use descriptive queryKey arrays for caching
- Export TypeScript interfaces from data files

## Styling Conventions

### Tailwind Patterns

**Color Coding for Win Rates:**

- Green (text-green-400): >= 60%
- Amber (text-amber-400): 40-59%
- Red (text-red-400): < 40%

**Custom Utility Classes:**

```css
.glow-purple  /* Purple magical glow effect */
.glow-blue    /* Blue magical glow effect */
.glow-gold    /* Gold highlight for first place */
.gradient-border /* Purple-to-blue gradient borders */
```

**Responsive Breakpoints:**

- Mobile-first approach
- Use `hidden sm:table-cell` for responsive tables
- Icon-only navigation on mobile, icon+text on desktop

**Theme Colors (HSL-based):**

- Background: `hsl(222.2 84% 4.9%)` (dark purple-black)
- Card: `hsl(222.2 84% 4.9%)` with slight variation
- Primary: `hsl(217.2 91.2% 59.8%)` (vibrant blue)
- Accent: `hsl(217.2 91.2% 59.8%)` (matches primary)

### Component Styling Patterns

**Card Layout:**

```tsx
<Card className="backdrop-blur-sm bg-card/50 border-purple-500/30 glow-purple">
  {/* Content */}
</Card>
```

**Loading Skeletons:**

- Match the structure of actual content
- Use `Skeleton` component from shadcn/ui
- Apply to containers during loading states

## Database Schema

### pod_leaderboard (View/Table)

```typescript
interface PodLeaderboardEntry {
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
```

**Calculated Fields:**

- `win_rate`: (wins / total_games) \* 100
- `points`: Custom scoring system (likely 3 for win, 1 for draw, 0 for loss)

### deck_stats (View/Table)

```typescript
interface DeckStatsEntry {
  deck_name: string
  commander_name: string
  owner_name: string
  games_played: number
  wins: number
  win_rate: number
}
```

**Note:** Both schemas likely represent database views with aggregated/calculated data.

## Development Workflow

### Essential Commands

Run `just check` (lint, format check, tests, build; requires [just](https://just.systems)) before handing off or opening a PR.

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run build:dev    # Dev build with debugging
npm run lint         # Run ESLint
npm run test         # Run tests once
npm run test:watch   # Watch mode for tests
npm run preview      # Preview production build
```

### Environment Setup

**Required .env variables:**

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Offline Development:**

- App works without Supabase connection
- Mock data automatically used as fallback
- Check console for "Supabase not connected" warnings

### Path Aliases

Use `@/` for imports from `src/`:

```typescript
import { supabase } from '@/lib/supabaseClient'
import { Leaderboard } from '@/components/Leaderboard'
```

## Testing Guidelines

### Test Setup

- Framework: Vitest with jsdom environment
- Location: `src/**/*.{test,spec}.{ts,tsx}`
- Config: Global test utilities enabled

### Testing Patterns

**Component Tests:**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  })
})
```

**Hook Tests:**

- Test with React Query's QueryClientProvider wrapper
- Mock Supabase client responses
- Test both connected and fallback states

## Common Tasks

### Adding a New Page

1. Create component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:
   ```typescript
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add navigation link in `src/components/Header.tsx`

### Adding a New Data Hook

1. Create hook in `src/hooks/useNewData.ts`:
   ```typescript
   export const useNewData = () => {
     return useQuery({
       queryKey: ['newData'],
       queryFn: async () => {
         if (!isSupabaseConnected()) {
           return mockNewData
         }
         const { data } = await supabase.from('table').select('*')
         return data
       },
     })
   }
   ```
2. Add mock data in `src/data/mockData.ts`
3. Define TypeScript interface in the data file

### Adding a shadcn/ui Component

```bash
npx shadcn@latest add component-name
```

Component will be added to `src/components/ui/`

### Modifying Theme Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --primary: 217.2 91.2% 59.8%; /* HSL values */
}
```

## Important Patterns to Follow

### ✅ DO

- Use React Query for all server state
- Provide mock data fallbacks for offline development
- Use shadcn/ui components as building blocks
- Apply consistent color-coding for win rates
- Use `cn()` utility for conditional classnames
- Keep components focused and single-responsibility
- Use TypeScript interfaces for all data structures
- Add loading skeletons that match content structure

### ❌ DON'T

- Don't use global state management (Redux, Zustand, etc.)
- Don't fetch data directly in components (use custom hooks)
- Don't hardcode colors (use Tailwind classes or CSS variables)
- Don't skip TypeScript types on props
- Don't create new components when shadcn/ui provides one
- Don't use inline styles (use Tailwind utilities)
- Don't commit .env files (use .env.example template)

## Known Issues & Gotchas

### TypeScript Configuration

TypeScript strict mode is **disabled** in this project:

- `noImplicitAny: false`
- `strictNullChecks: false`

This allows faster development but means type checking is relaxed.

### Supabase Connection

**Check before querying:**

```typescript
if (!isSupabaseConnected()) {
  // Use mock data
}
```

**Connection issues:** Verify environment variables are set correctly.

### Build Warnings

**Large Chunk Size:**
The bundled JavaScript file may exceed 500 kB. Consider code-splitting with dynamic imports if this becomes a performance concern.

**Browserslist Data:**
Run `npx update-browserslist-db@latest` periodically to update browser compatibility data.

## Project-Specific Conventions

### Naming Conventions

- **Components:** PascalCase (e.g., `WinRateChart.tsx`)
- **Hooks:** camelCase with "use" prefix (e.g., `useLeaderboard.ts`)
- **Utilities:** camelCase (e.g., `supabaseClient.ts`)
- **Types/Interfaces:** PascalCase (e.g., `PodLeaderboardEntry`)

### File Organization

- One component per file
- Colocate related utilities with features
- Keep mock data separate in `data/` directory
- Group UI primitives in `components/ui/`

### Import Order

```typescript
// 1. External dependencies
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal utilities
import { supabase } from '@/lib/supabaseClient'
import { cn } from '@/lib/utils'

// 3. Components
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// 4. Types
import type { PodLeaderboardEntry } from '@/data/mockData'
```

## Docker Development

### Local Development with Docker

**Start the application:**

```bash
docker-compose up
```

The app will be available at `http://localhost:8080` with hot reload enabled.

**Stop the application:**

```bash
docker-compose down
```

**Rebuild after dependency changes:**

```bash
docker-compose up --build
```

### Production Docker Build

**Build production image:**

```bash
docker build -t mtg-pod-hub:latest .
```

**Run production container:**

```bash
docker run -p 80:80 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  mtg-pod-hub:latest
```

The production image uses:

- Multi-stage build for optimized size
- Nginx for static file serving
- Gzip compression enabled
- Security headers configured
- Health check endpoint at `/health`

### Docker Files

- `Dockerfile` - Production multi-stage build with nginx
- `Dockerfile.dev` - Development build with hot reload
- `docker-compose.yml` - Local development orchestration
- `nginx.conf` - Nginx configuration for production
- `.dockerignore` - Excludes unnecessary files from builds

## Deployment Considerations

### Deployment Options

**Static Hosting (Vercel, Netlify, etc.):**

- Vite produces optimized bundle in `dist/`
- SPA routing requires server-side redirect configuration
- Set environment variables in hosting platform

**Docker Deployment:**

- Use production Dockerfile for containerized deployment
- Can be deployed to any container platform (Railway, Fly.io, AWS ECS, etc.)
- Nginx handles SPA routing automatically
- Health check endpoint available at `/health`

**Build Command:**

```bash
npm run build
```

### Environment Variables

Ensure hosting platform sets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Database Migrations

Supabase handles schema changes via their dashboard or CLI. Keep track of view definitions for `pod_leaderboard` and `deck_stats`.

## Resources

- [shadcn/ui Docs](https://ui.shadcn.com/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Examples](https://recharts.org/en-US/examples)
