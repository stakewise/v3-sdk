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

    '^methods/(.*)': '<rootDir>/methods/$1',
    '^methods$': '<rootDir>/methods/index.ts',

    '^helpers/(.*)': '<rootDir>/helpers/$1',
    '^helpers$': '<rootDir>/helpers/index.ts',

    '^contracts/(.*)': '<rootDir>/contracts/$1',
    '^contracts$': '<rootDir>/contracts/index.ts',
  },
}


export default config
