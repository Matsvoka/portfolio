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
    expect(screen.getAllByTestId('skill-category-card')).toHaveLength(skills.length);

    for (const category of skills) {
      expect(screen.getByText(category.category)).toBeInTheDocument();
      for (const item of category.items) {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      }
    }
  });

  it('shows each category inside a highlighted low-radius card', () => {
    render(<SkillsSection />);

    expect(screen.getAllByTestId('skill-category-card')[0].parentElement).toHaveClass('gap-2');
    for (const card of screen.getAllByTestId('skill-category-card')) {
      expect(card).toHaveClass('rounded-sm', 'border', 'border-fg/10', 'bg-bg', 'p-4');
    }
  });

  it('uses the primary section and experience-role typography', () => {
    render(<SkillsSection />);

    expect(screen.getByRole('heading', { name: 'Skills' })).toHaveClass(
      'ui-text-heading',
      'font-bold',
    );
    expect(screen.getByText(skills[0].category)).toHaveClass(
      'ui-text-entry-title',
      'font-bold',
      'leading-tight',
      'tracking-tight',
    );
  });
});
