# Sitewide Size Increase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase typography, icon, chip, and Experience-project-preview-card sizes sitewide by roughly +30%, per the approved design spec, with no behavior changes.

**Architecture:** Pure literal-value edits — Tailwind `text-*`/`text-[Npx]` classes, lucide-react `size={N}` props, and the handful of paddings/gaps/widths sized tightly around their own text/icon content. No new components, no new logic, no new abstractions.

**Tech Stack:** Next.js (App Router), React, Tailwind CSS v4, lucide-react, Vitest + React Testing Library.

## Global Constraints

- Spec source of truth: `docs/superpowers/specs/2026-06-22-sitewide-size-increase-design.md` — every value below is copied verbatim from its tables. If a number here ever disagrees with that file, the spec wins; stop and reconcile rather than guessing.
- No new tests are written for these changes — there is no new behavior to assert. Each task's verification step is a **regression check**: run the affected component's existing test file (and fix any assertion that hardcodes an old size class, per the two known cases below) to confirm nothing else broke.
- Out of scope, do not touch: `src/components/shared/entry-logo-placeholder.tsx` (the logo/flag placeholder and its 9px/7px labels), the Experience timeline dot/connector (`after:` pseudo-element widths in `experience-entry-row.tsx`), and `src/components/project-preview/use-tag-fit.ts` / `tag-overflow.ts` (the tag-overflow measurement logic — only the card's own dimensions change in Task 9).
- Two existing test files hardcode pre-change class strings and must be updated as part of their task: `src/components/education/education-section.test.tsx` (Task 6) and `src/components/skills/skills-section.test.tsx` (Task 8). A repo-wide search already confirmed no other test file asserts on a class or icon size this plan changes (see Task 13 for the final confirmation run).
- Commit after every task. Use `git add <files touched in this task>` (never `git add -A`).

---

### Task 1: Shared — `SectionTitle` heading and icon

**Files:**
- Modify: `src/components/shared/section-title.tsx:6,11`

**Interfaces:** n/a (presentational-only change; no new props or exports).

- [ ] **Step 1: Bump the heading and icon size**

In `src/components/shared/section-title.tsx`, change:

```tsx
    <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-fg">
      <span
        aria-hidden="true"
        className="flex shrink-0 items-center justify-center text-lime-deep dark:text-lime-bright"
      >
        <Icon size={24} strokeWidth={2.25} />
      </span>
```

to:

```tsx
    <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-fg">
      <span
        aria-hidden="true"
        className="flex shrink-0 items-center justify-center text-lime-deep dark:text-lime-bright"
      >
        <Icon size={31} strokeWidth={2.25} />
      </span>
```

- [ ] **Step 2: Run the component's test**

Run: `npx vitest run src/components/shared/section-title.test.tsx`
Expected: PASS (this test only checks the heading role and icon color classes, not size — see Tasks 6 and 8 for the two tests that *do* assert on the size this change produces downstream).

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/section-title.tsx
git commit -m "feat: increase section title heading and icon size"
```

---

### Task 2: Header, mobile nav, and theme toggle

**Files:**
- Modify: `src/components/layout/header.tsx:39,58`
- Modify: `src/components/layout/mobile-nav.tsx:21,27`
- Modify: `src/components/theme/theme-toggle.tsx:18`

**Interfaces:** n/a (presentational-only change).

- [ ] **Step 1: Bump header nav text and the language badge**

In `src/components/layout/header.tsx`, change:

```tsx
        <nav aria-label="Navegação principal" className="hidden gap-4 text-sm sm:flex">
```

to:

```tsx
        <nav aria-label="Navegação principal" className="hidden gap-4 text-base sm:flex">
```

and change:

```tsx
            className="rounded border border-fg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted"
```

to:

```tsx
            className="rounded border border-fg-muted px-1.5 py-0.5 font-mono text-sm text-fg-muted"
```

- [ ] **Step 2: Bump mobile nav icon and text**

In `src/components/layout/mobile-nav.tsx`, change:

```tsx
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
```

to:

```tsx
        {open ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
```

and change:

```tsx
          className="absolute left-0 top-full flex w-full flex-col gap-1 border-b border-bg-dim bg-bg px-4 py-3 text-sm"
```

to:

```tsx
          className="absolute left-0 top-full flex w-full flex-col gap-1 border-b border-bg-dim bg-bg px-4 py-3 text-base"
```

- [ ] **Step 3: Bump the theme toggle icon**

In `src/components/theme/theme-toggle.tsx`, change:

```tsx
      {isDark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
```

to:

```tsx
      {isDark ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
```

- [ ] **Step 4: Run the affected tests**

Run: `npx vitest run src/components/layout/header.test.tsx src/components/layout/mobile-nav.test.tsx src/components/theme/theme-toggle.test.tsx`
Expected: PASS (none of these assert on the text/icon size classes touched here).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/header.tsx src/components/layout/mobile-nav.tsx src/components/theme/theme-toggle.tsx
git commit -m "feat: increase header, mobile nav, and theme toggle sizes"
```

---

### Task 3: Hero

**Files:**
- Modify: `src/components/hero/hero.tsx:9,14,15,24,33,42`

**Interfaces:** n/a (presentational-only change).

- [ ] **Step 1: Bump the placeholder label, name, role, and social icons**

In `src/components/hero/hero.tsx`, change:

```tsx
        className="flex h-[200px] w-[200px] items-center justify-center rounded-full border-4 border-lime bg-bg-dim font-mono text-xs text-fg-muted"
```

to:

```tsx
        className="flex h-[200px] w-[200px] items-center justify-center rounded-full border-4 border-lime bg-bg-dim font-mono text-sm text-fg-muted"
```

change:

```tsx
      <h1 className="mt-9 text-4xl font-black tracking-tight text-fg">{profile.name}</h1>
      <p className="mt-1.5 font-mono text-sm uppercase tracking-wide text-lime-deep dark:text-lime-bright">
```

to:

```tsx
      <h1 className="mt-9 text-5xl font-black tracking-tight text-fg">{profile.name}</h1>
      <p className="mt-1.5 font-mono text-base uppercase tracking-wide text-lime-deep dark:text-lime-bright">
```

and change all three social icon sizes:

```tsx
          <Mail size={18} aria-hidden="true" />
```
```tsx
          <GithubIcon size={18} />
```
```tsx
          <LinkedinIcon size={18} />
```

to:

```tsx
          <Mail size={23} aria-hidden="true" />
```
```tsx
          <GithubIcon size={23} />
```
```tsx
          <LinkedinIcon size={23} />
```

- [ ] **Step 2: Run the component's test**

Run: `npx vitest run src/components/hero/hero.test.tsx`
Expected: PASS (asserts the heading and links exist by accessible name/href, not by size class).

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/hero.tsx
git commit -m "feat: increase hero name, role, and social icon sizes"
```

---

### Task 4: About

**Files:**
- Modify: `src/components/about/about-section.tsx:10`

**Interfaces:** n/a (presentational-only change).

- [ ] **Step 1: Bump the body copy size**

In `src/components/about/about-section.tsx`, change:

```tsx
        <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-fg-muted">
```

to:

```tsx
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-fg-muted">
```

- [ ] **Step 2: Run the component's test**

Run: `npx vitest run src/components/about/about-section.test.tsx`
Expected: PASS (asserts section/container classes unrelated to text size, and paragraph text content).

- [ ] **Step 3: Commit**

```bash
git add src/components/about/about-section.tsx
git commit -m "feat: increase about section body text size"
```

---

### Task 5: Experience — entry row and project chip

**Files:**
- Modify: `src/components/experience/experience-entry-row.tsx:18,24,25,28,31`
- Modify: `src/components/experience/project-chip.tsx:11`

**Interfaces:** n/a (presentational-only change).

- [ ] **Step 1: Bump role, company, period, description, and the "Projetos" label**

In `src/components/experience/experience-entry-row.tsx`, change:

```tsx
          <p
            className={`text-[17px] font-bold leading-tight tracking-tight ${
              entry.current ? 'text-lime-deep dark:text-lime-bright' : 'text-fg'
            }`}
          >
            {entry.role}
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-tight text-fg-muted">{entry.company}</p>
          <p className="mt-0.5 font-mono text-[11px] leading-tight text-fg-muted">{entry.period}</p>
```

to:

```tsx
          <p
            className={`text-[22px] font-bold leading-tight tracking-tight ${
              entry.current ? 'text-lime-deep dark:text-lime-bright' : 'text-fg'
            }`}
          >
            {entry.role}
          </p>
          <p className="mt-0.5 text-base font-semibold leading-tight text-fg-muted">{entry.company}</p>
          <p className="mt-0.5 font-mono text-sm leading-tight text-fg-muted">{entry.period}</p>
```

and change:

```tsx
      <p className="ml-[70px] mt-2 text-[12px] text-fg-muted">{entry.description}</p>
      {entry.projectSlugs && entry.projectSlugs.length > 0 && (
        <div className="ml-[70px] mt-2">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-fg-muted">
```

to:

```tsx
      <p className="ml-[70px] mt-2 text-base text-fg-muted">{entry.description}</p>
      {entry.projectSlugs && entry.projectSlugs.length > 0 && (
        <div className="ml-[70px] mt-2">
          <p className="mb-1.5 font-mono text-[13px] uppercase tracking-wide text-fg-muted">
```

- [ ] **Step 2: Bump the project chip text and padding**

In `src/components/experience/project-chip.tsx`, change:

```tsx
      triggerClassName="cursor-pointer rounded bg-lime-bright px-2.5 py-1 text-[11px] text-ink transition-[color,background-color,transform] duration-150 hover:bg-lime active:scale-90 active:bg-lime-deep active:text-bone data-[preview-active=true]:bg-lime data-[pinned=true]:bg-lime data-[pinned=true]:text-ink data-[pinned=true]:hover:bg-lime sm:cursor-default sm:active:scale-100 sm:active:bg-lime sm:active:text-ink dark:text-coal dark:active:text-bone dark:data-[pinned=true]:text-coal dark:sm:active:text-coal"
```

to:

```tsx
      triggerClassName="cursor-pointer rounded bg-lime-bright px-3.5 py-1.5 text-sm text-ink transition-[color,background-color,transform] duration-150 hover:bg-lime active:scale-90 active:bg-lime-deep active:text-bone data-[preview-active=true]:bg-lime data-[pinned=true]:bg-lime data-[pinned=true]:text-ink data-[pinned=true]:hover:bg-lime sm:cursor-default sm:active:scale-100 sm:active:bg-lime sm:active:text-ink dark:text-coal dark:active:text-bone dark:data-[pinned=true]:text-coal dark:sm:active:text-coal"
```

- [ ] **Step 3: Run the affected tests**

Run: `npx vitest run src/components/experience/experience-entry-row.test.tsx src/components/experience/project-chip.test.tsx`
Expected: PASS (neither test asserts on the specific size/padding classes touched here — confirmed by reading both files before writing this plan).

- [ ] **Step 4: Commit**

```bash
git add src/components/experience/experience-entry-row.tsx src/components/experience/project-chip.tsx
git commit -m "feat: increase experience entry row and project chip sizes"
```

---

### Task 6: Education

**Files:**
- Modify: `src/components/education/education-section.tsx:15,18,21`
- Modify: `src/components/education/education-section.test.tsx:31,32,33`

**Interfaces:** n/a (presentational-only change).

- [ ] **Step 1: Bump degree, institution, and period text**

In `src/components/education/education-section.tsx`, change:

```tsx
              <p className="text-[17px] font-bold leading-tight tracking-tight text-fg">
                {entry.degree}
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-tight text-fg-muted">
                {entry.institution}
              </p>
              <p className="mt-0.5 font-mono text-[11px] leading-tight text-fg-muted">
                {entry.period}
              </p>
```

to:

```tsx
              <p className="text-[22px] font-bold leading-tight tracking-tight text-fg">
                {entry.degree}
              </p>
              <p className="mt-0.5 text-base font-semibold leading-tight text-fg-muted">
                {entry.institution}
              </p>
              <p className="mt-0.5 font-mono text-sm leading-tight text-fg-muted">
                {entry.period}
              </p>
```

- [ ] **Step 2: Update the test that hardcodes the old size classes**

In `src/components/education/education-section.test.tsx`, change:

```tsx
    expect(screen.getByText(entry.degree)).toHaveClass('text-[17px]', 'font-bold');
    expect(screen.getByText(entry.institution)).toHaveClass('text-sm', 'font-semibold');
    expect(screen.getByText(entry.period)).toHaveClass('font-mono', 'text-[11px]');
```

to:

```tsx
    expect(screen.getByText(entry.degree)).toHaveClass('text-[22px]', 'font-bold');
    expect(screen.getByText(entry.institution)).toHaveClass('text-base', 'font-semibold');
    expect(screen.getByText(entry.period)).toHaveClass('font-mono', 'text-sm');
```

Also in the same file, the test "matches the section, role, company, and date typography from experience" asserts the `SectionTitle`-rendered heading class:

```tsx
    expect(screen.getByRole('heading', { name: 'Formação' })).toHaveClass(
      'text-2xl',
      'font-bold',
    );
```

Change `'text-2xl'` to `'text-3xl'` (matches Task 1's `SectionTitle` change):

```tsx
    expect(screen.getByRole('heading', { name: 'Formação' })).toHaveClass(
      'text-3xl',
      'font-bold',
    );
```

- [ ] **Step 3: Run the component's test**

Run: `npx vitest run src/components/education/education-section.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/education/education-section.tsx src/components/education/education-section.test.tsx
git commit -m "feat: increase education section text sizes"
```

---

### Task 7: Languages

**Files:**
- Modify: `src/components/languages/languages-section.tsx:14,16`

**Interfaces:** n/a (presentational-only change).

- [ ] **Step 1: Bump language name and proficiency text**

In `src/components/languages/languages-section.tsx`, change:

```tsx
            <p className="text-[17px] font-bold leading-tight tracking-tight text-fg">
              <span>{language.name}</span>{' '}
              <span className="text-sm font-semibold tracking-normal text-fg-muted">
                ({language.proficiency})
              </span>
            </p>
```

to:

```tsx
            <p className="text-[22px] font-bold leading-tight tracking-tight text-fg">
              <span>{language.name}</span>{' '}
              <span className="text-base font-semibold tracking-normal text-fg-muted">
                ({language.proficiency})
              </span>
            </p>
```

- [ ] **Step 2: Run the component's test**

Run: `npx vitest run src/components/languages/languages-section.test.tsx`
Expected: PASS (asserts text content and the section's layout classes, not the name/proficiency size).

- [ ] **Step 3: Commit**

```bash
git add src/components/languages/languages-section.tsx
git commit -m "feat: increase languages section text sizes"
```

---

### Task 8: Skills

**Files:**
- Modify: `src/components/skills/skills-section.tsx:12,19`
- Modify: `src/components/skills/skill-icon.tsx:31`
- Modify: `src/components/skills/skills-section.test.tsx:26-34`

**Interfaces:** n/a (presentational-only change).

- [ ] **Step 1: Bump the category heading and skill badge**

In `src/components/skills/skills-section.tsx`, change:

```tsx
          <p className="mb-2 text-[17px] font-bold leading-tight tracking-tight text-fg">
            {category.category}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((item) => (
              <span
                key={item.name}
                className="inline-flex items-center gap-1 rounded bg-lime-soft px-2.5 py-1 text-[10px] text-lime-deep"
              >
```

to:

```tsx
          <p className="mb-2 text-[22px] font-bold leading-tight tracking-tight text-fg">
            {category.category}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((item) => (
              <span
                key={item.name}
                className="inline-flex items-center gap-1 rounded bg-lime-soft px-3.5 py-1.5 text-[13px] text-lime-deep"
              >
```

- [ ] **Step 2: Bump the default skill icon size**

In `src/components/skills/skill-icon.tsx`, change:

```tsx
export function SkillIcon({ name, size = 11 }: { name: string; size?: number }) {
```

to:

```tsx
export function SkillIcon({ name, size = 14 }: { name: string; size?: number }) {
```

- [ ] **Step 3: Update the test that hardcodes the old size classes**

In `src/components/skills/skills-section.test.tsx`, change:

```tsx
    expect(screen.getByRole('heading', { name: 'Skills' })).toHaveClass(
      'text-2xl',
      'font-bold',
    );
    expect(screen.getByText(skills[0].category)).toHaveClass(
      'text-[17px]',
      'font-bold',
      'leading-tight',
      'tracking-tight',
    );
```

to:

```tsx
    expect(screen.getByRole('heading', { name: 'Skills' })).toHaveClass(
      'text-3xl',
      'font-bold',
    );
    expect(screen.getByText(skills[0].category)).toHaveClass(
      'text-[22px]',
      'font-bold',
      'leading-tight',
      'tracking-tight',
    );
```

- [ ] **Step 4: Run the affected tests**

Run: `npx vitest run src/components/skills/skills-section.test.tsx src/components/skills/skill-icon.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/skills/skills-section.tsx src/components/skills/skill-icon.tsx src/components/skills/skills-section.test.tsx
git commit -m "feat: increase skills section and skill icon sizes"
```

---

### Task 9: Project preview card and popover (Experience hover card)

This is the card named directly in the request, and the wider popover is expected to remove the "Cablagem"/"Cotação" tag overflow as a side effect (do not touch `use-tag-fit.ts`/`tag-overflow.ts` — only this card's own dimensions change).

**Files:**
- Modify: `src/components/project-preview/project-preview-card.tsx`
- Modify: `src/components/project-preview/project-preview-popover.tsx:148`

**Interfaces:** n/a (presentational-only change).

- [ ] **Step 1: Bump the card padding, title, "Ver" link, video height, one-liner, and tag row**

In `src/components/project-preview/project-preview-card.tsx`, change the card padding:

```tsx
      className={`w-full rounded-lg bg-bg p-3.5 ${
```

to:

```tsx
      className={`w-full rounded-lg bg-bg p-5 ${
```

change the title and "Ver" link:

```tsx
        <span className="text-[15px] font-bold text-fg">{project.title}</span>
        <Link
          href={`/projetos/${project.slug}`}
          aria-label={`Ver detalhes do projeto ${project.title}`}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-90 dark:hover:text-lime-bright"
        >
          <span>Ver</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
```

to:

```tsx
        <span className="text-[19px] font-bold text-fg">{project.title}</span>
        <Link
          href={`/projetos/${project.slug}`}
          aria-label={`Ver detalhes do projeto ${project.title}`}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-sm font-semibold text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-90 dark:hover:text-lime-bright"
        >
          <span>Ver</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
```

change the video height:

```tsx
        className="mt-2 h-20 w-full rounded-md bg-bg-dim object-cover"
```

to:

```tsx
        className="mt-2 h-28 w-full rounded-md bg-bg-dim object-cover"
```

change the one-liner:

```tsx
      <p className="mt-2 text-[11px] leading-snug text-fg-muted">{project.oneLiner}</p>
```

to:

```tsx
      <p className="mt-2 text-sm leading-snug text-fg-muted">{project.oneLiner}</p>
```

and change both the visible and mirror tag rows (the icon size inside `TagBlock` is shared by both):

```tsx
function TagBlock({ tag, showDot }: { tag: string; showDot: boolean }) {
  return (
    <span className="flex items-center gap-1">
      {showDot && <span className="text-fg-muted">·</span>}
      <Code2 size={10} aria-hidden="true" />
      <span>{tag}</span>
    </span>
  );
}
```

to:

```tsx
function TagBlock({ tag, showDot }: { tag: string; showDot: boolean }) {
  return (
    <span className="flex items-center gap-1">
      {showDot && <span className="text-fg-muted">·</span>}
      <Code2 size={13} aria-hidden="true" />
      <span>{tag}</span>
    </span>
  );
}
```

then change both tag row containers (visible and mirror — they must stay in sync since the mirror measures the visible row's real layout):

```tsx
      <div
        ref={rowRef}
        data-testid="tag-row"
        className="mt-2 flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] text-lime-deep dark:text-lime-bright"
      >
```

to:

```tsx
      <div
        ref={rowRef}
        data-testid="tag-row"
        className="mt-2 flex items-center gap-2 whitespace-nowrap font-mono text-[13px] text-lime-deep dark:text-lime-bright"
      >
```

and:

```tsx
      <div
        ref={mirrorRef}
        aria-hidden="true"
        className="flex h-0 items-center gap-1.5 overflow-hidden font-mono text-[10px]"
      >
```

to:

```tsx
      <div
        ref={mirrorRef}
        aria-hidden="true"
        className="flex h-0 items-center gap-2 overflow-hidden font-mono text-[13px]"
      >
```

- [ ] **Step 2: Widen the popover**

In `src/components/project-preview/project-preview-popover.tsx`, change:

```tsx
          className={`absolute left-0 z-50 w-60 [filter:drop-shadow(0_3px_10px_rgba(18,21,15,0.22))] dark:[filter:drop-shadow(0_3px_10px_rgba(0,0,0,0.45))] ${
```

to:

```tsx
          className={`absolute left-0 z-50 w-80 [filter:drop-shadow(0_3px_10px_rgba(18,21,15,0.22))] dark:[filter:drop-shadow(0_3px_10px_rgba(0,0,0,0.45))] ${
```

- [ ] **Step 3: Run the affected tests**

Run: `npx vitest run src/components/project-preview`
Expected: PASS — this runs `project-preview-card.test.tsx`, `project-preview-popover.test.tsx`, `tag-overflow.test.ts`, and `use-popover-placement.test.ts`. None of these assert on the literal size/width classes touched here (the card's tag-fit tests mock numeric widths directly, not classes).

- [ ] **Step 4: Commit**

```bash
git add src/components/project-preview/project-preview-card.tsx src/components/project-preview/project-preview-popover.tsx
git commit -m "feat: increase project preview card size and widen popover"
```

---

### Task 10: Project detail page

**Files:**
- Modify: `src/components/project-detail/project-header.tsx:8,11,17,25,35`
- Modify: `src/app/projetos/[slug]/page.tsx:28,30,35,43`

**Interfaces:** n/a (presentational-only change).

- [ ] **Step 1: Bump the project detail title, tags, and links**

In `src/components/project-detail/project-header.tsx`, change:

```tsx
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
```

to:

```tsx
      <h1 className="text-3xl font-bold text-fg">{project.title}</h1>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded bg-lime-soft px-3.5 py-1.5 text-[13px] text-lime-deep">
            {tag}
          </span>
        ))}
      </div>
      {project.links && (
        <div className="mt-3 flex gap-4 text-base text-fg-muted">
```

and bump the two link icons:

```tsx
              <GithubIcon size={14} /> Repositório
```
```tsx
              <ExternalLink size={14} aria-hidden="true" /> Live demo
```

to:

```tsx
              <GithubIcon size={18} /> Repositório
```
```tsx
              <ExternalLink size={18} aria-hidden="true" /> Live demo
```

- [ ] **Step 2: Bump the back link, narrative text, and back-arrow icon**

In `src/app/projetos/[slug]/page.tsx`, change:

```tsx
        className="mb-8 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-95 dark:hover:text-lime-bright"
      >
        <ArrowLeft size={16} aria-hidden="true" />
```

to:

```tsx
        className="mb-8 inline-flex cursor-pointer items-center gap-1.5 text-base font-semibold text-fg-muted transition-[color,transform] duration-150 hover:text-lime-deep active:scale-95 dark:hover:text-lime-bright"
      >
        <ArrowLeft size={20} aria-hidden="true" />
```

and change both narrative paragraph blocks (`before.map` and `after.map`) from:

```tsx
        <p key={index} className="mb-4 text-sm text-fg-muted">
```

to (both occurrences):

```tsx
        <p key={index} className="mb-4 text-base text-fg-muted">
```

- [ ] **Step 3: Run the affected tests**

Run: `npx vitest run src/components/project-detail/project-header.test.tsx "src/app/projetos/[slug]/page.test.tsx"`
Expected: PASS (neither asserts on the size classes touched here).

- [ ] **Step 4: Commit**

```bash
git add src/components/project-detail/project-header.tsx "src/app/projetos/[slug]/page.tsx"
git commit -m "feat: increase project detail page sizes"
```

---

### Task 11: Footer

**Files:**
- Modify: `src/components/footer/footer.tsx:12,14,23,32,41,44`

**Interfaces:** n/a (presentational-only change).

- [ ] **Step 1: Bump the CV button, social icons, and copyright text**

In `src/components/footer/footer.tsx`, change:

```tsx
        className="flex items-center gap-1.5 rounded bg-lime px-4 py-2 text-sm font-semibold text-ink dark:text-coal"
      >
        <Download size={14} aria-hidden="true" />
```

to:

```tsx
        className="flex items-center gap-1.5 rounded bg-lime px-4 py-2 text-base font-semibold text-ink dark:text-coal"
      >
        <Download size={18} aria-hidden="true" />
```

change the three social icons:

```tsx
          <Mail size={18} aria-hidden="true" />
```
```tsx
          <GithubIcon size={18} />
```
```tsx
          <LinkedinIcon size={18} />
```

to:

```tsx
          <Mail size={23} aria-hidden="true" />
```
```tsx
          <GithubIcon size={23} />
```
```tsx
          <LinkedinIcon size={23} />
```

and change the copyright line:

```tsx
      <p className="font-mono text-[10px] text-fg-muted">
```

to:

```tsx
      <p className="font-mono text-[13px] text-fg-muted">
```

- [ ] **Step 2: Run the component's test**

Run: `npx vitest run src/components/footer/footer.test.tsx`
Expected: PASS (asserts links by accessible name/href and copyright by text content, not size).

- [ ] **Step 3: Commit**

```bash
git add src/components/footer/footer.tsx
git commit -m "feat: increase footer text and icon sizes"
```

---

### Task 12: Project mocks (Doctag, GraphIt, loading placeholder)

**Files:**
- Modify: `src/components/project-mocks/doctag/index.tsx:55,61,70`
- Modify: `src/components/project-mocks/graphit/index.tsx:29,35`
- Modify: `src/components/project-mocks/registry.tsx:6`

**Interfaces:** n/a (presentational-only change).

- [ ] **Step 1: Bump the Doctag mock's instructions, doc name, and tag chip**

In `src/components/project-mocks/doctag/index.tsx`, change:

```tsx
      <p className="mb-3 font-mono text-[10px] uppercase tracking-wide text-fg-muted">
```

to:

```tsx
      <p className="mb-3 font-mono text-[13px] uppercase tracking-wide text-fg-muted">
```

change:

```tsx
            <span className="text-xs text-fg">{doc.name}</span>
```

to:

```tsx
            <span className="text-sm text-fg">{doc.name}</span>
```

and change:

```tsx
              className="cursor-grab rounded bg-lime-soft px-2.5 py-1 font-mono text-[11px] text-lime-deep active:cursor-grabbing motion-safe:transition-transform motion-safe:active:scale-95"
```

to:

```tsx
              className="cursor-grab rounded bg-lime-soft px-3.5 py-1.5 font-mono text-sm text-lime-deep active:cursor-grabbing motion-safe:transition-transform motion-safe:active:scale-95"
```

- [ ] **Step 2: Bump the GraphIt mock's instructions and button label**

In `src/components/project-mocks/graphit/index.tsx`, change:

```tsx
        <p className="font-mono text-[10px] uppercase tracking-wide text-fg-muted">
          GraphIt — clique na área para desenhar um nó
        </p>
        <button
          type="button"
          onClick={handleAddViaKeyboard}
          className="rounded bg-lime-soft px-2.5 py-1 font-mono text-[10px] text-lime-deep motion-safe:transition-transform motion-safe:active:scale-95"
        >
```

to:

```tsx
        <p className="font-mono text-[13px] uppercase tracking-wide text-fg-muted">
          GraphIt — clique na área para desenhar um nó
        </p>
        <button
          type="button"
          onClick={handleAddViaKeyboard}
          className="rounded bg-lime-soft px-3.5 py-1.5 font-mono text-[13px] text-lime-deep motion-safe:transition-transform motion-safe:active:scale-95"
        >
```

- [ ] **Step 3: Bump the mock loading placeholder text**

In `src/components/project-mocks/registry.tsx`, change:

```tsx
    <div className="flex h-48 items-center justify-center rounded-md bg-bg-dim font-mono text-xs text-fg-muted">
```

to:

```tsx
    <div className="flex h-48 items-center justify-center rounded-md bg-bg-dim font-mono text-sm text-fg-muted">
```

- [ ] **Step 4: Run the affected tests**

Run: `npx vitest run src/components/project-mocks`
Expected: PASS — this runs the Doctag, GraphIt, and registry tests. None assert on the size/padding classes touched here.

- [ ] **Step 5: Commit**

```bash
git add src/components/project-mocks/doctag/index.tsx src/components/project-mocks/graphit/index.tsx src/components/project-mocks/registry.tsx
git commit -m "feat: increase project mock text sizes"
```

---

### Task 13: Full regression run and manual browser verification

**Files:** none (verification only).

**Interfaces:** n/a.

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: PASS, full suite (no regressions from any of Tasks 1-12; the test files updated in Tasks 6 and 8 are the only ones that needed edits — this run is the proof no other test was missed).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: same single pre-existing unrelated error as before this plan (`src/components/project-preview/use-popover-placement.test.ts(22,3): error TS2578`) and nothing new. If any *other* error appears, a class/prop edit in this plan introduced a typo — find and fix it before continuing.

- [ ] **Step 3: Manual browser verification**

Use this project's `run` pattern (check for a project-level run skill first; otherwise the browser-driven pattern: start `npm run dev`, drive it with a headless Chromium script) to visually confirm, in both light and dark theme:
- Hero name, role, and social icons read larger; nothing wraps awkwardly at a 375px-wide mobile viewport.
- Header nav links, language badge, and the mobile menu (open it) are legible and don't overlap.
- An Experience entry's role/company/period/description and its "Projetos" chips are visibly bigger.
- Hover (or click, on a touch-emulated viewport) a project chip — e.g. "Cablagem" — and confirm the preview popover is now 320px wide and its tag row ("Google Apps Script · Google Sheets") no longer overflows the card edge. Repeat for "Cotação".
- Skills, Education, and Languages section text and icons read larger.
- A project detail page (`/projetos/doctag`) shows the bigger h1, tags, and link icons.
- Footer CV button, social icons, and copyright line are bigger.

Take at least one screenshot of the Cablagem popover at the new width as evidence the overflow is resolved (this was the original motivating bug for widening the card).

- [ ] **Step 4: Stop the dev server**

If a dev server was started for verification, stop it (e.g. find the PID listening on the port and kill it, or close the process you started it with).

No commit for this task — it's verification-only. If Step 1, 2, or 3 surfaces a problem, go back to the relevant earlier task, fix it there, and re-run that task's own test plus this task's full suite before considering the plan done.
