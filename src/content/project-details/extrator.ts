import type { ProjectDetail } from '../types';

export const extrator: ProjectDetail = {
  slug: 'extrator',
  title: 'Extrator',
  tags: ['Flask', 'React', 'Gemini API'],
  sections: [
    { type: 'demo', demo: { type: 'video', src: '/videos/extrator-placeholder.mp4' } },
    {
      type: 'paragraph',
      text: '[placeholder] "Extrator" é um app desktop (Flask + React) que extrai dados de chicotes elétricos a partir de PDFs usando a API do Gemini, com histórico de cotações em um banco local.',
    },
    {
      type: 'paragraph',
      text: '[placeholder] Sem mock interativo aqui — a demo é em vídeo, já que o app depende de PDFs e dados internos da HCP.',
    },
  ],
};
