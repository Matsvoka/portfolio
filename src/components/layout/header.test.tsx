import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme/theme-provider';
import userEvent from '@testing-library/user-event';
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
    expect(screen.getByRole('link', { name: 'Formação' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projetos' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Skills' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Idiomas' })).not.toBeInTheDocument();
  });

  it('marks the first section as active by default', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('aria-current', 'true');
  });

  it('adds Skills and Idiomas to the mobile menu', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills');
    expect(screen.getByRole('link', { name: 'Idiomas' })).toHaveAttribute('href', '#idiomas');
  });

  it('renders the theme toggle', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /tema/i })).toBeInTheDocument();
  });

  it('renders the UI size selector in place of the language placeholder', () => {
    renderHeader();
    expect(screen.getByRole('combobox', { name: 'Tamanho da interface' })).toBeInTheDocument();
    expect(screen.queryByText(/PT-BR/i)).not.toBeInTheDocument();
  });
});
