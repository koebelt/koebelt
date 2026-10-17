/**
 * The flight model behind the quadcopter figure: a rigid X frame in roll and
 * pitch, four motors with lag, and the loop that holds it. No DOM, so the same
 * numbers drive the drawing, the readout and the tests.
 *
 * Numbers are an F450-class build: 1.2 kg, motors 225 mm from the centre on the
 * diagonals, 10-inch props good for 8.5 N each. The loop is the one the case
 * study describes: an attitude loop at 1 kHz, fed by a complementary filter
 * that fuses the gyroscope (trusted short term) with the accelerometer
 * (trusted long term), cascaded into a rate loop that sets the motor mix.
 */

export const LOOP_HZ = 1000
const DT = 1 / LOOP_HZ

const MASS = 1.2 // kg
const G = 9.81
const INERTIA = 0.0125 // kg·m², roll and pitch
const ARM = 0.225 * Math.SQRT1_2 // m, each motor's lever about the roll and pitch axes
const T_MAX = 8.5 // N per motor at full throttle
const MOTOR_LAG = 0.035 // s, ESC and rotor spin-up
const AIR_DAMPING = 0.02 // N·m per rad/s

/** Hover throttle: thrust is about square in command, and four motors carry the weight. */
export const HOVER = Math.sqrt((MASS * G) / 4 / T_MAX)

// Cascade gains. Angle error to rate set-point, then rate error to the mix.
const ANGLE_P = 7 // (rad/s) per rad
const RATE_LIMIT = 4 // rad/s
const RATE_P = 0.11 // throttle per rad/s
const RATE_I = 0.5
const RATE_D = 0.0028
const MIX_LIMIT = 0.3

// Complementary filter: the share of the gyro-integrated estimate kept each tick.
const FUSE = 0.995
const GYRO_BIAS = [0.012, -0.009] // rad/s: what an uncalibrated gyro drifts by
const ACCEL_NOISE = 0.035 // rad, per sample

/** Motor positions, as signs on x (front) and y (left): 1 FR, 2 RL, 3 FL, 4 RR. */
export const MOTOR_SIGNS: readonly [number, number][] = [
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
]

interface Axis {
  angle: number // rad, true attitude
  rate: number // rad/s
  estimate: number // rad, what the filter believes
  integral: number
  lastError: number
}

export interface Quad {
  /** 0 roll (positive raises the left side), 1 pitch (positive lowers the nose). */
  axes: [Axis, Axis]
  /** Commanded attitude, rad. */
  set: [number, number]
  /** Throttle 0..1 per motor, after the lag. */
  motors: [number, number, number, number]
  /** External torque still acting, N·m, and how fast it dies away. */
  gust: [number, number]
  time: number
}

const axis = (): Axis => ({ angle: 0, rate: 0, estimate: 0, integral: 0, lastError: 0 })

export function createQuad(): Quad {
  return { axes: [axis(), axis()], set: [0, 0], motors: [HOVER, HOVER, HOVER, HOVER], gust: [0, 0], time: 0 }
}

/** A deterministic noise source, so the figure behaves the same on every load. */
function noise(t: number, seed: number): number {
  const x = Math.sin(t * 12.9898 + seed * 78.233) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

/** One control tick: sense, fuse, control, mix, then integrate the airframe. */
function tick(q: Quad) {
  q.time += DT
  const command: [number, number] = [0, 0]

  q.axes.forEach((a, i) => {
    // Sense. The gyro reads the true rate plus its bias; the accelerometer
    // reads the true angle plus vibration noise.
    const gyro = a.rate + GYRO_BIAS[i]
    const accel = a.angle + noise(q.time, i) * ACCEL_NOISE
    // Fuse.
    a.estimate = FUSE * (a.estimate + gyro * DT) + (1 - FUSE) * accel
    // Control: angle loop into rate loop.
    const want = Math.max(-RATE_LIMIT, Math.min(RATE_LIMIT, ANGLE_P * (q.set[i] - a.estimate)))
    const error = want - gyro
    a.integral = Math.max(-0.4, Math.min(0.4, a.integral + error * DT))
    const derivative = (error - a.lastError) / DT
    a.lastError = error
    command[i] = Math.max(-MIX_LIMIT, Math.min(MIX_LIMIT, RATE_P * error + RATE_I * a.integral + RATE_D * derivative))
  })

  // Mix. Roll raises the left motors (y > 0); pitch lowers the nose, so it
  // speeds up the rear motors (x < 0).
  const thrust = [0, 0]
  for (let m = 0; m < 4; m++) {
    const [sx, sy] = MOTOR_SIGNS[m]
    const target = Math.max(0, Math.min(1, HOVER + command[0] * sy - command[1] * sx))
    q.motors[m] += (target - q.motors[m]) * (DT / MOTOR_LAG)
    const force = T_MAX * q.motors[m] ** 2
    thrust[0] += force * sy * ARM // torque about x
    thrust[1] -= force * sx * ARM // torque about y
  }

  // Airframe.
  q.axes.forEach((a, i) => {
    const torque = thrust[i] + q.gust[i] - AIR_DAMPING * a.rate
    a.rate += (torque / INERTIA) * DT
    a.angle += a.rate * DT
  })
  // A gust is a short shove that dies away over about 60 ms.
  q.gust[0] *= Math.exp(-DT / 0.06)
  q.gust[1] *= Math.exp(-DT / 0.06)
}

/** Advances the model by `seconds` of flight, at the loop's own rate. */
export function step(q: Quad, seconds: number) {
  const ticks = Math.min(100, Math.round(seconds * LOOP_HZ))
  for (let i = 0; i < ticks; i++) tick(q)
}

/** A shove of `size` N·m, in a floor direction (unit x, y): that side is pushed down. */
export function shove(q: Quad, [fx, fy]: [number, number], size = 0.9) {
  // Pushing the +y side down is a negative roll torque; pushing +x down is a positive pitch torque.
  q.gust[0] -= fy * size
  q.gust[1] += fx * size
}

/** Settled: close to the set-point and barely moving. */
export function isSettled(q: Quad): boolean {
  return q.axes.every((a, i) => Math.abs(a.angle - q.set[i]) < 0.002 && Math.abs(a.rate) < 0.01) && Math.abs(q.gust[0]) + Math.abs(q.gust[1]) < 1e-3
}

export const deg = (rad: number) => (rad * 180) / Math.PI
