import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ExperienceSection } from './experience-section';
import { experience } from '@/content/experience';

describe('ExperienceSection', () => {
  it('renders inside a #experiencia section landmark', () => {
    render(<ExperienceSection />);
    expect(document.getElementById('experiencia')).toBeInTheDocument();
  });

  it('renders one row per experience entry', () => {
    render(<ExperienceSection />);
    for (const entry of experience) {
      expect(screen.getByText(entry.company)).toBeInTheDocument();
    }
  });

  it('renders two earlier roles below Desenvolvedor Full-stack', () => {
    render(<ExperienceSection />);
    const roles = screen.getAllByText(/Engenheiro|Desenvolvedor|Estagiário/);

    expect(roles.map((role) => role.textContent)).toEqual([
      'Engenheiro de Software',
      'Desenvolvedor Full-stack',
      'Desenvolvedor Front-end',
      'Estagiário de Desenvolvimento',
    ]);
  });

  it('links HCP App to the Desenvolvedor Full-stack role', () => {
    render(<ExperienceSection />);
    const role = screen.getByText('Desenvolvedor Full-stack');
    const row = role.closest('li');

    expect(row).not.toBeNull();
    expect(within(row!).getByText('Projetos')).toBeInTheDocument();
    expect(within(row!).getByRole('button', { name: 'HCP App' })).toBeInTheDocument();
  });
});
