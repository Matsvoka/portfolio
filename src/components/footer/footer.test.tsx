import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';
import { profile } from '@/content/profile';

describe('Footer', () => {
  it('renders a CV download link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      profile.resumeUrl,
    );
  });

  it('renders contact links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Enviar email' })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`,
    );
    expect(screen.getByRole('link', { name: 'Abrir GitHub' })).toHaveAttribute('href', profile.github);
    expect(screen.getByRole('link', { name: 'Abrir LinkedIn' })).toHaveAttribute(
      'href',
      profile.linkedin,
    );
  });

  it('renders the current year in the copyright line', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });
});
