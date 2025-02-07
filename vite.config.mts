import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'eslint.config.js',
        'tsup.config.ts',
        'vite.config.mts',
        '**/node_modules/**',
        '**/commitlint.config.ts',
        '**/release.config.cjs',
        '**/index.ts',
        '**/models/**',
        '**/interfaces/**',
        '**/config/**',
      ],
    },
    globals: true,
    restoreMocks: true,
  },
  plugins: [tsconfigPaths()],
});
