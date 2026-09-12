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

A cloud of ~3,600 points rendered as **one `THREE.Points`, one `ShaderMaterial`,
one draw call**. Everything it does happens in the vertex shader against uniforms
the engine writes once per frame. The HUD asserts the draw-call count, because
that is the whole architectural claim.

It is not decoration: it holds one scene per page section and morphs between them.

| scene | form | what it says |
|---|---|---|
| `hero` | Fibonacci sphere | the rest pose |
| `about` | **Earth, continents filled** | one marked point is Niort |
| `skills` | four nested orbital shells | one per discipline; hovering a card picks one out |
| `projects` | four knots in a row | one per project, sitting above its card |
| `experience` | a column that swells once per role | five roles as five bulges |
| `education` | two stacked strata | one layer per degree |
| `contact` | the sphere again | a deliberate return to the opening form |

### The Earth

Natural Earth's 50m land polygons, rasterised once by `npm run build:landmask`
into a 720×360 bitmask committed as source (`src/three/geometry/landmask.ts`) —
no runtime dependency, no network fetch. 29.0% of the grid is land, which matches
the real figure.

Points are not *filtered* to land, they are *squeezed* onto it: each point keeps
its own latitude and its ordering in longitude, and the full 360° is remapped
onto only the land cells at that latitude. The mapping is monotonic, so
neighbours stay neighbours and the sphere deforms into the continents rather than
scrambling; each row gets points in proportion to how much land it holds, so the
fill is area-correct.

Because there is no depth buffer, both hemispheres would rasterise, and the far
one is compressed by perspective into a smaller area where even a very low alpha
accumulates into a mass that competes with the near side. The globe therefore
culls the back hemisphere outright and fades the terminator.

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
  three/           SphereEngine + shaders + the six morph-target generators
  scroll/          IntersectionObserver scene controller, reduced-motion hooks
  sections/        Hero, About, Skills, Projects, Experience, Contact
  pages/           Home, ProjectDetail (/work/:slug), NotFound
  content/         locale-invariant data (dates, URLs, stacks, coordinates)
  i18n/            the Copy interface and the en/fr dictionaries
scripts/
  adherence-lint.mjs   enforces the design system's own no-raw-hex / no-raw-px rules
  build-landmask.mjs   rasterises Natural Earth land polygons into a committed bitmask
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
- Quality ladder by device (3,600 / 2,400 / 1,536 points), DPR capped at 2, with
  one automatic downgrade if frame time stays above 20ms. Never upgrades back —
  oscillating between rungs is more visible than staying on the lower one.
- The render loop pauses when the tab is hidden; WebGL context loss is recovered.
- three.js is dynamically imported, so it never blocks first paint (111 kB gz
  initial, 136 kB gz deferred).
- The canvas is `aria-hidden`; everything the sphere conveys is also in the DOM,
  with captions in an `aria-live` region.
- No WebGL, or a failed chunk, degrades to the full static portfolio.

## Known gaps

- `site.cvUrl` is unset, so the Download CV button does not render. Drop a PDF in
  `public/` and set it.
- Project deep-dive prose (`problem`, `constraints`, `decisions`, `retrospective`
  in `src/content/projects.ts`) is drafted and needs Thomas's real numbers.
- No project imagery; `MediaFrame` renders the design system's flat placeholder,
  which is what its documentation prescribes.
- Several design-system components have no responsive behaviour of their own and
  are overridden from `src/styles/app.css` rather than edited in place: `WorkRow`
  (352px of fixed grid track), `FooterBar` (56px display email and 56px side
  padding), and `NavBar` (a non-wrapping row of six items).
