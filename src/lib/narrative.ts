export function splitNarrativeAtDemoIndex(
  narrative: string[],
  demoIndex: number,
): { before: string[]; after: string[] } {
  const clampedIndex = Math.max(0, Math.min(demoIndex, narrative.length));
  return {
    before: narrative.slice(0, clampedIndex),
    after: narrative.slice(clampedIndex),
  };
}
