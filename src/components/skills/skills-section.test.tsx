import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillsSection } from './skills-section';
import { skills } from '@/content/skills';

describe('SkillsSection', () => {
  it('renders inside a #skills section landmark', () => {
    render(<SkillsSection />);
    expect(document.getElementById('skills')).toHaveClass('scroll-mt-16', 'px-4', 'py-12');
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

  it('uses the primary section and experience-role typography', () => {
    render(<SkillsSection />);

    expect(screen.getByRole('heading', { name: 'Skills' })).toHaveClass(
      'text-[27px]',
      'font-bold',
    );
    expect(screen.getByText(skills[0].category)).toHaveClass(
      'text-[20px]',
      'font-bold',
      'leading-tight',
      'tracking-tight',
    );
  });
});
