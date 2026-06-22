'use client';

import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { fitTagsToWidth, type TagFit } from './tag-overflow';

/**
 * Measures the real rendered width of each tag (via a hidden mirror row) against
 * the visible row's available width, and reports how many tags actually fit
 * before the "+N" overflow badge is needed. No tag is shown until its fit is
 * confirmed — there is no guessed minimum while the real measurement is pending.
 */
export function useTagFit(tags: string[]): {
  rowRef: RefObject<HTMLDivElement | null>;
  mirrorRef: RefObject<HTMLDivElement | null>;
  fit: TagFit;
} {
  const rowRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<TagFit>({ visibleCount: 0, overflowCount: 0 });

  useLayoutEffect(() => {
    const row = rowRef.current;
    const mirror = mirrorRef.current;
    if (!row || !mirror || tags.length === 0) return;

    function measure() {
      if (!row || !mirror) return;

      const availableWidth = row.clientWidth;
      if (availableWidth <= 0) return;

      const children = Array.from(mirror.children) as HTMLElement[];
      const badge = children[tags.length];
      if (!badge) return;

      const cumulativeWidths = children
        .slice(0, tags.length)
        .map((child) => child.offsetLeft + child.offsetWidth);

      const lastTagEnd = cumulativeWidths[cumulativeWidths.length - 1] ?? 0;
      const gap = badge.offsetLeft - lastTagEnd;

      setFit(fitTagsToWidth(cumulativeWidths, gap, badge.offsetWidth, availableWidth));
    }

    measure();

    const cleanups: Array<() => void> = [];

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);
      observer.observe(row);
      cleanups.push(() => observer.disconnect());
    }

    window.addEventListener('resize', measure);
    cleanups.push(() => window.removeEventListener('resize', measure));

    // A tag's width measured before its web font finishes swapping in (FOUT)
    // can read narrower than the font that actually ends up on screen —
    // re-measure once the real font is confirmed loaded to catch that.
    if (typeof document !== 'undefined' && document.fonts) {
      let cancelled = false;
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
      cleanups.push(() => {
        cancelled = true;
      });
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [tags]);

  return { rowRef, mirrorRef, fit };
}
