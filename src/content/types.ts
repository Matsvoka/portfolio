export type ProjectDemo =
  | { type: 'video'; src: string }
  | { type: 'gif'; src: string }
  | { type: 'none' };

export type ProjectLinks = {
  github?: string;
  live?: string;
};

/** Lightweight index entry — feeds only the home page project list/preview cards. */
export type ProjectSummary = {
  slug: string;
  title: string;
  oneLiner: string;
  tags: string[];
  /** Silent looping video used exclusively by preview cards on the home page. */
  previewVideo: string;
};

/** One piece of a project's case-study page, rendered in array order. */
export type ProjectContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'demo'; demo: ProjectDemo };

/** Full case-study content for a project's own /projetos/[slug] page. */
export type ProjectDetail = {
  slug: string;
  title: string;
  tags: string[];
  links?: ProjectLinks;
  sections: ProjectContentBlock[];
};

/** A single logo, or a light/dark pair swapped via the `dark:` variant. */
export type EntryLogoSource = string | { light: string; dark: string };

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  description: string;
  logo?: EntryLogoSource;
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
  logo?: EntryLogoSource;
};

export type Profile = {
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
};
