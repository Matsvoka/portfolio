import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { languages } from '@/content/languages';
import { LanguagesSection } from './languages-section';

describe('LanguagesSection', () => {
  it('renders every language and proficiency', () => {
    render(<LanguagesSection />);

    expect(document.getElementById('idiomas')).toHaveClass('scroll-mt-16', 'px-4', 'py-12');
    expect(screen.getByRole('heading', { name: 'Idiomas' })).toBeInTheDocument();
    for (const language of languages) {
      expect(screen.getByText(language.name)).toBeInTheDocument();
      expect(screen.getByText(language.proficiency)).toBeInTheDocument();
    }
  });
});
