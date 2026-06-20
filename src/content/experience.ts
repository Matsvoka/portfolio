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
    projectSlugs: [],
  },
];
