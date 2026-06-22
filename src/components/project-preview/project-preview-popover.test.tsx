import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectPreviewPopover } from './project-preview-popover';
import type { Project } from '@/content/types';

const project: Project = {
  slug: 'doctag',
  title: 'Doctag',
  oneLiner: 'App desktop de tagging de documentos.',
  tags: ['Electron'],
  role: 'Criador',
  narrative: ['Parágrafo.'],
  demoIndex: 0,
  demo: { type: 'mock', component: 'doctag' },
};

function renderPopover() {
  return render(
    <ProjectPreviewPopover project={project}>
      <span>Doctag</span>
    </ProjectPreviewPopover>,
  );
}

describe('ProjectPreviewPopover', () => {
  it('hides the card by default', () => {
    renderPopover();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shows the card on hover', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.hover(screen.getByRole('button'));
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('hides the card again on unhover when not pinned', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button');
    await user.hover(trigger);
    await user.unhover(trigger);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('persists the card after a click, even after unhover', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    await user.unhover(trigger);
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-pinned', 'true');
  });

  it('unpins the card when the trigger is clicked again', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    await user.click(trigger);
    expect(trigger).toHaveAttribute('data-pinned', 'false');
    await user.unhover(trigger);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('dismisses a pinned card on outside click', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ProjectPreviewPopover project={project}>
          <span>Doctag</span>
        </ProjectPreviewPopover>
        <button>outside</button>
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Doctag' }));
    await user.click(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('dismisses a pinned card on Escape', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders a decorative tail pointing at the trigger when visible', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.hover(screen.getByRole('button'));
    expect(screen.getByTestId('popover-tail')).toBeInTheDocument();
  });

  it('renders exactly one drop-shadow wrapper, not a duplicate on the card', async () => {
    const user = userEvent.setup();
    const { container } = renderPopover();
    await user.hover(screen.getByRole('button'));
    const shadowElements = Array.from(container.querySelectorAll('*')).filter((el) =>
      el.className?.toString().includes('drop-shadow'),
    );
    expect(shadowElements).toHaveLength(1);
    expect(screen.getByRole('link').className).not.toContain('drop-shadow');
  });

  it('applies a custom className to the trigger button', () => {
    render(
      <ProjectPreviewPopover project={project} triggerClassName="custom-trigger">
        <span>Doctag</span>
      </ProjectPreviewPopover>,
    );
    expect(screen.getByRole('button').className).toBe('custom-trigger');
  });

  it('renders the tail after the card and pointing downward when placed above the trigger', async () => {
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
      if (this.tagName === 'BUTTON') {
        return {
          top: 700,
          bottom: 720,
          left: 0,
          right: 0,
          width: 0,
          height: 20,
          x: 0,
          y: 700,
          toJSON: () => {},
        } as DOMRect;
      }
      return originalGetBoundingClientRect.call(this);
    };

    try {
      const user = userEvent.setup();
      renderPopover();
      await user.hover(screen.getByRole('button'));

      const tail = screen.getByTestId('popover-tail');
      const link = screen.getByRole('link');

      // placement === 'top' renders the downward-pointing triangle (border-t-bg)
      expect(tail.className).toContain('border-t-bg');
      expect(tail.className).not.toContain('border-b-bg');

      // and the tail must come after the card in DOM order
      expect(
        link.compareDocumentPosition(tail) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    }
  });
});
