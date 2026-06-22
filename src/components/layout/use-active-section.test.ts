import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useActiveSection } from './use-active-section';

const sectionIds = ['sobre', 'experiencia', 'skills', 'formacao', 'idiomas', 'projetos'];
const sectionTops: Record<string, number> = {
  sobre: 300,
  experiencia: 700,
  skills: 900,
  formacao: 1100,
  idiomas: 1300,
  projetos: 1500,
};

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value });
}

beforeEach(() => {
  document.body.innerHTML = sectionIds.map((id) => `<section id="${id}"></section>`).join('');
  setScrollY(0);
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: 2200,
  });

  for (const id of sectionIds) {
    const element = document.getElementById(id)!;
    element.getBoundingClientRect = () =>
      ({ top: sectionTops[id] - window.scrollY }) as DOMRect;
  }
});

describe('useActiveSection', () => {
  it('starts with the first section before its top reaches the header', () => {
    const { result } = renderHook(() => useActiveSection(sectionIds));
    expect(result.current).toBe('sobre');
  });

  it('activates a section only when its top reaches the header offset', () => {
    const { result } = renderHook(() => useActiveSection(sectionIds));

    act(() => {
      setScrollY(634);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('sobre');

    act(() => {
      setScrollY(635);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('experiencia');
  });

  it('tracks Skills and Idiomas independently', () => {
    const { result } = renderHook(() => useActiveSection(sectionIds));

    act(() => {
      setScrollY(835);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('skills');

    act(() => {
      setScrollY(1235);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('idiomas');
  });

  it('activates the final section at the bottom of the page', () => {
    const { result } = renderHook(() => useActiveSection(sectionIds));

    act(() => {
      setScrollY(1400);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('projetos');
  });
});
