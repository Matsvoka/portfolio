import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EducationSection } from './education-section';
import { education } from '@/content/education';

describe('EducationSection', () => {
  it('renders inside a #formacao section landmark', () => {
    render(<EducationSection />);
    expect(document.getElementById('formacao')).toBeInTheDocument();
  });

  it('renders degree, institution, and period below it for every entry', () => {
    render(<EducationSection />);
    for (const entry of education) {
      const degree = screen.getByText(entry.degree);
      expect(degree).toBeInTheDocument();
      expect(screen.getByText(entry.institution)).toBeInTheDocument();
      expect(screen.getByText(entry.period)).toBeInTheDocument();
    }
  });
});
