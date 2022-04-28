// eslint-disable-next-line import/no-default-export
export default {
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/{helpers,libs}/**/*.ts'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
      useESM: true,
    },
  },
  maxWorkers: '50%',
  preset: 'ts-jest/presets/default-esm',
  rootDir: '..',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  testMatch: ['**/*.test.ts'],
}
