# MTG Pod Hub

A modern web application for tracking Magic: The Gathering competitive pod league performance and statistics. View leaderboards, analyze win rates, and explore deck statistics with a dark, mystical MTG-themed UI.

[![CI](https://github.com/stousignant/mtg-pod-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/stousignant/mtg-pod-hub/actions/workflows/ci.yml)

## Features

- **Pod Leaderboards** - Player standings ranked by points with podium display and player cards
- **Win Rate Analytics** - Interactive charts with trend tracking over time
- **Deck Statistics** - Deck win rates and performance metrics filtered by pod
- **Game History** - Timeline view of recorded matches
- **Game Entry** - Admin interface for recording new game results
- **Player & Pod Filtering** - Filter data by pod, player, and player count
- **Authentication** - Protected admin routes with Supabase Auth
- **Real-time Updates** - Live data synchronization via Supabase
- **Automated Backups** - Daily database backups to Supabase Storage via GitHub Actions
- **Offline Support** - Mock data fallback for development without database
- **Responsive Design** - Mobile-first with adaptive navigation
- **Dark Theme** - Mystical purple and blue MTG-inspired aesthetic

## Tech Stack

### Frontend

- **React 18.3** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool with hot reload
- **TanStack Query 5.8** - Server state management
- **Tailwind CSS 3.4** - Utility-first styling
- **shadcn/ui** - Component library with Radix UI primitives
- **Recharts 2.15** - Data visualization

### Backend & Data

- **Supabase** - PostgreSQL database with real-time capabilities
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### DevOps & Quality

- **GitHub Actions** - CI pipeline and automated daily database backups
- **Vitest** - Unit testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Pre-commit hooks
- **Docker** - Containerization (dev and production)

## Quick Start

### Prerequisites

- Node.js 20+ and npm
- Supabase account (optional - app works with mock data)

### Installation

```bash
# Clone the repository
git clone https://github.com/stousignant/mtg-pod-hub.git
cd mtg-pod-hub

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials (optional)
# App works with mock data if Supabase is not configured

# Start development server
npm run dev
```

Visit `http://localhost:8080`

## Development

### Available Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Docker Development

**Start with Docker Compose:**

```bash
docker-compose up
```

App will be available at `http://localhost:8080` with hot reload.

**Stop containers:**

```bash
docker-compose down
```

### Project Structure

```
mtg-pod-hub/
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui primitives
│   │   └── ...          # Feature components
│   ├── pages/           # Route components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities & Supabase client
│   ├── data/            # Mock data & TypeScript interfaces
│   ├── constants/       # Centralized configuration
│   └── test/            # Test utilities
├── .github/workflows/   # CI and backup pipelines
├── scripts/             # Automation scripts (DB backup)
├── migrations/          # SQL migration files
├── public/              # Static assets
└── ...config files
```

### Code Quality

This project enforces code quality through:

- **Pre-commit hooks** - Automatic linting and formatting on commit
- **CI/CD pipeline** - Automated tests, linting, and builds on push
- **Zero magic numbers** - All constants centralized in `src/constants/config.ts`
- **Type safety** - TypeScript throughout with defined interfaces

## Database Schema

### pod_leaderboard

Aggregated view of player performance by pod:

- `player_name` - Player display name
- `avatar_url` - Player avatar URL
- `pod_name` - Pod identifier
- `wins`, `draws`, `losses` - Game results
- `points` - Calculated score
- `win_rate` - Percentage of games won

### deck_stats

Deck performance metrics:

- `deck_name` - Deck identifier
- `commander_name` - Commander card name
- `owner_name` - Deck owner
- `games_played` - Total games
- `wins` - Total wins
- `win_rate` - Win percentage

## Deployment

### Static Hosting (Vercel, Netlify)

```bash
npm run build
# Deploy the dist/ directory
```

Set environment variables in your hosting platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Docker Deployment

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

Production image includes:

- Multi-stage build for optimized size
- Nginx server with gzip compression
- Security headers configured
- Health check endpoint at `/health`

## Database Backups

Automated daily backups run via GitHub Actions at 3 AM UTC. The workflow:

1. Dumps all table data using `pg_dump`
2. Compares against the previous backup checksum
3. Uploads to a private Supabase Storage bucket if changes are detected
4. Retains the last 30 backups

Backups can also be triggered manually via `workflow_dispatch` in the Actions tab.

### Required GitHub Secrets

| Secret                      | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| `SUPABASE_PROJECT_REF`      | Project reference ID                                   |
| `SUPABASE_URL`              | Project API URL                                        |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (Project Settings → API)              |
| `SUPABASE_DB_PASSWORD`      | Database password (Project Settings → Database)        |
| `SUPABASE_POOLER_HOST`      | Session mode pooler host (Project Settings → Database) |

### Setup

1. Create a private `backups` bucket in Supabase Storage
2. Add the secrets above to your GitHub repository
3. The workflow runs automatically, or trigger manually from the Actions tab

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** App works offline with mock data if Supabase is not configured.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run test && npm run lint`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Code refactoring

## Testing

Run the test suite:

```bash
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

Coverage reports are generated in the `coverage/` directory.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Powered by [Supabase](https://supabase.com/)
- Visualization by [Recharts](https://recharts.org/)
