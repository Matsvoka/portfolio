import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';
import { profile } from '@/content/profile';

describe('Footer', () => {
  it('renders a CV download link', () => {
    render(<Footer />);
    const downloadLink = screen.getByRole('link', { name: /download cv/i });

    expect(downloadLink).toHaveAttribute('href', profile.resumeUrl);
    expect(downloadLink).toHaveClass('transition-transform', 'active:scale-95');
  });

  it('renders contact links', () => {
    render(<Footer />);
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

  it('renders the current year in the copyright line', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });
});
