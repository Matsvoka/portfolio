import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

describe('ProjectPreviewCard', () => {
  it('renders the title and one-liner', () => {
    render(<ProjectPreviewCard project={project} />);
    expect(screen.getByText('Doctag')).toBeInTheDocument();
    expect(screen.getByText(project.oneLiner)).toBeInTheDocument();
  });

  it('links to the project detail page as a single whole-card link', () => {
    render(<ProjectPreviewCard project={project} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/projetos/doctag');
  });

  it('shows only the first two tags plus an overflow count', () => {
    render(<ProjectPreviewCard project={project} />);
    expect(screen.getByText('Electron')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('PostgreSQL')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
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
    expect(screen.getByRole('link').className).toContain('drop-shadow');
  });

  it('omits its own shadow when elevated=false (popover supplies one shadow for card+tail)', () => {
    render(<ProjectPreviewCard project={project} elevated={false} />);
    expect(screen.getByRole('link').className).not.toContain('drop-shadow');
  });
});
