'use client';

import { useEffect, useState } from 'react';

const HEADER_OFFSET = 65;

export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const updateActiveSection = () => {
      const activationPoint = window.scrollY + HEADER_OFFSET;
      const orderedElements = [...elements].sort(
        (left, right) =>
          left.getBoundingClientRect().top - right.getBoundingClientRect().top,
      );
      let nextActiveId = sectionIds[0];

      for (const element of orderedElements) {
        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        if (elementTop <= activationPoint) {
          nextActiveId = element.id;
        }
      }

      const atPageEnd =
        window.scrollY > 0 &&
        Math.ceil(window.scrollY + window.innerHeight) >=
          document.documentElement.scrollHeight - 2;

      setActiveId(atPageEnd ? sectionIds[sectionIds.length - 1] : nextActiveId);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [sectionIds]);

  return activeId;
}
