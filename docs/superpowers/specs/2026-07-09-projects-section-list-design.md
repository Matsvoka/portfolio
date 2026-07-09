# Projects section — single container list, not individual cards

## Context

The "Projetos" section on the home page currently renders one elevated, shadowed `ProjectPreviewCard` per project, stacked with `gap-4` between them (`projects-section.tsx`). This reads as a repeated "identical card" grid, which `PRODUCT.md`'s anti-references explicitly flags ("identical project cards"), and doesn't match the flatter, tonal-layering elevation style `DESIGN.md` calls for elsewhere (Skills already uses a single bordered container with `border-b` separators between categories).

The user asked to replace the per-project cards with one general container, where each project is a row: a logo placeholder on the left, and on the right a body containing (in order) the title + "Ver" CTA, a video demo slot, a description, and tags — separated from the next project by a simple divider, matching the Skills section's pattern.

## Constraint: `ProjectPreviewCard` is shared

`ProjectPreviewCard` is not exclusive to the home page. `ProjectPreviewPopover` (used by `ProjectChip` inside `experience-entry-row.tsx`, for the hover/tap preview on project chips in the Experience timeline) renders it directly with `elevated={false}`. Its current tests assert on its `article` tag, its own elevation shadow toggle, its tag-fit behavior, and its video/link content. None of that changes — this spec only changes how the home page's Projects section is composed, not the popover.

## Approach

Rather than adding a layout-variant prop to `ProjectPreviewCard` (which would mix two fairly different DOM shapes — a shadowed standalone card vs. a bordered list row — behind conditionals in one file), this extracts the one genuinely reusable, non-trivial piece (the tag-fit/overflow row) into its own component, and builds a new, separate component for the home page's list row:

- **`ProjectTagRow`** (new, `src/components/project-preview/project-tag-row.tsx`): the `TagBlock`/`OverflowBadge`/`useTagFit` wiring currently inlined in `ProjectPreviewCard`, extracted as-is (same markup, same `data-testid="tag-row"`, same mirror-row measurement trick). `ProjectPreviewCard` is updated to render `<ProjectTagRow tags={project.tags} />` instead of its inline version — no visible or behavioral change to the popover.
- **`ProjectListItem`** (new, `src/components/projects/project-list-item.tsx`): the new per-project row for the home page, described below.
- **`ProjectsSection`** (modified): renders one bordered container with a `ProjectListItem` per personal project, instead of a `flex flex-col gap-4` stack of cards.

This keeps the popover's component untouched in behavior while eliminating duplication of the fiddly tag-measurement logic between the two presentations.

## `ProjectListItem` layout

```
[ logo ]  Título do Projeto                    Ver →
 56×56    ┌────────────────────────────────┐
          │           vídeo demo           │
          └────────────────────────────────┘
          Descrição curta do projeto (oneLiner)
          · React  · Vite  · +2
```

- **Logo**: `EntryLogoPlaceholder` (existing component, default props — 56×56 box, "logo" label), the same one used by Experience and Education rows. No per-project logo assets yet; this is a placeholder only, per the user's request.
- **Title + "Ver"**: same row, `justify-between`. Title uses `ui-text-entry-title` (the size token shared by Experience/Skills/Education row titles) instead of the smaller `ui-text-preview-title` the compact card uses — this row is full-width, not a compact card, so it should match the other timeline entries' title scale. The "Ver" link keeps its current markup/classes (`ArrowRight` icon, hover/active states, `/projetos/${slug}` href, same accessible label).
- **Video**: same `<video autoPlay muted loop playsInline preload="metadata">` element and `previewVideo` source as today, same `ui-preview-video` height token, but now constrained to the body column's width (to the right of the logo) rather than the full card width.
- **Description**: `project.oneLiner`, using the `ui-text-description` token (matches Experience's entry description sizing) instead of the smaller `ui-text-meta` the compact card uses.
- **Tags**: `<ProjectTagRow tags={project.tags} />` — identical visual treatment to today (mono, lime-deep, `Code2` icon, `+N` overflow badge).

No changes to `content/projects.ts` or `content/types.ts` — same `Project` fields are used, just laid out differently.

## Container and separators

`ProjectsSection` wraps its list in a single bordered container, matching Skills' container exactly:

```tsx
<ul className="rounded-sm border border-fg/10 bg-bg p-4">
  {personalProjects.map((project) => (
    <li key={project.slug} className="border-b border-fg/10 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <ProjectListItem project={project} />
    </li>
  ))}
</ul>
```

`<ul>`/`<li>` is used (rather than Skills' bare `<section>` children) because a list of projects is closer semantically to Education's `<ul>` of entries than to Skills' named subsections — each `<li>` is one independent project, not a titled category grouping several items.

No shadow/elevation on the container or its rows (per the "flat, like Skills" decision) — this also brings the home page's Projects section in line with `DESIGN.md`'s "Glow-Not-Shadow Rule" (neutral surfaces use tonal layering/borders, not drop shadows), rather than the drop-shadow the individual cards used before.

## Scope

In scope:
- `project-tag-row.tsx` (new, extracted)
- `project-preview-card.tsx` (modified to use the extraction — no visible change)
- `project-list-item.tsx` (new)
- `projects-section.tsx` (modified: container + list instead of stacked cards)
- Corresponding tests (see below)

Out of scope:
- `ProjectPreviewPopover` / `ProjectChip` / the Experience-section hover preview — unchanged in behavior and appearance.
- `content/projects.ts`, `content/types.ts` — no field changes.
- The project detail page (`app/projetos/[slug]/page.tsx`) — unchanged.
- Real per-project logos — still a placeholder, as requested.

## Testing

- **`project-tag-row.test.tsx`** (new): move the tag-fit/overflow test cases currently in `project-preview-card.test.tsx` (measuring/fit/overflow-badge behavior) here, testing `ProjectTagRow` directly.
- **`project-preview-card.test.tsx`** (modified): keep the title/link/video/elevation tests; keep one smoke test confirming tags still render through the extracted row, but drop the now-duplicated fit-edge-case tests.
- **`project-list-item.test.tsx`** (new): renders logo placeholder, title, "Ver" link (href, label, icon), video (`previewVideo` source), description (`oneLiner`), and tags.
- **`projects-section.test.tsx`** (modified): still asserts the `#projetos` landmark and that every personal project's title renders (and linked-only projects like "HCP App" don't); add an assertion that the list container and per-item separators are present (e.g. container renders as a `<ul>` with one `<li>` per personal project).
- Full test suite should otherwise pass unchanged (no other component touches these files).
- Manual check in the browser: confirm the Experience section's project-chip hover popover still looks and behaves exactly as before (this is the shared-component risk this spec calls out), and that the new Projects list reads correctly at a narrow mobile viewport (logo + body flex row shouldn't cramp the video/tags).
