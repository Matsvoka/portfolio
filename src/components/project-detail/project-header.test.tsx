import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectHeader } from './project-header';
import type { ProjectDetail } from '@/content/types';

const project: ProjectDetail = {
  slug: 'doctag',
  title: 'Doctag',
  tags: ['Electron', 'React'],
  links: { github: 'https://github.com/placeholder/doctag' },
  sections: [],
};

describe('ProjectHeader', () => {
  it('renders the title and tags', () => {
    render(<ProjectHeader project={project} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Doctag' })).toBeInTheDocument();
    expect(screen.getByText('Electron')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders a GitHub link when present', () => {
    render(<ProjectHeader project={project} />);
    expect(screen.getByRole('link', { name: /repositório/i })).toHaveAttribute(
      'href',
      project.links!.github,
    );
  });

  it('renders no links section when links is undefined', () => {
    render(<ProjectHeader project={{ ...project, links: undefined }} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
