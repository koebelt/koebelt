# koebelt

Personal portfolio for Thomas Koebel, in English and French. React 19 +
TypeScript + Vite, built on the KOEBELT design system, with a reactive
point-sphere that carries the page.

```bash
npm install
npm run dev        # http://localhost:5173  (?debug=1 for the engine HUD)
npm run verify     # typecheck + design-system adherence + production build
```

## The sphere

A cloud of up to 7,000 points rendered as **one `THREE.Points`, one `ShaderMaterial`,
one draw call**. Everything it does happens in the vertex shader against uniforms
the engine writes once per frame. The HUD asserts the draw-call count, because
that is the whole architectural claim.

It is not decoration: it holds one scene per page section and morphs between them.

| scene | form | what it says |
|---|---|---|
| `hero` | Fibonacci sphere | the rest pose |
| `about` | **Earth, drawn as coastlines** | one marked point is Niort |
| `skills` | four nested orbital shells | one per discipline; hovering a card picks one out, and any skill opens why he claims it |
| `projects` | one cube five times, from a loose cloud to a crisp wireframe | what a project is — a vague idea made precise; each cube turns on itself, and hovering a card spins its stop faster |
| `experience` | a strand of DNA, turning on its axis | five roles as five bright rungs |
| `education` | two stacked strata | one layer per degree |
| `contact` | the sphere again | a deliberate return to the opening form |

### The Earth

Natural Earth's 50m land polygons, rasterised once by `npm run build:landmask`
into a 720×360 bitmask committed as source (`src/three/geometry/landmask.ts`) —
no runtime dependency, no network fetch. 29.0% of the grid is land, which matches
the real figure.

Only **coastlines** are drawn — a cell counts when it is land and at least one of
its four neighbours is not. Outlines read far better than a fill at this scale: a
filled landmass becomes an undifferentiated blob of dots, whereas an edge is a
line, which is what the whole design system is built from. It is also 7× cheaper
(10,432 coastline cells against 75,121 land cells), which is why the globe needs
only a few thousand points.

Points are not *filtered* to the coast, they are *squeezed* onto it: each point
keeps its own latitude and its ordering in longitude, and the full 360° is
remapped onto only the coastline cells at that latitude. The mapping is
monotonic, so neighbours stay neighbours and the sphere deforms into the
continents rather than scrambling.

The globe leans its northern hemisphere toward the reader so Europe sits near the
middle of the disc, turns on its axis about once every two
minutess, fades its far side with depth exactly as every other scene does, and is
the one scene with no scattered accent points — the marked location is the only
lime on it.

**Morph targets are derived from each point's own home position**, never sampled
fresh — so point *i* stays near its neighbours and the cloud deforms instead of
scrambling. Transitions are staggered by point index over `--dur-reveal` (640ms)
on the design system's single easing curve.

Reactivity channels: **shape** (`uMorph`), **density** (`uDensity` against each
point's seed), **colour** (~5% front-facing accent subset, plus depth-driven
alpha), **size** (perspective attenuation), and **motion** (spin, pointer
parallax, scroll velocity, ripple, idle breathing).

### Why it never covers the text

Each section reserves an empty `<div data-sphere-slot>` in grid columns 7–12. The
engine scissors rendering to that rect, so the sphere is *structurally incapable*
of drawing across body copy — not merely z-indexed behind it. Headings stay in
columns 1–6, which is the design system's own grid rule.

## Languages

English and French, switched by a toggle in the nav. The first visit follows
`navigator.languages`, the choice is then remembered in `localStorage`, and
`<html lang>` tracks it for assistive technology. No routing involved, so every
link works in either language.

`src/i18n/{en,fr}.ts` both satisfy the `Copy` interface in `src/i18n/types.ts`,
so a missing or misspelled string is a type error rather than a blank on the
page. Locale-invariant data — names, dates, URLs, technology names, coordinates —
stays in `src/content/site.ts` and is never duplicated per language.

## Layout

```
design_system/     the KOEBELT design system, unmodified except:
  index.js           runtime barrel (the system ships none, but its lint expects one)
  index.d.ts         type barrel — the ONLY place component props are widened
src/
  three/           SphereEngine + shaders + the seven morph-target generators
  scroll/          IntersectionObserver scene controller, reduced-motion hooks
  sections/        Hero, About, Skills, Projects, Experience, Education, Contact
  pages/           Home, ProjectDetail (/work/:slug), NotFound
  content/         locale-invariant data (dates, URLs, stacks, coordinates)
  i18n/            the Copy interface and the en/fr dictionaries
scripts/
  adherence-lint.mjs   enforces the design system's own no-raw-hex / no-raw-px rules
  build-landmask.mjs   rasterises Natural Earth land polygons into a committed bitmask
  build-favicon.py     composites the logo mark onto brand ink for the favicons
  build-project-images.py  crops project art to the card frame and writes it greyscale
  pnglib.py            minimal stdlib PNG decode/encode shared by both
```

`@ds` resolves to the design system; it stays at the repo root, untouched, so the
design skill can regenerate it without touching `src/`. Its assets are copied into
`public/assets` by a `predev`/`prebuild` script (that copy is gitignored).

## Constraints this code is written under

From the design system's brand rules, and enforced rather than assumed:

- **Lime `#DCFB47` is the only saturated colour**, reserved for one primary action
  and small accents. Never decorative, never a large fill. The sphere uses it on
  ~5% of points and the single location marker.
- **No gradients, no glow, no drop shadows.** The point shader uses a 0.05-wide
  antialiasing band, `NormalBlending` (never additive — it accumulates into bloom).
- **One easing curve everywhere**, `cubic-bezier(.2,.8,.2,1)`, solved in GLSL.
  No bounce, no spring.
- **No raw hex or px in source.** Brand colours reach the shader through
  `getComputedStyle` on CSS custom properties; `npm run lint:adherence` checks it.
- **Voice**: first person singular, no hype adjectives, one-sentence captions.

## Accessibility and performance

- `prefers-reduced-motion` is live-tracked: the render loop stops entirely and
  draws one frame per state change. A global CSS block also freezes the design
  system's `Marquee`, whose animation is inline and otherwise unreachable.
- Quality ladder by device (7,000 / 5,000 / 3,000 points), DPR capped at 2, with
  one automatic downgrade if frame time stays above 20ms. Never upgrades back —
  oscillating between rungs is more visible than staying on the lower one.
- The render loop pauses when the tab is hidden; WebGL context loss is recovered.
- three.js is dynamically imported, so it never blocks first paint (117 kB gz
  initial, 143 kB gz deferred).
- The canvas is `aria-hidden`; everything the sphere conveys is also in the DOM,
  with captions in an `aria-live` region.
- No WebGL, or a failed chunk, degrades to the full static portfolio.

## Images

Project art lives in `originals/` and is prepared by
`npm run build:images` into `public/projects/`. The originals are ~1 MB each;
they are line art on black, which means they are greyscale in everything but the
file header, so cropping them to the card's 4:3 frame and writing a single
greyscale plane takes the set from **3,076 kB to 417 kB (87% smaller)**. The
Cbienlà wordmark is transparent and very wide, so `object-fit: cover` would crop
it to nothing; it is centred on a brand-ink field at the same ratio instead.

## Deploying

Hosted on **Cloudflare Workers** as a static-assets-only Worker (static requests
are free and unmetered), at `koebelt.com`. Configuration is in `wrangler.jsonc`.

- Workers Builds, connected to this repository: build command `npm run build`,
  deploy command `npx wrangler deploy`. The production branch is set under
  Settings → Build → Branch control.
- Routing: the app uses client-side routes (`/work/:slug`).
  `not_found_handling: "single-page-application"` serves `index.html` for any
  path with no file, so a direct hit or refresh on a case study works; unknown
  paths are handled by the app's own 404 page.
- Link previews use `public/og-image.png`, rendered from `scripts/og/og-image.html`
  by `npm run build:og`. The `og:image` and `og:url` tags in `index.html`, and
  `public/sitemap.xml`, hard-code `https://koebelt.com`; update them if the
  domain changes, and add a line to the sitemap when a project is added.

## Known gaps

- Several design-system components have no responsive behaviour of their own and
  are overridden from `src/styles/app.css` rather than edited in place: `WorkRow`
  (352px of fixed grid track), `FooterBar` (56px display email and 56px side
  padding), and `NavBar` (a non-wrapping row of six items).
