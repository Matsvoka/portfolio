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
    expect(screen.getAllByTestId('skill-category-section')).toHaveLength(skills.length);
    expect(screen.getAllByTestId('skill-item')).toHaveLength(
      skills.reduce((total, category) => total + category.items.length, 0),
    );

    for (const category of skills) {
      expect(screen.getByText(category.category)).toBeInTheDocument();
      for (const item of category.items) {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      }
    }
  });

  it('shows skill items as subdued chips', () => {
    render(<SkillsSection />);

    for (const item of screen.getAllByTestId('skill-item')) {
      expect(item).toHaveClass(
        'ui-chip',
        'inline-flex',
        'items-center',
        'gap-1',
        'rounded',
        'border',
        'border-fg/10',
        'bg-fg/5',
        'text-fg-muted',
      );
      expect(item).not.toHaveClass('bg-lime-soft', 'text-lime-deep');
    }
  });

  it('shows categories inside one highlighted low-radius card with separators', () => {
    render(<SkillsSection />);

    expect(screen.getByTestId('skills-card')).toHaveClass(
      'rounded-sm',
      'border',
      'border-fg/10',
      'bg-bg',
      'p-4',
    );
    expect(screen.getAllByTestId('skill-category-section')[0]).toHaveClass(
      'border-b',
      'border-fg/10',
      'py-4',
      'first:pt-0',
    );
    expect(screen.getAllByTestId('skill-category-section').at(-1)).toHaveClass(
      'last:border-b-0',
      'last:pb-0',
    );
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
