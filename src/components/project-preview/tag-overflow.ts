export function getVisibleTags(
  tags: string[],
  max: number,
): { visible: string[]; overflowCount: number } {
  if (tags.length <= max) {
    return { visible: tags, overflowCount: 0 };
  }
  return { visible: tags.slice(0, max), overflowCount: tags.length - max };
}
