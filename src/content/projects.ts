import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'doctag',
    title: 'Doctag',
    oneLiner: 'App desktop de tagging de documentos. [placeholder]',
    tags: ['Electron', 'React', 'PostgreSQL'],
    role: 'Criador e único desenvolvedor',
    previewVideo: '/videos/doctag-preview.mp4',
    narrative: [
      '[placeholder] Doctag é um app desktop para organizar documentos por tags, com um banco Postgres embutido — sem servidor externo.',
      '[placeholder] O maior desafio foi o drag-and-drop de tags continuar acessível por teclado, sem perder a fluidez do mouse.',
      '[placeholder] Construído com Electron + React, com foco em uma experiência rápida mesmo com milhares de documentos indexados.',
    ],
    demoIndex: 0,
    demo: { type: 'mock', component: 'doctag' },
    links: { github: 'https://github.com/placeholder/doctag' },
  },
  {
    slug: 'graphit',
    title: 'GraphIt',
    oneLiner: 'Ferramenta de grafos e visualização. [placeholder]',
    tags: ['React', 'Vite'],
    role: 'Criador e único desenvolvedor',
    previewVideo: '/videos/graphit-preview.mp4',
    narrative: [
      '[placeholder] GraphIt é uma ferramenta para desenhar e explorar grafos, migrando de HTML vanilla para React + Vite.',
      '[placeholder] A reescrita trouxe um modelo de estado mais previsível para desenhar nós e arestas interativamente.',
    ],
    demoIndex: 1,
    demo: { type: 'mock', component: 'graphit' },
    links: { github: 'https://github.com/placeholder/graphit' },
  },
  {
    slug: 'hcp-app',
    title: 'HCP App',
    oneLiner: 'Sistema de produção para gestão de processos. [placeholder]',
    tags: ['FastAPI', 'React'],
    role: 'Engenheiro de software',
    previewVideo: '/videos/hcp-app-placeholder.mp4',
    narrative: [
      '[placeholder] HCP App é um sistema interno de produção construído com FastAPI no backend e React no frontend.',
      '[placeholder] Sem mock interativo aqui — a demo é em vídeo, já que o sistema depende de dados internos da empresa.',
    ],
    demoIndex: 0,
    demo: { type: 'video', src: '/videos/hcp-app-placeholder.mp4' },
  },
];
