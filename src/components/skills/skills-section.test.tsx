import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillsSection } from './skills-section';
import { skills } from '@/content/skills';

describe('SkillsSection', () => {
  it('renders inside a #skills section landmark', () => {
    render(<SkillsSection />);
    expect(document.getElementById('skills')).toBeInTheDocument();
  });

  it('renders every category and item', () => {
    render(<SkillsSection />);
    for (const category of skills) {
      expect(screen.getByText(category.category)).toBeInTheDocument();
      for (const item of category.items) {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      }
    }
  });
});
