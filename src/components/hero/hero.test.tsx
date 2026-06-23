import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './hero';
import { profile } from '@/content/profile';

describe('Hero', () => {
  it('renders the name and role', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument();
    expect(screen.getByText(profile.role)).toBeInTheDocument();
  });

  it('renders contact links with accessible labels', () => {
    render(<Hero />);
    const emailLink = screen.getByRole('link', { name: 'Enviar email' });
    const githubLink = screen.getByRole('link', { name: 'Abrir GitHub' });
    const linkedinLink = screen.getByRole('link', { name: 'Abrir LinkedIn' });

    expect(emailLink).toHaveAttribute('href', `mailto:${profile.email}`);
    expect(githubLink).toHaveAttribute('href', profile.github);
    expect(linkedinLink).toHaveAttribute(
      'href',
      profile.linkedin,
    );
    expect(emailLink).toHaveClass('transition-[color,transform]', 'active:scale-90');
    expect(githubLink).toHaveClass('transition-[color,transform]', 'active:scale-90');
    expect(linkedinLink).toHaveClass('transition-[color,transform]', 'active:scale-90');
  });
});
