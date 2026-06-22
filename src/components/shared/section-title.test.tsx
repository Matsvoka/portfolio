import { render, screen } from '@testing-library/react';
import { BriefcaseBusiness } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { SectionTitle } from './section-title';

describe('SectionTitle', () => {
  it('renders an accessible heading with a decorative colored icon', () => {
    const { container } = render(
      <SectionTitle icon={BriefcaseBusiness}>Experiência</SectionTitle>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Experiência' })).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass(
      'text-lime-deep',
      'dark:text-lime-bright',
    );
    expect(container.querySelector('[aria-hidden="true"]')).not.toHaveClass('bg-lime');
  });
});
