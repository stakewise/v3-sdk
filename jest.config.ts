import type { Config } from 'jest'


const config: Config = {
  rootDir: '.',
  verbose: true,
  preset: 'ts-jest',
  resetMocks: true,
  testEnvironment: 'node',
  testMatch: [ '**/*.spec.ts' ],
  collectCoverageFrom: [ 'src/**/*.ts' ],
  moduleFileExtensions: [ 'json', 'js', 'ts' ],
  modulePathIgnorePatterns: [ '<rootDir>/src/helpers' ],
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
  globals: {
    isolatedModules: true,
  },
  moduleNameMapper: {
    '^helpers$': require.resolve('./src/helpers/index.ts'),
    '^graphql$': require.resolve('./src/graphql/index.ts'),
    '^contracts$': require.resolve('./src/contracts/index.ts'),
  },
}


export default config
