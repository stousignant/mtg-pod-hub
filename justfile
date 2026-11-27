# Single validation entrypoint. Requires just (https://just.systems) and `npm ci`.

# Placeholder Supabase env, as in CI; tests and build never reach the network.
test_env := "VITE_SUPABASE_URL=https://placeholder.supabase.co VITE_SUPABASE_ANON_KEY=placeholder-key"

# List available recipes
default:
    @just --list

# Everything CI runs: lint, format check, tests, production build
check: lint fmt-check test build

# Run ESLint
lint:
    npm run lint

# Check Prettier formatting without changing files
fmt-check:
    npm run format:check

# Format source files with Prettier (modifies files)
fmt:
    npm run format

# Run the unit tests once
test:
    {{test_env}} npm run test

# Production build into dist/ (gitignored)
build:
    {{test_env}} npm run build
