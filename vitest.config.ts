import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
        'dist/',
        '.husky/',
        'src/components/ui/**', // shadcn/ui components (external)
      ],
      all: true,
      lines: 0,
      functions: 0,
      branches: 0,
      statements: 0,
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
