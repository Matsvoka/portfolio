import type { ProjectDetail } from '../types';

export const hcpMargens: ProjectDetail = {
  slug: 'hcp-margens',
  title: 'HCP Margens',
  tags: ['Python', 'React', 'Docker'],
  sections: [
    { type: 'demo', demo: { type: 'video', src: '/videos/hcp-margens-placeholder.mp4' } },
    {
      type: 'paragraph',
      text: '[placeholder] O Monitor de Margens é um sistema para registrar componentes, PCMs e vendas por cliente, tal como variações no custo e valor de venda. Então é possível monitorar como essas variações afetam os limites comerciais definidos no sistema.',
    },
    {
      type: 'paragraph',
      text: '[placeholder] Sem mock interativo aqui — a demo é em vídeo, já que o script depende de planilhas e templates internos da HCP.',
    },
  ],
};
