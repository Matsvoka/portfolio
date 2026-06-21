import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectsSection } from './projects-section';
import { getPersonalProjects } from '@/lib/projects';

describe('ProjectsSection', () => {
  it('renders inside a #projetos section landmark', () => {
    render(<ProjectsSection />);
    expect(document.getElementById('projetos')).toBeInTheDocument();
  });

  it('renders a card for every personal project and none of the linked ones', () => {
    render(<ProjectsSection />);
    for (const project of getPersonalProjects()) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
    expect(screen.queryByText('HCP App')).not.toBeInTheDocument();
  });
});
