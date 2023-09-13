import type { Config } from 'jest'


const config: Config = {
  rootDir: '.',
  verbose: true,
  preset: 'ts-jest',
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^helpers$': require.resolve('./src/helpers/index.ts'),
    '^graphql$': require.resolve('./src/graphql/index.ts'),
  },
  modulePathIgnorePatterns: [ '<rootDir>/src/helpers' ],
  moduleFileExtensions: [ 'json', 'js', 'ts' ],
  collectCoverageFrom: [ 'src/**/*.ts' ],
  testMatch: [ '**/*.spec.ts' ],
  testEnvironment: 'node',
  resetMocks: true,
}


export default config
