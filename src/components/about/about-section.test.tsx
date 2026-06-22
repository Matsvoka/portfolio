import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { aboutParagraphs } from '@/content/about';
import { AboutSection } from './about-section';

describe('AboutSection', () => {
  it('renders the Sobre mim section with two paragraphs', () => {
    const { container } = render(<AboutSection />);

    expect(document.getElementById('sobre')).toBeInTheDocument();
    expect(document.getElementById('sobre')).toHaveClass('w-full', 'bg-bg');
    expect(document.getElementById('sobre')).not.toHaveClass('sm:rounded-xl');
    expect(document.getElementById('sobre')?.firstElementChild).toHaveClass(
      'mx-auto',
      'max-w-6xl',
    );
    expect(screen.getByRole('heading', { name: 'Sobre mim' })).toBeInTheDocument();
    expect(container.querySelectorAll('p')).toHaveLength(2);
    for (const paragraph of aboutParagraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });
});
