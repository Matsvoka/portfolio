'use client';

import { useEffect, useState } from 'react';

const EMPTY_SECTION_ALIASES: Record<string, string> = {};

export function useActiveSection(
  sectionIds: string[],
  sectionAliases: Record<string, string> = EMPTY_SECTION_ALIASES,
): string {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const observedIds = [...sectionIds, ...Object.keys(sectionAliases)];
    const elements = observedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const observedId = visible[0].target.id;
          setActiveId(sectionAliases[observedId] ?? observedId);
        }
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionAliases, sectionIds]);

  return activeId;
}
