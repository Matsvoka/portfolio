import type { ProjectDetail } from '../types';

export const itinerario: ProjectDetail = {
  slug: 'itinerario',
  title: 'Itinerário',
  tags: ['Google Apps Script', 'Google Sheets'],
  sections: [
    { type: 'demo', demo: { type: 'video', src: '/videos/itinerario-placeholder.mp4' } },
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
