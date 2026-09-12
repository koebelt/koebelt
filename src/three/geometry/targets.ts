import { site } from '../../content/site'
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

/** Number of clusters in the skills and projects scenes. */
export const CLUSTER_COUNT = 4
/** Number of gaussian bulges in the experience column. */
export const ROLE_COUNT = 5
/** Number of strata in the education scene. */
export const DEGREE_COUNT = 2

/** Scene 1 — the canonical sphere. Also the rest pose. */
const heroTarget: TargetGenerator = ({ home }) => Float32Array.from(home)

/**
 * Per-latitude-row lists of land columns, built once from the generated mask.
 *
 * Rows with no land at all (the Southern Ocean, roughly 57°S) borrow the nearest
 * row that has some, so no point is left without anywhere to land — a hidden
 * point would either clump at the origin or streak offscreen during the morph.
 */
let landRowsCache: Uint16Array[] | null = null

function landRows(): Uint16Array[] {
  if (landRowsCache) return landRowsCache

  const mask = landMask()
  const rows: (Uint16Array | null)[] = []

  for (let row = 0; row < LAND_HEIGHT; row++) {
    const cols: number[] = []
    for (let col = 0; col < LAND_WIDTH; col++) if (isLand(mask, col, row)) cols.push(col)
    rows.push(cols.length > 0 ? Uint16Array.from(cols) : null)
  }

  const filled = rows.map((cols, row) => {
    if (cols) return cols
    for (let d = 1; d < LAND_HEIGHT; d++) {
      const up = rows[row - d]
      if (up) return up
      const down = rows[row + d]
      if (down) return down
    }
    return new Uint16Array([0])
  })

  landRowsCache = filled
  return filled
}

/**
 * Scene 2 — Earth, with the continents filled.
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
  const rows = landRows()

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

    // Sub-cell jitter so the fill reads as a cloud rather than a lattice.
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
 * Scene 4 — four knots in a row, one per project.
 *
 * Laid out horizontally rather than in a 2×2 block because the sphere's slot is
 * wide and short, and because a row of four maps one-to-one onto the four project
 * cards directly below it.
 *
 * Radius uses seed² so points bunch toward each knot's centre instead of filling
 * a uniform ball, which makes each knot read as a dense object.
 */
const projectsTarget: TargetGenerator = ({ home, seed, index, n }) => {
  const out = new Float32Array(n * 3)
  const pitch = 0.82
  const tilt = (14 * Math.PI) / 180

  for (let i = 0; i < n; i++) {
    const scaled = index[i] * CLUSTER_COUNT
    const k = Math.min(CLUSTER_COUNT - 1, Math.floor(scaled))
    const ax = (k - (CLUSTER_COUNT - 1) / 2) * pitch
    // A slight alternating lift so the row is not a dead straight line.
    const ay = (k % 2 === 0 ? 1 : -1) * 0.1

    // A contiguous band of `index` is a contiguous band of LATITUDE on the
    // source sphere, so using home directly would make each knot a flat polar
    // cap. Re-map the point's position within its band across a full latitude
    // range instead, keeping its own azimuth — the cluster stays coherent and
    // each knot is a ball rather than a disc.
    const local = scaled - k
    const ly = 1 - local * 2
    const lr = Math.sqrt(Math.max(0, 1 - ly * ly))
    const azimuth = Math.atan2(home[i * 3 + 2], home[i * 3])

    const r = 0.13 + 0.24 * seed[i] * seed[i]

    const px = ax + Math.cos(azimuth) * lr * r
    let py = ay + ly * r
    let pz = Math.sin(azimuth) * lr * r
    ;[py, pz] = rotate(py, pz, tilt)

    out[i * 3] = px
    out[i * 3 + 1] = py
    out[i * 3 + 2] = pz
  }

  return out
}

/**
 * Scene 5 — a vertical column that swells once per role.
 *
 * The bulge envelope is a sum of five gaussians at the five role positions, so
 * the column visibly beats as it rises.
 */
const experienceTarget: TargetGenerator = ({ home, seed, index, n }) => {
  const out = new Float32Array(n * 3)
  const height = 2.2
  const sigma = 0.055

  for (let i = 0; i < n; i++) {
    const t = index[i]
    const y = (t - 0.5) * height

    let bulge = 1
    for (let r = 0; r < ROLE_COUNT; r++) {
      const centre = (r + 0.5) / ROLE_COUNT
      const d = t - centre
      bulge += 1.35 * Math.exp(-(d * d) / (2 * sigma * sigma))
    }

    // Reuse the point's own azimuth so the column keeps the sphere's winding.
    const angle = Math.atan2(home[i * 3 + 2], home[i * 3])
    const radius = (0.06 + 0.1 * seed[i]) * bulge

    out[i * 3] = Math.cos(angle) * radius
    out[i * 3 + 1] = y
    out[i * 3 + 2] = Math.sin(angle) * radius
  }

  return out
}

/**
 * Scene 6 — two stacked strata, one per degree.
 *
 * Education is layers laid down over time, so the form is two flat discs rather
 * than anything vertical: distinct from the experience column beside it, and
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
  projects: 0.55,
  experience: 0.75,
  education: 0.85,
  contact: 1,
}

/** Which scenes assign points to clusters, and how many. Drives setFocus. */
export const sceneClusters: Record<SceneId, number> = {
  hero: 0,
  about: 0,
  skills: CLUSTER_COUNT,
  projects: CLUSTER_COUNT,
  experience: ROLE_COUNT,
  education: DEGREE_COUNT,
  contact: 0,
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
