import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectChip } from './project-chip';

describe('ProjectChip', () => {
  it('renders the project title as the trigger label', () => {
    render(<ProjectChip slug="doctag" />);
    expect(screen.getByRole('button', { name: 'Doctag' })).toBeInTheDocument();
  });

  it('renders nothing for an unknown slug', () => {
    const { container } = render(<ProjectChip slug="not-a-real-project" />);
    expect(container).toBeEmptyDOMElement();
  });
});
