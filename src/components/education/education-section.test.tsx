import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EducationSection } from './education-section';
import { education } from '@/content/education';

describe('EducationSection', () => {
  it('renders inside a #formacao section landmark', () => {
    render(<EducationSection />);
    expect(document.getElementById('formacao')).toHaveClass('scroll-mt-16', 'px-4', 'py-12');
  });

  it('renders degree, institution, and period below it for every entry', () => {
    render(<EducationSection />);
    for (const entry of education) {
      const degree = screen.getByText(entry.degree);
      expect(degree).toBeInTheDocument();
      expect(screen.getByText(entry.institution)).toBeInTheDocument();
      expect(screen.getByText(entry.period)).toBeInTheDocument();
    }
    expect(screen.getAllByText('logo')).toHaveLength(education.length);
  });

  it('matches the section, role, company, and date typography from experience', () => {
    render(<EducationSection />);
    const entry = education[0];

    expect(screen.getByRole('heading', { name: 'Formação' })).toHaveClass(
      'text-3xl',
      'font-bold',
    );
    expect(screen.getByText(entry.degree)).toHaveClass('text-[22px]', 'font-bold');
    expect(screen.getByText(entry.institution)).toHaveClass('text-base', 'font-semibold');
    expect(screen.getByText(entry.period)).toHaveClass('font-mono', 'text-sm');
  });

  it('renders Língua Inglesa below Técnico em Informática', () => {
    render(<EducationSection />);
    const degrees = education.map((entry) => screen.getByText(entry.degree).textContent);

    expect(degrees).toEqual([
      'Bacharelado em Ciência da Computação',
      'Técnico em Informática',
      'Língua Inglesa',
    ]);
  });
});
