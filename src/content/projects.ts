import type { ProjectSummary } from './types';

export const projects: ProjectSummary[] = [
  {
    slug: 'doctag',
    title: 'Doctag',
    oneLiner: 'App desktop de tagging de documentos.',
    tags: ['Electron', 'React', 'PostgreSQL'],
    previewVideo: '/videos/doctag-preview.mp4',
  },
  {
    slug: 'graphit',
    title: 'GraphIt',
    oneLiner: 'Ferramenta para representação visual de grafos.',
    tags: ['React', 'Vite'],
    previewVideo: '/videos/graphit-preview.mp4',
  },
  {
    slug: 'hcp-app',
    title: 'HCP App',
    oneLiner: 'Sistema de produção para gestão de processos.',
    tags: ['FastAPI', 'React'],
    previewVideo: '/videos/hcp-app-placeholder.mp4',
  },
  {
    slug: 'valentines',
    title: 'Valentines',
    oneLiner: 'Site personalizado para o Dia dos Namorados. [placeholder]',
    tags: ['Vercel', 'React'],
    previewVideo: '/videos/valentines-preview.mp4',
  },
  {
    slug: 'cablagem',
    title: 'Cablagem',
    oneLiner: 'Automação para contagem de materiais e orçamento de chicotes.',
    tags: ['Google Apps Script', 'Google Sheets'],
    previewVideo: '/videos/cablagem-placeholder.mp4',
  },
  {
    slug: 'extrator',
    title: 'Extrator',
    oneLiner: 'Extrator de dados de chicotes elétricos a partir de PDFs com IA.',
    tags: ['Flask', 'React', 'Gemini API'],
    previewVideo: '/videos/extrator-placeholder.mp4',
  },
  {
    slug: 'itinerario',
    title: 'Itinerário',
    oneLiner: 'Planilha automatizada para organização de itinerário de equipes técnicas.',
    tags: ['Google Apps Script', 'Google Sheets'],
    previewVideo: '/videos/itinerario-placeholder.mp4',
  },
  {
    slug: 'abastecimento',
    title: 'Abastecimento',
    oneLiner: 'Automação para controle de combustível da frota da empresa.',
    tags: ['Google Apps Script', 'Google Sheets'],
    previewVideo: '/videos/itinerario-placeholder.mp4',
  },
  {
    slug: 'hcp-margens',
    title: 'HCP Margens',
    oneLiner: 'Sistema de monitoramento de margens de venda.',
    tags: ['Python', 'React', 'Docker'],
    previewVideo: '/videos/hcp-margens-placeholder.mp4',
  },
];
