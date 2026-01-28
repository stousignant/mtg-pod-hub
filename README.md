# MTG Pod Hub

A modern web application for tracking Magic: The Gathering competitive pod league performance and statistics. View leaderboards, analyze win rates, and explore deck statistics with a dark, mystical MTG-themed UI.

[![CI](https://github.com/stousignant/mtg-pod-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/stousignant/mtg-pod-hub/actions/workflows/ci.yml)

## Features

- **Pod Leaderboards** - Track player standings ranked by points across different pods
- **Win Rate Analytics** - Visualize player performance with interactive charts
- **Deck Statistics** - Analyze deck win rates and performance metrics
- **Real-time Updates** - Live data synchronization via Supabase
- **Offline Support** - Mock data fallback for development without database
- **Responsive Design** - Optimized for desktop and mobile devices
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

- **GitHub Actions** - CI/CD pipeline
- **Vitest** - Unit testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Pre-commit hooks
- **Docker** - Containerization

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
├── .github/workflows/   # CI/CD pipelines
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
