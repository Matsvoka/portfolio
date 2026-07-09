import type { ProjectDetail } from '../types';

export const valentines: ProjectDetail = {
  slug: 'valentines',
  title: 'Valentines',
  tags: ['Vercel', 'React'],
  sections: [
    { type: 'demo', demo: { type: 'video', src: '/videos/valentines-preview.mp4' } },
    {
      type: 'paragraph',
      text: '[placeholder] Valentines é um modelo de site para o Dia dos Namorados com foco na interação do usuário.',
    },
    {
      type: 'paragraph',
      text: '[placeholder] As seções apresentam elementos interativos e a UI/UX foi planejada para ser chamativa e divertida.',
    },
  ],
};
