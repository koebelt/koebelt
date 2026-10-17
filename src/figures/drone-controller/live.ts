/**
 * Moves the controller figure: stick caps follow the pointer, buttons press,
 * and the LCD shows what the aircraft sends back.
 *
 * The point the figure makes is the case study's: stick positions go out at a
 * fixed 50 Hz whether or not anything moved, so the packet counter keeps
 * counting while the sticks are still, and a silent link is unmistakable.
 */
import { CONTROLLER_DATA } from './art.generated'

type Vec3 = [number, number, number]

const RATE_HZ = 50
const UNIT = Math.sqrt(1.6)
const MAX_ANGLE = 30 // degrees of roll or pitch at full stick
const RESPONSE = 0.25 // s: how quickly the aircraft follows the sticks

function projector() {
  const { origin, scale, azimuth, elevation } = CONTROLLER_DATA.P
  const a = (azimuth * Math.PI) / 180
  const e = (elevation * Math.PI) / 180
  const k = scale * UNIT
  const [sa, ca, se, ce] = [Math.sin(a), Math.cos(a), Math.sin(e), Math.cos(e)]
  const iso = ([x, y, z]: Vec3): [number, number] => [origin[0] + (x * sa - y * ca) * k, origin[1] + ((x * ca + y * sa) * se - z * ce) * k]
  return { iso, k, sa, ca, se }
}
const { iso, k, sa, ca, se } = projector()

/** A screen offset (viewBox units) as a floor offset (world units). */
function floorOffset(dx: number, dy: number): [number, number] {
  const fx = dx * sa + (dy / se) * ca
  const fy = -dx * ca + (dy / se) * sa
  return [fx / k, fy / k]
}

const pad = (n: number, width: number) => String(Math.round(n)).padStart(width, ' ')
const signed = (n: number) => (Math.round(n) >= 0 ? '+' : '-') + String(Math.abs(Math.round(n))).padStart(2, '0')

export interface ControllerValues {
  count: string
  idle: string
}

export function mountController(stage: HTMLElement, say: (values: ControllerValues) => void) {
  const svg = stage.querySelector('svg')!
  const rows = [0, 1, 2, 3].map((i) => svg.querySelector<SVGTextElement>(`[data-row="${i}"]`)!)
  const sticks = CONTROLLER_DATA.sticks.map((s) => ({
    id: s.id,
    pivot: s.pivot as unknown as Vec3,
    capAt: s.cap as unknown as Vec3,
    cap: svg.querySelector<SVGGElement>(`[data-cap="${s.id}"]`)!,
    shaft: svg.querySelector<SVGPathElement>(`[data-shaft="${s.id}"]`)!,
    // Deflection in the floor plane, -1..1 on each axis: x toward the pilot, y to their left.
    at: [0, 0] as [number, number],
    target: [0, 0] as [number, number],
  }))
  const buttons = CONTROLLER_DATA.buttons.map((b) => ({ ...b, el: svg.querySelector<SVGGElement>(`[data-button="${b.id}"]`)!, until: 0 }))
  const still = matchMedia('(prefers-reduced-motion: reduce)')

  // Left stick: throttle (toward the back of the controller is up) and yaw.
  // Right stick: pitch and roll. Throttle does not spring back; the rest do.
  const [left, right] = sticks
  const aircraft = { armed: false, mode: 'STAB', roll: 0, pitch: 0, volts: 12.4 }
  let clock = 0 // animation time: steps are capped, so it can lag on a slow device
  let started = 0 // wall clock at mount: the radio does not slow down with the screen
  let sent = 0
  let lastMove = 0 // wall clock, ms
  let wall = 0
  let frame = 0
  let last = 0
  let visible = false
  let touring = !still.matches
  let tourClock = 0
  let idleTimer = 0

  const press = (id: number) => {
    const b = buttons[id]
    b.until = clock + 0.14
    if (id === 0 || id === 1) aircraft.armed = !aircraft.armed
    if (id === 2 || id === 3) aircraft.mode = aircraft.mode === 'STAB' ? 'ACRO' : 'STAB'
  }

  function draw() {
    for (const s of sticks) {
      const [ux, uy] = s.at
      const reach = CONTROLLER_DATA.reach
      // The cap swings on the gimbal: it moves across and drops a little.
      const drop = 1.2 * (ux * ux + uy * uy)
      const [x0, y0] = iso(s.capAt)
      const [x1, y1] = iso([s.capAt[0] + ux * reach, s.capAt[1] + uy * reach, s.capAt[2] - drop])
      s.cap.setAttribute('transform', `translate(${(x1 - x0).toFixed(2)} ${(y1 - y0).toFixed(2)})`)
      const [px, py] = iso(s.pivot)
      const [cx, cy] = iso([s.capAt[0] + ux * reach, s.capAt[1] + uy * reach, s.capAt[2] - drop + 0.4])
      s.shaft.setAttribute('d', `M${px.toFixed(1)} ${py.toFixed(1)}L${cx.toFixed(1)} ${cy.toFixed(1)}`)
      s.shaft.style.strokeWidth = (2 * CONTROLLER_DATA.shaftR * k).toFixed(2)
    }
    for (const b of buttons) {
      const down = clock < b.until
      const [dx, dy] = iso([0, 0, down ? -1.6 : 0])
      const [ox, oy] = iso([0, 0, 0])
      b.el.setAttribute('transform', down ? `translate(${(dx - ox).toFixed(2)} ${(dy - oy).toFixed(2)})` : '')
    }
    const throttle = Math.max(0, Math.min(100, (-left.at[0] + 1) * 50))
    const link = 97 + Math.round(2 * Math.abs(Math.sin(clock * 0.9) * Math.sin(clock * 2.3)))
    const text = [
      `${aircraft.armed ? 'ARMED   ' : 'DISARMED'}  ${aircraft.mode} ${aircraft.volts.toFixed(1)}V`,
      `ROLL ${signed(aircraft.roll)}  PITCH ${signed(aircraft.pitch)}`,
      `THR ${pad(throttle, 3)}%  LINK ${pad(link, 3)}%`,
      `TX ${RATE_HZ}Hz  #${String(sent % 1_000_000).padStart(6, '0')}`,
    ]
    rows.forEach((row, i) => {
      if (row.textContent !== text[i]) row.textContent = text[i]
    })
    say({ count: String(sent), idle: (Math.max(0, wall - (lastMove || wall)) / 1000).toFixed(1) })
  }

  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60
    last = now
    clock += dt
    started ||= now
    wall = now
    sent = Math.floor(((now - started) / 1000) * RATE_HZ)

    if (touring) {
      // Fly a little, then hold still for a while: the counter never pauses.
      tourClock += dt
      const phase = tourClock % 8
      if (tourClock > 1 && !aircraft.armed && tourClock < 1.2) press(0)
      if (phase < 4.5) {
        const t = tourClock
        left.target = [-0.1 - 0.15 * Math.sin(t * 0.8), 0.35 * Math.sin(t * 1.3)]
        right.target = [0.55 * Math.sin(t * 1.7), 0.55 * Math.cos(t * 1.1)]
      } else {
        right.target = [0, 0]
        left.target = [left.target[0], 0]
      }
    }

    for (const s of sticks) {
      const before = [...s.at]
      const ease = 1 - Math.exp(-dt / 0.08)
      s.at = [s.at[0] + (s.target[0] - s.at[0]) * ease, s.at[1] + (s.target[1] - s.at[1]) * ease]
      if (Math.hypot(s.at[0] - before[0], s.at[1] - before[1]) > 1e-3) lastMove = now
    }
    // The aircraft follows the right stick: forward (away from the pilot) is nose down.
    const follow = 1 - Math.exp(-dt / RESPONSE)
    aircraft.roll += (-right.at[1] * MAX_ANGLE - aircraft.roll) * follow
    aircraft.pitch += (right.at[0] * MAX_ANGLE - aircraft.pitch) * follow
    if (aircraft.armed) aircraft.volts = Math.max(10.5, aircraft.volts - dt * 0.0004 * (1 - left.at[0]))

    draw()
    frame = visible && !still.matches ? requestAnimationFrame(tick) : 0
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
      tourClock = 2
      run()
    }, 4000)
    run()
  }

  const toWorld = (event: { clientX: number; clientY: number }) => {
    const box = svg.getBoundingClientRect()
    const scale = box.width / CONTROLLER_DATA.width
    return [(event.clientX - box.left) / scale, (event.clientY - box.top) / scale] as const
  }

  // The nearer stick follows the pointer, as far as its gate allows.
  const onMove = (event: PointerEvent) => {
    const [mx, my] = toWorld(event)
    const nearest = sticks
      .map((s) => {
        const [sx, sy] = iso(s.capAt)
        return { s, dx: mx - sx, dy: my - sy, d: Math.hypot(mx - sx, my - sy) }
      })
      .sort((a, b) => a.d - b.d)[0]
    const [fx, fy] = floorOffset(nearest.dx, nearest.dy)
    const r = Math.hypot(fx, fy)
    const gain = 1 / 22 // a pointer 22 mm out is full stick
    const scaleBack = Math.min(1, 1 / (r * gain || 1))
    nearest.s.target = [fx * gain * scaleBack, fy * gain * scaleBack]
    // The other stick lets go: the right one centres, the left keeps its throttle.
    const other = sticks.find((s) => s !== nearest.s)!
    other.target = other === left ? [left.target[0], 0] : [0, 0]
    takeOver()
  }
  const onLeave = () => {
    right.target = [0, 0]
    left.target = [left.target[0], 0]
    takeOver()
  }
  const onClick = (event: MouseEvent) => {
    const [mx, my] = toWorld(event)
    const hit = buttons.find((b) => {
      const [bx, by] = iso([b.at[0], b.at[1], 28] as Vec3)
      return Math.hypot(mx - bx, my - by) < 9 * k
    })
    if (hit) press(hit.id)
    takeOver()
  }
  const onKey = (event: KeyboardEvent) => {
    const keys: Record<string, [typeof left, number, number]> = {
      w: [left, -1, 0],
      s: [left, 1, 0],
      a: [left, 0, 1],
      d: [left, 0, -1],
      ArrowUp: [right, -1, 0],
      ArrowDown: [right, 1, 0],
      ArrowLeft: [right, 0, 1],
      ArrowRight: [right, 0, -1],
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      press(0)
    } else if (event.key === 'm') press(2)
    else if (keys[event.key]) {
      event.preventDefault()
      const [s, ax, ay] = keys[event.key]
      s.target = [Math.max(-1, Math.min(1, s.target[0] + ax * 0.25)), Math.max(-1, Math.min(1, s.target[1] + ay * 0.25))]
    } else return
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
  const onMotionPref = () => (still.matches ? draw() : run())
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
