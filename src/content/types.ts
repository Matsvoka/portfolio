export type ProjectDemo =
  | { type: 'mock'; component: string }
  | { type: 'video'; src: string }
  | { type: 'gif'; src: string }
  | { type: 'none' };

export type ProjectLinks = {
  github?: string;
  live?: string;
};

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  tags: string[];
  role: string;
  narrative: string[];
  /** How many narrative paragraphs render before the demo slot. 0 = demo right after the header. */
  demoIndex: number;
  demo: ProjectDemo;
  links?: ProjectLinks;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  description: string;
  logo?: string;
  /** Marks the entry whose title/dot render in lime — the current job. */
  current?: boolean;
  projectSlugs?: string[];
};

export type SkillItem = {
  name: string;
  /** Key into the icon registry built in Task 19 (a lucide-react icon name). */
  icon: string;
};

export type SkillCategory = {
  category: string;
  items: SkillItem[];
};

export type EducationEntry = {
  degree: string;
  institution: string;
  period: string;
};

export type Profile = {
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
};
