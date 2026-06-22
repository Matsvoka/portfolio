import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme/theme-provider';
import Page from './page';

function renderPage() {
  return render(
    <ThemeProvider>
      <Page />
    </ThemeProvider>,
  );
}

describe('Home page', () => {
  it('renders every section landmark inside main', () => {
    renderPage();
    expect(screen.getByRole('main')).toHaveClass('bg-bg-dim');
    expect(screen.getByRole('main').firstElementChild).toHaveClass(
      'mx-auto',
      'w-full',
      'max-w-6xl',
    );
    expect(document.getElementById('sobre')).toBeInTheDocument();
    expect(document.getElementById('experiencia')).toBeInTheDocument();
    expect(document.getElementById('projetos')).toBeInTheDocument();
    expect(document.getElementById('skills')).toBeInTheDocument();
    expect(document.getElementById('formacao')).toBeInTheDocument();
    expect(document.getElementById('idiomas')).toBeInTheDocument();
  });

  it('renders the header and footer outside the main landmark', () => {
    renderPage();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toHaveClass('bg-bg');
    expect(screen.getByRole('contentinfo')).toHaveClass('bg-bg');
  });
});
