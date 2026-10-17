/**
 * Moves the quadcopter figure. The drawing arrives finished (art.generated.ts);
 * this only flies it.
 *
 * Tilt without rebuilding: every quad item was drawn at a known height, and a
 * rotation restricted to one horizontal plane is affine on screen. So each
 * height gets one SVG matrix per frame, and the 124 drawn items follow their
 * plane's matrix. Shading stays as drawn, which holds for the ±15° the loop
 * ever commands.
 */
import { QUAD_DATA } from './art.generated'
import { createQuad, deg, isSettled, shove, step, type Quad } from './model'

type Vec3 = [number, number, number]

const MAX_LEAN = (14 * Math.PI) / 180
const UNIT = Math.sqrt(1.6)

/** The kit's projection (figures/kit/iso-kit.mjs `iso`), restated for the browser. */
function projector() {
  const { origin, scale, azimuth, elevation } = QUAD_DATA.P
  const a = (azimuth * Math.PI) / 180
  const e = (elevation * Math.PI) / 180
  const k = scale * UNIT
  const [sa, ca, se, ce] = [Math.sin(a), Math.cos(a), Math.sin(e), Math.cos(e)]
  const iso = ([x, y, z]: Vec3): [number, number] => [
    origin[0] + (x * sa - y * ca) * k,
    origin[1] + ((x * ca + y * sa) * se - z * ce) * k,
  ]
  return { iso, sa, ca, se }
}

const { iso, sa, ca, se } = projector()

/** Rotates a world point about the pivot: roll about x, then pitch about y. */
function attitude(roll: number, pitch: number) {
  const [cr, sr, cp, sp] = [Math.cos(roll), Math.sin(roll), Math.cos(pitch), Math.sin(pitch)]
  const [px, py, pz] = QUAD_DATA.pivot
  return ([x, y, z]: Vec3): Vec3 => {
    const [dx, dy, dz] = [x - px, y - py, z - pz]
    // Rx(roll): raises +y for positive roll.
    const y1 = dy * cr - dz * sr
    const z1 = dy * sr + dz * cr
    // Ry(pitch): lowers +x for positive pitch.
    const x2 = dx * cp + z1 * sp
    const z2 = -dx * sp + z1 * cp
    return [x2 + px, y1 + py, z2 + pz]
  }
}

/** The SVG matrix that carries the plane at height `z` through `turn`. */
function planeMatrix(z: number, turn: (p: Vec3) => Vec3): string {
  const s0 = iso([0, 0, z])
  const sx = iso([1, 0, z])
  const sy = iso([0, 1, z])
  const t0 = iso(turn([0, 0, z]))
  const tx = iso(turn([1, 0, z]))
  const ty = iso(turn([0, 1, z]))
  // Screen basis of the plane before (S) and after (T) the turn.
  const S = [sx[0] - s0[0], sy[0] - s0[0], sx[1] - s0[1], sy[1] - s0[1]]
  const T = [tx[0] - t0[0], ty[0] - t0[0], tx[1] - t0[1], ty[1] - t0[1]]
  const det = S[0] * S[3] - S[1] * S[2]
  const inv = [S[3] / det, -S[1] / det, -S[2] / det, S[0] / det]
  const a = T[0] * inv[0] + T[1] * inv[2]
  const c = T[0] * inv[1] + T[1] * inv[3]
  const b = T[2] * inv[0] + T[3] * inv[2]
  const d = T[2] * inv[1] + T[3] * inv[3]
  const e = t0[0] - (a * s0[0] + c * s0[1])
  const f = t0[1] - (b * s0[0] + d * s0[1])
  return `matrix(${a.toFixed(5)} ${b.toFixed(5)} ${c.toFixed(5)} ${d.toFixed(5)} ${e.toFixed(2)} ${f.toFixed(2)})`
}

/** Both blades of a prop at `angle`, flat on the disc plane (same as the build's bladePath). */
function bladePath([x, y, z]: Vec3, angle: number): string {
  const one = (a: number) => {
    const c = Math.cos(a)
    const s = Math.sin(a)
    const lead = QUAD_DATA.blade.map(([r, w]) => iso([x + c * r - s * w, y + s * r + c * w, z]))
    const trail = QUAD_DATA.blade.map(([r, w]) => iso([x + c * r + s * w * 0.7, y + s * r - c * w * 0.7, z])).reverse()
    return 'M' + [...lead, ...trail].map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join('L') + 'Z'
  }
  return one(angle) + one(angle + Math.PI)
}

/** A screen direction (px right, px down) as a floor direction (unit x, y). */
function floorOf(dx: number, dy: number): [number, number] {
  // Screen right is world (sa, -ca); screen down on the floor is (ca, sa) foreshortened by se.
  const fx = dx * sa + (dy / se) * ca
  const fy = -dx * ca + (dy / se) * sa
  const n = Math.hypot(fx, fy) || 1
  return [fx / n, fy / n]
}

export interface Mounted {
  stop(): void
}

/**
 * Starts the figure in `stage` (the element holding the SVG). `say` gets the
 * readout's values, already formatted. Returns a handle to stop it.
 */
export function mountQuadcopter(stage: HTMLElement, say: (roll: string, pitch: string, motors: string) => void): Mounted {
  const svg = stage.querySelector('svg')!
  const planes = [...svg.querySelectorAll<SVGGElement>('[data-plane]')]
  const props = QUAD_DATA.props.map((p) => {
    const g = svg.querySelector<SVGGElement>(`[data-prop="${p.id}"]`)!
    return {
      ...p,
      disc: g.querySelector<SVGPathElement>('.q-disc')!,
      blade: g.querySelector<SVGPathElement>('.q-blade')!,
      rim: g.querySelector<SVGPathElement>('.q-rim')!,
      angle: QUAD_DATA.stillSpin * p.spin + p.id,
    }
  })
  const shadow = svg.querySelector<SVGGElement>('[data-shadow]')
  const still = matchMedia('(prefers-reduced-motion: reduce)')

  const q: Quad = createQuad()
  let frame = 0
  let last = 0
  let visible = false
  let touring = !still.matches
  let tourClock = 0
  let nextGust = 2.4
  let idleTimer = 0

  function draw() {
    const [roll, pitch] = [q.axes[0].angle, q.axes[1].angle]
    const turn = attitude(roll, pitch)
    const byPlane = QUAD_DATA.planes.map((z) => planeMatrix(z, turn))
    for (const g of planes) g.setAttribute('transform', byPlane[Number(g.dataset.plane)])
    // The shadow leans with the frame: the low side's shadow comes closer.
    if (shadow) {
      const [dx, dy] = [Math.sin(pitch) * 18, -Math.sin(roll) * 18]
      const [a, b] = iso([dx, dy, 0])
      const [o0, o1] = iso([0, 0, 0])
      shadow.setAttribute('transform', `translate(${(a - o0).toFixed(2)} ${(b - o1).toFixed(2)})`)
    }
    props.forEach((p, m) => {
      const u = q.motors[m]
      // Faster props blur to a denser disc.
      const load = Math.max(0, Math.min(1, (u - 0.45) / 0.3))
      p.disc.style.opacity = (0.015 + 0.06 * load).toFixed(3)
      p.rim.style.opacity = (0.15 + 0.5 * load).toFixed(3)
      p.blade.style.opacity = (0.2 + 0.55 * load).toFixed(3)
      p.blade.setAttribute('d', bladePath(p.at as unknown as Vec3, p.angle))
    })
    // As a pilot reads them: right wing down and nose up are positive. The
    // model's roll already raises the left side; its pitch lowers the nose.
    say(deg(roll).toFixed(1), (-deg(pitch)).toFixed(1), q.motors.map((u) => Math.round(u * 100)).join(' '))
  }

  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60
    last = now
    if (touring) {
      // A slow figure of eight, with a gust now and then.
      tourClock += dt
      q.set = [Math.sin(tourClock * 0.7) * 0.12, Math.sin(tourClock * 1.4) * 0.07]
      if (tourClock > nextGust) {
        const a = tourClock * 2.3
        shove(q, [Math.cos(a), Math.sin(a)])
        nextGust = tourClock + 3.2
      }
    }
    step(q, dt)
    // Props: a stroboscopic turn, faster with throttle. The real rotor is at
    // about 100 turns a second; nothing on a screen can show that.
    props.forEach((p, m) => (p.angle += dt * p.spin * (2 + 10 * q.motors[m])))
    draw()
    frame = visible && (touring || !isSettled(q)) ? requestAnimationFrame(tick) : 0
  }

  const run = () => {
    if (!frame && visible && !still.matches) {
      last = 0
      frame = requestAnimationFrame(tick)
    }
  }
  const takeOver = () => {
    touring = false
    clearTimeout(idleTimer)
    idleTimer = window.setTimeout(() => {
      touring = !still.matches
      run()
    }, 4000)
    run()
  }

  // Steering: lean toward the pointer, further the further out it is.
  const onMove = (event: PointerEvent) => {
    const box = svg.getBoundingClientRect()
    const centre = iso(QUAD_DATA.pivot as unknown as Vec3)
    const scale = box.width / QUAD_DATA.width
    const dx = (event.clientX - box.left) / scale - centre[0]
    const dy = (event.clientY - box.top) / scale - centre[1]
    const reach = Math.min(1, Math.hypot(dx, dy) / (QUAD_DATA.width * 0.38))
    const [fx, fy] = floorOf(dx, dy)
    // Lowering the side toward (fx, fy): roll lowers +y for negative roll, pitch lowers +x for positive pitch.
    q.set = [-fy * MAX_LEAN * reach, fx * MAX_LEAN * reach]
    takeOver()
  }
  const onLeave = () => {
    q.set = [0, 0]
    takeOver()
  }
  // A click shoves the side under the pointer down; the loop catches it.
  const onClick = (event: MouseEvent) => {
    const box = svg.getBoundingClientRect()
    const centre = iso(QUAD_DATA.pivot as unknown as Vec3)
    const scale = box.width / QUAD_DATA.width
    shove(q, floorOf((event.clientX - box.left) / scale - centre[0], (event.clientY - box.top) / scale - centre[1]), 1.4)
    takeOver()
  }
  // Arrow keys lean toward that side of the screen; space or Enter is a gust.
  const onKey = (event: KeyboardEvent) => {
    const screen: Record<string, [number, number]> = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      shove(q, floorOf(1, 0.4), 1.4)
      takeOver()
      return
    }
    if (event.key === 'Escape' || event.key === 'Home') {
      q.set = [0, 0]
      takeOver()
      return
    }
    const direction = screen[event.key]
    if (!direction) return
    event.preventDefault()
    const [fx, fy] = floorOf(...direction)
    q.set = [-fy * MAX_LEAN, fx * MAX_LEAN]
    takeOver()
  }

  stage.addEventListener('pointermove', onMove)
  stage.addEventListener('pointerleave', onLeave)
  stage.addEventListener('click', onClick)
  stage.addEventListener('keydown', onKey)
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting
      if (visible) run()
    },
    // adherence-ignore: IntersectionObserver rootMargin is not CSS; var() does not resolve here
    { rootMargin: '120px 0px' },
  )
  io.observe(stage)
  const onMotionPref = () => {
    touring = !still.matches
    if (still.matches) {
      q.set = [0, 0]
      draw()
    } else run()
  }
  still.addEventListener('change', onMotionPref)
  draw()

  return {
    stop() {
      cancelAnimationFrame(frame)
      clearTimeout(idleTimer)
      io.disconnect()
      still.removeEventListener('change', onMotionPref)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      stage.removeEventListener('click', onClick)
      stage.removeEventListener('keydown', onKey)
    },
  }
}
