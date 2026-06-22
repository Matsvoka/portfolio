import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExperienceEntryRow } from './experience-entry-row';
import type { ExperienceEntry } from '@/content/types';

const currentEntry: ExperienceEntry = {
  company: 'Empresa X',
  role: 'Engenheiro de Software',
  period: '2023 — Atual',
  description: 'Atuação em produto X.',
  current: true,
  projectSlugs: [],
};

const pastEntry: ExperienceEntry = {
  ...currentEntry,
  company: 'Empresa Y',
  role: 'Desenvolvedor Full-stack',
  period: '2021 — 2023',
  current: false,
};

describe('ExperienceEntryRow', () => {
  it('draws the timeline connector only from this dot toward the next one', () => {
    const { container } = render(
      <ul>
        <ExperienceEntryRow entry={currentEntry} />
      </ul>,
    );
    const row = container.querySelector('li');

    expect(row).not.toHaveClass('border-l-2');
    expect(row).toHaveClass(
      'after:top-[33px]',
      'after:-bottom-[33px]',
      'after:bg-fg-muted',
      'first:after:bg-lime',
      'last:after:hidden',
    );
  });

  it('renders role, company, period, and description', () => {
    render(
      <ul>
        <ExperienceEntryRow entry={currentEntry} />
      </ul>,
    );
    expect(screen.getByText('Engenheiro de Software')).toBeInTheDocument();
    expect(screen.getByText('Empresa X')).toBeInTheDocument();
    expect(screen.getByText('2023 — Atual')).toBeInTheDocument();
    expect(screen.getByText('Atuação em produto X.')).toBeInTheDocument();
  });

  it('renders the current entry role in lime', () => {
    render(
      <ul>
        <ExperienceEntryRow entry={currentEntry} />
      </ul>,
    );
    expect(screen.getByText('Engenheiro de Software').className).toContain('text-lime-deep');
  });

  it('renders a past entry role in the neutral foreground color, not lime', () => {
    render(
      <ul>
        <ExperienceEntryRow entry={pastEntry} />
      </ul>,
    );
    expect(screen.getByText('Desenvolvedor Full-stack').className).not.toContain('text-lime-deep');
  });

  it('renders a "Projetos" label and chip when projectSlugs is non-empty', () => {
    render(
      <ul>
        <ExperienceEntryRow entry={{ ...currentEntry, projectSlugs: ['hcp-app'] }} />
      </ul>,
    );
    expect(screen.getByText('Projetos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'HCP App' })).toBeInTheDocument();
  });

  it('renders no "Projetos" label when projectSlugs is empty', () => {
    render(
      <ul>
        <ExperienceEntryRow entry={currentEntry} />
      </ul>,
    );
    expect(screen.queryByText('Projetos')).not.toBeInTheDocument();
  });
});
