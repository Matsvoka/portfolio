import { describe, it, expect } from 'vitest';
import { splitNarrativeAtDemoIndex } from './narrative';

describe('splitNarrativeAtDemoIndex', () => {
  it('puts everything after the demo when demoIndex is 0', () => {
    expect(splitNarrativeAtDemoIndex(['p1', 'p2'], 0)).toEqual({ before: [], after: ['p1', 'p2'] });
  });

  it('splits at the given index', () => {
    expect(splitNarrativeAtDemoIndex(['p1', 'p2', 'p3'], 2)).toEqual({
      before: ['p1', 'p2'],
      after: ['p3'],
    });
  });

  it('puts everything before the demo when demoIndex is at or beyond the length', () => {
    expect(splitNarrativeAtDemoIndex(['p1', 'p2'], 5)).toEqual({ before: ['p1', 'p2'], after: [] });
  });

  it('clamps a negative demoIndex to 0', () => {
    expect(splitNarrativeAtDemoIndex(['p1', 'p2'], -3)).toEqual({ before: [], after: ['p1', 'p2'] });
  });
});
