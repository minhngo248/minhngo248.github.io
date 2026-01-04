import '@testing-library/jest-dom'

// Mock fetch for testing
global.fetch = vi.fn()

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
}