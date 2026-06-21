import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
