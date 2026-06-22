export type TagFit = { visibleCount: number; overflowCount: number };

/**
 * Greedily fits as many tags as possible into `availableWidth`, reserving room
 * for the "+N" badge once the full set doesn't fit.
 *
 * `cumulativeWidths[i]` is the total rendered width of tags `[0..i]` together
 * (icon, separators and gaps included) — i.e. how wide the row would be if it
 * stopped right after tag `i`.
 */
export function fitTagsToWidth(
  cumulativeWidths: number[],
  gap: number,
  badgeWidth: number,
  availableWidth: number,
): TagFit {
  const n = cumulativeWidths.length;
  if (n === 0) return { visibleCount: 0, overflowCount: 0 };

  if (cumulativeWidths[n - 1] <= availableWidth) {
    return { visibleCount: n, overflowCount: 0 };
  }

  for (let count = n - 1; count >= 0; count--) {
    const widthBeforeBadge = count > 0 ? cumulativeWidths[count - 1] + gap : 0;
    if (widthBeforeBadge + badgeWidth <= availableWidth) {
      return { visibleCount: count, overflowCount: n - count };
    }
  }

  return { visibleCount: 0, overflowCount: n };
}
