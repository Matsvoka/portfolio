import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { languages } from '@/content/languages';
import { LanguagesSection } from './languages-section';

describe('LanguagesSection', () => {
  it('renders every language and proficiency', () => {
    render(<LanguagesSection />);

    expect(document.getElementById('idiomas')).toHaveClass('scroll-mt-16', 'px-4', 'py-12');
    const card = screen.getByTestId('languages-card');

    expect(card).toContainElement(screen.getByRole('heading', { name: 'Idiomas' }));
    expect(card).toHaveClass(
      'rounded-lg',
      'border',
      'border-white/45',
      'bg-zinc-200/45',
      'shadow-xl',
      'backdrop-blur-2xl',
      'backdrop-saturate-150',
      'p-4',
    );
    for (const language of languages) {
      expect(screen.getByText(language.name)).toBeInTheDocument();
      expect(screen.getByText(`(${language.proficiency})`)).toBeInTheDocument();
      expect(screen.getByTestId(`language-flag-${language.countryCode}`)).toHaveClass(
        'h-7',
        'w-10',
        'rounded',
      );
    }
  });
});
