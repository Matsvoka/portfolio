'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';

export type PopoverPlacement = 'top' | 'bottom';

export function usePopoverPlacement(
  triggerRef: RefObject<HTMLElement | null>,
  active: boolean,
  estimatedHeight = 220,
): PopoverPlacement {
  const [placement, setPlacement] = useState<PopoverPlacement>('bottom');

  useLayoutEffect(() => {
    if (!active || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    setPlacement(spaceBelow >= estimatedHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top');
  }, [active, triggerRef, estimatedHeight]);

  return placement;
}
