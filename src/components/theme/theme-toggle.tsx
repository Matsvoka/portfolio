'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      aria-pressed={isDark}
      className="cursor-pointer rounded p-1.5 text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-75 dark:hover:text-lime-bright"
    >
      {isDark ? (
        <Moon className="ui-icon-control" aria-hidden="true" />
      ) : (
        <Sun className="ui-icon-control" aria-hidden="true" />
      )}
    </button>
  );
}
