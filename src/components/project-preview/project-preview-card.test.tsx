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

  it('renders its tags through the shared tag row, with no guessed minimum before measurement', () => {
    render(<ProjectPreviewCard project={project} />);
    const tagRow = within(screen.getByTestId('tag-row'));
    expect(tagRow.queryByText('Electron')).not.toBeInTheDocument();
    expect(tagRow.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
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
