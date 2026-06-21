import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

import ProjectPage, { generateStaticParams } from './page';

describe('generateStaticParams', () => {
  it('generates a param entry for every project', () => {
    expect(generateStaticParams()).toEqual([
      { slug: 'doctag' },
      { slug: 'graphit' },
      { slug: 'hcp-app' },
    ]);
  });
});

describe('ProjectPage', () => {
  it('renders the header and narrative for a known slug', async () => {
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'doctag' }) });
    render(jsx);
    expect(screen.getByRole('heading', { level: 1, name: 'Doctag' })).toBeInTheDocument();
  });

  it('renders narrative paragraphs before the demo when demoIndex is 0', async () => {
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'doctag' }) });
    const { container } = render(jsx);
    const paragraphs = Array.from(container.querySelectorAll('p')).map((p) => p.textContent);
    expect(paragraphs[0]).toMatch(/^\[placeholder\] Doctag é um app desktop/);
  });

  it('calls notFound for an unknown slug', async () => {
    await expect(ProjectPage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
  });
});
