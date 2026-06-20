# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the portfolio from scratch per `docs/superpowers/specs/2026-06-20-portfolio-rebuild-design.md` — a single-scroll Next.js site (Header → Hero → Experiência → [Projetos | Skills+Formação] → Footer) plus per-project case study pages with lazy-loaded interactive mock widgets.

**Architecture:** Next.js 15 App Router + TypeScript, typed placeholder content in `src/content/`, a shared `ProjectPreviewCard` component (inline on the home Projects list, popover from Experience chips), Tailwind CSS v4 with semantic CSS-variable tokens for light/dark theming, `next/dynamic` for mock-widget code-splitting.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Vitest + React Testing Library, `next/font` (Geist Sans + JetBrains Mono), lucide-react.

## Global Constraints

- Content language: PT-BR only, no i18n library (next-intl) — the language selector in the header is a non-functional visual placeholder.
- Color tokens (from `DESIGN.md`, do not invent new ones): `paper #f3f6f1`, `paper-dim #e5e9e1`, `ink #12150f`, `ink-muted #4b4f47`, `coal #0c0e09`, `coal-dim #161a13`, `bone #edf0ea`, `bone-muted #a2a69e`, `lime #92d00b`, `lime-bright #a7d960`, `lime-soft #bfe58e`, `lime-deep #375900`.
- Never use raw `lime` (`#92d00b`) as text color on a light surface — use `lime-deep` (`#375900`), the only AA-safe lime step on `paper`.
- Default theme is dark; toggle persists to `localStorage` key `theme`.
- Fonts: Geist Sans (display/body, weights 100–900) + JetBrains Mono (metadata: dates, tags, labels), both via `next/font/google`.
- Every interactive element must be keyboard-operable and respect `prefers-reduced-motion` (WCAG AA, per `PRODUCT.md`).
- No real app code embedded for project demos — mocks are small from-scratch React components with fictional data.
- All content (experience, projects, skills, education) is placeholder data clearly marked as such — no real CV content yet.

---

## Task 1: Project scaffolding (Next.js + TypeScript + Tailwind v4)

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Create: `.gitignore` additions (modify existing `.gitignore`)

**Interfaces:**
- Produces: a runnable `npm run dev` Next.js App Router project, `npm test` running Vitest, `globals.css` importing Tailwind v4 with no custom tokens yet (added in Task 2).

- [ ] **Step 1: Scaffold the Next.js project**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-eslint --import-alias "@/*" --use-npm
```
When prompted about the non-empty directory (it contains `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, `docs/`, `.gitignore`), confirm proceeding — those files are unrelated to the generated app files and won't be overwritten.

- [ ] **Step 2: Verify Tailwind v4 is wired up**

Open `src/app/globals.css` and confirm it starts with:
```css
@import "tailwindcss";
```
If the generator produced a `tailwind.config.ts` with a v3-style `content` array, delete it — Tailwind v4 does not need it for this project (no custom plugins).

- [ ] **Step 3: Install test tooling**

Run:
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 4: Create the Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Create `vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Add the test script**

Modify `package.json` scripts block to add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Write a smoke test to verify the toolchain works**

Create `src/app/page.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Home page', () => {
  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
```

This will fail until `page.tsx` renders a `<main>` — adjust the generated `src/app/page.tsx` to wrap its content in `<main>...</main>` if it doesn't already.

- [ ] **Step 7: Run the test**

Run: `npm test`
Expected: PASS (1 test).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js 15 + TypeScript + Tailwind v4 + Vitest"
```

---

## Task 2: Design tokens and dark/light theme CSS

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: Tailwind utility classes `bg-bg`, `bg-bg-dim`, `text-fg`, `text-fg-muted`, `bg-lime`, `text-lime-deep`, `bg-lime-soft`, `bg-lime-bright`, `border-bg-dim`, etc. (generated from `@theme` color tokens), plus a `.dark` class selector that remaps the semantic `bg`/`fg` tokens for dark mode. `--font-sans` / `--font-mono` theme vars wired to `font-sans` / `font-mono` utilities (fonts themselves come in Task 3).

- [ ] **Step 1: Write the token layer**

Replace the contents of `src/app/globals.css` with:
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-paper: #f3f6f1;
  --color-paper-dim: #e5e9e1;
  --color-ink: #12150f;
  --color-ink-muted: #4b4f47;
  --color-coal: #0c0e09;
  --color-coal-dim: #161a13;
  --color-bone: #edf0ea;
  --color-bone-muted: #a2a69e;
  --color-lime: #92d00b;
  --color-lime-bright: #a7d960;
  --color-lime-soft: #bfe58e;
  --color-lime-deep: #375900;

  /* semantic tokens — values flipped by .dark below */
  --color-bg: var(--color-paper);
  --color-bg-dim: var(--color-paper-dim);
  --color-fg: var(--color-ink);
  --color-fg-muted: var(--color-ink-muted);
}

.dark {
  --color-bg: var(--color-coal);
  --color-bg-dim: var(--color-coal-dim);
  --color-fg: var(--color-bone);
  --color-fg-muted: var(--color-bone-muted);
}

body {
  background-color: var(--color-bg);
  color: var(--color-fg);
}
```

- [ ] **Step 2: Write a test that the tokens compile**

Tailwind tokens aren't unit-testable directly, so verify via build instead. Run: `npm run build`
Expected: build succeeds with no CSS errors (confirms `@theme`/`@custom-variant` syntax is valid for the installed Tailwind v4 version).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "Add DESIGN.md color tokens and dark/light semantic CSS variables"
```

---

## Task 3: Fonts (Geist Sans + JetBrains Mono)

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `font-sans` utility = Geist Sans, `font-mono` utility = JetBrains Mono, applied to `<html>` so all text defaults to Geist Sans unless `font-mono` is used.

- [ ] **Step 1: Wire the fonts in the root layout**

Modify `src/app/layout.tsx` to load both fonts and apply their CSS variables to `<html>`:
```tsx
import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Vinicius Matsuoka — Portfolio',
  description: 'Portfolio de Vinicius Matsuoka — engenharia de software, projetos e experiência.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

Note: `className="... dark"` hardcodes dark-by-default for now; Task 7 (theme toggle) replaces this static class with a script-driven one that also respects a saved preference.

- [ ] **Step 2: Map the font variables into Tailwind's theme**

Add to the `@theme` block in `src/app/globals.css`:
```css
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-jetbrains-mono);
```

- [ ] **Step 3: Verify with a build**

Run: `npm run build`
Expected: build succeeds, no missing-font-variable errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "Add Geist Sans and JetBrains Mono via next/font"
```

---

## Task 4: Content model types

**Files:**
- Create: `src/content/types.ts`

**Interfaces:**
- Produces: `Project`, `ExperienceEntry`, `SkillCategory`, `SkillItem`, `EducationEntry`, `ProjectDemo` types, imported by every content/data/component task below.

- [ ] **Step 1: Write the types**

Create `src/content/types.ts`:
```ts
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors (this file has no logic to test, just types — covered indirectly by every later test that imports it).

- [ ] **Step 3: Commit**

```bash
git add src/content/types.ts
git commit -m "Add content model types"
```

---

## Task 5: Placeholder content data

**Files:**
- Create: `src/content/projects.ts`
- Create: `src/content/experience.ts`
- Create: `src/content/skills.ts`
- Create: `src/content/education.ts`

**Interfaces:**
- Consumes: types from Task 4 (`src/content/types.ts`).
- Produces: `projects: Project[]`, `experience: ExperienceEntry[]`, `skills: SkillCategory[]`, `education: EducationEntry[]` — the data every section component renders. Slugs `'doctag'`, `'graphit'`, `'hcp-app'` are referenced by name in later tasks (mock registry, derived-helper tests) — keep them exact.

- [ ] **Step 1: Write the projects data**

Create `src/content/projects.ts`:
```ts
import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'doctag',
    title: 'Doctag',
    oneLiner: 'App desktop de tagging de documentos. [placeholder]',
    tags: ['Electron', 'React', 'PostgreSQL'],
    role: 'Criador e único desenvolvedor',
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
    narrative: [
      '[placeholder] HCP App é um sistema interno de produção construído com FastAPI no backend e React no frontend.',
      '[placeholder] Sem mock interativo aqui — a demo é em vídeo, já que o sistema depende de dados internos da empresa.',
    ],
    demoIndex: 0,
    demo: { type: 'video', src: '/videos/hcp-app-placeholder.mp4' },
  },
];
```

- [ ] **Step 2: Write the experience data**

Create `src/content/experience.ts`:
```ts
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
```

- [ ] **Step 3: Write the skills data**

Create `src/content/skills.ts`:
```ts
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
```

- [ ] **Step 4: Write the education data**

Create `src/content/education.ts`:
```ts
import type { EducationEntry } from './types';

export const education: EducationEntry[] = [
  {
    degree: 'Bacharelado em Ciência da Computação',
    institution: 'Universidade X',
    period: '2016 — 2020',
  },
  {
    degree: 'Técnico em Informática',
    institution: 'Escola Y',
    period: '2013 — 2015',
  },
];
```

- [ ] **Step 5: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/content/projects.ts src/content/experience.ts src/content/skills.ts src/content/education.ts
git commit -m "Add placeholder content data"
```

---

## Task 6: Derived helper — personal vs experience-linked projects

**Files:**
- Create: `src/lib/projects.ts`
- Test: `src/lib/projects.test.ts`

**Interfaces:**
- Consumes: `projects` from `src/content/projects.ts`, `experience` from `src/content/experience.ts`.
- Produces: `isPersonalProject(slug: string): boolean`, `getPersonalProjects(): Project[]`, `getProjectBySlug(slug: string): Project | undefined` — used by the Projects section (Task 18) and the project detail page (Task 27).

- [ ] **Step 1: Write the failing tests**

Create `src/lib/projects.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { isPersonalProject, getPersonalProjects, getProjectBySlug } from './projects';

describe('isPersonalProject', () => {
  it('returns false for a project linked to an experience entry', () => {
    expect(isPersonalProject('hcp-app')).toBe(false);
  });

  it('returns true for a project not linked to any experience entry', () => {
    expect(isPersonalProject('doctag')).toBe(true);
  });
});

describe('getPersonalProjects', () => {
  it('excludes projects linked to experience entries', () => {
    const slugs = getPersonalProjects().map((p) => p.slug);
    expect(slugs).toContain('doctag');
    expect(slugs).toContain('graphit');
    expect(slugs).not.toContain('hcp-app');
  });
});

describe('getProjectBySlug', () => {
  it('finds a project by slug', () => {
    expect(getProjectBySlug('doctag')?.title).toBe('Doctag');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getProjectBySlug('nonexistent-slug')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/projects.test.ts`
Expected: FAIL with "Cannot find module './projects'" (the file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Create `src/lib/projects.ts`:
```ts
import { projects } from '@/content/projects';
import { experience } from '@/content/experience';
import type { Project } from '@/content/types';

function getLinkedProjectSlugs(): Set<string> {
  const slugs = new Set<string>();
  for (const entry of experience) {
    for (const slug of entry.projectSlugs ?? []) {
      slugs.add(slug);
    }
  }
  return slugs;
}

export function isPersonalProject(slug: string): boolean {
  return !getLinkedProjectSlugs().has(slug);
}

export function getPersonalProjects(): Project[] {
  return projects.filter((project) => isPersonalProject(project.slug));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/projects.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/projects.ts src/lib/projects.test.ts
git commit -m "Add personal-vs-linked project derivation helper"
```

---

## Task 7: Theme provider and toggle (dark default, persisted)

**Files:**
- Create: `src/components/theme/theme-provider.tsx`
- Create: `src/components/theme/theme-script.tsx`
- Create: `src/components/theme/theme-toggle.tsx`
- Test: `src/components/theme/theme-toggle.test.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `ThemeProvider` (wraps the app), `useTheme(): { theme: 'light' | 'dark'; toggleTheme: () => void }`, `<ThemeToggle />` (button, used by Header in Task 9), `<ThemeScript />` (inline script for `<head>`, prevents flash-of-wrong-theme).

- [ ] **Step 1: Install lucide-react**

Run: `npm install lucide-react`

- [ ] **Step 2: Write the failing tests**

Create `src/components/theme/theme-toggle.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('ThemeToggle', () => {
  it('defaults to dark theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggles to light theme on click and persists it', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    expect(window.localStorage.getItem('theme')).toBe('light');
  });

  it('reads a previously stored theme on mount', () => {
    window.localStorage.setItem('theme', 'light');
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run src/components/theme/theme-toggle.test.tsx`
Expected: FAIL with "Cannot find module './theme-provider'".

- [ ] **Step 4: Write the theme provider**

Create `src/components/theme/theme-provider.tsx`:
```tsx
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' ? stored : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

- [ ] **Step 5: Write the toggle button**

Create `src/components/theme/theme-toggle.tsx`:
```tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      aria-pressed={isDark}
      className="rounded p-1.5 text-fg-muted transition-colors hover:text-lime-deep dark:hover:text-lime-bright"
    >
      {isDark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
    </button>
  );
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run src/components/theme/theme-toggle.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 7: Write the anti-flash inline script**

Create `src/components/theme/theme-script.tsx`:
```tsx
const THEME_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (e) {}
})();
`;

export function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
```

- [ ] **Step 8: Wire the provider and script into the root layout**

Modify `src/app/layout.tsx` — remove the hardcoded `dark` class (the script now controls it before paint) and wrap `children` in `ThemeProvider`:
```tsx
import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeScript } from '@/components/theme/theme-script';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Vinicius Matsuoka — Portfolio',
  description: 'Portfolio de Vinicius Matsuoka — engenharia de software, projetos e experiência.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Run the full test suite and build**

Run: `npm test && npm run build`
Expected: all tests PASS, build succeeds.

- [ ] **Step 10: Commit**

```bash
git add src/components/theme src/app/layout.tsx package.json package-lock.json
git commit -m "Add theme provider, toggle, and anti-flash script (dark default)"
```

---

## Task 8: Active-section tracking hook + desktop Header

**Files:**
- Create: `src/components/layout/use-active-section.ts`
- Test: `src/components/layout/use-active-section.test.ts`
- Create: `src/components/layout/header.tsx`
- Test: `src/components/layout/header.test.tsx`
- Modify: `vitest.setup.ts`

**Interfaces:**
- Consumes: `ThemeToggle` from Task 7.
- Produces: `useActiveSection(sectionIds: string[]): string`; `<Header />` (renders nav with ids `sobre`/`experiencia`/`projetos`/`skills`/`formacao` — Tasks 10, 14, 17, 18, 19 must render `<section id="...">` matching these); `NAV_ITEMS` exported from `header.tsx` for reuse by Task 9's mobile nav.

- [ ] **Step 1: Add a default IntersectionObserver stub for jsdom**

jsdom has no `IntersectionObserver`. Modify `vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  class NoopIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error -- minimal test double, tests that care override this themselves
  window.IntersectionObserver = NoopIntersectionObserver;
}
```

- [ ] **Step 2: Write the failing hook test**

Create `src/components/layout/use-active-section.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from './use-active-section';

type Entry = { isIntersecting: boolean; target: Element };
type ObserverCallback = (entries: Entry[]) => void;

let observedCallback: ObserverCallback | null = null;

class MockIntersectionObserver {
  constructor(callback: ObserverCallback) {
    observedCallback = callback;
  }
  observe() {}
  disconnect() {}
}

beforeEach(() => {
  observedCallback = null;
  // @ts-expect-error -- test double for a browser API jsdom doesn't implement
  window.IntersectionObserver = MockIntersectionObserver;
  document.body.innerHTML = '<div id="sobre"></div><div id="experiencia"></div>';
});

describe('useActiveSection', () => {
  it('starts with the first section id', () => {
    const { result } = renderHook(() => useActiveSection(['sobre', 'experiencia']));
    expect(result.current).toBe('sobre');
  });

  it('updates to the section reported as intersecting', () => {
    const { result } = renderHook(() => useActiveSection(['sobre', 'experiencia']));
    const experienciaEl = document.getElementById('experiencia')!;

    act(() => {
      observedCallback?.([{ isIntersecting: true, target: experienciaEl }]);
    });

    expect(result.current).toBe('experiencia');
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/components/layout/use-active-section.test.ts`
Expected: FAIL with "Cannot find module './use-active-section'".

- [ ] **Step 4: Implement the hook**

Create `src/components/layout/use-active-section.ts`:
```ts
'use client';

import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/layout/use-active-section.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Write the failing Header test**

Create `src/components/layout/header.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Header } from './header';

function renderHeader() {
  return render(
    <ThemeProvider>
      <Header />
    </ThemeProvider>,
  );
}

describe('Header', () => {
  it('renders all nav items', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: 'Sobre' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Experiência' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projetos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Formação' })).toBeInTheDocument();
  });

  it('marks the first section as active by default', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('aria-current', 'true');
  });

  it('renders the theme toggle', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /tema/i })).toBeInTheDocument();
  });

  it('renders a non-functional language placeholder', () => {
    renderHeader();
    expect(screen.getByLabelText(/seletor de idioma ainda não implementado/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `npx vitest run src/components/layout/header.test.tsx`
Expected: FAIL with "Cannot find module './header'".

- [ ] **Step 8: Implement the Header (desktop nav only — mobile nav added in Task 9)**

Create `src/components/layout/header.tsx`:
```tsx
'use client';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useActiveSection } from './use-active-section';

export const NAV_ITEMS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'experiencia', label: 'Experiência' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'skills', label: 'Skills' },
  { id: 'formacao', label: 'Formação' },
];

export function Header() {
  const activeId = useActiveSection(NAV_ITEMS.map((item) => item.id));

  return (
    <header className="sticky top-0 z-40 border-b border-bg-dim bg-bg px-4 py-3">
      <div className="flex items-center justify-between">
        <a href="#sobre" className="font-bold tracking-tight text-fg">
          VM
        </a>
        <nav aria-label="Navegação principal" className="hidden gap-4 text-sm sm:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={
                activeId === item.id
                  ? 'border-b-2 border-lime pb-0.5 text-lime-deep dark:text-lime-bright'
                  : 'text-fg-muted hover:text-fg'
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span
            className="rounded border border-fg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted"
            aria-label="Idioma: Português (Brasil). Seletor de idioma ainda não implementado."
          >
            PT-BR ⌄
          </span>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `npx vitest run src/components/layout/header.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 10: Commit**

```bash
git add vitest.setup.ts src/components/layout/use-active-section.ts src/components/layout/use-active-section.test.ts src/components/layout/header.tsx src/components/layout/header.test.tsx
git commit -m "Add active-section tracking hook and desktop Header"
```

---

## Task 9: Mobile nav collapse

**Files:**
- Create: `src/components/layout/mobile-nav.tsx`
- Test: `src/components/layout/mobile-nav.test.tsx`
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/layout/header.test.tsx`

**Interfaces:**
- Consumes: `NAV_ITEMS` shape (`{ id: string; label: string }[]`) and `activeId: string` from Task 8.
- Produces: `<MobileNav items={...} activeId={...} />`, rendered inside `<Header />` for small viewports.

- [ ] **Step 1: Write the failing test**

Create `src/components/layout/mobile-nav.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileNav } from './mobile-nav';

const items = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'experiencia', label: 'Experiência' },
];

describe('MobileNav', () => {
  it('hides the panel by default', () => {
    render(<MobileNav items={items} activeId="sobre" />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('opens the panel on click and shows nav items', async () => {
    const user = userEvent.setup();
    render(<MobileNav items={items} activeId="sobre" />);
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(screen.getByRole('link', { name: 'Sobre' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Experiência' })).toBeInTheDocument();
  });

  it('closes the panel after clicking a nav link', async () => {
    const user = userEvent.setup();
    render(<MobileNav items={items} activeId="sobre" />);
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    await user.click(screen.getByRole('link', { name: 'Sobre' }));
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/layout/mobile-nav.test.tsx`
Expected: FAIL with "Cannot find module './mobile-nav'".

- [ ] **Step 3: Implement MobileNav**

Create `src/components/layout/mobile-nav.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

type NavItem = { id: string; label: string };

export function MobileNav({ items, activeId }: { items: NavItem[]; activeId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        className="p-1.5 text-fg"
      >
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>
      {open && (
        <nav
          id="mobile-nav-panel"
          aria-label="Navegação principal"
          className="absolute left-0 top-full flex w-full flex-col gap-1 border-b border-bg-dim bg-bg px-4 py-3 text-sm"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={activeId === item.id ? 'text-lime-deep dark:text-lime-bright' : 'text-fg-muted'}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/layout/mobile-nav.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Wire MobileNav into Header**

Modify `src/components/layout/header.tsx` — add the import and render it next to the language placeholder:
```tsx
import { MobileNav } from './mobile-nav';
```
And inside the `<div className="flex items-center gap-2">` block, after the language `<span>`, add:
```tsx
          <MobileNav items={NAV_ITEMS} activeId={activeId} />
```

- [ ] **Step 6: Re-run the Header test to confirm no regression**

Run: `npx vitest run src/components/layout/header.test.tsx`
Expected: PASS (4 tests) — `MobileNav`'s panel is closed by default so it adds no extra `link`/`navigation` roles to the query results.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/mobile-nav.tsx src/components/layout/mobile-nav.test.tsx src/components/layout/header.tsx
git commit -m "Add mobile nav collapse to Header"
```

---

## Task 10: Profile content + Hero section

**Files:**
- Modify: `src/content/types.ts`
- Create: `src/content/profile.ts`
- Create: `src/components/hero/hero.tsx`
- Test: `src/components/hero/hero.test.tsx`

**Interfaces:**
- Produces: `Profile` type and `profile: Profile` data (name, role, email, github, linkedin, resumeUrl) — also consumed by the Footer in Task 21. `<Hero />` renders `<section id="sobre">`, matching the `sobre` nav id from Task 8.

- [ ] **Step 1: Add the Profile type**

Append to `src/content/types.ts`:
```ts
export type Profile = {
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
};
```

- [ ] **Step 2: Add placeholder profile data**

Create `src/content/profile.ts`:
```ts
import type { Profile } from './types';

export const profile: Profile = {
  name: 'Vinicius Matsuoka',
  role: 'Software Engineer · Full-stack',
  email: 'vinicius@example.com',
  github: 'https://github.com/placeholder',
  linkedin: 'https://linkedin.com/in/placeholder',
  resumeUrl: '/cv-placeholder.pdf',
};
```

- [ ] **Step 3: Write the failing Hero test**

Create `src/components/hero/hero.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './hero';
import { profile } from '@/content/profile';

describe('Hero', () => {
  it('renders the name and role', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument();
    expect(screen.getByText(profile.role)).toBeInTheDocument();
  });

  it('renders contact links with accessible labels', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: 'Enviar email' })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`,
    );
    expect(screen.getByRole('link', { name: 'Abrir GitHub' })).toHaveAttribute('href', profile.github);
    expect(screen.getByRole('link', { name: 'Abrir LinkedIn' })).toHaveAttribute(
      'href',
      profile.linkedin,
    );
  });

  it('renders inside a #sobre section landmark', () => {
    render(<Hero />);
    expect(document.getElementById('sobre')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npx vitest run src/components/hero/hero.test.tsx`
Expected: FAIL with "Cannot find module './hero'".

- [ ] **Step 5: Implement the Hero component**

Create `src/components/hero/hero.tsx`:
```tsx
import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/content/profile';

export function Hero() {
  return (
    <section id="sobre" className="flex flex-col items-center px-4 py-16 text-center">
      <div
        className="flex h-[200px] w-[200px] items-center justify-center rounded-full border-4 border-lime bg-bg-dim font-mono text-xs text-fg-muted"
        aria-hidden="true"
      >
        foto
      </div>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-fg">{profile.name}</h1>
      <p className="mt-1.5 font-mono text-sm uppercase tracking-wide text-lime-deep dark:text-lime-bright">
        {profile.role}
      </p>
      <div className="mt-2 flex items-center gap-3.5 text-fg-muted">
        <a
          href={`mailto:${profile.email}`}
          aria-label="Enviar email"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <Mail size={18} aria-hidden="true" />
        </a>
        <a
          href={profile.github}
          aria-label="Abrir GitHub"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <Github size={18} aria-hidden="true" />
        </a>
        <a
          href={profile.linkedin}
          aria-label="Abrir LinkedIn"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <Linkedin size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/components/hero/hero.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add src/content/types.ts src/content/profile.ts src/components/hero
git commit -m "Add profile content and Hero section"
```

---

## Task 11: `ProjectPreviewCard` (shared content component)

**Files:**
- Create: `src/components/project-preview/tag-overflow.ts`
- Test: `src/components/project-preview/tag-overflow.test.ts`
- Create: `src/components/project-preview/project-preview-card.tsx`
- Test: `src/components/project-preview/project-preview-card.test.tsx`

**Interfaces:**
- Consumes: `Project` type from Task 4.
- Produces: `getVisibleTags(tags: string[], max: number): { visible: string[]; overflowCount: number }`; `<ProjectPreviewCard project={project} />` — the whole-card-clickable component reused as-is for the inline Projects-section context (Task 17) and wrapped by the popover shell (Task 12) for the Experience-chip context.

This component renders only the shared inner content (title+arrow, preview, description, tech). It does **not** take a `variant` prop — "inline" means using it directly; "popover" means Task 12 wraps it in a positioned tooltip shell. Both contexts render identical card markup, satisfying the spec's "same component" requirement without leaking popover-positioning concerns into the card itself. The card itself is `w-full` (fills its container) — Task 13's popover wrapper constrains it to a fixed tooltip width; Task 17's inline usage lets it fill the wide main column.

- [ ] **Step 1: Write the failing tag-overflow test**

Create `src/components/project-preview/tag-overflow.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { getVisibleTags } from './tag-overflow';

describe('getVisibleTags', () => {
  it('returns all tags with no overflow when under the max', () => {
    expect(getVisibleTags(['Electron', 'React'], 2)).toEqual({
      visible: ['Electron', 'React'],
      overflowCount: 0,
    });
  });

  it('truncates and reports the overflow count when over the max', () => {
    expect(getVisibleTags(['Electron', 'React', 'PostgreSQL', 'Docker'], 2)).toEqual({
      visible: ['Electron', 'React'],
      overflowCount: 2,
    });
  });

  it('handles an empty tag list', () => {
    expect(getVisibleTags([], 2)).toEqual({ visible: [], overflowCount: 0 });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/project-preview/tag-overflow.test.ts`
Expected: FAIL with "Cannot find module './tag-overflow'".

- [ ] **Step 3: Implement the helper**

Create `src/components/project-preview/tag-overflow.ts`:
```ts
export function getVisibleTags(
  tags: string[],
  max: number,
): { visible: string[]; overflowCount: number } {
  if (tags.length <= max) {
    return { visible: tags, overflowCount: 0 };
  }
  return { visible: tags.slice(0, max), overflowCount: tags.length - max };
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/components/project-preview/tag-overflow.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the failing card test**

Create `src/components/project-preview/project-preview-card.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectPreviewCard } from './project-preview-card';
import type { Project } from '@/content/types';

const project: Project = {
  slug: 'doctag',
  title: 'Doctag',
  oneLiner: 'App desktop de tagging de documentos.',
  tags: ['Electron', 'React', 'PostgreSQL', 'Docker'],
  role: 'Criador',
  narrative: ['Parágrafo 1.'],
  demoIndex: 0,
  demo: { type: 'mock', component: 'doctag' },
};

describe('ProjectPreviewCard', () => {
  it('renders the title and one-liner', () => {
    render(<ProjectPreviewCard project={project} />);
    expect(screen.getByText('Doctag')).toBeInTheDocument();
    expect(screen.getByText(project.oneLiner)).toBeInTheDocument();
  });

  it('links to the project detail page as a single whole-card link', () => {
    render(<ProjectPreviewCard project={project} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/projetos/doctag');
  });

  it('shows only the first two tags plus an overflow count', () => {
    render(<ProjectPreviewCard project={project} />);
    expect(screen.getByText('Electron')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('PostgreSQL')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows a preview placeholder describing the demo type', () => {
    render(<ProjectPreviewCard project={project} />);
    expect(screen.getByText('preview (demo interativo)')).toBeInTheDocument();
  });

  it('applies its own elevation shadow by default', () => {
    render(<ProjectPreviewCard project={project} />);
    expect(screen.getByRole('link').className).toContain('drop-shadow');
  });

  it('omits its own shadow when elevated=false (popover supplies one shadow for card+tail)', () => {
    render(<ProjectPreviewCard project={project} elevated={false} />);
    expect(screen.getByRole('link').className).not.toContain('drop-shadow');
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npx vitest run src/components/project-preview/project-preview-card.test.tsx`
Expected: FAIL with "Cannot find module './project-preview-card'".

- [ ] **Step 7: Implement the card**

Create `src/components/project-preview/project-preview-card.tsx`. The `elevated` prop (default `true`) lets the inline Projects-list usage (Task 17) keep its own shadow, while the popover shell (Task 12) passes `elevated={false}` and supplies a single shadow covering card+tail itself:
```tsx
import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';
import type { Project } from '@/content/types';
import { getVisibleTags } from './tag-overflow';

const MAX_VISIBLE_TAGS = 2;

function previewLabel(demo: Project['demo']): string {
  switch (demo.type) {
    case 'mock':
      return 'preview (demo interativo)';
    case 'video':
      return 'preview (vídeo)';
    case 'gif':
      return 'preview (gif)';
    case 'none':
      return 'sem preview';
  }
}

export function ProjectPreviewCard({
  project,
  elevated = true,
}: {
  project: Project;
  elevated?: boolean;
}) {
  const { visible, overflowCount } = getVisibleTags(project.tags, MAX_VISIBLE_TAGS);

  return (
    <Link
      href={`/projetos/${project.slug}`}
      className={`group block w-full rounded-lg bg-bg p-3.5 ${
        elevated
          ? '[filter:drop-shadow(0_3px_10px_rgba(18,21,15,0.22))] dark:[filter:drop-shadow(0_3px_10px_rgba(0,0,0,0.45))]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[15px] font-bold text-fg">{project.title}</span>
        <ArrowRight
          size={14}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-fg-muted transition-colors group-hover:text-lime-deep dark:group-hover:text-lime-bright"
        />
      </div>
      <div className="mt-2 flex h-20 items-center justify-center rounded-md bg-bg-dim font-mono text-[10px] text-fg-muted">
        {previewLabel(project.demo)}
      </div>
      <p className="mt-2 text-[11px] leading-snug text-fg-muted">{project.oneLiner}</p>
      <div className="mt-2 flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] text-lime-deep dark:text-lime-bright">
        {visible.map((tag, index) => (
          <span key={tag} className="flex items-center gap-1">
            {index > 0 && <span className="text-fg-muted">·</span>}
            <Code2 size={10} aria-hidden="true" />
            <span>{tag}</span>
          </span>
        ))}
        {overflowCount > 0 && (
          <span className="flex items-center gap-1">
            <span className="text-fg-muted">·</span>
            <span className="text-fg-muted">+{overflowCount}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 8: Run it to verify it passes**

Run: `npx vitest run src/components/project-preview/project-preview-card.test.tsx`
Expected: PASS (6 tests).

- [ ] **Step 9: Commit**

```bash
git add src/components/project-preview/tag-overflow.ts src/components/project-preview/tag-overflow.test.ts src/components/project-preview/project-preview-card.tsx src/components/project-preview/project-preview-card.test.tsx
git commit -m "Add ProjectPreviewCard shared component"
```

---

## Task 12: `ProjectPreviewPopover` — hover/persist/dismiss state machine

**Files:**
- Create: `src/components/project-preview/project-preview-popover.tsx`
- Test: `src/components/project-preview/project-preview-popover.test.tsx`

**Interfaces:**
- Consumes: `ProjectPreviewCard` (with `elevated={false}`) from Task 11.
- Produces: `<ProjectPreviewPopover project={project}><span>Trigger</span></ProjectPreviewPopover>` — wraps any `children` as the hover/click trigger. Used by `ProjectChip` in Task 15. Visual polish (tail, unified shadow, responsive up/down placement, hover-to-lime-deep arrow) is added on top of this behavior in Task 13 — this task only covers open/persist/dismiss state.

- [ ] **Step 1: Write the failing tests**

Create `src/components/project-preview/project-preview-popover.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectPreviewPopover } from './project-preview-popover';
import type { Project } from '@/content/types';

const project: Project = {
  slug: 'doctag',
  title: 'Doctag',
  oneLiner: 'App desktop de tagging de documentos.',
  tags: ['Electron'],
  role: 'Criador',
  narrative: ['Parágrafo.'],
  demoIndex: 0,
  demo: { type: 'mock', component: 'doctag' },
};

function renderPopover() {
  return render(
    <ProjectPreviewPopover project={project}>
      <span>Doctag</span>
    </ProjectPreviewPopover>,
  );
}

describe('ProjectPreviewPopover', () => {
  it('hides the card by default', () => {
    renderPopover();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shows the card on hover', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.hover(screen.getByRole('button'));
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('hides the card again on unhover when not pinned', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button');
    await user.hover(trigger);
    await user.unhover(trigger);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('persists the card after a click, even after unhover', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    await user.unhover(trigger);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('keeps the card open if the trigger is clicked again while already pinned', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    await user.click(trigger);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('dismisses a pinned card on outside click', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ProjectPreviewPopover project={project}>
          <span>Doctag</span>
        </ProjectPreviewPopover>
        <button>outside</button>
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Doctag' }));
    await user.click(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('dismisses a pinned card on Escape', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/project-preview/project-preview-popover.test.tsx`
Expected: FAIL with "Cannot find module './project-preview-popover'".

- [ ] **Step 3: Implement the popover**

Create `src/components/project-preview/project-preview-popover.tsx`:
```tsx
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Project } from '@/content/types';
import { ProjectPreviewCard } from './project-preview-card';

export function ProjectPreviewPopover({
  project,
  children,
}: {
  project: Project;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [pinned, setPinned] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinned) return;

    function dismiss() {
      setPinned(false);
      setVisible(false);
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        dismiss();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        dismiss();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pinned]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => {
        if (!pinned) setVisible(false);
      }}
    >
      <button
        type="button"
        onClick={() => {
          setPinned(true);
          setVisible(true);
        }}
        aria-expanded={visible}
      >
        {children}
      </button>
      {visible && (
        <div className="absolute left-0 top-full z-50 mt-2.5">
          <ProjectPreviewCard project={project} elevated={false} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/project-preview/project-preview-popover.test.tsx`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/project-preview/project-preview-popover.tsx src/components/project-preview/project-preview-popover.test.tsx
git commit -m "Add ProjectPreviewPopover hover/persist/dismiss behavior"
```

---

## Task 13: Responsive placement + tail + unified shadow

**Files:**
- Create: `src/components/project-preview/use-popover-placement.ts`
- Test: `src/components/project-preview/use-popover-placement.test.ts`
- Modify: `src/components/project-preview/project-preview-popover.tsx`
- Modify: `src/components/project-preview/project-preview-popover.test.tsx`

**Interfaces:**
- Produces: `usePopoverPlacement(triggerRef: RefObject<HTMLElement | null>, active: boolean, estimatedHeight?: number): 'top' | 'bottom'`, wired into `ProjectPreviewPopover` to flip the card above the trigger when there isn't room below.

Note on the arrow hover-to-lime-deep behavior from the spec: it needs no new code here. `ProjectPreviewCard`'s `<Link>` already carries `group` with `group-hover:text-lime-deep` on the arrow (Task 11) — hovering the rendered card, in either context, triggers it natively via CSS.

- [ ] **Step 1: Write the failing placement-hook tests**

Create `src/components/project-preview/use-popover-placement.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { usePopoverPlacement } from './use-popover-placement';

function makeTriggerRef(rect: Partial<DOMRect>) {
  const ref = createRef<HTMLElement>();
  const el = document.createElement('div');
  el.getBoundingClientRect = () =>
    ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
      ...rect,
    }) as DOMRect;
  // @ts-expect-error -- assigning to a readonly ref for the test
  ref.current = el;
  return ref;
}

describe('usePopoverPlacement', () => {
  it('chooses bottom when there is enough space below the trigger', () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    const ref = makeTriggerRef({ top: 100, bottom: 120 });
    const { result } = renderHook(() => usePopoverPlacement(ref, true, 220));
    expect(result.current).toBe('bottom');
  });

  it('chooses top when there is not enough space below but there is above', () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    const ref = makeTriggerRef({ top: 700, bottom: 720 });
    const { result } = renderHook(() => usePopoverPlacement(ref, true, 220));
    expect(result.current).toBe('top');
  });

  it('does nothing while inactive, keeping the default bottom placement', () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    const ref = makeTriggerRef({ top: 700, bottom: 720 });
    const { result } = renderHook(() => usePopoverPlacement(ref, false, 220));
    expect(result.current).toBe('bottom');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/project-preview/use-popover-placement.test.ts`
Expected: FAIL with "Cannot find module './use-popover-placement'".

- [ ] **Step 3: Implement the hook**

Create `src/components/project-preview/use-popover-placement.ts`:
```ts
'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';

export type PopoverPlacement = 'top' | 'bottom';

export function usePopoverPlacement(
  triggerRef: RefObject<HTMLElement | null>,
  active: boolean,
  estimatedHeight = 220,
): PopoverPlacement {
  const [placement, setPlacement] = useState<PopoverPlacement>('bottom');

  useLayoutEffect(() => {
    if (!active || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    setPlacement(spaceBelow >= estimatedHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top');
  }, [active, triggerRef, estimatedHeight]);

  return placement;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/project-preview/use-popover-placement.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Add an integration test for the tail to the popover test file**

Add this test inside the existing `describe('ProjectPreviewPopover', ...)` block in `src/components/project-preview/project-preview-popover.test.tsx`:
```tsx
  it('renders a decorative tail pointing at the trigger when visible', async () => {
    const user = userEvent.setup();
    const { container } = renderPopover();
    await user.hover(screen.getByRole('button'));
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npx vitest run src/components/project-preview/project-preview-popover.test.tsx`
Expected: FAIL on the new test — no `aria-hidden` element is rendered yet.

- [ ] **Step 7: Wire placement and tail into the popover**

Replace the contents of `src/components/project-preview/project-preview-popover.tsx`:
```tsx
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Project } from '@/content/types';
import { ProjectPreviewCard } from './project-preview-card';
import { usePopoverPlacement, type PopoverPlacement } from './use-popover-placement';

function PopoverTail({ placement }: { placement: PopoverPlacement }) {
  return placement === 'top' ? (
    <div
      aria-hidden="true"
      className="ml-6 h-0 w-0 border-x-[9px] border-t-[9px] border-x-transparent border-t-bg"
    />
  ) : (
    <div
      aria-hidden="true"
      className="ml-6 h-0 w-0 border-x-[9px] border-b-[9px] border-x-transparent border-b-bg"
    />
  );
}

export function ProjectPreviewPopover({
  project,
  children,
}: {
  project: Project;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [pinned, setPinned] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const placement = usePopoverPlacement(triggerRef, visible);

  useEffect(() => {
    if (!pinned) return;

    function dismiss() {
      setPinned(false);
      setVisible(false);
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        dismiss();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        dismiss();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pinned]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => {
        if (!pinned) setVisible(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setPinned(true);
          setVisible(true);
        }}
        aria-expanded={visible}
      >
        {children}
      </button>
      {visible && (
        <div
          className={`absolute left-0 z-50 w-60 [filter:drop-shadow(0_3px_10px_rgba(18,21,15,0.22))] dark:[filter:drop-shadow(0_3px_10px_rgba(0,0,0,0.45))] ${
            placement === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'
          }`}
        >
          {placement === 'bottom' && <PopoverTail placement={placement} />}
          <ProjectPreviewCard project={project} elevated={false} />
          {placement === 'top' && <PopoverTail placement={placement} />}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Run the full popover test file to verify everything passes**

Run: `npx vitest run src/components/project-preview/project-preview-popover.test.tsx`
Expected: PASS (8 tests).

- [ ] **Step 9: Run the whole suite and build**

Run: `npm test && npm run build`
Expected: all PASS, build succeeds.

- [ ] **Step 10: Commit**

```bash
git add src/components/project-preview/use-popover-placement.ts src/components/project-preview/use-popover-placement.test.ts src/components/project-preview/project-preview-popover.tsx src/components/project-preview/project-preview-popover.test.tsx
git commit -m "Add responsive placement, tail, and unified shadow to ProjectPreviewPopover"
```

---

## Task 14: `ExperienceEntryRow` (timeline dot/line, logo, hierarchy)

**Files:**
- Create: `src/components/experience/experience-entry-row.tsx`
- Test: `src/components/experience/experience-entry-row.test.tsx`

**Interfaces:**
- Consumes: `ExperienceEntry` type from Task 4.
- Produces: `<ExperienceEntryRow entry={entry} />`, rendered as an `<li>` — must be used inside a `<ul>` (Task 16 provides it). The continuous timeline line is each `<li>`'s own full-height `border-l-2 border-lime`; consecutive `<li>`s stacking with no gap is what makes it read as one line — no JS measurement needed.

- [ ] **Step 1: Write the failing tests**

Create `src/components/experience/experience-entry-row.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExperienceEntryRow } from './experience-entry-row';
import type { ExperienceEntry } from '@/content/types';

const currentEntry: ExperienceEntry = {
  company: 'Empresa X',
  role: 'Engenheiro de Software',
  period: '2023 — Atual',
  description: 'Atuação em produto X.',
  current: true,
  projectSlugs: [],
};

const pastEntry: ExperienceEntry = {
  ...currentEntry,
  company: 'Empresa Y',
  role: 'Desenvolvedor Full-stack',
  period: '2021 — 2023',
  current: false,
};

describe('ExperienceEntryRow', () => {
  it('renders role, company, period, and description', () => {
    render(
      <ul>
        <ExperienceEntryRow entry={currentEntry} />
      </ul>,
    );
    expect(screen.getByText('Engenheiro de Software')).toBeInTheDocument();
    expect(screen.getByText('Empresa X')).toBeInTheDocument();
    expect(screen.getByText('2023 — Atual')).toBeInTheDocument();
    expect(screen.getByText('Atuação em produto X.')).toBeInTheDocument();
  });

  it('renders the current entry role in lime', () => {
    render(
      <ul>
        <ExperienceEntryRow entry={currentEntry} />
      </ul>,
    );
    expect(screen.getByText('Engenheiro de Software').className).toContain('text-lime-deep');
  });

  it('renders a past entry role in the neutral foreground color, not lime', () => {
    render(
      <ul>
        <ExperienceEntryRow entry={pastEntry} />
      </ul>,
    );
    expect(screen.getByText('Desenvolvedor Full-stack').className).not.toContain('text-lime-deep');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/experience/experience-entry-row.test.tsx`
Expected: FAIL with "Cannot find module './experience-entry-row'".

- [ ] **Step 3: Implement the component**

Create `src/components/experience/experience-entry-row.tsx`:
```tsx
import type { ExperienceEntry } from '@/content/types';

const LOGO_SIZE = 56;

export function ExperienceEntryRow({ entry }: { entry: ExperienceEntry }) {
  return (
    <li className="relative border-l-2 border-lime pb-6 pl-8 last:pb-0">
      <span
        aria-hidden="true"
        className={`absolute -left-[5px] top-7 h-2.5 w-2.5 rounded-full ${
          entry.current ? 'bg-lime shadow-[0_0_6px_rgba(146,208,11,0.6)]' : 'bg-fg-muted'
        }`}
      />
      <div className="flex gap-3.5">
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center rounded-lg bg-bg-dim font-mono text-[9px] text-fg-muted"
          style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
        >
          logo
        </div>
        <div>
          <p
            className={`text-[17px] font-bold leading-tight tracking-tight ${
              entry.current ? 'text-lime-deep dark:text-lime-bright' : 'text-fg'
            }`}
          >
            {entry.role}
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-tight text-fg-muted">{entry.company}</p>
          <p className="mt-0.5 font-mono text-[11px] leading-tight text-fg-muted">{entry.period}</p>
        </div>
      </div>
      <p className="ml-[70px] mt-2 text-[12px] text-fg-muted">{entry.description}</p>
    </li>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/experience/experience-entry-row.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/experience/experience-entry-row.tsx src/components/experience/experience-entry-row.test.tsx
git commit -m "Add ExperienceEntryRow with timeline dot/line"
```

---

## Task 15: `ProjectChip` — clickable chip wired to the popover

**Files:**
- Modify: `src/components/project-preview/project-preview-popover.tsx`
- Modify: `src/components/project-preview/project-preview-popover.test.tsx`
- Create: `src/components/experience/project-chip.tsx`
- Test: `src/components/experience/project-chip.test.tsx`
- Modify: `src/components/experience/experience-entry-row.tsx`
- Modify: `src/components/experience/experience-entry-row.test.tsx`

**Interfaces:**
- Consumes: `ProjectPreviewPopover` from Task 13, `getProjectBySlug` from Task 6.
- Produces: `<ProjectChip slug="doctag" />`; `ExperienceEntryRow` now renders a "Projetos" label + one `ProjectChip` per `entry.projectSlugs` entry below the description.

- [ ] **Step 1: Add a `triggerClassName` passthrough to the popover**

The popover's trigger `<button>` currently has no styling hook for callers. Modify `src/components/project-preview/project-preview-popover.tsx`: change the function signature to accept and apply it:
```tsx
export function ProjectPreviewPopover({
  project,
  children,
  triggerClassName = '',
}: {
  project: Project;
  children: ReactNode;
  triggerClassName?: string;
}) {
```
And update the `<button>` element:
```tsx
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setPinned(true);
          setVisible(true);
        }}
        aria-expanded={visible}
        className={triggerClassName}
      >
        {children}
      </button>
```

- [ ] **Step 2: Add a regression test for the new prop**

Add this test inside `describe('ProjectPreviewPopover', ...)` in `src/components/project-preview/project-preview-popover.test.tsx`:
```tsx
  it('applies a custom className to the trigger button', () => {
    render(
      <ProjectPreviewPopover project={project} triggerClassName="custom-trigger">
        <span>Doctag</span>
      </ProjectPreviewPopover>,
    );
    expect(screen.getByRole('button').className).toBe('custom-trigger');
  });
```

- [ ] **Step 3: Run the popover tests to verify they pass**

Run: `npx vitest run src/components/project-preview/project-preview-popover.test.tsx`
Expected: PASS (9 tests).

- [ ] **Step 4: Write the failing ProjectChip test**

Create `src/components/experience/project-chip.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectChip } from './project-chip';

describe('ProjectChip', () => {
  it('renders the project title as the trigger label', () => {
    render(<ProjectChip slug="doctag" />);
    expect(screen.getByRole('button', { name: 'Doctag' })).toBeInTheDocument();
  });

  it('renders nothing for an unknown slug', () => {
    const { container } = render(<ProjectChip slug="not-a-real-project" />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 5: Run it to verify it fails**

Run: `npx vitest run src/components/experience/project-chip.test.tsx`
Expected: FAIL with "Cannot find module './project-chip'".

- [ ] **Step 6: Implement ProjectChip**

Create `src/components/experience/project-chip.tsx`:
```tsx
import { ProjectPreviewPopover } from '@/components/project-preview/project-preview-popover';
import { getProjectBySlug } from '@/lib/projects';

export function ProjectChip({ slug }: { slug: string }) {
  const project = getProjectBySlug(slug);
  if (!project) return null;

  return (
    <ProjectPreviewPopover
      project={project}
      triggerClassName="rounded bg-lime-soft px-2.5 py-1 text-[11px] text-lime-deep transition-colors hover:bg-lime-bright hover:text-ink dark:hover:text-coal motion-safe:transition-transform motion-safe:active:scale-95"
    >
      {project.title}
    </ProjectPreviewPopover>
  );
}
```

- [ ] **Step 7: Run it to verify it passes**

Run: `npx vitest run src/components/experience/project-chip.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 8: Wire ProjectChip into ExperienceEntryRow**

Modify `src/components/experience/experience-entry-row.tsx` — add the import:
```tsx
import { ProjectChip } from './project-chip';
```
And add this block right after the description `<p>`, still inside the `<li>`:
```tsx
      {entry.projectSlugs && entry.projectSlugs.length > 0 && (
        <div className="ml-[70px] mt-2">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-fg-muted">
            Projetos
          </p>
          <div className="flex flex-wrap gap-1.5">
            {entry.projectSlugs.map((slug) => (
              <ProjectChip key={slug} slug={slug} />
            ))}
          </div>
        </div>
      )}
```

- [ ] **Step 9: Add a regression test for the chip block**

Add this test to `src/components/experience/experience-entry-row.test.tsx` (the entry needs a real linked slug — use `'hcp-app'`, which exists in the Task 5 content data):
```tsx
  it('renders a "Projetos" label and chip when projectSlugs is non-empty', () => {
    render(
      <ul>
        <ExperienceEntryRow entry={{ ...currentEntry, projectSlugs: ['hcp-app'] }} />
      </ul>,
    );
    expect(screen.getByText('Projetos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'HCP App' })).toBeInTheDocument();
  });

  it('renders no "Projetos" label when projectSlugs is empty', () => {
    render(
      <ul>
        <ExperienceEntryRow entry={currentEntry} />
      </ul>,
    );
    expect(screen.queryByText('Projetos')).not.toBeInTheDocument();
  });
```

- [ ] **Step 10: Run the full test file to verify it passes**

Run: `npx vitest run src/components/experience/experience-entry-row.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 11: Run the whole suite and build**

Run: `npm test && npm run build`
Expected: all PASS, build succeeds.

- [ ] **Step 12: Commit**

```bash
git add src/components/project-preview/project-preview-popover.tsx src/components/project-preview/project-preview-popover.test.tsx src/components/experience/project-chip.tsx src/components/experience/project-chip.test.tsx src/components/experience/experience-entry-row.tsx src/components/experience/experience-entry-row.test.tsx
git commit -m "Add ProjectChip and wire it into ExperienceEntryRow"
```

---

## Task 16: `ExperienceSection`

**Files:**
- Create: `src/components/experience/experience-section.tsx`
- Test: `src/components/experience/experience-section.test.tsx`

**Interfaces:**
- Consumes: `experience` data from Task 5, `ExperienceEntryRow` from Task 15.
- Produces: `<ExperienceSection />`, renders `<section id="experiencia">` (matches the `experiencia` nav id from Task 8) — composed into the home page in Task 22.

- [ ] **Step 1: Write the failing test**

Create `src/components/experience/experience-section.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExperienceSection } from './experience-section';
import { experience } from '@/content/experience';

describe('ExperienceSection', () => {
  it('renders inside a #experiencia section landmark', () => {
    render(<ExperienceSection />);
    expect(document.getElementById('experiencia')).toBeInTheDocument();
  });

  it('renders one row per experience entry', () => {
    render(<ExperienceSection />);
    for (const entry of experience) {
      expect(screen.getByText(entry.company)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/experience/experience-section.test.tsx`
Expected: FAIL with "Cannot find module './experience-section'".

- [ ] **Step 3: Implement the section**

Create `src/components/experience/experience-section.tsx`:
```tsx
import { experience } from '@/content/experience';
import { ExperienceEntryRow } from './experience-entry-row';

export function ExperienceSection() {
  return (
    <section id="experiencia" className="px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold text-fg">Experiência</h2>
      <ul>
        {experience.map((entry) => (
          <ExperienceEntryRow key={`${entry.company}-${entry.period}`} entry={entry} />
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/components/experience/experience-section.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/experience/experience-section.tsx src/components/experience/experience-section.test.tsx
git commit -m "Add ExperienceSection"
```

---

## Task 17: `ProjectsSection` (personal projects, inline cards)

**Files:**
- Create: `src/components/projects/projects-section.tsx`
- Test: `src/components/projects/projects-section.test.tsx`

**Interfaces:**
- Consumes: `getPersonalProjects()` from Task 6, `ProjectPreviewCard` from Task 11.
- Produces: `<ProjectsSection />`, renders `<section id="projetos">` — composed into the grid in Task 20.

- [ ] **Step 1: Write the failing test**

Create `src/components/projects/projects-section.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectsSection } from './projects-section';
import { getPersonalProjects } from '@/lib/projects';

describe('ProjectsSection', () => {
  it('renders inside a #projetos section landmark', () => {
    render(<ProjectsSection />);
    expect(document.getElementById('projetos')).toBeInTheDocument();
  });

  it('renders a card for every personal project and none of the linked ones', () => {
    render(<ProjectsSection />);
    for (const project of getPersonalProjects()) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
    expect(screen.queryByText('HCP App')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/projects/projects-section.test.tsx`
Expected: FAIL with "Cannot find module './projects-section'".

- [ ] **Step 3: Implement the section**

Create `src/components/projects/projects-section.tsx`:
```tsx
import { getPersonalProjects } from '@/lib/projects';
import { ProjectPreviewCard } from '@/components/project-preview/project-preview-card';

export function ProjectsSection() {
  const personalProjects = getPersonalProjects();

  return (
    <section id="projetos">
      <h2 className="mb-6 text-2xl font-bold text-fg">Projetos</h2>
      <div className="flex flex-col gap-4">
        {personalProjects.map((project) => (
          <ProjectPreviewCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/components/projects/projects-section.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/projects/projects-section.tsx src/components/projects/projects-section.test.tsx
git commit -m "Add ProjectsSection (personal projects only)"
```

---

## Task 18: `SkillsSection` (categories + icon chips)

**Files:**
- Create: `src/components/skills/skill-icon.tsx`
- Test: `src/components/skills/skill-icon.test.tsx`
- Create: `src/components/skills/skills-section.tsx`
- Test: `src/components/skills/skills-section.test.tsx`

**Interfaces:**
- Consumes: `skills` data from Task 5.
- Produces: `<SkillIcon name="Atom" />` (resolves a lucide-react icon by name, falls back to a generic icon for unknown names); `<SkillsSection />`, renders `<section id="skills">`.

- [ ] **Step 1: Write the failing icon test**

Create `src/components/skills/skill-icon.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SkillIcon } from './skill-icon';

describe('SkillIcon', () => {
  it('renders a known icon without crashing', () => {
    const { container } = render(<SkillIcon name="Atom" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('falls back to a generic icon for an unknown name', () => {
    const { container } = render(<SkillIcon name="NotARealIcon" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/skills/skill-icon.test.tsx`
Expected: FAIL with "Cannot find module './skill-icon'".

- [ ] **Step 3: Implement the icon registry**

Create `src/components/skills/skill-icon.tsx`:
```tsx
import { Atom, Code2, Container, Database, FileCode, Server, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  FileCode,
  Atom,
  Server,
  Database,
  Container,
};

export function SkillIcon({ name, size = 11 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? Code2;
  return <Icon size={size} aria-hidden="true" />;
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/components/skills/skill-icon.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the failing section test**

Create `src/components/skills/skills-section.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillsSection } from './skills-section';
import { skills } from '@/content/skills';

describe('SkillsSection', () => {
  it('renders inside a #skills section landmark', () => {
    render(<SkillsSection />);
    expect(document.getElementById('skills')).toBeInTheDocument();
  });

  it('renders every category and item', () => {
    render(<SkillsSection />);
    for (const category of skills) {
      expect(screen.getByText(category.category)).toBeInTheDocument();
      for (const item of category.items) {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      }
    }
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npx vitest run src/components/skills/skills-section.test.tsx`
Expected: FAIL with "Cannot find module './skills-section'".

- [ ] **Step 7: Implement the section**

Create `src/components/skills/skills-section.tsx`:
```tsx
import { skills } from '@/content/skills';
import { SkillIcon } from './skill-icon';

export function SkillsSection() {
  return (
    <section id="skills">
      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wide text-fg-muted">Skills</h2>
      {skills.map((category) => (
        <div key={category.category} className="mb-4">
          <p className="mb-1.5 text-[10px] text-fg-muted">{category.category}</p>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((item) => (
              <span
                key={item.name}
                className="inline-flex items-center gap-1 rounded bg-lime-soft px-2.5 py-1 text-[10px] text-lime-deep"
              >
                <SkillIcon name={item.icon} />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 8: Run it to verify it passes**

Run: `npx vitest run src/components/skills/skills-section.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 9: Commit**

```bash
git add src/components/skills
git commit -m "Add SkillsSection with icon registry"
```

---

## Task 19: `EducationSection`

**Files:**
- Create: `src/components/education/education-section.tsx`
- Test: `src/components/education/education-section.test.tsx`

**Interfaces:**
- Consumes: `education` data from Task 5.
- Produces: `<EducationSection />`, renders `<section id="formacao">`.

- [ ] **Step 1: Write the failing test**

Create `src/components/education/education-section.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EducationSection } from './education-section';
import { education } from '@/content/education';

describe('EducationSection', () => {
  it('renders inside a #formacao section landmark', () => {
    render(<EducationSection />);
    expect(document.getElementById('formacao')).toBeInTheDocument();
  });

  it('renders degree, institution, and period below it for every entry', () => {
    render(<EducationSection />);
    for (const entry of education) {
      const degree = screen.getByText(entry.degree);
      expect(degree).toBeInTheDocument();
      expect(screen.getByText(entry.institution)).toBeInTheDocument();
      expect(screen.getByText(entry.period)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/education/education-section.test.tsx`
Expected: FAIL with "Cannot find module './education-section'".

- [ ] **Step 3: Implement the section**

Create `src/components/education/education-section.tsx`:
```tsx
import { education } from '@/content/education';

export function EducationSection() {
  return (
    <section id="formacao">
      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wide text-fg-muted">Formação</h2>
      <ul className="flex flex-col gap-3">
        {education.map((entry) => (
          <li key={`${entry.institution}-${entry.period}`}>
            <p className="text-[13px] font-bold text-fg">{entry.degree}</p>
            <p className="mt-0.5 text-[11px] text-fg-muted">{entry.institution}</p>
            <p className="mt-0.5 font-mono text-[10px] text-fg-muted">{entry.period}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/components/education/education-section.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/education/education-section.tsx src/components/education/education-section.test.tsx
git commit -m "Add EducationSection"
```

---

## Task 20: Two-column `ProjectsSkillsGrid`

**Files:**
- Create: `src/components/home/projects-skills-grid.tsx`
- Test: `src/components/home/projects-skills-grid.test.tsx`

**Interfaces:**
- Consumes: `ProjectsSection` (Task 17), `SkillsSection` (Task 18), `EducationSection` (Task 19).
- Produces: `<ProjectsSkillsGrid />` — the 2-column layout (collapsing to 1 column under Tailwind's `lg` breakpoint) composed into the home page in Task 22.

- [ ] **Step 1: Write the failing test**

Create `src/components/home/projects-skills-grid.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProjectsSkillsGrid } from './projects-skills-grid';

describe('ProjectsSkillsGrid', () => {
  it('renders the Projetos, Skills, and Formação landmarks together', () => {
    render(<ProjectsSkillsGrid />);
    expect(document.getElementById('projetos')).toBeInTheDocument();
    expect(document.getElementById('skills')).toBeInTheDocument();
    expect(document.getElementById('formacao')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/home/projects-skills-grid.test.tsx`
Expected: FAIL with "Cannot find module './projects-skills-grid'".

- [ ] **Step 3: Implement the grid**

Create `src/components/home/projects-skills-grid.tsx`:
```tsx
import { ProjectsSection } from '@/components/projects/projects-section';
import { SkillsSection } from '@/components/skills/skills-section';
import { EducationSection } from '@/components/education/education-section';

export function ProjectsSkillsGrid() {
  return (
    <div className="grid gap-8 px-4 py-12 lg:grid-cols-[2fr_1fr]">
      <ProjectsSection />
      <aside className="flex flex-col gap-8 lg:border-l lg:border-bg-dim lg:pl-8">
        <SkillsSection />
        <EducationSection />
      </aside>
    </div>
  );
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/components/home/projects-skills-grid.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/home/projects-skills-grid.tsx src/components/home/projects-skills-grid.test.tsx
git commit -m "Add two-column ProjectsSkillsGrid"
```

---

## Task 21: `Footer`

**Files:**
- Create: `src/components/footer/footer.tsx`
- Test: `src/components/footer/footer.test.tsx`

**Interfaces:**
- Consumes: `profile` data from Task 10.
- Produces: `<Footer />`, renders `<footer>` — centered CTA + contact icons + copyright, composed into the home page in Task 22.

- [ ] **Step 1: Write the failing test**

Create `src/components/footer/footer.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';
import { profile } from '@/content/profile';

describe('Footer', () => {
  it('renders a CV download link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      profile.resumeUrl,
    );
  });

  it('renders contact links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Enviar email' })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`,
    );
    expect(screen.getByRole('link', { name: 'Abrir GitHub' })).toHaveAttribute('href', profile.github);
    expect(screen.getByRole('link', { name: 'Abrir LinkedIn' })).toHaveAttribute(
      'href',
      profile.linkedin,
    );
  });

  it('renders the current year in the copyright line', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/footer/footer.test.tsx`
Expected: FAIL with "Cannot find module './footer'".

- [ ] **Step 3: Implement the Footer**

Create `src/components/footer/footer.tsx`:
```tsx
import { Download, Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/content/profile';

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-bg-dim px-4 py-10 text-center">
      <a
        href={profile.resumeUrl}
        download
        className="flex items-center gap-1.5 rounded bg-lime px-4 py-2 text-sm font-semibold text-ink dark:text-coal"
      >
        <Download size={14} aria-hidden="true" />
        Download CV (PDF)
      </a>
      <div className="flex items-center gap-3.5 text-fg-muted">
        <a
          href={`mailto:${profile.email}`}
          aria-label="Enviar email"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <Mail size={18} aria-hidden="true" />
        </a>
        <a
          href={profile.github}
          aria-label="Abrir GitHub"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <Github size={18} aria-hidden="true" />
        </a>
        <a
          href={profile.linkedin}
          aria-label="Abrir LinkedIn"
          target="_blank"
          rel="noreferrer"
          className="hover:text-lime-deep dark:hover:text-lime-bright"
        >
          <Linkedin size={18} aria-hidden="true" />
        </a>
      </div>
      <p className="font-mono text-[10px] text-fg-muted">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/components/footer/footer.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/footer/footer.tsx src/components/footer/footer.test.tsx
git commit -m "Add Footer"
```

---

## Task 22: Compose the home page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.test.tsx`

**Interfaces:**
- Consumes: `Header` (Task 9), `Hero` (Task 10), `ExperienceSection` (Task 16), `ProjectsSkillsGrid` (Task 20), `Footer` (Task 21).
- Produces: the complete `/` route. This replaces Task 1's placeholder smoke test with real landmark assertions.

- [ ] **Step 1: Replace the page test**

Replace the contents of `src/app/page.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme/theme-provider';
import Page from './page';

function renderPage() {
  return render(
    <ThemeProvider>
      <Page />
    </ThemeProvider>,
  );
}

describe('Home page', () => {
  it('renders every section landmark inside main', () => {
    renderPage();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(document.getElementById('sobre')).toBeInTheDocument();
    expect(document.getElementById('experiencia')).toBeInTheDocument();
    expect(document.getElementById('projetos')).toBeInTheDocument();
    expect(document.getElementById('skills')).toBeInTheDocument();
    expect(document.getElementById('formacao')).toBeInTheDocument();
  });

  it('renders the header and footer outside the main landmark', () => {
    renderPage();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/app/page.test.tsx`
Expected: FAIL — `page.tsx` still renders Task 1's placeholder content, missing the section ids.

- [ ] **Step 3: Compose the page**

Replace the contents of `src/app/page.tsx`:
```tsx
import { Header } from '@/components/layout/header';
import { Hero } from '@/components/hero/hero';
import { ExperienceSection } from '@/components/experience/experience-section';
import { ProjectsSkillsGrid } from '@/components/home/projects-skills-grid';
import { Footer } from '@/components/footer/footer';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ExperienceSection />
        <ProjectsSkillsGrid />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/app/page.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the whole suite and build**

Run: `npm test && npm run build`
Expected: all PASS, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/app/page.test.tsx
git commit -m "Compose the home page from all sections"
```

---

## Task 23: `splitNarrativeAtDemoIndex` helper

**Files:**
- Create: `src/lib/narrative.ts`
- Test: `src/lib/narrative.test.ts`

**Interfaces:**
- Produces: `splitNarrativeAtDemoIndex(narrative: string[], demoIndex: number): { before: string[]; after: string[] }` — used by the project detail page (Task 28) to render narrative paragraphs before/after the demo slot.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/narrative.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { splitNarrativeAtDemoIndex } from './narrative';

describe('splitNarrativeAtDemoIndex', () => {
  it('puts everything after the demo when demoIndex is 0', () => {
    expect(splitNarrativeAtDemoIndex(['p1', 'p2'], 0)).toEqual({ before: [], after: ['p1', 'p2'] });
  });

  it('splits at the given index', () => {
    expect(splitNarrativeAtDemoIndex(['p1', 'p2', 'p3'], 2)).toEqual({
      before: ['p1', 'p2'],
      after: ['p3'],
    });
  });

  it('puts everything before the demo when demoIndex is at or beyond the length', () => {
    expect(splitNarrativeAtDemoIndex(['p1', 'p2'], 5)).toEqual({ before: ['p1', 'p2'], after: [] });
  });

  it('clamps a negative demoIndex to 0', () => {
    expect(splitNarrativeAtDemoIndex(['p1', 'p2'], -3)).toEqual({ before: [], after: ['p1', 'p2'] });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/narrative.test.ts`
Expected: FAIL with "Cannot find module './narrative'".

- [ ] **Step 3: Implement the helper**

Create `src/lib/narrative.ts`:
```ts
export function splitNarrativeAtDemoIndex(
  narrative: string[],
  demoIndex: number,
): { before: string[]; after: string[] } {
  const clampedIndex = Math.max(0, Math.min(demoIndex, narrative.length));
  return {
    before: narrative.slice(0, clampedIndex),
    after: narrative.slice(clampedIndex),
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/narrative.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/narrative.ts src/lib/narrative.test.ts
git commit -m "Add splitNarrativeAtDemoIndex helper"
```

---

## Task 24: Doctag mock widget (drag-or-keyboard tag retagging)

**Files:**
- Create: `src/components/project-mocks/doctag/index.tsx`
- Test: `src/components/project-mocks/doctag/index.test.tsx`

**Interfaces:**
- Produces: `<DoctagMock />` — a self-contained, fictional-data widget illustrating "move a tag onto a document." Exported as the named export `DoctagMock` (the key the registry in Task 26 imports). No real Doctag app code is embedded — this is a from-scratch recreation of one interaction.

- [ ] **Step 1: Write the failing tests**

Create `src/components/project-mocks/doctag/index.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoctagMock } from './index';

describe('DoctagMock', () => {
  it('renders a tag button per document with its current tag', () => {
    render(<DoctagMock />);
    expect(
      screen.getByRole('button', { name: /Proposta — Cliente A\.pdf: Contrato/ }),
    ).toBeInTheDocument();
  });

  it('cycles the tag forward with ArrowRight', async () => {
    const user = userEvent.setup();
    render(<DoctagMock />);
    const tagButton = screen.getByRole('button', { name: /Proposta — Cliente A\.pdf: Contrato/ });
    tagButton.focus();
    await user.keyboard('{ArrowRight}');
    expect(
      screen.getByRole('button', { name: /Proposta — Cliente A\.pdf: Fatura/ }),
    ).toBeInTheDocument();
  });

  it('cycles the tag backward with ArrowLeft, wrapping around to the last tag', async () => {
    const user = userEvent.setup();
    render(<DoctagMock />);
    const tagButton = screen.getByRole('button', { name: /Proposta — Cliente A\.pdf: Contrato/ });
    tagButton.focus();
    await user.keyboard('{ArrowLeft}');
    expect(
      screen.getByRole('button', { name: /Proposta — Cliente A\.pdf: Relatório/ }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/project-mocks/doctag/index.test.tsx`
Expected: FAIL with "Cannot find module './index'".

- [ ] **Step 3: Implement the widget**

Create `src/components/project-mocks/doctag/index.tsx`:
```tsx
'use client';

import { useState, type DragEvent, type KeyboardEvent } from 'react';

const AVAILABLE_TAGS = ['Contrato', 'Fatura', 'Relatório'];

type DocumentItem = { id: string; name: string; tag: string };

const INITIAL_DOCUMENTS: DocumentItem[] = [
  { id: 'doc-1', name: 'Proposta — Cliente A.pdf', tag: 'Contrato' },
  { id: 'doc-2', name: 'NF 00231.pdf', tag: 'Fatura' },
  { id: 'doc-3', name: 'Status mensal.pdf', tag: 'Relatório' },
];

export function DoctagMock() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function setTag(id: string, tag: string) {
    setDocuments((current) => current.map((doc) => (doc.id === id ? { ...doc, tag } : doc)));
  }

  function cycleTag(id: string, direction: 1 | -1) {
    setDocuments((current) =>
      current.map((doc) => {
        if (doc.id !== id) return doc;
        const index = AVAILABLE_TAGS.indexOf(doc.tag);
        const nextIndex = (index + direction + AVAILABLE_TAGS.length) % AVAILABLE_TAGS.length;
        return { ...doc, tag: AVAILABLE_TAGS[nextIndex] };
      }),
    );
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>, targetId: string) {
    event.preventDefault();
    if (draggedId && draggedId !== targetId) {
      const draggedDoc = documents.find((doc) => doc.id === draggedId);
      if (draggedDoc) setTag(targetId, draggedDoc.tag);
    }
    setDraggedId(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, id: string) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      cycleTag(id, 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      cycleTag(id, -1);
    }
  }

  return (
    <div className="rounded-md bg-bg-dim p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-wide text-fg-muted">
        Doctag — arraste a tag de um documento sobre outro, ou foque nela e use ← → para trocar
      </p>
      <ul className="flex flex-col gap-2">
        {documents.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between gap-3 rounded bg-bg px-3 py-2">
            <span className="text-xs text-fg">{doc.name}</span>
            <button
              type="button"
              draggable
              onDragStart={() => setDraggedId(doc.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, doc.id)}
              onKeyDown={(event) => handleKeyDown(event, doc.id)}
              aria-label={`Tag de ${doc.name}: ${doc.tag}. Use as setas para mudar.`}
              className="cursor-grab rounded bg-lime-soft px-2.5 py-1 font-mono text-[11px] text-lime-deep active:cursor-grabbing motion-safe:transition-transform motion-safe:active:scale-95"
            >
              {doc.tag}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/project-mocks/doctag/index.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/project-mocks/doctag
git commit -m "Add Doctag mock widget (drag-or-keyboard tag retagging)"
```

---

## Task 25: GraphIt mock widget (draw a node)

**Files:**
- Create: `src/components/project-mocks/graphit/index.tsx`
- Test: `src/components/project-mocks/graphit/index.test.tsx`

**Interfaces:**
- Produces: `<GraphItMock />` — a self-contained, fictional-data widget illustrating "place a node on a canvas," with a keyboard-accessible button as the non-pointer path. Exported as the named export `GraphItMock`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/project-mocks/graphit/index.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphItMock } from './index';

describe('GraphItMock', () => {
  it('starts with no nodes', () => {
    render(<GraphItMock />);
    expect(screen.getByText('0 nó(s) no grafo.')).toBeInTheDocument();
  });

  it('adds a node when the canvas is clicked', async () => {
    const user = userEvent.setup();
    render(<GraphItMock />);
    await user.click(screen.getByRole('application', { name: 'Área de desenho do grafo' }));
    expect(screen.getByText('1 nó(s) no grafo.')).toBeInTheDocument();
  });

  it('adds a node via the keyboard-accessible button', async () => {
    const user = userEvent.setup();
    render(<GraphItMock />);
    await user.click(screen.getByRole('button', { name: '+ Adicionar nó (teclado)' }));
    expect(screen.getByText('1 nó(s) no grafo.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/project-mocks/graphit/index.test.tsx`
Expected: FAIL with "Cannot find module './index'".

- [ ] **Step 3: Implement the widget**

Create `src/components/project-mocks/graphit/index.tsx`:
```tsx
'use client';

import { useState, type MouseEvent } from 'react';

type Node = { id: number; x: number; y: number };

export function GraphItMock() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [nextId, setNextId] = useState(1);

  function addNodeAt(x: number, y: number) {
    setNodes((current) => [...current, { id: nextId, x, y }]);
    setNextId((id) => id + 1);
  }

  function handleCanvasClick(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    addNodeAt(event.clientX - rect.left, event.clientY - rect.top);
  }

  function handleAddViaKeyboard() {
    const offset = (nodes.length % 5) * 40;
    addNodeAt(40 + offset, 40 + offset);
  }

  return (
    <div className="rounded-md bg-bg-dim p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-wide text-fg-muted">
          GraphIt — clique na área para desenhar um nó
        </p>
        <button
          type="button"
          onClick={handleAddViaKeyboard}
          className="rounded bg-lime-soft px-2.5 py-1 font-mono text-[10px] text-lime-deep motion-safe:transition-transform motion-safe:active:scale-95"
        >
          + Adicionar nó (teclado)
        </button>
      </div>
      <div
        role="application"
        aria-label="Área de desenho do grafo"
        onClick={handleCanvasClick}
        className="relative h-48 w-full cursor-crosshair rounded bg-bg"
      >
        {nodes.map((node) => (
          <span
            key={node.id}
            aria-hidden="true"
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime motion-safe:transition-transform"
            style={{ left: node.x, top: node.y }}
          />
        ))}
        <span className="sr-only">{nodes.length} nó(s) no grafo.</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/project-mocks/graphit/index.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/project-mocks/graphit
git commit -m "Add GraphIt mock widget (draw a node)"
```

---

## Task 26: Mock registry with `next/dynamic` lazy loading

**Files:**
- Create: `src/components/project-mocks/registry.tsx`
- Test: `src/components/project-mocks/registry.test.tsx`

**Interfaces:**
- Consumes: `DoctagMock` (Task 24), `GraphItMock` (Task 25).
- Produces: `getMockComponent(key: string): ComponentType | undefined`, resolved by `Project.demo.component` — used by `DemoSlot` in Task 27. Each entry is `next/dynamic`'d with `ssr: false`, so a mock's JS only loads on the project page that actually renders it.

- [ ] **Step 1: Write the failing tests**

Create `src/components/project-mocks/registry.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { getMockComponent } from './registry';

describe('getMockComponent', () => {
  it('resolves the doctag and graphit keys', () => {
    expect(getMockComponent('doctag')).toBeDefined();
    expect(getMockComponent('graphit')).toBeDefined();
  });

  it('returns undefined for an unregistered key', () => {
    expect(getMockComponent('not-a-real-mock')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/project-mocks/registry.test.tsx`
Expected: FAIL with "Cannot find module './registry'".

- [ ] **Step 3: Implement the registry**

Create `src/components/project-mocks/registry.tsx`:
```tsx
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

function LoadingPlaceholder() {
  return (
    <div className="flex h-48 items-center justify-center rounded-md bg-bg-dim font-mono text-xs text-fg-muted">
      carregando demo…
    </div>
  );
}

const MOCK_REGISTRY: Record<string, ComponentType> = {
  doctag: dynamic(() => import('./doctag').then((mod) => mod.DoctagMock), {
    ssr: false,
    loading: LoadingPlaceholder,
  }),
  graphit: dynamic(() => import('./graphit').then((mod) => mod.GraphItMock), {
    ssr: false,
    loading: LoadingPlaceholder,
  }),
};

export function getMockComponent(key: string): ComponentType | undefined {
  return MOCK_REGISTRY[key];
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/project-mocks/registry.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/project-mocks/registry.tsx src/components/project-mocks/registry.test.tsx
git commit -m "Add lazy-loaded mock-widget registry"
```

---

## Task 27: `ProjectHeader` and `DemoSlot`

**Files:**
- Create: `src/components/project-detail/project-header.tsx`
- Test: `src/components/project-detail/project-header.test.tsx`
- Create: `src/components/project-detail/demo-slot.tsx`
- Test: `src/components/project-detail/demo-slot.test.tsx`

**Interfaces:**
- Consumes: `Project` type (Task 4), `getMockComponent` (Task 26).
- Produces: `<ProjectHeader project={project} />` (title, tags, GitHub/live links); `<DemoSlot demo={project.demo} />` (renders the right element for `mock`/`video`/`gif`/`none`) — both composed into the project detail page in Task 28.

- [ ] **Step 1: Write the failing ProjectHeader tests**

Create `src/components/project-detail/project-header.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectHeader } from './project-header';
import type { Project } from '@/content/types';

const project: Project = {
  slug: 'doctag',
  title: 'Doctag',
  oneLiner: 'App desktop de tagging de documentos.',
  tags: ['Electron', 'React'],
  role: 'Criador',
  narrative: [],
  demoIndex: 0,
  demo: { type: 'none' },
  links: { github: 'https://github.com/placeholder/doctag' },
};

describe('ProjectHeader', () => {
  it('renders the title and tags', () => {
    render(<ProjectHeader project={project} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Doctag' })).toBeInTheDocument();
    expect(screen.getByText('Electron')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders a GitHub link when present', () => {
    render(<ProjectHeader project={project} />);
    expect(screen.getByRole('link', { name: /repositório/i })).toHaveAttribute(
      'href',
      project.links!.github,
    );
  });

  it('renders no links section when links is undefined', () => {
    render(<ProjectHeader project={{ ...project, links: undefined }} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/project-detail/project-header.test.tsx`
Expected: FAIL with "Cannot find module './project-header'".

- [ ] **Step 3: Implement ProjectHeader**

Create `src/components/project-detail/project-header.tsx`:
```tsx
import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/content/types';

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-fg">{project.title}</h1>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded bg-lime-soft px-2.5 py-1 text-[10px] text-lime-deep">
            {tag}
          </span>
        ))}
      </div>
      {project.links && (
        <div className="mt-3 flex gap-4 text-sm text-fg-muted">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-lime-deep dark:hover:text-lime-bright"
            >
              <Github size={14} aria-hidden="true" /> Repositório
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-lime-deep dark:hover:text-lime-bright"
            >
              <ExternalLink size={14} aria-hidden="true" /> Live demo
            </a>
          )}
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/components/project-detail/project-header.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the failing DemoSlot tests**

Create `src/components/project-detail/demo-slot.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DemoSlot } from './demo-slot';

describe('DemoSlot', () => {
  it('renders nothing for demo.type "none"', () => {
    const { container } = render(<DemoSlot demo={{ type: 'none' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a video element for demo.type "video"', () => {
    render(<DemoSlot demo={{ type: 'video', src: '/videos/x.mp4' }} />);
    expect(document.querySelector('video source')).toHaveAttribute('src', '/videos/x.mp4');
  });

  it('renders an img element for demo.type "gif"', () => {
    render(<DemoSlot demo={{ type: 'gif', src: '/gifs/x.gif' }} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/gifs/x.gif');
  });

  it('renders nothing for an unregistered mock key', () => {
    const { container } = render(<DemoSlot demo={{ type: 'mock', component: 'not-real' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the registered mock component for demo.type "mock"', async () => {
    render(<DemoSlot demo={{ type: 'mock', component: 'doctag' }} />);
    expect(await screen.findByText(/Doctag —/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npx vitest run src/components/project-detail/demo-slot.test.tsx`
Expected: FAIL with "Cannot find module './demo-slot'".

- [ ] **Step 7: Implement DemoSlot**

Create `src/components/project-detail/demo-slot.tsx`:
```tsx
import type { Project } from '@/content/types';
import { getMockComponent } from '@/components/project-mocks/registry';

export function DemoSlot({ demo }: { demo: Project['demo'] }) {
  if (demo.type === 'none') return null;

  if (demo.type === 'mock') {
    const MockComponent = getMockComponent(demo.component);
    return MockComponent ? <MockComponent /> : null;
  }

  if (demo.type === 'video') {
    return (
      <video controls className="w-full rounded-md bg-bg-dim">
        <source src={demo.src} />
      </video>
    );
  }

  return <img src={demo.src} alt="" className="w-full rounded-md" />;
}
```

- [ ] **Step 8: Run it to verify it passes**

Run: `npx vitest run src/components/project-detail/demo-slot.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 9: Commit**

```bash
git add src/components/project-detail/project-header.tsx src/components/project-detail/project-header.test.tsx src/components/project-detail/demo-slot.tsx src/components/project-detail/demo-slot.test.tsx
git commit -m "Add ProjectHeader and DemoSlot"
```

---

## Task 28: `/projetos/[slug]` page

**Files:**
- Create: `src/app/projetos/[slug]/page.tsx`
- Test: `src/app/projetos/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `getProjectBySlug` (Task 6), `splitNarrativeAtDemoIndex` (Task 23), `ProjectHeader` + `DemoSlot` (Task 27), `projects` data (Task 5).
- Produces: the `/projetos/[slug]` route — header, narrative paragraphs before `demoIndex`, the demo slot, then the remaining paragraphs. Unknown slugs call `notFound()`.

- [ ] **Step 1: Write the failing tests**

Create `src/app/projetos/[slug]/page.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

import ProjectPage, { generateStaticParams } from './page';

describe('generateStaticParams', () => {
  it('generates a param entry for every project', () => {
    expect(generateStaticParams()).toEqual([
      { slug: 'doctag' },
      { slug: 'graphit' },
      { slug: 'hcp-app' },
    ]);
  });
});

describe('ProjectPage', () => {
  it('renders the header and narrative for a known slug', async () => {
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'doctag' }) });
    render(jsx);
    expect(screen.getByRole('heading', { level: 1, name: 'Doctag' })).toBeInTheDocument();
  });

  it('renders narrative paragraphs before the demo when demoIndex is 0', async () => {
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'doctag' }) });
    const { container } = render(jsx);
    const paragraphs = Array.from(container.querySelectorAll('p')).map((p) => p.textContent);
    expect(paragraphs[0]).toMatch(/^\[placeholder\] Doctag é um app desktop/);
  });

  it('calls notFound for an unknown slug', async () => {
    await expect(ProjectPage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run "src/app/projetos/[slug]/page.test.tsx"`
Expected: FAIL with "Cannot find module './page'".

- [ ] **Step 3: Implement the page**

Create `src/app/projetos/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { projects } from '@/content/projects';
import { getProjectBySlug } from '@/lib/projects';
import { splitNarrativeAtDemoIndex } from '@/lib/narrative';
import { ProjectHeader } from '@/components/project-detail/project-header';
import { DemoSlot } from '@/components/project-detail/demo-slot';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { before, after } = splitNarrativeAtDemoIndex(project.narrative, project.demoIndex);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <ProjectHeader project={project} />
      {before.map((paragraph, index) => (
        <p key={index} className="mb-4 text-sm text-fg-muted">
          {paragraph}
        </p>
      ))}
      <div className="mb-4">
        <DemoSlot demo={project.demo} />
      </div>
      {after.map((paragraph, index) => (
        <p key={index} className="mb-4 text-sm text-fg-muted">
          {paragraph}
        </p>
      ))}
    </main>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run "src/app/projetos/[slug]/page.test.tsx"`
Expected: PASS (4 tests).

- [ ] **Step 5: Run the whole suite and build**

Run: `npm test && npm run build`
Expected: all PASS, build succeeds, and `/projetos/doctag`, `/projetos/graphit`, `/projetos/hcp-app` are statically generated.

- [ ] **Step 6: Commit**

```bash
git add "src/app/projetos"
git commit -m "Add project detail page with configurable demo position"
```

---

## Task 29: README + final verification pass

**Files:**
- Modify: `README.md`

**Interfaces:**
- No new code interfaces — this task documents the project and manually verifies the non-functional requirements that aren't covered by unit tests (visual theming, keyboard flows end-to-end, `prefers-reduced-motion`, responsive breakpoints).

- [ ] **Step 1: Replace the generated README**

Replace the contents of `README.md` (the one `create-next-app` generated in Task 1) with:
```markdown
# Vinicius Matsuoka — Portfolio

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4. Single-scroll home (`/`) plus one case-study page per project (`/projetos/[slug]`). Content lives in `src/content/` as typed placeholder data — see `docs/superpowers/specs/2026-06-20-portfolio-rebuild-design.md` for the full design spec.

## Develop

```bash
npm install
npm run dev
```

## Test

```bash
npm test        # run once
npm run test:watch
```

## Build

```bash
npm run build
```
```

- [ ] **Step 2: Run the full automated suite one more time**

Run: `npm test`
Expected: every test file from Tasks 1–28 passes.

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: build succeeds, and the build output lists `/projetos/doctag`, `/projetos/graphit`, `/projetos/hcp-app` as statically generated routes (○ or ● markers in the Next.js build summary).

- [ ] **Step 4: Manually verify keyboard and motion behavior in the browser**

Run: `npm run dev`, open `http://localhost:3000`, and check each item by hand (none of these are covered by the jsdom-based test suite):
- Tab through the Header: logo → nav links → theme toggle → language placeholder → mobile menu button (hidden width permitting). The active nav link underline updates while scrolling.
- Tab into an Experience entry's project chip, press Enter — the popover opens and persists; press Escape — it closes and focus stays on the chip.
- Click a personal project's preview card in the Projects column — navigates to `/projetos/<slug>`.
- On `/projetos/doctag`, Tab to a tag button and use ArrowLeft/ArrowRight — the tag cycles without a mouse.
- On `/projetos/graphit`, Tab to "+ Adicionar nó (teclado)" and press Enter repeatedly — nodes appear without a mouse.
- In OS/browser settings, enable "reduce motion," reload, and confirm the chip press-scale and node-placement transition no longer animate (DESIGN.md's `prefers-reduced-motion` requirement).
- Resize below Tailwind's `lg` breakpoint — the Projects/Skills/Formação grid collapses to one column, and below `sm` the desktop nav hides in favor of the hamburger menu.
- Toggle the theme button — background/text/lime tokens swap and the choice survives a reload (`localStorage`).

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "Add project README"
```

---
