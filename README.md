# koebelt

Personal portfolio for Thomas Koebel. React 19 + TypeScript + Vite, built on the
KOEBELT design system, with a reactive point-sphere that carries the page.

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
| `about` | graticule globe | one marked point is Niort |
| `skills` | four nested orbital shells | one per discipline; hovering a card picks one out |
| `projects` | four knots in a row | one per project, sitting above its card |
| `experience` | a column that swells once per role | five roles as five bulges |
| `contact` | the sphere again | a deliberate return to the opening form |

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
  content/         all copy and data, typed
scripts/
  adherence-lint.mjs   enforces the design system's own no-raw-hex / no-raw-px rules
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
