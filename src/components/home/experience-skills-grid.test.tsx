import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ExperienceSkillsGrid } from './experience-skills-grid';

describe('ExperienceSkillsGrid', () => {
  it('groups Experiência, Skills, and Formação without Projetos', () => {
    render(<ExperienceSkillsGrid />);

    expect(document.getElementById('experiencia')).toBeInTheDocument();
    expect(document.getElementById('skills')).toBeInTheDocument();
    expect(document.getElementById('formacao')).toBeInTheDocument();
    expect(document.getElementById('idiomas')).toBeInTheDocument();
    expect(document.getElementById('projetos')).not.toBeInTheDocument();
  });

  it('places Formação below Experiência and keeps Skills and Idiomas in the sidebar', () => {
    render(<ExperienceSkillsGrid />);
    const experience = document.getElementById('experiencia');
    const education = document.getElementById('formacao');
    const skills = document.getElementById('skills');
    const languages = document.getElementById('idiomas');

    expect(experience?.parentElement).toBe(education?.parentElement?.parentElement);
    expect(education?.closest('aside')).toBeNull();
    expect(skills?.closest('aside')).not.toBeNull();
    expect(languages?.closest('aside')).not.toBe(skills?.closest('aside'));
    expect(education?.parentElement).toHaveClass('lg:row-start-2');
    expect(languages?.closest('aside')).toHaveClass('lg:row-start-2');
  });
});
