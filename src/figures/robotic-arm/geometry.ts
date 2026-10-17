/**
 * The robotic arm's moving parts, drawn for any pose. Shared by the build
 * (figures/robotic-arm/build.mjs draws the rest pose into the page) and the
 * browser (live.ts redraws the arm as it moves), so both use the same kit
 * functions and every pose is drawn the way the rest pose is.
 *
 * Drawn from the build photo (originals/robotarm.png): a square base, a round
 * turntable housing, then three pitch joints, each a hobby servo whose round
 * horn drives the next link's side plates, and a toothed two-jaw gripper.
 *
 * Every moving part is a prism or a turned part along the joint axis (world y),
 * so a joint turning only rotates its cross-section in the x–z plane: the
 * kit's prismOf redraws it with true outlines and tones at any angle.
 */
// The kit is plain JavaScript (figures/kit, vendored from the anatomy skill),
// typed loosely through allowJs.
import * as k from '../../../figures/kit/iso-kit.mjs'
import * as G from '../../../figures/kit/lathe.mjs'

export type Vec3 = [number, number, number]
type Flat = [number, number]

export const WIDTH = 640
export const HEIGHT = 480

// World units are millimetres. The arm works in the x–z plane; its joints turn about y.
export const SHOULDER: Flat = [0, 104] // (x, z) of the shoulder axis
export const UPPER = 112 // shoulder to elbow
export const FORE = 104 // elbow to wrist
export const HAND = 74 // wrist to the jaws' tips
export const BLOCK = 22 // the cube it moves
export const PADS: Flat[] = [
  [168, 0],
  [96, 0],
] // pick and place, on the bench (x, z of the pad's centre)

const BENCH = { x: -96, y: -92, w: 330, d: 184, r: 6 }

export const P = k.fitProjection(
  [...k.boxCorners(BENCH, -6, 0), [0, 0, 230], [210, 0, 160], [-40, 0, 150]],
  WIDTH,
  HEIGHT,
  // The shared camera (figures/camera.mjs): true isometric.
  { pad: 30, azimuth: 45, elevation: (Math.atan(1 / Math.SQRT2) * 180) / Math.PI },
)
const V = G.viewOf(P) as Vec3

export interface Pose {
  /** Joint angles in radians: shoulder from horizontal, elbow and wrist relative to the link before. */
  shoulder: number
  elbow: number
  wrist: number
  /** Jaw opening, mm between the jaws. */
  grip: number
  /** The block rides in the jaws. */
  carrying: boolean
  /** Where the block sits on the bench when not carried (x). */
  blockAt: number
}

/** Positions of the joints and the jaws' tips for a pose. */
export function chain(pose: Pose) {
  const a1 = pose.shoulder
  const a2 = a1 + pose.elbow
  const a3 = a2 + pose.wrist
  const S = SHOULDER
  const E: Flat = [S[0] + UPPER * Math.cos(a1), S[1] + UPPER * Math.sin(a1)]
  const W: Flat = [E[0] + FORE * Math.cos(a2), E[1] + FORE * Math.sin(a2)]
  const T: Flat = [W[0] + HAND * Math.cos(a3), W[1] + HAND * Math.sin(a3)]
  return { a1, a2, a3, S, E, W, T }
}

/**
 * Joint angles that put the jaws' tips at (x, z) pointing straight down: the
 * wrist sits HAND above the tips, and the shoulder and elbow solve the
 * two-link triangle to it, elbow up. Null when out of reach.
 */
export function solve(x: number, z: number): Pick<Pose, 'shoulder' | 'elbow' | 'wrist'> | null {
  const wx = x - SHOULDER[0]
  const wz = z + HAND - SHOULDER[1]
  const d = Math.hypot(wx, wz)
  if (d > UPPER + FORE - 0.5 || d < Math.abs(UPPER - FORE) + 0.5) return null
  const cosElbow = (d * d - UPPER * UPPER - FORE * FORE) / (2 * UPPER * FORE)
  const elbow = -Math.acos(Math.max(-1, Math.min(1, cosElbow))) // elbow up: the forearm folds down
  const shoulder = Math.atan2(wz, wx) - Math.atan2(FORE * Math.sin(elbow), UPPER + FORE * Math.cos(elbow))
  const wrist = -Math.PI / 2 - shoulder - elbow
  return { shoulder, elbow, wrist }
}

// ---------------------------------------------------------------- drawing

interface Item {
  /** Painter's layer along the joint axis: back plates first, front horns last. */
  layer: number
  /** Depth within the layer: the in-plane part of the depth. */
  depth: number
  svg: string
}

/** A frame on the joint axis at plane point (x, z), turned to `angle` in the plane. */
const frameAt = ([x, z]: Flat, angle: number) =>
  G.frameOf([x, 0, z], [0, 1, 0], [Math.cos(angle), 0, Math.sin(angle)], [-Math.sin(angle), 0, Math.cos(angle)])

/** A world point at (u, v) in a frame's plane, `y` along the axis. */
const inFrame = (F: { o: Vec3; u: Vec3; v: Vec3 }, u: number, v: number, y: number): Vec3 => [
  F.o[0] + F.u[0] * u + F.v[0] * v,
  y,
  F.o[2] + F.u[2] * u + F.v[2] * v,
]
const inPlaneDepth = (x: number, z: number) => x * V[0] + z * V[2]

const solid = (paths: unknown, style: Record<string, unknown> = {}) => k.solidSvg(paths, style) as string
const line = (d: string, style: Record<string, unknown> = {}) => k.lineSvg(d, style) as string
const dots = (points: Flat[], style: Record<string, unknown> = {}) => k.dotsSvg(points, style) as string
const flat = (p: Vec3): Flat => k.iso(p, P) as Flat

/** A closed outline on a face of a frame's plane, from (u, v) points. */
function faceOutline(F: Parameters<typeof inFrame>[0], points: Flat[], y: number) {
  return k.pathOf(points.map(([u, v]) => flat(inFrame(F, u, v, y))), true) as string
}

/** A rounded slot from u0 to u1, half-width w, as (u, v) points. */
function slot(u0: number, u1: number, w: number, steps = 10): Flat[] {
  const out: Flat[] = []
  for (let i = 0; i <= steps; i++) {
    const t = -Math.PI / 2 + (Math.PI * i) / steps
    out.push([u1 + w * Math.cos(t), w * Math.sin(t)])
  }
  for (let i = 0; i <= steps; i++) {
    const t = Math.PI / 2 + (Math.PI * i) / steps
    out.push([u0 + w * Math.cos(t), w * Math.sin(t)])
  }
  return out
}

/** A side plate of a link: two rounded ends joined, `y0..y1` along the axis. */
function plate(F: ReturnType<typeof frameAt>, r0: number, r1: number, length: number, y0: number, y1: number, cut: Flat[] | null, tone = 'mid') {
  const shape = G.stadium(r0, r1, length, 40)
  const paths = G.prismOf(F, shape, y0, y1, P)
  const face = y1 > 0 ? y1 : y0
  const inner = cut ? line(faceOutline(F, cut, face), { tone: 'lo' }) : ''
  return solid(paths, { tone, inner })
}

/** A servo horn: a disc on the axis with its screw holes, turned to the link's angle. */
function horn(F: ReturnType<typeof frameAt>, y0: number, y1: number, r: number) {
  const D = G.frameOf(F.o, [0, 1, 0], F.u, F.v)
  const paths = G.disc(y0, y1, r, D, P)
  const face = Math.max(y0, y1)
  const holes: Flat[] = []
  const rings: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    holes.push(flat(inFrame(F, Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62, face)))
  }
  rings.push(G.circleOf(G.frameOf([F.o[0], face, F.o[2]], [0, 1, 0], F.u, F.v), 0, r * 0.32, P, 24))
  rings.push(G.circleOf(G.frameOf([F.o[0], face, F.o[2]], [0, 1, 0], F.u, F.v), 0, r * 0.84, P, 40))
  return solid(paths, { tone: 'hi', crease: 'lo' }) + line(rings.join(''), { tone: 'lo' }) + dots(holes, { size: 0.55, tone: 'lo' }) + dots([flat(inFrame(F, 0, 0, face))], { size: 0.7, tone: 'mid' })
}

/**
 * A hobby servo (MG996R-sized: 40 × 20 × 43) with its shaft on the axis at the
 * frame's origin. `along` is the direction of its long side in the plane.
 */
function servo(F: ReturnType<typeof frameAt>, y0: number, y1: number) {
  const body: Flat[] = [[-10, -10], [30, -10], [30, 10], [-10, 10]]
  const tabs: Flat[] = [[-17, -10], [37, -10], [37, -7.6], [-17, -7.6]]
  const seam: Flat[] = [[-10, 4], [30, 4]]
  const bodyPaths = G.prismOf(F, body, y0, y1, P)
  const tabPaths = G.prismOf(F, tabs, y0 + 4, y1 - 4, P)
  // The case's seam line, on the face toward the viewer (+y: the camera looks from +y).
  const face = y1
  const seamLine = k.pathOf(seam.map(([u, v]) => flat(inFrame(F, u, v, face))))
  return solid(tabPaths, { tone: 'lo' }) + solid(bodyPaths, { tone: 'lo', inner: line(seamLine, { tone: 'faint' }) })
}

/**
 * One jaw: a finger with teeth on its inner edge. `side` is +1 or -1. The jaws
 * are 10 thick, thinner than the 22 block, so the block shows between them
 * while it is carried; from the shared camera the near jaw lies wholly to one
 * side of the block's front face, so back jaw, block, near jaw order cleanly.
 */
function jaw(F: ReturnType<typeof frameAt>, gap: number, side: number) {
  const v0 = side * (gap / 2)
  const v1 = side * (gap / 2 + 7)
  const finger: Flat[] = [[34, v0], [HAND, v0], [HAND, v1 - side * 2.5], [HAND - 6, v1], [34, v1]]
  const out = [solid(G.prismOf(F, finger, -5, 5, P), { tone: 'hi', crease: 'lo' })]
  for (let i = 0; i < 4; i++) {
    const u = 48 + i * 6.4
    const tooth: Flat[] = [[u, v0], [u + 4.6, v0], [u + 2.3, v0 - side * 2.2]]
    out.push(solid(G.prismOf(F, tooth, -5, 5, P), { tone: 'hi', crease: 'lo' }))
  }
  return out.join('')
}

/** Every moving part of the arm, back to front, as one SVG string. */
export function drawArm(pose: Pose): string {
  const { a1, a2, a3, S, E, W, T } = chain(pose)
  const items: Item[] = []
  const add = (layer: number, at: Flat, svg: string) => items.push({ layer, depth: inPlaneDepth(at[0], at[1]), svg })

  // The shoulder servo stands on the turntable, its shaft on the axis. It does
  // not move, but it sits between the upper arm's plates, so it is ordered here.
  add(2, [S[0], S[1] - 12], servo(frameAt(S, -Math.PI / 2), -20, 20))

  // Upper arm: back plate, front plate with its long slot, horn outside.
  const F1 = frameAt(S, a1)
  const mid1: Flat = [(S[0] + E[0]) / 2, (S[1] + E[1]) / 2]
  add(0, mid1, plate(F1, 19, 16, UPPER, -24, -21, null))
  add(2, mid1, solid(G.prismOf(F1, [[40, -6], [72, -6], [72, 6], [40, 6]], -21, 21, P), { tone: 'lo' }))
  add(3, mid1, plate(F1, 19, 16, UPPER, 21, 24, slot(30, UPPER - 34, 5.5)))
  add(4, S, horn(F1, 24, 27, 13))

  // Elbow servo, carried by the upper arm (its body lies back along it);
  // forearm plates outside the upper arm's, and the horn outside those.
  add(2, E, servo(frameAt(E, a1 + Math.PI), -20, 20))
  const F2 = frameAt(E, a2)
  const mid2: Flat = [(E[0] + W[0]) / 2, (W[1] + E[1]) / 2]
  const tri: Flat[] = [[32, -7], [FORE - 30, -4], [FORE - 30, 4], [32, 7]]
  add(0, mid2, plate(F2, 16, 13, FORE, -27, -24, null))
  add(3.5, mid2, plate(F2, 16, 13, FORE, 27, 30, tri))
  add(4.5, E, horn(F2, 30, 33, 11.5))

  // Wrist servo, carried by the forearm; the wrist bracket outside the
  // forearm plates, its horn outside that, and the gripper body across it.
  add(2, W, servo(frameAt(W, a2 + Math.PI), -17, 17))
  const F3 = frameAt(W, a3)
  const mid3: Flat = [(W[0] + T[0]) / 2, (W[1] + T[1]) / 2]
  add(0, mid3, plate(F3, 13, 9, 30, -33, -30, null))
  add(3.7, mid3, plate(F3, 13, 9, 30, 30, 33, null))
  add(4.7, W, horn(F3, 33, 36, 10))
  add(2, inFrameFlat(F3, 31, 0), solid(G.prismOf(F3, [[26, -14], [36, -14], [36, 14], [26, 14]], -30, 30, P), { tone: 'mid' }))
  // The jaws and the block share the axis span, so they order by depth alone.
  const gap = Math.max(BLOCK - 0.2, pose.grip)
  add(2, inFrameFlat(F3, 56, -gap / 2 - 4), jaw(F3, gap, -1))
  add(2, inFrameFlat(F3, 56, gap / 2 + 4), jaw(F3, gap, 1))

  // The block: in the jaws, or on the bench.
  // Held where the jaws closed on it: the block's centre 7 above the tips.
  const centre: Flat = pose.carrying ? inFrameFlat(F3, HAND - 7, 0) : [pose.blockAt, BLOCK / 2]
  const angle = pose.carrying ? a3 + Math.PI / 2 : 0
  const Fb = frameAt(centre, angle)
  const half = BLOCK / 2
  const cube = G.prismOf(Fb, [[-half, -half], [half, -half], [half, half], [-half, half]], -half, half, P)
  add(2, centre, solid(cube, { tone: 'hi', crease: 'lo', inner: line(faceOutline(Fb, [[-half + 3, -half + 3], [half - 3, -half + 3], [half - 3, half - 3], [-half + 3, half - 3]], half), { tone: 'faint' }) }))

  items.sort((a, b) => a.layer - b.layer || a.depth - b.depth)
  return items.map((item) => item.svg).join('')
}

/** The destination the phone sent: a ring on the bench under it and a dot at its height. */
export function drawTarget(x: number, z: number): string {
  const ring = G.circleOf(G.frameOf([x, 0, 0.6], [0, 0, 1], [1, 0, 0], [0, 1, 0]), 0, 7, P, 40)
  const [cx, cy] = flat([x, 0, z])
  return `<path class="a-target" d="${ring}"/><circle class="a-led" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="1.6"/>`
}

function inFrameFlat(F: ReturnType<typeof frameAt>, u: number, v: number): Flat {
  const p = inFrame(F, u, v, 0)
  return [p[0], p[2]]
}

export { BENCH }
