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

  it('renders inside a #sobre section landmark', () => {
    render(<Hero />);
    expect(document.getElementById('sobre')).toBeInTheDocument();
  });
});
