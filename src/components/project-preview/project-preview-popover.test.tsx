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
  });

  it('keeps the card open if the trigger is clicked again while already pinned', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    await user.click(trigger);
    expect(screen.getByRole('link')).toBeInTheDocument();
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
});
