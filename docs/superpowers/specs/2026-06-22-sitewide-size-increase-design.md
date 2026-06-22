# Sitewide size increase — typography, icons, chips, project preview card

## Context

The site currently runs a very compact, low-contrast type scale (lots of `text-[10px]`/`text-[11px]` micro-text, `text-sm` body copy, 10-18px icons). `DESIGN.md` explicitly leaves the type hierarchy "undecided — sizes, weights, line-heights to be defined at implementation," so this spec defines that scale for the first time rather than tweaking an existing one.

This was prompted by two things:
1. A general impression that elements across the site read too small for the "Bold and distinctive" brand personality in `PRODUCT.md`.
2. A visible text overflow on the Experience section's project-preview popover (e.g. "Cablagem" tags spilling past the card edge at the current 240px width). Widening the card as part of this pass is expected to remove that overflow as a side effect — it is **not** a re-engineering of the tag-fit measurement logic in `use-tag-fit.ts`/`tag-overflow.ts`, which is explicitly out of scope here and parked for later if the wider card doesn't fully resolve it.

## Approach

Pure value changes — no new components, no behavior changes, no new abstractions. Every change is one of:
- Swapping a Tailwind font-size utility or arbitrary `text-[Npx]` value for a larger one.
- Bumping a lucide-react `size={N}` icon prop.
- Bumping padding/gap/width/height on the handful of containers that are sized tightly around their current (smaller) content (chips, the preview card, its video slot).

The scale targets roughly **+30%** over current values ("Notável" tier, validated against the user via the visual brainstorming companion), then rounds to clean numbers — consolidating several near-duplicate current sizes (e.g. `12px` description and `text-sm`/14px body copy) into single shared steps (`text-base`/16px) so the result is a coherent ladder, not just every number scaled independently.

Two approaches were considered and rejected in favor of the above:
- **CSS custom-property scale (`--step-0`, `--step-1`, ...)**: more "systematic" but would require touching `globals.css`'s `@theme` block and refactoring every consumer to reference tokens instead of literal Tailwind classes — a bigger structural change than what was asked for, and premature given `DESIGN.md` itself treats the scale as not yet locked in.
- **Tailwind `text-*` utilities only, dropping all arbitrary `text-[Npx]` values**: cleaner Tailwind, but several current sizes (17px role/degree, 15px card title) don't land on a default Tailwind step even after scaling, and forcing them onto the nearest step would distort the relative hierarchy the rest of the site depends on. Arbitrary values are kept where the scaled number doesn't land near a standard step; standard utilities are used wherever the scaled number does (e.g. 11px → 14px becomes `text-sm`, not `text-[14px]`).

## Scope

In scope: every `text-*`/`text-[Npx]` font size, every lucide-react `size={N}` icon, and the chip/card paddings, gaps and widths/heights that are sized tightly around their own text/icon content (project chip, skill badge, project tag, the Experience preview card and its video slot).

Explicitly out of scope (left unchanged): the Experience timeline's logo/flag placeholder (`entry-logo-placeholder.tsx`, 56px logo / 40×28px flag / 9px / 7px labels) and the timeline dot/connector line. These are decorative placeholders pending real content and weren't named by the user; revisit separately if desired. Also out of scope: re-engineering the tag overflow measurement logic (separate, already-built `useTagFit`/`fitTagsToWidth` mechanism) — only the card's dimensions change here.

## Typography table

| Use | File(s) | Current | New |
|---|---|---|---|
| Micro labels (tag text context, "Projetos" label, footer copyright, project-mock instructions/loading) | `project-chip.tsx`, `experience-entry-row.tsx`, `footer.tsx`, `project-mocks/*` | `text-[10px]` | `text-[13px]` |
| Badge / period / "Ver" link / one-liner / language badge | `experience-entry-row.tsx`, `project-preview-card.tsx`, `education-section.tsx`, `header.tsx` | `text-[11px]` | `text-sm` (14px) |
| Body copy: About paragraphs, project narrative, job description | `about-section.tsx`, `app/projetos/[slug]/page.tsx`, `experience-entry-row.tsx` (12px) | `text-sm` (14px) / `text-[12px]` | `text-base` (16px) |
| Card title (preview card) | `project-preview-card.tsx` | `text-[15px]` | `text-[19px]` |
| Role / company / degree / language name / skill category | `experience-entry-row.tsx`, `education-section.tsx`, `languages-section.tsx`, `skills-section.tsx` | `text-[17px]` | `text-[22px]` |
| Nav links, footer links, hero role subtitle, back link, company name | `header.tsx`, `mobile-nav.tsx`, `footer.tsx`, `hero.tsx`, `app/projetos/[slug]/page.tsx`, `experience-entry-row.tsx` | `text-sm` (14px) | `text-base` (16px) |
| Section heading (h2) | `section-title.tsx` | `text-2xl` (24px) | `text-3xl` (30px) |
| Project detail title (h1) | `project-header.tsx` | `text-2xl` (24px) | `text-3xl` (30px) |
| Hero name | `hero.tsx` | `text-4xl` (36px) | `text-5xl` (48px) |
| Misc `xs` labels (hero "foto" placeholder, mock doc names, mock loading text) | `hero.tsx`, `project-mocks/*`, `registry.tsx` | `text-xs` (12px) | `text-sm` (14px) |

## Icon table (lucide-react `size={N}`)

| Use | File(s) | Current | New |
|---|---|---|---|
| Tag icon (`Code2`) | `project-preview-card.tsx` (the preview card's tag row only — `project-header.tsx`'s detail-page tags have no icon) | 10 | 13 |
| Skill icon (default) | `skill-icon.tsx` | 11 | 14 |
| GithubIcon / ExternalLink (project links), CV download, ArrowRight ("Ver" link) | `project-header.tsx`, `footer.tsx`, `project-preview-card.tsx` | 14 | 18 |
| ArrowLeft (back), Sun/Moon (theme toggle) | `app/projetos/[slug]/page.tsx`, `theme-toggle.tsx` | 16 | 20 |
| Mail / GithubIcon / LinkedinIcon (social, hero + footer) | `hero.tsx`, `footer.tsx` | 18 | 23 |
| Menu / X (mobile nav toggle) | `mobile-nav.tsx` | 20 | 26 |
| Section title icon (`strokeWidth` stays 2.25) | `section-title.tsx` | 24 | 31 |

## Chips and project preview card

- **Project chip** (`project-chip.tsx`): text 11→14px (via the badge/period table row above), padding `px-2.5 py-1` → `px-3.5 py-1.5`.
- **Skill badge** (`skills-section.tsx`): text 10→13px, padding `px-2.5 py-1` → `px-3.5 py-1.5`, icon via `skill-icon.tsx` 11→14.
- **Project tag, detail page** (`project-header.tsx`): text 10→13px, padding `px-2.5 py-1` → `px-3.5 py-1.5` (no icon — this tag has text only, unlike the preview card's tag row).
- **Project preview card** (`project-preview-card.tsx`, `project-preview-popover.tsx`):
  - Popover width: `w-60` (240px) → `w-80` (320px).
  - Card padding: `p-3.5` (14px) → `p-5` (20px).
  - Title: 15→19px. One-liner: 11→14px (`text-sm`). Tag row: 10→13px, tag icon 10→13, row gap `gap-1.5` (6px) → `gap-2` (8px).
  - Video preview height: `h-20` (80px) → `h-28` (112px) (keeps roughly the same aspect ratio as the card widens).
  - "Ver" link: 11→14px (`text-sm`), `ArrowRight` icon 14→18.
- **Mock-internal chips** (`project-mocks/doctag/index.tsx`'s drag tag, `project-mocks/graphit/index.tsx`'s "+ Adicionar nó" button): same `px-2.5 py-1` → `px-3.5 py-1.5` chip-padding treatment as every other chip above, for visual consistency with the rest of the chip family even though these are demo content inside an interactive mock rather than the portfolio's own chrome.

The wider card (320px vs 240px) increases the tag row's available content width from ~212px to ~292px, which comfortably fits the current "Cablagem" (`Google Apps Script` / `Google Sheets`) and "Cotação" (`Flask` / `React` / `Gemini API`) tag sets even accounting for the font-swap timing variance observed earlier. The existing `useTagFit` overflow-badge mechanism stays in place unchanged as a safety net for any project with even longer tags in the future.

## Testing

This is a pure visual/value change with no new logic, so:
- Existing component tests (`*.test.tsx`) should continue to pass unchanged, since none of them assert on literal pixel values or class strings beyond what's already covered (e.g. `text-content` assertions, not size classes) — confirm by running the full suite after the change.
- Manually verify in the browser (dev server + the project's `run` pattern) at both light/dark theme and at a narrow mobile viewport, since several bumped elements (project chips, the preview card, hero name) are the ones most likely to wrap or overflow awkwardly at small widths.
- Specifically re-check the "Cablagem"/"Cotação" preview card tag rows no longer overflow at the new 320px width, across a few hover/open cycles (to rule out the font-swap timing issue resurfacing).

## Out of scope / explicitly deferred

- Entry logo/flag placeholder sizing (`entry-logo-placeholder.tsx`) and the experience timeline dot/connector — left at current size.
- Any change to `use-tag-fit.ts` / `tag-overflow.ts` overflow-measurement logic.
- Section vertical rhythm (`py-12`, etc.) — only touched where a bumped element would otherwise look visually cramped against its existing container (the preview card's own padding/video height), not as a deliberate spacing redesign.
