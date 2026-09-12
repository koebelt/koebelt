/** Golden angle. Successive points advance by this much in azimuth. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

export interface SphereCloud {
  /** xyz triples on the unit sphere, length n*3. */
  home: Float32Array
  /** Per-point pseudo-random value in [0,1), length n. */
  seed: Float32Array
  /** i/n, length n. Drives morph stagger, cluster assignment and timeline height. */
  index: Float32Array
  n: number
}

/**
 * A Fibonacci (golden-spiral) sphere: the cheapest way to get points that are
 * near-uniformly spaced with no clustering at the poles, which a naive lat/lon
 * grid would produce.
 *
 * Ported from the design prototype, including its seed hash, so the WebGL sphere
 * has the same grain as the 2D one it replaces.
 */
export function buildSphere(n: number): SphereCloud {
  const home = new Float32Array(n * 3)
  const seed = new Float32Array(n)
  const index = new Float32Array(n)

  for (let i = 0; i < n; i++) {
    // +0.5 offset keeps the first and last points off the exact poles.
    const y = 1 - ((i + 0.5) / n) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = GOLDEN_ANGLE * i

    home[i * 3] = Math.cos(theta) * r
    home[i * 3 + 1] = y
    home[i * 3 + 2] = Math.sin(theta) * r

    // Prototype's hash. The fract of a large sine — cheap, stable, and good
    // enough to decorrelate size, cluster and accent decisions per point.
    const h = Math.sin(i * 12.9898) * 43758.5453
    seed[i] = Math.abs(h - Math.floor(h))
    index[i] = i / n
  }

  return { home, seed, index, n }
}
