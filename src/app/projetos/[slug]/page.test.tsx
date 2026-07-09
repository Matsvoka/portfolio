import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

import ProjectPage, { generateStaticParams } from './page';

describe('generateStaticParams', () => {
  it('generates a param entry for every project detail', () => {
    expect(generateStaticParams()).toEqual([
      { slug: 'doctag' },
      { slug: 'graphit' },
      { slug: 'hcp-app' },
      { slug: 'valentines' },
      { slug: 'cablagem' },
      { slug: 'extrator' },
      { slug: 'itinerario' },
      { slug: 'abastecimento' },
      { slug: 'hcp-margens' },
    ]);
  });
});

describe('ProjectPage', () => {
  it('renders the header and content sections for a known slug', async () => {
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'doctag' }) });
    render(jsx);
    expect(screen.getByRole('heading', { level: 1, name: 'Doctag' })).toBeInTheDocument();
  });

  it('provides navigation back to the portfolio home', async () => {
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'doctag' }) });
    render(jsx);

    const link = screen.getByRole('link', { name: 'Voltar' });

    expect(link).toHaveAttribute('href', '/');
    expect(link).not.toHaveClass('bg-bg-dim', 'rounded-md');
  });

  it('renders content blocks in the order they are defined', async () => {
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'doctag' }) });
    const { container } = render(jsx);
    const video = container.querySelector('video');
    const paragraphs = Array.from(container.querySelectorAll('p')).map((p) => p.textContent);

    expect(video).toBeInTheDocument();
    expect(paragraphs[0]).toMatch(/^\[placeholder\] Doctag é um app desktop/);
  });

  it('calls notFound for an unknown slug', async () => {
    await expect(ProjectPage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
  });
});
