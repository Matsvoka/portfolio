import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { aboutParagraphs } from '@/content/about';
import { AboutSection } from './about-section';

describe('AboutSection', () => {
  it('renders the Sobre mim section with two paragraphs', () => {
    const { container } = render(<AboutSection />);

    expect(document.getElementById('sobre')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sobre mim' })).toBeInTheDocument();
    expect(container.querySelectorAll('p')).toHaveLength(2);
    for (const paragraph of aboutParagraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });
});
