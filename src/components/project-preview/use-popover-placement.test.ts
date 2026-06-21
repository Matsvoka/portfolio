import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { usePopoverPlacement } from './use-popover-placement';

function makeTriggerRef(rect: Partial<DOMRect>) {
  const ref = createRef<HTMLElement>();
  const el = document.createElement('div');
  el.getBoundingClientRect = () =>
    ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
      ...rect,
    }) as DOMRect;
  // @ts-expect-error -- assigning to a readonly ref for the test
  ref.current = el;
  return ref;
}

describe('usePopoverPlacement', () => {
  it('chooses bottom when there is enough space below the trigger', () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    const ref = makeTriggerRef({ top: 100, bottom: 120 });
    const { result } = renderHook(() => usePopoverPlacement(ref, true, 220));
    expect(result.current).toBe('bottom');
  });

  it('chooses top when there is not enough space below but there is above', () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    const ref = makeTriggerRef({ top: 700, bottom: 720 });
    const { result } = renderHook(() => usePopoverPlacement(ref, true, 220));
    expect(result.current).toBe('top');
  });

  it('does nothing while inactive, keeping the default bottom placement', () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    const ref = makeTriggerRef({ top: 700, bottom: 720 });
    const { result } = renderHook(() => usePopoverPlacement(ref, false, 220));
    expect(result.current).toBe('bottom');
  });
});
