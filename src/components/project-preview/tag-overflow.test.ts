import { describe, it, expect } from 'vitest';
import { fitTagsToWidth } from './tag-overflow';

describe('fitTagsToWidth', () => {
  it('shows every tag when the full row already fits', () => {
    // two tags, cumulative widths 80 and 150, well under the 200px budget
    expect(fitTagsToWidth([80, 150], 6, 24, 200)).toEqual({
      visibleCount: 2,
      overflowCount: 0,
    });
  });

  it('drops trailing tags that would overflow, reserving room for the badge', () => {
    // "Google Apps Script" (120px) fits; adding "Google Sheets" pushes the
    // row to 230px, past the 212px budget — so only the first tag plus a
    // "+1" badge (22px) fit instead.
    expect(fitTagsToWidth([120, 230], 6, 22, 212)).toEqual({
      visibleCount: 1,
      overflowCount: 1,
    });
  });

  it('hides every tag when even one tag plus the badge cannot fit', () => {
    expect(fitTagsToWidth([180, 360], 6, 22, 100)).toEqual({
      visibleCount: 0,
      overflowCount: 2,
    });
  });

  it('handles an empty width list', () => {
    expect(fitTagsToWidth([], 6, 22, 200)).toEqual({ visibleCount: 0, overflowCount: 0 });
  });

  it('keeps a single tag visible when it fits within the available width', () => {
    expect(fitTagsToWidth([80], 6, 20, 200)).toEqual({ visibleCount: 1, overflowCount: 0 });
  });
});
