import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProjectsSkillsGrid } from './projects-skills-grid';

describe('ProjectsSkillsGrid', () => {
  it('renders the Projetos, Skills, and Formação landmarks together', () => {
    render(<ProjectsSkillsGrid />);
    expect(document.getElementById('projetos')).toBeInTheDocument();
    expect(document.getElementById('skills')).toBeInTheDocument();
    expect(document.getElementById('formacao')).toBeInTheDocument();
  });
});
