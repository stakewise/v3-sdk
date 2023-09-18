import type { Config } from 'jest'


const config: Config = {
  verbose: true,
  rootDir: './src',
  preset: 'ts-jest',
  resetMocks: true,
  testEnvironment: 'node',
  testMatch: [ '**/*.spec.ts' ],
  collectCoverageFrom: [ 'src/**/*.ts' ],
  moduleFileExtensions: [ 'json', 'js', 'ts' ],
  modulePathIgnorePatterns: [ '<rootDir>/src/helpers' ],
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
    '\\.graphql$': '@graphql-tools/jest-transform',
  },
  globals: {
    isolatedModules: true,
  },
  moduleNameMapper: {
    '^graphql/(.*)': '<rootDir>/graphql/$1',
    '^graphql$': '<rootDir>/graphql/index.ts',

    '^requests/(.*)': '<rootDir>/requests/$1',
    '^requests$': '<rootDir>/requests/index.ts',
    '^requests/methods': '<rootDir>/requests/methods/indes.ts',

    '^helpers$': '<rootDir>/helpers/index.ts',
    '^contracts$': '<rootDir>/contracts/index.ts',
  },
}


export default config
