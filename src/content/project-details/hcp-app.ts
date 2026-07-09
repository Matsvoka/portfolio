import type { ProjectDetail } from '../types';

export const hcpApp: ProjectDetail = {
  slug: 'hcp-app',
  title: 'HCP App',
  tags: ['FastAPI', 'React'],
  sections: [
    { type: 'demo', demo: { type: 'video', src: '/videos/hcp-app-placeholder.mp4' } },
    {
      type: 'paragraph',
      text: '[placeholder] HCP App é um sistema interno de produção construído com FastAPI no backend e React no frontend.',
    },
    {
      type: 'paragraph',
      text: '[placeholder] Sem mock interativo aqui — a demo é em vídeo, já que o sistema depende de dados internos da empresa.',
    },
  ],
};
