import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  verbose: false,
  // setupFilesAfterEnv: ['./jest.setup.js'],
}

export default createJestConfig(config)
