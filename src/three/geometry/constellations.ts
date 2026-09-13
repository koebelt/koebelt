import type { ProjectSlug } from '../../i18n/types'

/**
 * One star-chart constellation per project.
 *
 * Deliberately suggestive rather than illustrative, the way real constellations
 * are: a handful of stars and the lines someone chose to draw between them. Each
 * one hints at its project without drawing it.
 *
 * Coordinates are local to the project's cell in the row, roughly x ∈ [-0.35,
 * 0.35] and y ∈ [-0.4, 0.4]. Each star carries a little depth so the pointer
 * parallax separates the stars from one another, and a magnitude that sets how
 * many points it gathers — a bright star is a dense clump, a faint one a few dots.
 */
type Star = [x: number, y: number, z: number, magnitude: number]

interface Constellation {
  stars: Star[]
  /** Pairs of star indices joined by a line. */
  edges: [number, number][]
}

const CONSTELLATIONS: Record<ProjectSlug, Constellation> = {
  // The House: a roofline and walls, a chimney star on the right slope, and the
  // brightest star of the four charts sitting unconnected inside — the one lived in.
  cbienla: {
    stars: [
      [0.0, 0.34, 0.05, 1.3],
      [-0.27, 0.08, -0.08, 1.0],
      [0.26, 0.1, 0.06, 1.1],
      [-0.22, -0.34, 0.1, 0.8],
      [0.24, -0.32, -0.05, 1.0],
      [0.18, 0.31, 0.0, 0.5],
      [0.02, -0.1, 0.12, 1.7],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [2, 5],
    ],
  },

  // The Cross: four arms from a bright centre, each ending beside a faint
  // companion star, the way the rotors sit off the ends of the frame.
  quadcopter: {
    stars: [
      [0.0, 0.02, 0.0, 1.4],
      [-0.3, 0.28, 0.08, 1.0],
      [0.28, 0.3, -0.06, 0.9],
      [-0.26, -0.3, -0.1, 0.8],
      [0.32, -0.26, 0.1, 1.1],
      [-0.35, 0.36, 0.1, 0.35],
      [0.34, 0.37, -0.04, 0.35],
      [-0.33, -0.36, -0.08, 0.35],
      [0.37, -0.33, 0.12, 0.35],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
  },

  // The Hands: two small triangles held apart and joined across the top by a
  // bridge through one star — a pair of grips and what they are holding.
  'drone-controller': {
    stars: [
      [-0.28, -0.05, 0.06, 1.1],
      [-0.17, 0.2, -0.04, 0.9],
      [-0.1, -0.28, 0.1, 0.7],
      [0.29, -0.02, -0.06, 1.0],
      [0.17, 0.22, 0.05, 0.9],
      [0.12, -0.26, -0.1, 0.7],
      [0.0, 0.28, 0.0, 1.2],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [3, 4],
      [3, 5],
      [1, 6],
      [6, 4],
    ],
  },

  // The Reach: a bright base, a chain of joints climbing away from it, and two
  // faint stars opening off the last one.
  'robotic-arm': {
    stars: [
      [-0.3, -0.35, 0.0, 1.3],
      [-0.12, -0.38, 0.06, 0.6],
      [-0.22, -0.04, 0.08, 1.0],
      [0.07, 0.26, -0.06, 1.1],
      [0.26, 0.1, 0.05, 0.9],
      [0.35, 0.24, 0.0, 0.5],
      [0.35, -0.02, 0.1, 0.5],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [4, 6],
    ],
  },
}

/** How a project's band of points is split between stars, lines and dust. */
const STAR_SHARE = 0.42
const LINE_SHARE = 0.43
// The remaining 15% is faint dust scattered through the cell, so each
// constellation sits in a patch of sky rather than on an empty page.

/** Clump radius of a magnitude-1 star. */
const STAR_RADIUS = 0.024
/** Lines stop short of their stars, as they do on a printed star chart. */
const LINE_INSET = 0.18

interface Prepared {
  constellation: Constellation
  /** Cumulative, normalised star magnitudes. */
  starCdf: number[]
  /** Cumulative, normalised line lengths. */
  edgeCdf: number[]
}

const prepared = new Map<ProjectSlug, Prepared>()

function prepare(slug: ProjectSlug): Prepared {
  const cached = prepared.get(slug)
  if (cached) return cached

  const constellation = CONSTELLATIONS[slug]
  const { stars, edges } = constellation
  const lengths = edges.map(([a, b]) => Math.hypot(stars[a][0] - stars[b][0], stars[a][1] - stars[b][1]))

  const result = {
    constellation,
    starCdf: cdf(stars.map((s) => s[3])),
    edgeCdf: cdf(lengths),
  }
  prepared.set(slug, result)
  return result
}

/**
 * Where a point belongs in a project's constellation.
 *
 * `t` is the point's position within its project's band, `seed` its own random
 * value. Consecutive `t` stay together — the same star, or neighbours along the
 * same line — so the staggered morph gathers each star and then draws each line
 * rather than scattering points across the chart.
 */
export function sampleConstellation(slug: ProjectSlug, t: number, seed: number): [number, number, number] {
  const { constellation, starCdf, edgeCdf } = prepare(slug)
  const { stars, edges } = constellation

  if (t < STAR_SHARE) {
    const [k, local] = pick(starCdf, t / STAR_SHARE)
    const [x, y, z, magnitude] = stars[k]
    // seed² bunches points toward the core, so a star reads as bright and small.
    const r = STAR_RADIUS * Math.sqrt(magnitude) * seed * seed
    const angle = local * Math.PI * 2 * 5
    return [x + Math.cos(angle) * r, y + Math.sin(angle) * r, z + (fract(seed * 5.3) - 0.5) * 0.01]
  }

  if (t < STAR_SHARE + LINE_SHARE) {
    const [k, local] = pick(edgeCdf, (t - STAR_SHARE) / LINE_SHARE)
    const [a, b] = edges[k]
    const f = LINE_INSET + local * (1 - LINE_INSET * 2)
    const sa = stars[a]
    const sb = stars[b]
    const wobble = (seed - 0.5) * 0.006
    return [
      sa[0] + (sb[0] - sa[0]) * f + wobble,
      sa[1] + (sb[1] - sa[1]) * f - wobble,
      sa[2] + (sb[2] - sa[2]) * f,
    ]
  }

  const u = (t - STAR_SHARE - LINE_SHARE) / (1 - STAR_SHARE - LINE_SHARE)
  return [(u - 0.5) * 0.8, (fract(seed * 17.31) - 0.5) * 0.9, (fract(seed * 3.71) - 0.5) * 0.3]
}

function cdf(weights: number[]): number[] {
  const total = weights.reduce((a, b) => a + b, 0)
  let run = 0
  return weights.map((w) => (run += w / total))
}

/** The entry `u` falls into, and how far through that entry it is. */
function pick(cdf: number[], u: number): [number, number] {
  let k = 0
  while (k < cdf.length - 1 && u >= cdf[k]) k++
  const start = k === 0 ? 0 : cdf[k - 1]
  return [k, (u - start) / Math.max(cdf[k] - start, 1e-6)]
}

function fract(n: number) {
  return n - Math.floor(n)
}
