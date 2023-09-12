module.exports = {
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: [ 'json', 'js', 'ts' ],
  collectCoverageFrom: ['src/**/*.ts'],
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  resetMocks: true,
}
