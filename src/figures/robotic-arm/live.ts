/**
 * Moves the robotic arm. The phone sends where the jaws should go, nothing
 * more; the firmware here works out the joint angles (geometry.ts `solve`) and
 * gets there smoothly at its own pace. Cut the link and the arm holds where it
 * is, whatever it was doing: for an arm that may be holding something, stopping
 * is the safe state, letting go is not.
 */
import { ARM_REST } from './art.generated'
import { BLOCK, P, PADS, WIDTH, drawArm, drawTarget, solve, type Pose } from './geometry'

type Flat = [number, number]

const SPEED = 140 // mm/s, the most the firmware lets the jaws travel
const SETTLE = 0.12 // s, how softly it eases into each destination
const OPEN = 34 // mm between the jaws, open
const SAFE = 70 // mm above the bench, travelling height
const DOWN = 4 // the jaws' tips just above the bench, either side of the block

const UNIT = Math.sqrt(1.6)
function screenToPlane(sx: number, sy: number): Flat {
  // Invert the kit's projection for points on the arm's plane (y = 0).
  const a = (P.azimuth * Math.PI) / 180
  const e = (P.elevation * Math.PI) / 180
  const k = P.scale * UNIT
  const dx = (sx - P.origin[0]) / k
  const dy = (sy - P.origin[1]) / k
  const x = dx / Math.sin(a)
  const z = (x * Math.cos(a) * Math.sin(e) - dy) / Math.cos(e)
  return [x, z]
}

/** The nearest point the jaws can reach, pointing down, to (x, z). */
function reachable([x, z]: Flat): Flat {
  const clamped: Flat = [Math.max(40, Math.min(230, x)), Math.max(DOWN, Math.min(150, z))]
  if (solve(...clamped)) return clamped
  // Walk back toward the arm until it fits.
  for (let t = 0.98; t > 0.2; t -= 0.02) {
    const p: Flat = [40 + (clamped[0] - 40) * t, DOWN + (clamped[1] - DOWN) * t]
    if (solve(...p)) return p
  }
  return [PADS[1][0], SAFE]
}

export interface ArmValues {
  x: string
  z: string
  state: 'moving' | 'there' | 'holding'
}

export function mountArm(stage: HTMLElement, say: (values: ArmValues) => void) {
  const svg = stage.querySelector('svg')!
  const armLayer = svg.querySelector<SVGGElement>('[data-arm]')!
  const targetLayer = svg.querySelector<SVGGElement>('[data-target]')!
  const led = svg.querySelector<SVGCircleElement>('[data-led]')
  const still = matchMedia('(prefers-reduced-motion: reduce)')

  const pose: Pose = { ...ARM_REST }
  let tip: Flat = [PADS[0][0], SAFE] // where the jaws' tips are
  let target: Flat = [...tip] // where the phone last asked them to be
  let velocity: Flat = [0, 0]
  let link = true
  let frame = 0
  let last = 0
  let visible = false
  let touring = !still.matches
  let idleTimer = 0
  let dirty = true

  // The tour: a pick from whichever pad the block is on, a place on the other.
  type Step = { to?: Flat; grip?: number; carry?: boolean; hold?: number }
  let steps: Step[] = []
  let stepHold = 0
  const plan = () => {
    const from = pose.blockAt
    const to = Math.abs(from - PADS[0][0]) < 1 ? PADS[1][0] : PADS[0][0]
    steps = [
      { to: [from, SAFE], grip: OPEN },
      { to: [from, DOWN] },
      { grip: BLOCK - 0.2, hold: 0.35 },
      // Taken the moment the jaws close, where they hold it, then lifted.
      { carry: true },
      { to: [from, SAFE] },
      { to: [to, SAFE] },
      { to: [to, DOWN] },
      { grip: OPEN, carry: false, hold: 0.35 },
      { to: [to, SAFE], hold: 0.6 },
    ]
  }

  function draw(state: ArmValues['state']) {
    if (dirty) {
      const angles = solve(...tip)
      if (angles) Object.assign(pose, angles)
      armLayer.innerHTML = drawArm(pose)
      targetLayer.innerHTML = drawTarget(target[0], target[1])
      dirty = false
    }
    if (led) led.toggleAttribute('data-off', !link)
    say({ x: target[0].toFixed(0), z: target[1].toFixed(0), state })
  }

  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60
    last = now

    // Only a live link delivers new destinations; the tour stands in for the phone.
    if (touring && link) {
      if (!steps.length) plan()
      const step = steps[0]
      if (step.to) target = reachable(step.to)
      const arrived = Math.hypot(tip[0] - target[0], tip[1] - target[1]) < 0.4 && Math.hypot(...velocity) < 2
      if (!step.to || arrived) {
        if (step.grip !== undefined && pose.grip !== step.grip) {
          pose.grip = step.grip
          dirty = true
        }
        if (step.carry !== undefined && pose.carrying !== step.carry) {
          pose.carrying = step.carry
          if (!step.carry) pose.blockAt = target[0]
          dirty = true
        }
        stepHold += dt
        if (stepHold >= (step.hold ?? 0)) {
          steps.shift()
          stepHold = 0
        }
      }
    }

    let state: ArmValues['state'] = 'there'
    if (!link) {
      // Link lost: no new destination, and the firmware stops where it is.
      velocity = [0, 0]
      state = 'holding'
    } else {
      // Ease toward the destination, never faster than SPEED.
      const want: Flat = [(target[0] - tip[0]) / SETTLE, (target[1] - tip[1]) / SETTLE]
      const speed = Math.hypot(...want)
      const cap = speed > SPEED ? SPEED / speed : 1
      velocity = [want[0] * cap, want[1] * cap]
      if (Math.hypot(...velocity) > 0.5) {
        const next: Flat = [tip[0] + velocity[0] * dt, tip[1] + velocity[1] * dt]
        if (solve(...next)) {
          tip = next
          dirty = true
        }
        state = 'moving'
      }
    }
    draw(state)
    const busy = touring || state === 'moving'
    frame = visible && busy && !still.matches ? requestAnimationFrame(tick) : 0
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
      steps = []
      run()
    }, 4000)
    run()
  }

  // Pointing sends a destination, as the phone would. With the link cut,
  // nothing is sent and nothing moves.
  const onMove = (event: PointerEvent) => {
    const box = svg.getBoundingClientRect()
    const scale = box.width / WIDTH
    const plane = screenToPlane((event.clientX - box.left) / scale, (event.clientY - box.top) / scale)
    if (link) {
      target = reachable(plane)
      dirty = true
    }
    takeOver()
  }
  const toggleLink = () => {
    link = !link
    dirty = true
    takeOver()
    draw(link ? 'there' : 'holding')
  }
  const onKey = (event: KeyboardEvent) => {
    const nudge: Record<string, Flat> = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, 10], ArrowDown: [0, -10] }
    if (event.key === ' ' || event.key === 'Enter' || event.key === 'l') {
      event.preventDefault()
      toggleLink()
    } else if (nudge[event.key]) {
      event.preventDefault()
      if (link) target = reachable([target[0] + nudge[event.key][0], target[1] + nudge[event.key][1]])
      takeOver()
    }
  }

  stage.addEventListener('pointermove', onMove)
  stage.addEventListener('click', toggleLink)
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
  const onMotionPref = () => (still.matches ? draw('there') : run())
  still.addEventListener('change', onMotionPref)

  return {
    stop() {
      cancelAnimationFrame(frame)
      clearTimeout(idleTimer)
      io.disconnect()
      still.removeEventListener('change', onMotionPref)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('click', toggleLink)
      stage.removeEventListener('keydown', onKey)
    },
  }
}
