import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectListItem } from './project-list-item';
import type { ProjectSummary } from '@/content/types';

const project: ProjectSummary = {
  slug: 'doctag',
  title: 'Doctag',
  oneLiner: 'App desktop de tagging de documentos.',
  tags: ['Electron', 'React'],
  previewVideo: '/videos/doctag-preview.mp4',
};

describe('ProjectListItem', () => {
  it('renders a logo placeholder', () => {
    render(<ProjectListItem project={project} />);
    expect(screen.getByText('logo')).toBeInTheDocument();
  });

  it('renders the title and one-liner at the entry-row sizing tokens', () => {
    render(<ProjectListItem project={project} />);
    expect(screen.getByText('Doctag')).toHaveClass('ui-text-entry-title');
    expect(screen.getByText(project.oneLiner)).toHaveClass('ui-text-description');
  });

  it('links to the project detail page through the Ver control', () => {
    render(<ProjectListItem project={project} />);
    const link = screen.getByRole('link', { name: 'Ver detalhes do projeto Doctag' });
    expect(link).toHaveAttribute('href', '/projetos/doctag');
    expect(link).toHaveTextContent('Ver');
  });

  it('renders the dedicated preview video', () => {
    const { container } = render(<ProjectListItem project={project} />);
    const video = screen.getByLabelText('Preview em vídeo do projeto Doctag');
    const source = container.querySelector('video source');

    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
    expect(source).toHaveAttribute('src', project.previewVideo);
  });

  it('renders the tag row for the project tags', () => {
    render(<ProjectListItem project={project} />);
    expect(screen.getByTestId('tag-row')).toBeInTheDocument();
  });
});
