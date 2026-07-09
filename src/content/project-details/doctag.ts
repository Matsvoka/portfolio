import type { ProjectDetail } from '../types';

export const doctag: ProjectDetail = {
  slug: 'doctag',
  title: 'Doctag',
  tags: ['Electron', 'React', 'PostgreSQL'],
  links: { github: 'https://github.com/placeholder/doctag' },
  sections: [
    { type: 'demo', demo: { type: 'video', src: '/videos/doctag-preview.mp4' } },
    {
      type: 'paragraph',
      text: '[placeholder] Doctag é um app desktop para organizar documentos por tags, com um banco Postgres embutido — sem servidor externo.',
    },
    {
      type: 'paragraph',
      text: '[placeholder] O maior desafio foi o drag-and-drop de tags continuar acessível por teclado, sem perder a fluidez do mouse.',
    },
    {
      type: 'paragraph',
      text: '[placeholder] Construído com Electron + React, com foco em uma experiência rápida mesmo com milhares de documentos indexados.',
    },
  ],
};
