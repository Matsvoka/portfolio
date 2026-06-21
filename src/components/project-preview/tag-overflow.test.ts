import { describe, it, expect } from 'vitest';
import { getVisibleTags } from './tag-overflow';

describe('getVisibleTags', () => {
  it('returns all tags with no overflow when under the max', () => {
    expect(getVisibleTags(['Electron', 'React'], 2)).toEqual({
      visible: ['Electron', 'React'],
      overflowCount: 0,
    });
  });

  it('truncates and reports the overflow count when over the max', () => {
    expect(getVisibleTags(['Electron', 'React', 'PostgreSQL', 'Docker'], 2)).toEqual({
      visible: ['Electron', 'React'],
      overflowCount: 2,
    });
  });

  it('handles an empty tag list', () => {
    expect(getVisibleTags([], 2)).toEqual({ visible: [], overflowCount: 0 });
  });
});
