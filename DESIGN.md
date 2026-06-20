---
name: Vinicius Matsuoka — Portfolio
description: A bold, dual-theme engineering portfolio built around a single live-wire lime accent
colors:
  paper: "#f3f6f1"
  paper-dim: "#e5e9e1"
  ink: "#12150f"
  ink-muted: "#4b4f47"
  coal: "#0c0e09"
  coal-dim: "#161a13"
  bone: "#edf0ea"
  bone-muted: "#a2a69e"
  lime: "#92d00b"
  lime-bright: "#a7d960"
  lime-soft: "#bfe58e"
  lime-deep: "#375900"
---

<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. Typography, rounded, spacing, and components are intentionally undecided below. -->

# Design System: Vinicius Matsuoka — Portfolio

## 1. Overview

**Creative North Star: "The Live Wire"**

The whole system runs on one current: a single high-voltage lime (`#92d00b`) against a calm, nearly-colorless neutral canvas. The lime never blends in — it marks the thing that matters on screen (a CTA, an active nav item, a project tag) the way a live wire marks the thing carrying charge. Everything else stays quiet on purpose, so the accent reads as a deliberate signal rather than decoration.

The system switches between a light and a dark base (user-toggleable), but the lime's role never changes between them — it is the one constant the eye learns to track. This is a portfolio for recruiters scanning fast: confident, technical, a little blunt. It explicitly rejects the generic "developer portfolio template" look — no stock hero-with-gradient-blob, no identical icon-card grids, no tiny tracked-uppercase eyebrows stacked above every section — and it rejects motion-as-spectacle. Interaction feedback is immediate and purposeful; nothing performs a scroll-triggered show.

**Key Characteristics:**
- One accent color carrying real weight (≈10% of any view), everything else neutral
- Dual light/dark themes, switchable, with the accent's role held constant across both
- Technical/geometric type direction — confident, not decorative
- Motion is responsive (reacts to input), never choreographed (no orchestrated entrances)
- Flat-leaning surfaces; depth comes from tonal layering and lime-tinted glow, not drop shadows

## 2. Colors

A near-monochrome neutral field (60% dominant background + 30% text/ink) with exactly one saturated color (10% lime) doing all the expressive work, per the 60-30-10 split.

### Primary
- **Lime** (`#92d00b`, oklch(79% 0.204 128)): the signal color. CTAs, the active nav indicator, key icons, focus rings, project/skill tags, selection states. Used as a *fill*, never as small text on a light surface (see Do's and Don'ts — contrast fails).
- **Lime Bright** (`#a7d960`): a lighter step of the same hue, for hover/glow states on dark surfaces (buttons brightening on hover, focus glow).
- **Lime Soft** (`#bfe58e`): a pale tint for subtle fills — selected-row backgrounds, badge backgrounds, low-emphasis highlight blocks.
- **Lime Deep** (`#375900`): the AA-text-safe step of the same hue (7.4:1 on Paper). Use anywhere lime needs to read as *text* on a light surface — links, active labels, small icons.

### Neutral — Light theme
- **Paper** (`#f3f6f1`): the light-theme background. A near-white very gently tinted toward the lime's own hue rather than warm or cool by default.
- **Paper Dim** (`#e5e9e1`): light-theme surface/card fill, one step down from Paper.
- **Ink** (`#12150f`): primary text on light surfaces (16.9:1 on Paper).
- **Ink Muted** (`#4b4f47`): secondary/supporting text on light surfaces (7.7:1 on Paper — still comfortably AA, deliberately not washed-out gray).

### Neutral — Dark theme
- **Coal** (`#0c0e09`): the dark-theme background. Near-black, same hue-tint as Paper for cross-theme cohesion.
- **Coal Dim** (`#161a13`): dark-theme surface/card fill, one step up from Coal.
- **Bone** (`#edf0ea`): primary text on dark surfaces (16.9:1 on Coal).
- **Bone Muted** (`#a2a69e`): secondary/supporting text on dark surfaces (7.8:1 on Coal).

### Named Rules
**The 60-30-10 Rule.** Any given screen is ~60% Paper/Coal, ~30% Ink/Bone, ~10% Lime. Never invert the ratio — if lime starts dominating a layout, pull it back to a fill, border, or icon instead of a background.

**The Dark-Ink-On-Lime Rule.** Anything with a lime fill always carries dark text (`Ink` in light theme, `Coal` in dark theme) — never light text. This holds regardless of which theme is active, because lime itself doesn't change between themes.

## 3. Typography

**Direction confirmed, exact faces not yet chosen:** a single technical/geometric sans across the whole interface (one family, multiple weights — not a serif/sans pair), optionally with a monospace used narrowly for metadata and tags (dates, tech-stack labels, project IDs) to reinforce the engineering register through a genuine contrast axis (proportional vs. monospace), not a second competing sans.

*Suggested candidates to confirm at implementation:* Space Grotesk, Geist Sans, or IBM Plex Sans for the primary geometric sans; JetBrains Mono or IBM Plex Mono for the label/metadata mono. `[font pairing to be locked in at implementation, then captured by re-running /impeccable document in scan mode]`

### Hierarchy
`[sizes, weights, line-heights, and letter-spacing to be defined at implementation — display heading ceiling ≤ 6rem clamp, letter-spacing floor ≥ -0.04em, text-wrap: balance on headings per project-wide convention]`

## 4. Elevation

Flat-leaning by default. Depth between a surface and its background comes from tonal layering (Paper → Paper Dim, Coal → Coal Dim), not drop shadows. The one place shadows do real work is the lime glow: hover/focus states on lime-filled elements get a soft, lime-tinted glow (e.g. a diffuse `lime` shadow at low opacity) rather than a generic dark drop shadow — the glow reads as "this is the live wire," consistent with the North Star.

### Named Rules
**The Glow-Not-Shadow Rule.** Elevation cues on lime elements use a lime-tinted glow, not a neutral dark shadow. Neutral surfaces (cards, panels) stay flat or use tonal layering instead of shadows.

## 5. Components

`[No components exist yet — this section is intentionally omitted in this seed pass. Re-run /impeccable document in scan mode once buttons, cards, nav, and the experience-timeline / project-detail components exist, to extract real shape, padding, and state treatments.]`

## 6. Do's and Don'ts

### Do:
- **Do** keep lime to ~10% of any screen (the 60-30-10 Rule) — it should always read as a deliberate signal, never as the base palette.
- **Do** pair any lime fill with dark text (`Ink`/`Coal`), never light text, in either theme.
- **Do** use `Lime Deep` (`#375900`) for lime-as-text on light surfaces — it's the only lime step that clears AA (7.4:1 on Paper).
- **Do** keep the lime accent's role identical across light and dark themes; only the neutral roles swap.
- **Do** make motion responsive — real feedback on hover/focus/press/drag — but stop short of scroll-driven choreography or orchestrated entrance sequences.
- **Do** support `prefers-reduced-motion` with an instant or crossfade alternative for every transition (per PRODUCT.md's WCAG AA commitment).

### Don't:
- **Don't** use raw `Lime` (`#92d00b`) as text color on `Paper` or `Paper Dim` — measured contrast is 1.7:1, far below AA. Use `Lime Deep` instead.
- **Don't** build a generic "developer portfolio template": no stock hero-with-gradient-blob, no identical icon-card grids repeated section after section, no tiny tracked-uppercase eyebrow label above every section (direct from PRODUCT.md's anti-references).
- **Don't** add heavy or gimmicky animation — no bounce/elastic easing, no scroll-hijacking, no orchestrated multi-element entrance shows (direct from PRODUCT.md's anti-references).
- **Don't** let the dark and light themes diverge in personality — same North Star, same accent role, only the neutral base inverts.
- **Don't** invent a second saturated color outside the lime family without revisiting this file — the system is built on one accent doing the work, not a multi-color palette.
