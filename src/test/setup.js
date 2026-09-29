import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas-confetti for JSDOM test environment
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
  create: vi.fn(() => vi.fn()),
  reset: vi.fn()
}));
