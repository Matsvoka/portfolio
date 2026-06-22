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
  {
    category: 'Qualidade & Testes',
    items: [
      { name: 'Vitest', icon: 'FlaskConical' },
      { name: 'Testing Library', icon: 'TestTube2' },
      { name: 'Playwright', icon: 'ScanSearch' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      { name: 'AWS', icon: 'Cloud' },
      { name: 'GitHub Actions', icon: 'Workflow' },
      { name: 'Linux', icon: 'Terminal' },
    ],
  },
];
