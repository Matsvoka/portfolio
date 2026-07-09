import type { ProjectDetail } from '../types';

export const cablagem: ProjectDetail = {
  slug: 'cablagem',
  title: 'Cablagem',
  tags: ['Google Apps Script', 'Google Sheets'],
  sections: [
    { type: 'demo', demo: { type: 'video', src: '/videos/cablagem-placeholder.mp4' } },
    {
      type: 'paragraph',
      text: '[placeholder] Cablagem é um script de Google Apps Script acoplado a uma planilha, que consolida quantitativos de materiais, conectores, luvas, etiquetas e abraçadeiras a partir do comprimento dos cabos.',
    },
    {
      type: 'paragraph',
      text: '[placeholder] Sem mock interativo aqui — a demo é em vídeo, já que o script depende de planilhas e templates internos da HCP.',
    },
  ],
};
