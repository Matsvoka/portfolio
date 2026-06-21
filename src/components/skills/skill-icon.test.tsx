import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SkillIcon } from './skill-icon';

describe('SkillIcon', () => {
  it('renders a known icon without crashing', () => {
    const { container } = render(<SkillIcon name="Atom" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('falls back to a generic icon for an unknown name', () => {
    const { container } = render(<SkillIcon name="NotARealIcon" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
