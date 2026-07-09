import type { ProjectDetail } from '../types';

export const graphit: ProjectDetail = {
  slug: 'graphit',
  title: 'GraphIt',
  tags: ['React', 'Vite'],
  sections: [
    {
      type: 'paragraph',
      text: '[placeholder] GraphIt é uma ferramenta para desenhar e explorar grafos, migrando de HTML vanilla para React + Vite.',
    },
    { type: 'demo', demo: { type: 'video', src: '/videos/graphit-preview.mp4' } },
    {
      type: 'paragraph',
      text: '[placeholder] A reescrita trouxe um modelo de estado mais previsível para desenhar nós e arestas interativamente.',
    },
  ],
};
