import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Header } from './header';

function renderHeader() {
  return render(
    <ThemeProvider>
      <Header />
    </ThemeProvider>,
  );
}

describe('Header', () => {
  it('renders all nav items', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: 'Sobre' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Experiência' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projetos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Formação' })).toBeInTheDocument();
  });

  it('marks the first section as active by default', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('aria-current', 'true');
  });

  it('renders the theme toggle', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /tema/i })).toBeInTheDocument();
  });

  it('renders a non-functional language placeholder', () => {
    renderHeader();
    expect(screen.getByLabelText(/seletor de idioma ainda não implementado/i)).toBeInTheDocument();
  });
});
