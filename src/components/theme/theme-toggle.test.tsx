import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('ThemeToggle', () => {
  it('defaults to dark theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button')).toHaveClass('cursor-pointer', 'active:scale-75');
  });

  it('toggles to light theme on click and persists it', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    expect(window.localStorage.getItem('theme')).toBe('light');
  });

  it('reads a previously stored theme on mount', async () => {
    window.localStorage.setItem('theme', 'light');
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(await screen.findByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders dark by default before correcting to a stored light theme after mount', async () => {
    window.localStorage.setItem('theme', 'light');
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    // The initial render must be deterministic ('dark') regardless of localStorage,
    // matching what the server would have rendered, to avoid a hydration mismatch.
    // The mount-time effect then corrects it to the real stored value.
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Mudar para tema escuro');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
