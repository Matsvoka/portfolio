# Projects Section List Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page's stacked, individually-shadowed `ProjectPreviewCard` list with a single bordered container of project rows (logo + title/CTA + video + description + tags), separated by simple dividers, matching the Skills section's container pattern.

**Architecture:** Extract the existing tag-fit/overflow row out of `ProjectPreviewCard` into a standalone `ProjectTagRow` component (reused by both the untouched popover card and the new row). Build a new `ProjectListItem` component for the home page's per-project row. Update `ProjectsSection` to wrap `ProjectListItem`s in one bordered `<ul>` with `border-b` separators between `<li>`s, matching `SkillsSection`'s container styling.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, Vitest + Testing Library.

## Global Constraints

- `ProjectPreviewPopover` (`src/components/project-preview/project-preview-popover.tsx`) renders `ProjectPreviewCard` directly with `elevated={false}` for the Experience section's hover/tap preview — its appearance and behavior must not change.
- No changes to `src/content/projects.ts` or `src/content/types.ts` — same `Project` fields, laid out differently.
- No changes to `src/app/projetos/[slug]/page.tsx` (project detail page).
- Container styling must match `SkillsSection`'s existing container exactly: `rounded-sm border border-fg/10 bg-bg p-4` on the wrapper, `border-b border-fg/10 py-4 first:pt-0 last:border-b-0 last:pb-0` on each item.
- New row's title uses the `ui-text-entry-title` token (not `ui-text-preview-title`); its description uses `ui-text-description` (not `ui-text-meta`) — both to match Experience/Education/Skills row sizing, per the design spec.
- Run `npx vitest run <file>` after each test-touching step; run the full `npx vitest run` before the final commit of each task.

---

## Task 1: Extract `ProjectTagRow` from `ProjectPreviewCard`

**Files:**
- Create: `src/components/project-preview/project-tag-row.tsx`
- Create: `src/components/project-preview/project-tag-row.test.tsx`
- Modify: `src/components/project-preview/project-preview-card.tsx`
- Modify: `src/components/project-preview/project-preview-card.test.tsx`

**Interfaces:**
- Produces: `ProjectTagRow({ tags: string[] }): JSX.Element` — renders the visible tag row (`data-testid="tag-row"`) plus a hidden measurement mirror row, using the existing `useTagFit` hook from `./use-tag-fit`. No tag is shown until its fit is measured (no guessed minimum).
- Consumes (existing, unchanged): `useTagFit(tags: string[])` from `src/components/project-preview/use-tag-fit.ts`, returning `{ rowRef, mirrorRef, fit: { visibleCount, overflowCount } }`.

- [ ] **Step 1: Write the new `ProjectTagRow` test file (will fail — component doesn't exist yet)**

Create `src/components/project-preview/project-tag-row.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ProjectTagRow } from './project-tag-row';

/**
 * Mocks real layout so `useTagFit`'s width measurement produces a
 * deterministic result in jsdom (which has no real layout engine).
 * `widthsByText` is keyed by each mirror block's full textContent (dot +
 * icon + label concatenated, as the DOM actually produces it).
 */
function mockTagLayout(widthsByText: Record<string, number>, availableWidth: number, gap = 6) {
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalOffsetLeft = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetLeft');
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return widthsByText[this.textContent ?? ''] ?? 0;
    },
  });

  Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
    configurable: true,
    get(this: HTMLElement) {
      if (this.parentElement?.getAttribute('aria-hidden') !== 'true') return 0;
      const siblings = Array.from(this.parentElement.children);
      const index = siblings.indexOf(this);
      return siblings
        .slice(0, index)
        .reduce((sum, sibling) => sum + (sibling as HTMLElement).offsetWidth + gap, 0);
    },
  });

  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() {
      return availableWidth;
    },
  });

  return function restore() {
    if (originalOffsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    if (originalOffsetLeft) Object.defineProperty(HTMLElement.prototype, 'offsetLeft', originalOffsetLeft);
    if (originalClientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
  };
}

describe('ProjectTagRow', () => {
  it('shows no tags and no badge while layout cannot be measured yet (no guessed minimum)', () => {
    render(<ProjectTagRow tags={['Electron', 'React', 'PostgreSQL', 'Docker']} />);
    const tagRow = within(screen.getByTestId('tag-row'));
    expect(tagRow.queryByText('Electron')).not.toBeInTheDocument();
    expect(tagRow.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it('shows every tag once measured, when they all fit', () => {
    const restore = mockTagLayout(
      { Electron: 60, '·React': 50, '·PostgreSQL': 80, '·Docker': 60 },
      400,
    );
    try {
      render(<ProjectTagRow tags={['Electron', 'React', 'PostgreSQL', 'Docker']} />);
      const tagRow = within(screen.getByTestId('tag-row'));
      expect(tagRow.getByText('Electron')).toBeInTheDocument();
      expect(tagRow.getByText('React')).toBeInTheDocument();
      expect(tagRow.getByText('PostgreSQL')).toBeInTheDocument();
      expect(tagRow.getByText('Docker')).toBeInTheDocument();
      expect(tagRow.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it('hides a tag that would overflow the row width, even when only two tags are set', () => {
    const restore = mockTagLayout(
      { 'Google Apps Script': 140, '·Google Sheets': 110, '·+2': 24 },
      200,
    );
    try {
      render(<ProjectTagRow tags={['Google Apps Script', 'Google Sheets']} />);
      const tagRow = within(screen.getByTestId('tag-row'));
      expect(tagRow.getByText('Google Apps Script')).toBeInTheDocument();
      expect(tagRow.queryByText('Google Sheets')).not.toBeInTheDocument();
      expect(tagRow.getByText('+1')).toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it('hides every tag — with no minimum kept visible — when even one tag plus the badge cannot fit', () => {
    const restore = mockTagLayout(
      { 'Google Apps Script': 140, '·Google Sheets': 110, '·+2': 24 },
      40,
    );
    try {
      render(<ProjectTagRow tags={['Google Apps Script', 'Google Sheets']} />);
      const tagRow = within(screen.getByTestId('tag-row'));
      expect(tagRow.queryByText('Google Apps Script')).not.toBeInTheDocument();
      expect(tagRow.queryByText('Google Sheets')).not.toBeInTheDocument();
      expect(tagRow.getByText('+2')).toBeInTheDocument();
    } finally {
      restore();
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/project-preview/project-tag-row.test.tsx`
Expected: FAIL — `Failed to resolve import "./project-tag-row"` (module doesn't exist yet).

- [ ] **Step 3: Create `ProjectTagRow`**

Create `src/components/project-preview/project-tag-row.tsx`:

```tsx
'use client';

import { Code2 } from 'lucide-react';
import { useTagFit } from './use-tag-fit';

function TagBlock({ tag, showDot }: { tag: string; showDot: boolean }) {
  return (
    <span className="flex items-center gap-1">
      {showDot && <span className="text-fg-muted">·</span>}
      <Code2 className="ui-icon-tag" aria-hidden="true" />
      <span>{tag}</span>
    </span>
  );
}

function OverflowBadge({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-fg-muted">·</span>
      <span className="text-fg-muted">+{count}</span>
    </span>
  );
}

export function ProjectTagRow({ tags }: { tags: string[] }) {
  const { rowRef, mirrorRef, fit } = useTagFit(tags);
  const visible = tags.slice(0, fit.visibleCount);
  const overflowCount = fit.overflowCount;

  return (
    <>
      <div
        ref={rowRef}
        data-testid="tag-row"
        className="ui-preview-tag-row ui-text-label mt-2 flex items-center whitespace-nowrap font-mono text-lime-deep dark:text-lime-bright"
      >
        {visible.map((tag, index) => (
          <TagBlock key={tag} tag={tag} showDot={index > 0} />
        ))}
        {overflowCount > 0 && <OverflowBadge count={overflowCount} />}
      </div>
      <div
        ref={mirrorRef}
        aria-hidden="true"
        className="ui-preview-tag-row ui-text-label flex h-0 items-center overflow-hidden whitespace-nowrap font-mono"
      >
        {tags.map((tag, index) => (
          <TagBlock key={tag} tag={tag} showDot={index > 0} />
        ))}
        <OverflowBadge count={tags.length} />
      </div>
    </>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/project-preview/project-tag-row.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Update `ProjectPreviewCard` to use `ProjectTagRow`, and trim its test file's now-duplicated fit tests**

Replace the full contents of `src/components/project-preview/project-preview-card.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/content/types';
import { ProjectTagRow } from './project-tag-row';

export function ProjectPreviewCard({
  project,
  elevated = true,
}: {
  project: Project;
  elevated?: boolean;
}) {
  return (
    <article
      data-testid="project-preview-card"
      className={`ui-preview-card w-full rounded-lg bg-bg ${
        elevated
          ? '[filter:drop-shadow(0_3px_10px_rgba(18,21,15,0.22))] dark:[filter:drop-shadow(0_3px_10px_rgba(0,0,0,0.45))]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="ui-text-preview-title font-bold text-fg">{project.title}</span>
        <Link
          href={`/projetos/${project.slug}`}
          aria-label={`Ver detalhes do projeto ${project.title}`}
          className="ui-text-meta inline-flex shrink-0 cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 font-semibold text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-90 dark:hover:text-lime-bright"
        >
          <span>Ver</span>
          <ArrowRight className="ui-icon-inline" aria-hidden="true" />
        </Link>
      </div>
      <video
        aria-label={`Preview em vídeo do projeto ${project.title}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="ui-preview-video mt-2 w-full rounded-md bg-bg-dim object-cover"
      >
        <source src={project.previewVideo} type="video/mp4" />
      </video>
      <p className="ui-text-meta mt-2 leading-snug text-fg-muted">{project.oneLiner}</p>
      <ProjectTagRow tags={project.tags} />
    </article>
  );
}
```

Replace the full contents of `src/components/project-preview/project-preview-card.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ProjectPreviewCard } from './project-preview-card';
import type { Project } from '@/content/types';

const project: Project = {
  slug: 'doctag',
  title: 'Doctag',
  oneLiner: 'App desktop de tagging de documentos.',
  tags: ['Electron', 'React', 'PostgreSQL', 'Docker'],
  role: 'Criador',
  previewVideo: '/videos/doctag-preview.mp4',
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

  it('links to the project detail page only through the Ver control', () => {
    render(<ProjectPreviewCard project={project} />);
    const link = screen.getByRole('link', { name: 'Ver detalhes do projeto Doctag' });

    expect(screen.getByTestId('project-preview-card').tagName).toBe('ARTICLE');
    expect(link).toHaveAttribute('href', '/projetos/doctag');
    expect(link).toHaveTextContent('Ver');
    expect(link).toHaveClass('active:scale-90');
  });

  it('renders its tags through the shared tag row, with no guessed minimum before measurement', () => {
    render(<ProjectPreviewCard project={project} />);
    const tagRow = within(screen.getByTestId('tag-row'));
    expect(tagRow.queryByText('Electron')).not.toBeInTheDocument();
    expect(tagRow.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it('always renders the dedicated preview video, independently of the detail demo', () => {
    const { container } = render(<ProjectPreviewCard project={project} />);
    const video = screen.getByLabelText('Preview em vídeo do projeto Doctag');
    const source = container.querySelector('video source');

    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
    expect(source).toHaveAttribute('src', project.previewVideo);
    expect(project.demo.type).toBe('mock');
  });

  it('applies its own elevation shadow by default', () => {
    render(<ProjectPreviewCard project={project} />);
    expect(screen.getByTestId('project-preview-card').className).toContain('drop-shadow');
  });

  it('omits its own shadow when elevated=false (popover supplies one shadow for card+tail)', () => {
    render(<ProjectPreviewCard project={project} elevated={false} />);
    expect(screen.getByTestId('project-preview-card').className).not.toContain('drop-shadow');
  });
});
```

- [ ] **Step 6: Run both test files to verify they pass**

Run: `npx vitest run src/components/project-preview/project-tag-row.test.tsx src/components/project-preview/project-preview-card.test.tsx`
Expected: PASS (4 tests + 6 tests).

- [ ] **Step 7: Commit**

```bash
git add src/components/project-preview/project-tag-row.tsx src/components/project-preview/project-tag-row.test.tsx src/components/project-preview/project-preview-card.tsx src/components/project-preview/project-preview-card.test.tsx
git commit -m "refactor(project-preview): extract ProjectTagRow from ProjectPreviewCard"
```

---

## Task 2: Build `ProjectListItem`

**Files:**
- Create: `src/components/projects/project-list-item.tsx`
- Create: `src/components/projects/project-list-item.test.tsx`

**Interfaces:**
- Consumes: `ProjectTagRow({ tags: string[] })` from Task 1 (`@/components/project-preview/project-tag-row`); `EntryLogoPlaceholder({ label?, variant? })` (existing, `@/components/shared/entry-logo-placeholder`, defaults `label='logo'`, `variant='logo'` → 56×56 box); `Project` type from `@/content/types`.
- Produces: `ProjectListItem({ project: Project }): JSX.Element` — a project row (logo + title/CTA + video + description + tags), for use inside `ProjectsSection` (Task 3).

- [ ] **Step 1: Write the failing test**

Create `src/components/projects/project-list-item.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectListItem } from './project-list-item';
import type { Project } from '@/content/types';

const project: Project = {
  slug: 'doctag',
  title: 'Doctag',
  oneLiner: 'App desktop de tagging de documentos.',
  tags: ['Electron', 'React'],
  role: 'Criador',
  previewVideo: '/videos/doctag-preview.mp4',
  narrative: ['Parágrafo 1.'],
  demoIndex: 0,
  demo: { type: 'mock', component: 'doctag' },
};

describe('ProjectListItem', () => {
  it('renders a logo placeholder', () => {
    render(<ProjectListItem project={project} />);
    expect(screen.getByText('logo')).toBeInTheDocument();
  });

  it('renders the title and one-liner', () => {
    render(<ProjectListItem project={project} />);
    expect(screen.getByText('Doctag')).toBeInTheDocument();
    expect(screen.getByText(project.oneLiner)).toBeInTheDocument();
  });

  it('links to the project detail page through the Ver control', () => {
    render(<ProjectListItem project={project} />);
    const link = screen.getByRole('link', { name: 'Ver detalhes do projeto Doctag' });
    expect(link).toHaveAttribute('href', '/projetos/doctag');
    expect(link).toHaveTextContent('Ver');
  });

  it('renders the dedicated preview video', () => {
    const { container } = render(<ProjectListItem project={project} />);
    const video = screen.getByLabelText('Preview em vídeo do projeto Doctag');
    const source = container.querySelector('video source');

    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
    expect(source).toHaveAttribute('src', project.previewVideo);
  });

  it('renders the tag row for the project tags', () => {
    render(<ProjectListItem project={project} />);
    expect(screen.getByTestId('tag-row')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/projects/project-list-item.test.tsx`
Expected: FAIL — `Failed to resolve import "./project-list-item"` (module doesn't exist yet).

- [ ] **Step 3: Create `ProjectListItem`**

Create `src/components/projects/project-list-item.tsx`:

```tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/content/types';
import { EntryLogoPlaceholder } from '@/components/shared/entry-logo-placeholder';
import { ProjectTagRow } from '@/components/project-preview/project-tag-row';

export function ProjectListItem({ project }: { project: Project }) {
  return (
    <div className="flex gap-3.5">
      <EntryLogoPlaceholder />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="ui-text-entry-title font-bold leading-tight tracking-tight text-fg">
            {project.title}
          </span>
          <Link
            href={`/projetos/${project.slug}`}
            aria-label={`Ver detalhes do projeto ${project.title}`}
            className="ui-text-meta inline-flex shrink-0 cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 font-semibold text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-90 dark:hover:text-lime-bright"
          >
            <span>Ver</span>
            <ArrowRight className="ui-icon-inline" aria-hidden="true" />
          </Link>
        </div>
        <video
          aria-label={`Preview em vídeo do projeto ${project.title}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="ui-preview-video mt-2 w-full rounded-md bg-bg-dim object-cover"
        >
          <source src={project.previewVideo} type="video/mp4" />
        </video>
        <p className="ui-text-description mt-2 text-fg-muted">{project.oneLiner}</p>
        <ProjectTagRow tags={project.tags} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/projects/project-list-item.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/projects/project-list-item.tsx src/components/projects/project-list-item.test.tsx
git commit -m "feat(projects): add ProjectListItem row component"
```

---

## Task 3: Wire `ProjectsSection` into a single bordered list

**Files:**
- Modify: `src/components/projects/projects-section.tsx`
- Modify: `src/components/projects/projects-section.test.tsx`

**Interfaces:**
- Consumes: `ProjectListItem({ project: Project })` from Task 2 (`./project-list-item`); `getPersonalProjects(): Project[]` (existing, `@/lib/projects`, unchanged).

- [ ] **Step 1: Write the updated test (will fail against the current card-stack markup)**

Replace the full contents of `src/components/projects/projects-section.test.tsx`:

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

  it('renders a list item for every personal project and none of the linked ones', () => {
    render(<ProjectsSection />);
    for (const project of getPersonalProjects()) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
    expect(screen.queryByText('HCP App')).not.toBeInTheDocument();
  });

  it('renders one bordered container with a separator between each project item', () => {
    render(<ProjectsSection />);
    const list = screen.getByRole('list');
    const items = screen.getAllByRole('listitem');

    expect(list.className).toContain('border');
    expect(items).toHaveLength(getPersonalProjects().length);
    expect(items[0].className).toContain('first:pt-0');
    expect(items[items.length - 1].className).toContain('last:border-b-0');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/projects/projects-section.test.tsx`
Expected: FAIL — no element with role `list`/`listitem` exists yet (current markup is a `div` of cards, not a `ul`/`li`).

- [ ] **Step 3: Update `ProjectsSection`**

Replace the full contents of `src/components/projects/projects-section.tsx`:

```tsx
import { FolderKanban } from 'lucide-react';
import { SectionTitle } from '@/components/shared/section-title';
import { getPersonalProjects } from '@/lib/projects';
import { ProjectListItem } from './project-list-item';

export function ProjectsSection() {
  const personalProjects = getPersonalProjects();

  return (
    <section id="projetos" className="scroll-mt-16">
      <SectionTitle icon={FolderKanban}>Projetos</SectionTitle>
      <ul className="rounded-sm border border-fg/10 bg-bg p-4">
        {personalProjects.map((project) => (
          <li
            key={project.slug}
            className="border-b border-fg/10 py-4 first:pt-0 last:border-b-0 last:pb-0"
          >
            <ProjectListItem project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/projects/projects-section.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — every test file green, including the untouched `project-preview-popover.test.tsx` (confirms `ProjectPreviewPopover`/`ProjectChip` are unaffected).

- [ ] **Step 6: Commit**

```bash
git add src/components/projects/projects-section.tsx src/components/projects/projects-section.test.tsx
git commit -m "feat(projects): render Projects section as one bordered list"
```

---

## Task 4: Manual verification

**Files:** none (no code changes — this task is a manual check using the `run` skill/pattern for this project).

- [ ] **Step 1: Start the dev server and open the home page**

Use this project's `run` pattern (or `npm run dev`) and open the "Projetos" section. Confirm:
- One bordered container, projects separated by a thin horizontal rule (no per-project shadow).
- Each row shows: 56×56 logo placeholder on the left; title + "Ver" on the same line; video demo below the title row; one-liner description below the video; tags below the description.
- "Ver" navigates to `/projetos/<slug>` as before.
- Check both light and dark theme (theme toggle in the header).
- Check a narrow mobile viewport (e.g. 375px) — the logo + body flex row shouldn't cramp the video or force awkward wrapping.

- [ ] **Step 2: Confirm the Experience section's hover popover is unaffected**

On the Experience section, hover (desktop) or tap (mobile) a project chip. Confirm the popover still shows the original compact shadowed card (unchanged), proving the `ProjectTagRow` extraction didn't alter `ProjectPreviewPopover`'s appearance.

- [ ] **Step 3: Report back**

No commit for this task — it's verification only. If anything looks wrong, fix it in the relevant task's files and re-run that task's tests before re-verifying.
