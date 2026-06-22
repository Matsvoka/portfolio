import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectChip } from './project-chip';

describe('ProjectChip', () => {
  it('renders the project title as the trigger label', () => {
    render(<ProjectChip slug="doctag" />);
    expect(screen.getByRole('button', { name: 'Doctag' })).toHaveClass(
      'cursor-pointer',
      'bg-lime-bright',
      'hover:bg-lime',
      'active:bg-lime-deep',
      'active:scale-90',
      'sm:active:scale-100',
      'sm:cursor-default',
      'data-[preview-active=true]:bg-lime',
      'data-[pinned=true]:bg-lime',
      'data-[pinned=true]:text-ink',
      'dark:data-[pinned=true]:text-coal',
    );
  });

  it('renders nothing for an unknown slug', () => {
    const { container } = render(<ProjectChip slug="not-a-real-project" />);
    expect(container).toBeEmptyDOMElement();
  });
});
