import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from './use-active-section';

type Entry = { isIntersecting: boolean; target: Element };
type ObserverCallback = (entries: Entry[]) => void;

let observedCallback: ObserverCallback | null = null;

class MockIntersectionObserver {
  constructor(callback: ObserverCallback) {
    observedCallback = callback;
  }
  observe() {}
  disconnect() {}
}

beforeEach(() => {
  observedCallback = null;
  // @ts-expect-error -- test double for a browser API jsdom doesn't implement
  window.IntersectionObserver = MockIntersectionObserver;
  document.body.innerHTML =
    '<div id="sobre"></div><div id="experiencia"></div><div id="skills"></div><div id="formacao"></div><div id="idiomas"></div>';
});

describe('useActiveSection', () => {
  it('starts with the first section id', () => {
    const { result } = renderHook(() => useActiveSection(['sobre', 'experiencia']));
    expect(result.current).toBe('sobre');
  });

  it('updates to the section reported as intersecting', () => {
    const { result } = renderHook(() => useActiveSection(['sobre', 'experiencia']));
    const experienciaEl = document.getElementById('experiencia')!;

    act(() => {
      observedCallback?.([{ isIntersecting: true, target: experienciaEl }]);
    });

    expect(result.current).toBe('experiencia');
  });

  it('tracks Skills and Idiomas as independent sections', () => {
    const sectionIds = ['sobre', 'experiencia', 'skills', 'formacao', 'idiomas'];
    const { result } = renderHook(() => useActiveSection(sectionIds));

    act(() => {
      observedCallback?.([
        { isIntersecting: true, target: document.getElementById('skills')! },
      ]);
    });
    expect(result.current).toBe('skills');

    act(() => {
      observedCallback?.([
        { isIntersecting: true, target: document.getElementById('idiomas')! },
      ]);
    });
    expect(result.current).toBe('idiomas');
  });
});
