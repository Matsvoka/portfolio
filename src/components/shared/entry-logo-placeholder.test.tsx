import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EntryLogoPlaceholder } from './entry-logo-placeholder';

describe('EntryLogoPlaceholder', () => {
  it('renders a fixed 56px decorative placeholder', () => {
    render(<EntryLogoPlaceholder />);

    expect(screen.getByText('logo')).toHaveStyle({ width: '56px', height: '56px' });
    expect(screen.getByText('logo')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a smaller rectangular flag placeholder', () => {
    render(<EntryLogoPlaceholder label="bandeira" variant="flag" />);

    expect(screen.getByText('bandeira')).toHaveStyle({ width: '40px', height: '28px' });
    expect(screen.getByText('bandeira')).toHaveClass('rounded');
  });
});
