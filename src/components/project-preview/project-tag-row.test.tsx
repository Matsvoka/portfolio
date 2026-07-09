import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ProjectTagRow } from './project-tag-row';

/**
 * Mocks real layout so `useTagFit`'s width measurement produces a
 * deterministic result in jsdom (which has no real layout engine).
 * `widthsByText` is keyed by each mirror block's full textContent (dot +
 * icon + label concatenated, as the DOM actually produces it).
 */
function mockTagLayout(widthsByText: Record<string, number>, availableWidth: number, gap = 6) {
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalOffsetLeft = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetLeft');
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return widthsByText[this.textContent ?? ''] ?? 0;
    },
  });

  Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
    configurable: true,
    get(this: HTMLElement) {
      if (this.parentElement?.getAttribute('aria-hidden') !== 'true') return 0;
      const siblings = Array.from(this.parentElement.children);
      const index = siblings.indexOf(this);
      return siblings
        .slice(0, index)
        .reduce((sum, sibling) => sum + (sibling as HTMLElement).offsetWidth + gap, 0);
    },
  });

  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() {
      return availableWidth;
    },
  });

  return function restore() {
    if (originalOffsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    if (originalOffsetLeft) Object.defineProperty(HTMLElement.prototype, 'offsetLeft', originalOffsetLeft);
    if (originalClientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
  };
}

describe('ProjectTagRow', () => {
  it('shows no tags and no badge while layout cannot be measured yet (no guessed minimum)', () => {
    render(<ProjectTagRow tags={['Electron', 'React', 'PostgreSQL', 'Docker']} />);
    const tagRow = within(screen.getByTestId('tag-row'));
    expect(tagRow.queryByText('Electron')).not.toBeInTheDocument();
    expect(tagRow.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it('shows every tag once measured, when they all fit', () => {
    const restore = mockTagLayout(
      { Electron: 60, '·React': 50, '·PostgreSQL': 80, '·Docker': 60 },
      400,
    );
    try {
      render(<ProjectTagRow tags={['Electron', 'React', 'PostgreSQL', 'Docker']} />);
      const tagRow = within(screen.getByTestId('tag-row'));
      expect(tagRow.getByText('Electron')).toBeInTheDocument();
      expect(tagRow.getByText('React')).toBeInTheDocument();
      expect(tagRow.getByText('PostgreSQL')).toBeInTheDocument();
      expect(tagRow.getByText('Docker')).toBeInTheDocument();
      expect(tagRow.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it('hides a tag that would overflow the row width, even when only two tags are set', () => {
    const restore = mockTagLayout(
      { 'Google Apps Script': 140, '·Google Sheets': 110, '·+2': 24 },
      200,
    );
    try {
      render(<ProjectTagRow tags={['Google Apps Script', 'Google Sheets']} />);
      const tagRow = within(screen.getByTestId('tag-row'));
      expect(tagRow.getByText('Google Apps Script')).toBeInTheDocument();
      expect(tagRow.queryByText('Google Sheets')).not.toBeInTheDocument();
      expect(tagRow.getByText('+1')).toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it('hides every tag — with no minimum kept visible — when even one tag plus the badge cannot fit', () => {
    const restore = mockTagLayout(
      { 'Google Apps Script': 140, '·Google Sheets': 110, '·+2': 24 },
      40,
    );
    try {
      render(<ProjectTagRow tags={['Google Apps Script', 'Google Sheets']} />);
      const tagRow = within(screen.getByTestId('tag-row'));
      expect(tagRow.queryByText('Google Apps Script')).not.toBeInTheDocument();
      expect(tagRow.queryByText('Google Sheets')).not.toBeInTheDocument();
      expect(tagRow.getByText('+2')).toBeInTheDocument();
    } finally {
      restore();
    }
  });
});
