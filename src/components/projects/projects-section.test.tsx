import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectsSection } from './projects-section';
import { getPersonalProjects } from '@/lib/projects';

describe('ProjectsSection', () => {
  it('renders inside a #projetos section landmark', () => {
    render(<ProjectsSection />);
    expect(document.getElementById('projetos')).toBeInTheDocument();
  });

  it('renders a list item for every personal project and none of the linked ones', () => {
    render(<ProjectsSection />);
    for (const project of getPersonalProjects()) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
    expect(screen.queryByText('HCP App')).not.toBeInTheDocument();
  });

  it('renders one bordered container with a separator between each project item', () => {
    render(<ProjectsSection />);
    const list = screen.getByRole('list');
    const items = screen.getAllByRole('listitem');

    expect(list.className).toContain('border');
    expect(items).toHaveLength(getPersonalProjects().length);
    expect(items[0].className).toContain('first:pt-0');
    expect(items[items.length - 1].className).toContain('last:border-b-0');
  });
});
