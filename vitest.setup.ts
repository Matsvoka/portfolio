import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  class NoopIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error -- minimal test double, tests that care override this themselves
  window.IntersectionObserver = NoopIntersectionObserver;
}
