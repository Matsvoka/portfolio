import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ProjectPreviewCard } from './project-preview-card';
import type { Project } from '@/content/types';

const project: Project = {
  slug: 'doctag',
  title: 'Doctag',
  oneLiner: 'App desktop de tagging de documentos.',
  tags: ['Electron', 'React', 'PostgreSQL', 'Docker'],
  role: 'Criador',
  previewVideo: '/videos/doctag-preview.mp4',
  narrative: ['Parágrafo 1.'],
  demoIndex: 0,
  demo: { type: 'mock', component: 'doctag' },
};

/**
 * Mocks real layout so `useTagFit`'s width measurement produces a
 * deterministic result in jsdom (which has no real layout engine).
 * `widthsByText` is keyed by each mirror block's full textContent (dot +
 * icon + label concatenated, as the DOM actually produces it).
 */
function mockTagLayout(widthsByText: Record<string, number>, availableWidth: number, gap = 8) {
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalOffsetLeft = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetLeft');
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return widthsByText[this.textContent ?? ''] ?? 0;
    },
  });

  // Only the hidden mirror row's direct children need a meaningful
  // offsetLeft (cumulative width of preceding siblings + the row's gap-2).
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

describe('ProjectPreviewCard', () => {
  it('renders the title and one-liner', () => {
    render(<ProjectPreviewCard project={project} />);
    expect(screen.getByText('Doctag')).toBeInTheDocument();
    expect(screen.getByText(project.oneLiner)).toBeInTheDocument();
  });

  it('links to the project detail page only through the Ver control', () => {
    render(<ProjectPreviewCard project={project} />);
    const link = screen.getByRole('link', { name: 'Ver detalhes do projeto Doctag' });

    expect(screen.getByTestId('project-preview-card').tagName).toBe('ARTICLE');
    expect(link).toHaveAttribute('href', '/projetos/doctag');
    expect(link).toHaveTextContent('Ver');
    expect(link).toHaveClass('active:scale-90');
  });

  it('shows no tags and no badge while layout cannot be measured yet (no guessed minimum)', () => {
    render(<ProjectPreviewCard project={project} />);
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
      render(<ProjectPreviewCard project={project} />);
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

  it('hides a tag that would overflow the card width, even when only two tags are set', () => {
    // Reproduces the "Cablagem" overflow: two tags fit the old fixed count of
    // two, but their combined text is too wide for this card.
    const wideTagsProject: Project = {
      ...project,
      tags: ['Google Apps Script', 'Google Sheets'],
    };

    const restore = mockTagLayout(
      { 'Google Apps Script': 140, '·Google Sheets': 110, '·+2': 24 },
      200,
    );

    try {
      render(<ProjectPreviewCard project={wideTagsProject} />);
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
      render(<ProjectPreviewCard project={{ ...project, tags: ['Google Apps Script', 'Google Sheets'] }} />);
      const tagRow = within(screen.getByTestId('tag-row'));
      expect(tagRow.queryByText('Google Apps Script')).not.toBeInTheDocument();
      expect(tagRow.queryByText('Google Sheets')).not.toBeInTheDocument();
      expect(tagRow.getByText('+2')).toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it('always renders the dedicated preview video, independently of the detail demo', () => {
    const { container } = render(<ProjectPreviewCard project={project} />);
    const video = screen.getByLabelText('Preview em vídeo do projeto Doctag');
    const source = container.querySelector('video source');

    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
    expect(source).toHaveAttribute('src', project.previewVideo);
    expect(project.demo.type).toBe('mock');
  });

  it('applies its own elevation shadow by default', () => {
    render(<ProjectPreviewCard project={project} />);
    expect(screen.getByTestId('project-preview-card').className).toContain('drop-shadow');
  });

  it('omits its own shadow when elevated=false (popover supplies one shadow for card+tail)', () => {
    render(<ProjectPreviewCard project={project} elevated={false} />);
    expect(screen.getByTestId('project-preview-card').className).not.toContain('drop-shadow');
  });
});
