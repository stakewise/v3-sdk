import { defineConfig, configDefaults } from 'vitest/config'


export default defineConfig({
  resolve: {
    alias: [ { find: /\.graphql$/, replacement: '.graphql.ts' } ],
  },
  test: {
    unstubGlobals: true,
    coverage: {
      provider: 'v8',
      reporter: [ 'text', 'json-summary' ],
      include: [ 'src/**/*.ts' ],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.d.ts',
        'src/**/*.graphql.ts',
        'src/types/**',
        'src/contracts/types/**',
        'src/contracts/vault/types/**',
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: [ 'src/**/*.spec.ts', 'test/**/*.spec.ts' ],
          exclude: [ ...configDefaults.exclude, '**/*.fork.spec.ts' ],
          setupFiles: [ 'test/setup.ts' ],
        },
      },
      {
        extends: true,
        test: {
          name: 'fork',
          include: [ 'src/**/*.fork.spec.ts' ],
          globalSetup: [ 'test/fork/globalSetup.ts' ],
          setupFiles: [ 'test/setup.ts' ],
          testTimeout: 120_000,
          hookTimeout: 120_000,
          fileParallelism: false,
        },
      },
    ],
  },
})
