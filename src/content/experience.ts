import type { ExperienceEntry } from './types';

export const experience: ExperienceEntry[] = [
  {
    company: 'HCP Eletrônicos, Comércio e Indústria',
    role: 'Técnico de Desenvolvimento II',
    period: '2026 — Atual',
    description: 'Desenvolvedor full-stack de soluções para processos internos e apoio à engenharia.',
    current: true,
    projectSlugs: ['cablagem', 'extrator', 'hcp-app', 'hcp-margens'],
  },
  {
    company: 'Dominioz Serviços de Telecomunicações LTDA',
    role: 'Operador de NOC',
    period: '2022 — 2025',
    description: 'Monitoramento de rede de internet, organização de itinerário e gestão de equipes técnicas. Elaboração de soluções personalizadas utilizando Google Apps Script.',
    current: false,
    projectSlugs: ['itinerario', 'abastecimento'],
  },
  {
    company: 'Freelance',
    role: 'Analista de Mídias Sociais',
    period: '2022 — 2022',
    description: 'Criação de conteúdo visual utilizando Adobe Illustrator, Photoshop e Premiere',
    current: false,
    projectSlugs: [],
  },
  {
    company: 'Dominioz Serviços de Telecomunicações LTDA',
    role: 'Operador de Helpdesk',
    period: '2018 — 2021',
    description: 'Atendimento ao cliente, suporte técnico, solução de problemas de internet e gerenciamento de chamados.',
    current: false,
    projectSlugs: [],
  },
];
