import type { SkillCategory } from './types';

export const skills: SkillCategory[] = [
  {
    category: 'Linguagens & Frameworks',
    items: [
      { name: 'TypeScript', icon: 'FileCode' },
      { name: 'React', icon: 'Atom' },
      { name: 'Node.js', icon: 'Server' },
    ],
  },
  {
    category: 'Infra & Dados',
    items: [
      { name: 'PostgreSQL', icon: 'Database' },
      { name: 'Docker', icon: 'Container' },
    ],
  },
];
