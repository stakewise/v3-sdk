module.exports = {
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  projects: [
    '<rootDir>/packages/*/jest.config.js',
  ],
  moduleFileExtensions: [ 'json', 'js', 'ts' ],
  collectCoverageFrom: ['src/**/*.ts'],
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  resetMocks: true,
}
