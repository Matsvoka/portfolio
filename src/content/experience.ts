import type { ExperienceEntry } from './types';

export const experience: ExperienceEntry[] = [
  {
    company: 'Empresa X',
    role: 'Engenheiro de Software',
    period: '2023 — Atual',
    description: '[placeholder] Atuação em produto X, liderando a feature Y.',
    current: true,
    projectSlugs: ['hcp-app'],
  },
  {
    company: 'Empresa Y',
    role: 'Desenvolvedor Full-stack',
    period: '2021 — 2023',
    description: '[placeholder] Desenvolvimento do sistema Z, do zero até produção.',
    current: false,
    projectSlugs: ['hcp-app'],
  },
  {
    company: 'Empresa Z',
    role: 'Desenvolvedor Front-end',
    period: '2019 — 2021',
    description: '[placeholder] Desenvolvimento de interfaces web e evolução do design system.',
    current: false,
    projectSlugs: [],
  },
  {
    company: 'Empresa W',
    role: 'Estagiário de Desenvolvimento',
    period: '2018 — 2019',
    description: '[placeholder] Apoio no desenvolvimento e manutenção de aplicações internas.',
    current: false,
    projectSlugs: [],
  },
];
