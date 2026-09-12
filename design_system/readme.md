# KOEBELT Design System

Design system for the personal portfolio of **Thomas Koebel**, working under the pseudonym **koebelt**. Single-person design studio — identity, art direction, web design, type design, packaging. No codebase, Figma file or existing site was provided; this system was built from a brand brief plus one asset:

- `uploads/Logo White.png` — the KOEBELT monogram, white-on-transparent (copied into `assets/`)
- Brand colors given directly: background `#282526` (since darkened to `#1D1A1B`), contrast white, accent `#DCFB47`
- Name: Thomas Koebel / koebelt

Everything else (type pairing, spacing scale, component inventory, copy voice) was designed from scratch to fit those three colors and the mark. There is no existing product to recreate.

## Index

- `styles.css` — entry point, imports everything below
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `base.css`
- `assets/` — `logo-mark-white.png` (source), `logo-mark-dark.png`, `logo-mark-accent.png` (generated tints)
- `guidelines/` — 20 foundation specimen cards (Colors, Type, Spacing, Brand groups in the Design System tab)
- `components/`
  - `core/` — Button, IconButton, Tag, Badge, Divider, Icon
  - `forms/` — Field, Input, Textarea, Select, Checkbox, Switch
  - `content/` — Card, MediaFrame, ProjectCard, WorkRow, SectionHeading, Quote
  - `brand/` — Logo, Marquee
  - `navigation/` — NavBar, Tabs, FooterBar
  - `feedback/` — Dialog, Notice
- `ui_kits/cv/` — a standalone CV/résumé section (experience, education, skills, CV download)
- `SKILL.md` — portable skill file for use outside this tool

## Content fundamentals

Voice is direct and factual — a software engineer talking about their own work, not a studio talking about itself.

- **First person, singular.** "I design identities..." not "We craft..." There is one person; the copy says so.
- **No hype adjectives.** No "stunning", "seamless", "elevate". Facts stand in for enthusiasm: *"He shipped the whole identity in five weeks."*
- **Sentence case, not title case**, for everything except the mono labels (see below), which are UPPERCASE.
- **Numbers over adjectives.** "Eight years", "Thirty projects, 2018 to present", "Five weeks" — specifics instead of "years of experience".
- **Short.** Hero line is one sentence. Project summaries are one sentence, never two.
- No emoji anywhere.
- Mono/label text (eyebrows, tags, nav) is uppercase with wide tracking — this is the one place formality shows up; body copy stays lowercase/sentence case.

## Visual foundations

- **Palette**: near-black `#1D1A1B` background (ink-700) is the default surface everywhere — this is a dark-mode-only brand, not a dark theme option. White is the contrast/text color. Lime `#DCFB47` is the *only* saturated color in the system, reserved for the one primary action, active states, and the mono eyebrow — never used decoratively or as a background for large areas.
- **Type**: Archivo (grotesque, variable) for everything display/heading/body; JetBrains Mono for every label, tag, nav item and metadata string, always uppercase with 0.14em tracking. This mono/display split is the system's main visual signature.
- **Scale**: display sizes are large and tight (128→56px, −0.035em tracking, 0.94 line-height) — the hero name/statement reads as a poster line. Body copy is comfortable (16–18px, 1.55 line-height, 62ch measure).
- **Spacing**: 2px base scale doubling up to 96px between sections. Generous — sections breathe at 96–160px vertical gaps; content inside a block stays tight (8–24px).
- **Backgrounds**: flat color only. No gradients, no photographic textures, no noise/grain. Where imagery is missing, `MediaFrame` renders a flat sunken placeholder with a mono caption rather than invented art.
- **Depth**: near-zero. Cards are a flat panel one shade lighter than the page with a 1px hairline border — no drop shadows. The only real shadow in the system is the dialog/overlay scrim. Hover state is a background/border shift one step up the ink ramp, never a shadow.
- **Corners**: almost square. 2px on controls, 4px on cards, pill only on tags and the switch — radius is not a personality trait here.
- **Borders**: hairline (`rgba(255,255,255,.12)`) is the primary structural device — it separates sections, wraps cards, underlines nav. This replaces both shadows and background-color changes as "the way to divide things."
- **Motion**: fast and flat. 140ms for control hovers, 220ms for UI, 640ms for scroll reveals (fade + 16px rise). Single easing curve (`cubic-bezier(.2,.8,.2,1)`) everywhere — no bounce, no spring, no overshoot. The one continuous animation is the discipline `Marquee` ticker.
- **Hover / press**: hover = one step lighter background or lime text; press = `scale(0.985)`. No color inversion tricks, no lift/shadow-grow.
- **Transparency/blur**: used sparingly — the sticky `NavBar` and the `Dialog` scrim are the only blurred/translucent surfaces in the system (glass-morphism reserved for chrome that floats over content, never for cards).
- **Imagery tone**: no real photography supplied. Placeholders assume cool, quiet, low-saturation photography (the kind that reads well against `#1D1A1B`) — flag this to Thomas for real work samples.

## Iconography

No icon font or SVG set was provided. The system uses **Lucide** (outline, 2px stroke, MIT-licensed) as the closest neutral match to the brand's flat, linear visual language — path data is extracted and bundled inline in `components/core/icons-data.js` (no CDN fetch, no CSS mask) so every glyph renders reliably and inherits `currentColor` via `stroke`. No emoji, no unicode-glyph icons. House set: `arrow-up-right` (external/project link), `arrow-right` (next), `mail`, `github`, `linkedin`, `instagram`, `download`, `menu`, `x`, `plus`, `check`, `info`, `triangle-alert`, `circle-alert`, `chevron-down`.

## Intentional additions

No component source was provided, so the full inventory (Button, Field family, Card family, Dialog, Notice, NavBar/FooterBar/Tabs, Logo, Marquee) was authored from scratch to a size appropriate for a one-person portfolio site — not copied from an existing library.

## Caveats

- **No logo asset beyond the one PNG supplied.** Only a white monogram was given; `dark` and `accent` tints in `assets/` are programmatic recolors of that same file, not separately designed lockups. If Thomas has an official wordmark or color logo, swap it in.
- **No real résumé/CV data.** Experience, education and skills in `ui_kits/cv` are placeholder in the voice described above — replace before shipping. The "Download CV" link has no PDF wired up yet.
- **Fonts substituted from Google Fonts** (Archivo, JetBrains Mono) since none were provided — flagged below.

## Font substitution — please confirm

No font files were provided. Archivo (grotesque display/text) and JetBrains Mono (labels) were picked from Google Fonts as a fit for the brand's flat, structural, mono-labelled look. **If koebelt has a licensed typeface it should be running on**, send the font files (or names) and I'll swap the `@font-face`/token definitions — everything else in the system stays the same.

---

**This is a first pass built from a three-color brief and one logo file — not real product content.** The biggest thing I'd ask for: real CV data and a PDF to link. Tell me what to iterate on — more component states, a different type pairing, additional sections — and I'll keep refining.
