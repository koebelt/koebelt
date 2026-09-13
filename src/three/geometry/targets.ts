import { site } from '../../content/site'
import { PROJECT_SLUGS } from '../../i18n/types'
import type { SceneId } from '../types'
import type { SphereCloud } from './fibonacci'
import { LAND_HEIGHT, LAND_WIDTH, isLand, landMask } from './landmask'

/**
 * Every target is derived from the point's own home position by transformation,
 * never by sampling a fresh distribution.
 *
 * That is the rule that makes a morph read as a transformation rather than a
 * teleport: point i stays near point i's neighbours, so each one travels a short,
 * spatially coherent path and the cloud deforms instead of scrambling.
 */
export type TargetGenerator = (cloud: SphereCloud) => Float32Array

const TAU = Math.PI * 2

/** Number of clusters in the skills scene. */
export const CLUSTER_COUNT = 4
/** Number of project stops with a card. */
export const PROJECT_COUNT = PROJECT_SLUGS.length
/** Number of bright rungs on the experience strand. */
export const ROLE_COUNT = 5
/** Number of strata in the education scene. */
export const DEGREE_COUNT = 2

/** Scene 1 — the canonical sphere. Also the rest pose. */
const heroTarget: TargetGenerator = ({ home }) => Float32Array.from(home)

/**
 * Per-latitude-row lists of COASTLINE columns, built once from the generated mask.
 *
 * A cell is coastline when it is land and at least one of its four neighbours is
 * not, so the continents are drawn as outlines rather than filled. Outlines read
 * far better at this scale: a filled landmass turns into an undifferentiated blob
 * of dots, whereas an edge is a line, which is what the design system's whole
 * visual language is built from. It is also 7x cheaper — 10,432 coastline cells
 * against 75,121 land cells — so the same detail costs a fraction of the points.
 *
 * Rows with no coastline borrow the nearest row that has some, so no point is
 * left without anywhere to land; a hidden point would either clump at the origin
 * or streak offscreen during the morph.
 */
let coastRowsCache: Uint16Array[] | null = null

function coastRows(): Uint16Array[] {
  if (coastRowsCache) return coastRowsCache

  const mask = landMask()
  // Longitude wraps; latitude does not, so the poles count as edges.
  const at = (col: number, row: number) =>
    row >= 0 && row < LAND_HEIGHT && isLand(mask, (col + LAND_WIDTH) % LAND_WIDTH, row)

  const rows: (Uint16Array | null)[] = []
  for (let row = 0; row < LAND_HEIGHT; row++) {
    const cols: number[] = []
    for (let col = 0; col < LAND_WIDTH; col++) {
      if (!at(col, row)) continue
      const interior = at(col - 1, row) && at(col + 1, row) && at(col, row - 1) && at(col, row + 1)
      if (!interior) cols.push(col)
    }
    rows.push(cols.length > 0 ? Uint16Array.from(cols) : null)
  }

  coastRowsCache = rows.map((cols, row) => {
    if (cols) return cols
    for (let d = 1; d < LAND_HEIGHT; d++) {
      const up = rows[row - d]
      if (up) return up
      const down = rows[row + d]
      if (down) return down
    }
    return new Uint16Array([0])
  })
  return coastRowsCache
}

/**
 * Scene 2 — Earth, drawn as coastlines.
 *
 * Every point keeps its own latitude and its own ordering in longitude; what
 * changes is that the full 360° of longitude is re-mapped onto just the land
 * cells at that latitude. Because the mapping is monotonic in longitude, points
 * that were neighbours stay neighbours — the sphere squeezes onto the continents
 * rather than scrambling — and because each row gets points in proportion to how
 * much land it holds, the fill is area-correct.
 */
const aboutTarget: TargetGenerator = ({ home, seed, n }) => {
  const out = new Float32Array(n * 3)
  const rows = coastRows()

  for (let i = 0; i < n; i++) {
    const lat = Math.asin(clamp(home[i * 3 + 1], -1, 1))
    const lon = Math.atan2(home[i * 3 + 2], home[i * 3])

    const row = clampInt(
      Math.floor(((Math.PI / 2 - lat) / Math.PI) * LAND_HEIGHT),
      0,
      LAND_HEIGHT - 1,
    )
    const cols = rows[row]

    // Fractional position around the globe, preserved through the remap.
    const f = (lon + Math.PI) / TAU
    const col = cols[clampInt(Math.floor(f * cols.length), 0, cols.length - 1)]

    // Sub-cell jitter so the line reads as a drawn edge rather than a lattice.
    const jx = (seed[i] - 0.5) * (TAU / LAND_WIDTH)
    const jy = (fract(seed[i] * 7.13) - 0.5) * (Math.PI / LAND_HEIGHT)

    const outLon = ((col + 0.5) / LAND_WIDTH) * TAU - Math.PI + jx
    const outLat = Math.PI / 2 - ((row + 0.5) / LAND_HEIGHT) * Math.PI + jy

    writeLatLon(out, i, outLat, outLon, 1)
  }

  // The marked point sits at Niort and is written last so it always wins.
  writeLatLon(
    out,
    markerIndex(n),
    (site.coords.lat * Math.PI) / 180,
    (site.coords.lon * Math.PI) / 180,
    1.03,
  )

  return out
}

/**
 * Scene 3 — four tilted orbital shells, one per skill family.
 *
 * Clusters are contiguous bands of `index` rather than a hash, so neighbouring
 * points join the same shell and the split reads as the sphere peeling apart.
 */
const skillsTarget: TargetGenerator = ({ home, seed, index, n }) => {
  const out = new Float32Array(n * 3)

  for (let i = 0; i < n; i++) {
    const c = Math.min(CLUSTER_COUNT - 1, Math.floor(index[i] * CLUSTER_COUNT))

    // Keep the point's own azimuth so ordering around the ring survives the morph.
    const angle = Math.atan2(home[i * 3 + 2], home[i * 3])
    const radius = 0.7 + 0.12 * c
    const thickness = (seed[i] - 0.5) * 0.04

    // A ring in the XZ plane, then tilted twice so the four shells nest.
    let px = Math.cos(angle) * (radius + thickness)
    let py = thickness * 2
    let pz = Math.sin(angle) * (radius + thickness)

    const tiltX = (c * 32 * Math.PI) / 180
    const tiltY = (c * 90 * Math.PI) / 180
    ;[py, pz] = rotate(py, pz, tiltX)
    ;[px, pz] = rotate(px, pz, tiltY)

    out[i * 3] = px
    out[i * 3 + 1] = py
    out[i * 3 + 2] = pz
  }

  return out
}

/**
 * Scene 4 — idea to shipped: the same object five times, sharper left to right.
 *
 * Not a picture of any single project but of what a project is — something vague
 * made precise. The target here is only the finished form, a wireframe cube at
 * each stop; the scatter and each cube's spin are added in the shader (stops()),
 * because a spin cannot be baked into a static target.
 *
 * The first stops follow PROJECT_SLUGS left to right, one per card.
 */
/**
 * One more stop than there are projects: the extra one, on the right, is the
 * finished form and has no card. Each project hovers one of the stops before it.
 *
 * The row keeps the width it was tuned at with four projects (four pitches of
 * 0.66), and the pitch and cubes shrink to fit however many projects there are,
 * so adding one never pushes the row out of its slot.
 */
export const STOP_COUNT = PROJECT_COUNT + 1
const ROW_WIDTH = 4 * 0.66
export const STOP_PITCH = ROW_WIDTH / (STOP_COUNT - 1)
const CUBE_HALF = 0.18 * (STOP_PITCH / 0.66)

/** The twelve edges of a unit cube, as pairs of corner sign vectors. */
const CUBE_EDGES: [number[], number[]][] = (() => {
  const edges: [number[], number[]][] = []
  for (let axis = 0; axis < 3; axis++) {
    for (const a of [-1, 1]) {
      for (const b of [-1, 1]) {
        const from = [0, 0, 0]
        const to = [0, 0, 0]
        const [o1, o2] = [(axis + 1) % 3, (axis + 2) % 3]
        from[axis] = -1
        to[axis] = 1
        from[o1] = to[o1] = a
        from[o2] = to[o2] = b
        edges.push([from, to])
      }
    }
  }
  return edges
})()

const projectsTarget: TargetGenerator = ({ index, n }) => {
  const out = new Float32Array(n * 3)
  // Turned off its faces so all three axes show; the scene itself does not spin.
  const tiltX = (28 * Math.PI) / 180
  const tiltY = (38 * Math.PI) / 180

  for (let i = 0; i < n; i++) {
    const k = Math.min(STOP_COUNT - 1, Math.floor(index[i] * STOP_COUNT))
    const [from, to] = CUBE_EDGES[Math.floor(hash(i, 1) * CUBE_EDGES.length)]
    const t = hash(i, 2)

    let px = (from[0] + (to[0] - from[0]) * t) * CUBE_HALF
    let py = (from[1] + (to[1] - from[1]) * t) * CUBE_HALF
    let pz = (from[2] + (to[2] - from[2]) * t) * CUBE_HALF
    ;[px, pz] = rotate(px, pz, tiltY)
    ;[py, pz] = rotate(py, pz, tiltX)

    out[i * 3] = (k - (STOP_COUNT - 1) / 2) * STOP_PITCH + px
    out[i * 3 + 1] = py
    out[i * 3 + 2] = pz
  }

  return out
}

/**
 * An independent uniform number per point. The point's own seed is not reused:
 * the shader thins the cloud by dropping high seeds, which would carve the same
 * edges out of every cube instead of thinning them evenly.
 */
function hash(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Scene 5 — a strand of DNA: two helices joined by rungs, one bright rung per role.
 *
 * Experience as what the work is made of rather than a list of dates. Every
 * point's height comes straight from its index, so the five focus bands are five
 * stretches of the strand and each bright rung sits in the middle of its own.
 *
 * The target is upright and still. The lean and the turn about the strand's own
 * axis are applied in the shader (strand()), because spinning the whole scene
 * would make a leaning strand wobble around the vertical instead of turning.
 */
const DNA_HEIGHT = 2.0
const DNA_RADIUS = 0.4
const DNA_TURNS = 2.25
/** Rungs along the strand; a multiple of ROLE_COUNT so one lands on each role's centre. */
const DNA_RUNGS_PER_ROLE = 3
const DNA_RUNGS = ROLE_COUNT * DNA_RUNGS_PER_ROLE
/** The second helix trails the first by less than half a turn, like DNA's major and minor grooves. */
const DNA_GROOVE = Math.PI * 0.8
/** Strands are drawn as round tubes; rungs as thinner bars. */
const DNA_TUBE = 0.02
const DNA_BAR = 0.008

const experienceTarget: TargetGenerator = ({ index, n }) => {
  const out = new Float32Array(n * 3)

  for (let i = 0; i < n; i++) {
    const t = index[i]
    const a = hash(i, 5)

    const rung = Math.min(DNA_RUNGS - 1, Math.floor(t * DNA_RUNGS))
    const roleRung = rung % DNA_RUNGS_PER_ROLE === (DNA_RUNGS_PER_ROLE - 1) / 2
    const rungShare = roleRung ? 0.62 : 0.38

    let cx: number
    let cy: number
    let cz: number
    let thickness: number

    if (a < rungShare) {
      // A base pair: a straight bar across the axis between the two helices.
      const rt = (rung + 0.5) / DNA_RUNGS
      const angle = rt * DNA_TURNS * TAU
      const s = hash(i, 6)
      const ax = Math.cos(angle) * DNA_RADIUS
      const az = Math.sin(angle) * DNA_RADIUS
      cx = ax + (Math.cos(angle + DNA_GROOVE) * DNA_RADIUS - ax) * s
      cy = (rt - 0.5) * DNA_HEIGHT
      cz = az + (Math.sin(angle + DNA_GROOVE) * DNA_RADIUS - az) * s
      thickness = roleRung ? DNA_BAR * 2.5 : DNA_BAR
    } else {
      const angle = t * DNA_TURNS * TAU + (hash(i, 7) < 0.5 ? 0 : DNA_GROOVE)
      cx = Math.cos(angle) * DNA_RADIUS
      cy = (t - 0.5) * DNA_HEIGHT
      cz = Math.sin(angle) * DNA_RADIUS
      thickness = DNA_TUBE
    }

    // Offset onto a small sphere around the centreline, which reads as a tube.
    const u = hash(i, 8) * 2 - 1
    const phi = hash(i, 9) * TAU
    const ring = Math.sqrt(1 - u * u)
    out[i * 3] = cx + Math.cos(phi) * ring * thickness
    out[i * 3 + 1] = cy + u * thickness
    out[i * 3 + 2] = cz + Math.sin(phi) * ring * thickness
  }

  return out
}

/**
 * Scene 6 — two stacked strata, one per degree.
 *
 * Education is layers laid down over time, so the form is two flat discs rather
 * than anything vertical: distinct from the experience strand beside it, and
 * legible in a wide, short slot.
 */
const educationTarget: TargetGenerator = ({ home, seed, index, n }) => {
  const out = new Float32Array(n * 3)
  const tilt = (18 * Math.PI) / 180

  for (let i = 0; i < n; i++) {
    const scaled = index[i] * DEGREE_COUNT
    const layer = Math.min(DEGREE_COUNT - 1, Math.floor(scaled))

    // sqrt keeps the disc evenly filled rather than crowding the centre.
    const radius = 0.92 * Math.sqrt(scaled - layer)
    const angle = Math.atan2(home[i * 3 + 2], home[i * 3])

    let px = Math.cos(angle) * radius
    let py = (layer === 0 ? 1 : -1) * 0.3 + (seed[i] - 0.5) * 0.05
    let pz = Math.sin(angle) * radius
    ;[py, pz] = rotate(py, pz, tilt)

    out[i * 3] = px
    out[i * 3 + 1] = py
    out[i * 3 + 2] = pz
  }

  return out
}

export const targetGenerators: Record<SceneId, TargetGenerator> = {
  hero: heroTarget,
  about: aboutTarget,
  skills: skillsTarget,
  projects: projectsTarget,
  experience: experienceTarget,
  education: educationTarget,
  // A deliberate return to the opening form, six sections later.
  contact: heroTarget,
}

/** How much of the cloud each scene shows. Thinning is a reactivity channel. */
export const sceneDensity: Record<SceneId, number> = {
  hero: 1,
  // The continents need every point they can get.
  about: 1,
  skills: 0.9,
  // Thinning much further breaks the finished cube's edges into loose dots.
  projects: 0.85,
  // The tubes need the points to look solid.
  experience: 0.9,
  education: 0.85,
  contact: 1,
}

/** Which scenes assign points to clusters, and how many. Drives setFocus. */
export const sceneClusters: Record<SceneId, number> = {
  hero: 0,
  about: 0,
  skills: CLUSTER_COUNT,
  projects: PROJECT_COUNT,
  experience: ROLE_COUNT,
  education: DEGREE_COUNT,
  contact: 0,
}

/**
 * Scenes drawn as a leaning strand turning on its own axis (see strand() in the
 * shader).
 */
export const sceneStrand: Record<SceneId, boolean> = {
  hero: false,
  about: false,
  skills: false,
  projects: false,
  experience: true,
  education: false,
  contact: false,
}

/**
 * Scenes drawn as spinning stops (see stops() in the shader). Hovering a card
 * there spins its stop faster instead of tightening it.
 */
export const sceneStops: Record<SceneId, boolean> = {
  hero: false,
  about: false,
  skills: false,
  projects: true,
  experience: false,
  education: false,
  contact: false,
}

/** The single point rendered as the location marker, in the about scene. */
export function markerIndex(n: number): number {
  return Math.floor(n * 0.5)
}

/**
 * Geographic lat/lon to a point on the sphere.
 *
 * The Z term is negated so that increasing longitude runs EAST across the screen
 * when the globe is viewed from the camera. Without it the whole map renders
 * mirrored — the Americas appear where Asia should be.
 */
function writeLatLon(out: Float32Array, i: number, lat: number, lon: number, r: number) {
  const cl = Math.cos(lat)
  out[i * 3] = Math.cos(lon) * cl * r
  out[i * 3 + 1] = Math.sin(lat) * r
  out[i * 3 + 2] = -Math.sin(lon) * cl * r
}

function rotate(a: number, b: number, angle: number): [number, number] {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return [a * c - b * s, a * s + b * c]
}

function clamp(n: number, lo: number, hi: number) {
  return n < lo ? lo : n > hi ? hi : n
}

function clampInt(n: number, lo: number, hi: number) {
  return n < lo ? lo : n > hi ? hi : n
}

function fract(n: number) {
  return n - Math.floor(n)
}
