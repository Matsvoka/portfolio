import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileNav } from './mobile-nav';

const items = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'experiencia', label: 'Experiência' },
];

describe('MobileNav', () => {
  it('hides the panel by default', () => {
    render(<MobileNav items={items} activeId="sobre" />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('opens the panel on click and shows nav items', async () => {
    const user = userEvent.setup();
    render(<MobileNav items={items} activeId="sobre" />);
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(screen.getByRole('link', { name: 'Sobre' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Experiência' })).toBeInTheDocument();
  });

  it('closes the panel after clicking a nav link', async () => {
    const user = userEvent.setup();
    render(<MobileNav items={items} activeId="sobre" />);
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    await user.click(screen.getByRole('link', { name: 'Sobre' }));
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
