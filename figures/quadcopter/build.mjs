// Fig: the stabilised quadcopter, hovering over its launch pad.
//
// Drawn from the build photo (originals/drone.png): an X frame with lattice
// arms between two plates, a perfboard flight controller on standoffs, an ESC
// and cable ties on each arm, bell motors on round mounts, fin legs under the
// motors, two-blade props with spinner nuts, the battery strapped underneath
// and the XT60 lead hanging off one side.
//
// The geometry is built once here, depth-settled by the kit's audit and written
// to src/figures/quadcopter/art.generated.ts. The browser only tilts it: every
// quad item carries its height, and the live code maps each height's plane
// through the attitude rotation as one affine transform (src/figures/quadcopter/live.ts).
//
//   node figures/quadcopter/build.mjs           build
//   node figures/quadcopter/build.mjs --audit   build and print the geometry audit

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { CAMERA } from "../camera.mjs";
import * as A from "../kit/audit.mjs";
import * as k from "../kit/iso-kit.mjs";
import * as G from "../kit/lathe.mjs";
import { tubePieces, tubeSvg } from "../kit/tube.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
// The card still is an <img>, so it carries its own styles: the kit's (added by
// figureSvg) and the site's palette on top, the same file the live figure uses.
const CARD_CSS = readFileSync(join(ROOT, "src", "figures", "palette.css"), "utf8");

// 4:3, so the same drawing fills the project card's frame.
const WIDTH = 640;
const HEIGHT = 480;

// World units are 2 mm. An F450-class frame: 450 mm motor to motor across the
// diagonal, so each motor sits 225 mm (112.5 units) out along its arm.
const MOTOR_R = 112.5; // motor centre, out along its diagonal
const PROP_R = 63.5; // 10 in props: 254 mm across
const ARM_W = 13;
const PLATE_Z = 1.6; // bottom plate thickness
const ARM_TOP = PLATE_Z + 11.6;
const TOP_Z = ARM_TOP + 1.6; // top plate top
const DECK_Z = TOP_Z + 9.4; // perfboard underside, on standoffs
const BOARD_TOP = DECK_Z + 1.4;
const MOUNT_TOP = ARM_TOP + 1.4;
const BELL_Z = MOUNT_TOP + 2.6;
const BELL_TOP = BELL_Z + 10.4;
const PROP_Z = BELL_TOP + 2.4; // prop disc plane
const HOVER = 58; // the quad's bottom plate above the pad
const PIVOT = [0, 0, HOVER + 9]; // centre of mass: about the top plate

// Motors on the diagonals, numbered the way flight controllers do for an X frame:
// 1 front right, 2 rear left, 3 front left, 4 rear right. "Front" is +x.
// Props alternate direction so the yaw torques cancel.
const MOTORS = [
  { id: 1, angle: -45, spin: -1 },
  { id: 2, angle: 135, spin: -1 },
  { id: 3, angle: 45, spin: 1 },
  { id: 4, angle: -135, spin: 1 },
].map((m) => {
  const a = (m.angle * Math.PI) / 180;
  const dir = [Math.cos(a), Math.sin(a)];
  return { ...m, dir, at: [dir[0] * MOTOR_R, dir[1] * MOTOR_R] };
});

const PAD = { x: -92, y: -92, w: 184, d: 184, r: 9 };
const PAD_H = 9;
const FOOT_H = 4;

const P = k.fitProjection(
  [
    ...k.boxCorners(PAD, -PAD_H - FOOT_H, 0),
    ...MOTORS.flatMap((m) => [0, 90, 180, 270].map((deg) => [m.at[0] + PROP_R * Math.cos((deg * Math.PI) / 180), m.at[1] + PROP_R * Math.sin((deg * Math.PI) / 180), HOVER + PROP_Z])),
    [0, 0, HOVER + PROP_Z + 10],
  ],
  WIDTH,
  HEIGHT,
  { pad: 46, ...CAMERA },
);

// Nothing holds a hovering quad up: its bottom plate is the ground the audit's
// support check counts everything else from.
const R = A.recorder(P, { ground: (shape) => shape.name?.startsWith("frame.bottom") });
const V = G.viewOf(P);
const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const Q = (z) => z + HOVER; // quad heights are written from the bottom plate up

/**
 * Puts one drawn item into the depth-settled list. Quad items carry the height
 * of the plane the live tilt maps them through.
 */
function put(name, centre, svg, shapes, { bias = 0, quad = false, plane } = {}) {
  const unique = R.nameFor(name);
  for (const shape of shapes) shape.name ??= unique;
  R.put({ name: unique, at: centre, bias, svg, quad, plane: plane ?? centre[2], shapes: shapes.map((s) => R.solid(s)) });
}

/** Spans of [from, to] left once the `cuts` (each [from, to]) are taken out. */
function spansBetween(from, to, cuts) {
  const out = [];
  let at = from;
  for (const [a, b] of [...cuts].sort((x, y) => x[0] - y[0])) {
    if (a > at) out.push([at, a]);
    at = Math.max(at, b);
  }
  if (at < to) out.push([at, to]);
  return out;
}

// A two-blade prop's outline in its own plane, as [radius, half-width] from
// hub to tip: widest a third of the way out, rounded at the tip.
const BLADE = [[3.4, 2.6], [10, 4.4], [20, 5.2], [32, 4.6], [44, 3.6], [54, 2.6], [60, 1.6], [PROP_R - 1.2, 0.6]];
const STILL_SPIN = 0.35; // radians: the blade angle drawn before any motion

/** Both blades of a prop at `angle`, as one screen path on the disc's plane. */
export function bladePath([x, y, z], angle, P) {
  const one = (a) => {
    const c = Math.cos(a);
    const s = Math.sin(a);
    const lead = BLADE.map(([r, w]) => [x + c * r - s * w, y + s * r + c * w]);
    const trail = BLADE.map(([r, w]) => [x + c * r + s * w * 0.7, y + s * r - c * w * 0.7]).reverse();
    return k.onTop([...lead, ...trail], z, P, true);
  };
  return one(angle) + one(angle + Math.PI);
}

// ------------------------------------------------------------------ helpers

/** A rectangle along a direction: `from`/`to` along `dir`, `half` across it, as a floor ring. */
function bar(dir, from, to, half, across = 0) {
  const [dx, dy] = dir;
  const [nx, ny] = [-dy, dx];
  const p = (s, t) => [dx * s + nx * (t + across), dy * s + ny * (t + across)];
  return [p(from, -half), p(to, -half), p(to, half), p(from, half)];
}
const along = (dir, s, t = 0) => [dir[0] * s - dir[1] * t, dir[1] * s + dir[0] * t];
/** Arc length along a route at the point where it reaches `s` along `dir`. */
function arcAt(points, dir, s) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const sa = a[0] * dir[0] + a[1] * dir[1];
    const sb = b[0] * dir[0] + b[1] * dir[1];
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    if (sb >= s) return total + (seg * (s - sa)) / (sb - sa || 1);
    total += seg;
  }
  return total;
}
const mid3 = (ring, z) => {
  const n = ring.length;
  return [ring.reduce((sum, p) => sum + p[0], 0) / n, ring.reduce((sum, p) => sum + p[1], 0) / n, z];
};

// --------------------------------------------------------------------- pad

function pad() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PAD, -PAD_H - FOOT_H, PAD_H, P)}"/>`];
  const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  for (const [x, y] of byDepth(k.corners(PAD, 20))) {
    out.push(S(k.cylinder(x, y, 7, -PAD_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PAD_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PAD, -PAD_H, PAD_H, P, 8, 1.6), { tone: "mid", inner: L(k.sideSeam(PAD, -PAD_H + 3, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PAD, 6), 0, P), { tone: "lo" }));
  // Landing circle and the H, inlaid flush.
  out.push(L(k.ring(0, 0, 66, 0, P, 120), { tone: "lo" }), L(k.ring(0, 0, 62, 0, P, 120), { tone: "faint" }));
  for (const plan of [
    { x: -30, y: -26, w: 60, d: 10, r: 1 },
    { x: -30, y: 16, w: 60, d: 10, r: 1 },
    { x: -5, y: -16, w: 10, d: 32, r: 0 },
  ]) out.push(S(k.slabOf(plan, 0, 0.3, P, 2), { tone: "lo", flat: true, crease: "none" }));
  // Corner screws.
  const screws = k.corners(PAD, 11);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.4, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // A ruler strip along the near edge, and a label plate on the other near edge.
  const strip = { x: PAD.x + 24, y: PAD.y + PAD.d - 15, w: PAD.w - 48, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  const label = { x: PAD.x + PAD.w - 15, y: PAD.y + 22, w: 8, d: 40, r: 1 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), { tone: "faint" }));
  for (const [len, x] of [[30, label.x + 2.6], [21, label.x + 4.3], [25, label.x + 6]]) {
    out.push(L(k.lineOnTop([x, label.y + 5], [x, label.y + 5 + len], 0.8, P), { tone: "lo", free: true }));
  }
  return out.join("");
}

/** The quad's shadow on the pad: its footprint, blurred. Moves with the attitude. */
function shadow() {
  const parts = [k.haloOf({ x: -38, y: -38, w: 76, d: 76, r: 8 }, 0, 0.1, P)];
  for (const m of MOTORS) {
    const ring = bar(m.dir, 20, MOTOR_R, ARM_W / 2);
    parts.push(k.onTop(ring, 0, P, true));
    parts.push(k.onTop(k.circleRing(m.at[0], m.at[1], 11, 24), 0, P, true));
  }
  return `<g data-shadow="" style="filter:blur(5px);opacity:.75"><path class="iso-halo" d="${parts.join("")}"/></g>`;
}

// ------------------------------------------------------------------- frame

function frame() {
  // Bottom plate: the arms are clamped between it and the top plate.
  const bottom = { x: -40, y: -40, w: 80, d: 80, r: 9 };
  put("frame.bottom", [0, 0, Q(PLATE_Z / 2)], S(k.slabOf(bottom, Q(0), PLATE_Z, P, 8, 0.5), { tone: "mid" }), [A.slab(bottom, Q(0), PLATE_Z)], { quad: true });

  for (const m of MOTORS) arm(m);

  const top = { x: -33, y: -33, w: 66, d: 66, r: 7 };
  const topScrews = [];
  for (const m of MOTORS) for (const t of [-4.2, 4.2]) topScrews.push(along(m.dir, 36, t));
  put(
    "frame.top",
    [0, 0, Q(TOP_Z - 0.8)],
    S(k.slabOf(top, Q(ARM_TOP), TOP_Z - ARM_TOP, P, 8, 0.5), { tone: "mid" }) +
      L(topScrews.map(([x, y]) => k.ring(x, y, 1.4, Q(TOP_Z), P, 12)).join(""), { tone: "lo" }) +
      D(topScrews.map(([x, y]) => at([x, y, Q(TOP_Z)])), { size: 0.45 }),
    [A.slab(top, Q(ARM_TOP), TOP_Z - ARM_TOP)],
    { quad: true },
  );
}

/** A lattice arm with its ESC, cable ties, motor lead, motor mount, leg and motor. */
function arm(m) {
  const { dir } = m;
  const from = 22;
  const to = MOTOR_R + 7;
  const z0 = Q(PLATE_Z);
  const h = ARM_TOP - PLATE_Z;

  // Cable ties wrap the arm, so the beam (and anything on it) is cut where
  // each tie sits and the tie is drawn between the pieces.
  const TIES = [[53, 3.8], [75, 1.8]];
  const tieCuts = TIES.map(([s]) => [s - 0.9, s + 0.9]);

  // The lattice: an X in every cell of the top face, cut through as four
  // triangular windows, so every line is a closed outline. Cells run between
  // the ties, so no window passes under one.
  const edges = [42, 47.5, 53, 58.5, 64, 69.5, 75, 80.5, 86, 91.5, 97];
  const half = ARM_W / 2 - 1.6;
  const side = [-dir[1], dir[0]];
  const sideSign = side[0] * V[0] + side[1] * V[1] > 0 ? 1 : -1;
  const faceT = (sideSign * ARM_W) / 2;
  const windowsIn = (lo, hi) => {
    const out = [];
    for (let i = 0; i < edges.length - 1; i++) {
      const s0 = edges[i] + 1.2;
      const s1 = edges[i + 1] - 1.2;
      if (s0 < lo || s1 > hi) continue;
      const sm = (s0 + s1) / 2;
      const g = 0.8;
      const tri = (pts) => out.push(k.onTop(pts.map(([s, t]) => along(dir, s, t)), Q(ARM_TOP), P, true));
      tri([[s0, -half], [s1, -half], [sm, -g]]);
      tri([[s0, half], [s1, half], [sm, g]]);
      tri([[s0, -half + g * 1.3], [s0, half - g * 1.3], [sm - g, 0]]);
      tri([[s1, -half + g * 1.3], [s1, half - g * 1.3], [sm + g, 0]]);
      // The visible side: one window per cell, a triangle standing on its base.
      const P3 = (s, z) => [...along(dir, s, faceT), z];
      out.push(k.pathOf([P3(s0, z0 + 2), P3(s1, z0 + 2), P3(sm, z0 + h - 2)].map(at), true));
    }
    return out.join("");
  };
  for (const [a, b] of spansBetween(from, to, tieCuts)) {
    const piece = bar(dir, a, b, ARM_W / 2);
    put(
      `arm${m.id}.beam`,
      mid3(piece, z0 + h / 2),
      S(k.extrude(piece, z0, h, P, { bevel: 0.5 }), { tone: "mid", inner: L(windowsIn(a, b), { tone: "lo" }) }),
      [A.extruded(piece, z0, h)],
      { quad: true },
    );
  }

  // ESC on the arm, in heat-shrink, held by the inner cable tie.
  for (const [a, b] of spansBetween(44, 62, tieCuts)) {
    const esc = bar(dir, a, b, 4.6, -1.2);
    put(
      `arm${m.id}.esc`,
      mid3(esc, Q(ARM_TOP) + 1.6),
      S(k.extrude(esc, Q(ARM_TOP), 3.2, P, { bevel: 0.4 }), { tone: "lo", inner: L(k.ringSeam(esc, Q(ARM_TOP) + 1.6, P), { tone: "faint" }) }),
      [A.extruded(esc, Q(ARM_TOP), 3.2)],
      { quad: true },
    );
  }

  // The three motor phase wires, ESC to motor, side by side on the arm.
  const wires = [-3.2, -1.8, -0.4];
  wires.forEach((t, index) => {
    const zW = Q(ARM_TOP) + 0.6;
    const route = [
      [...along(dir, 62, t), zW + 1.1],
      [...along(dir, 66, t), zW],
      [...along(dir, MOTOR_R - 10.6, t), zW],
    ];
    const pts = G.fillet(route, 3, 7);
    // Gapped under the outer cable tie, so the tie wraps it instead of
    // interlocking with it.
    const gaps = [[arcAt(pts, dir, 75 - 0.9), arcAt(pts, dir, 75 + 0.9)]];
    const pieces = tubePieces(pts, 0.55, P, { maxLength: 40, spacing: 6, gaps, stripes: false });
    pieces.forEach((piece, n) => {
      R.put({ name: `arm${m.id}.wire${index}.${n}`, at: piece.mid, bias: 0.05, svg: tubeSvg(piece, { tone: "mid" }), quad: true, plane: zW, shapes: [R.solid(A.tube(piece.points, 0.55, { name: `arm${m.id}.wire${index}`, limp: true, owner: `arm${m.id}.wires` }))] });
    });
  });

  // Cable ties: one round the ESC, one round the wires, wrapping the arm.
  for (const [s, extra] of TIES) {
    const tie = bar(dir, s - 0.9, s + 0.9, ARM_W / 2 + 0.5);
    put(`arm${m.id}.tie`, mid3(tie, z0 + h / 2), S(k.extrude(tie, z0 - 0.5, h + 0.5 + extra, P), { tone: "lo", crease: "none" }), [A.extruded(tie, z0 - 0.5, h + 0.5 + extra)], { quad: true, bias: 0.2 });
  }

  // Leg: a fin under the motor, tapering to its foot.
  const F = G.frameOf([...m.at, z0], [-dir[1], dir[0], 0], [dir[0], dir[1], 0], [0, 0, 1]);
  const fin = [[-9, 0], [7, 0], [3.4, -24], [-4.4, -24]];
  put(`arm${m.id}.leg`, [...along(dir, MOTOR_R - 1), z0 - 12], S(G.prismOf(F, fin, -2, 2, P), { tone: "mid" }), [A.prism(F, fin, -2, 2)], { quad: true });
  // Rubber foot at the bottom of the fin.
  const [fx, fy] = along(dir, MOTOR_R - 0.5);
  put(`arm${m.id}.foot`, [fx, fy, z0 - 26], S(k.cylinder(fx, fy, 3.2, z0 - 28, 4, P, 24, 0.3), { tone: "lo" }), [A.cylinder(fx, fy, 3.2, z0 - 28, 4)], { quad: true });

  motor(m);
}

function motor(m) {
  const [x, y] = m.at;
  const mount = Q(ARM_TOP);
  const parts = [];
  // Round mount plate with its four screws.
  parts.push(S(k.cylinder(x, y, 10.5, mount, MOUNT_TOP - ARM_TOP, P, 48, 0.4), { tone: "mid" }));
  const screws = [0, 1, 2, 3].map((i) => [x + 8 * Math.cos(Math.PI / 4 + (i * Math.PI) / 2), y + 8 * Math.sin(Math.PI / 4 + (i * Math.PI) / 2)]);
  parts.push(D(screws.map(([sx, sy]) => at([sx, sy, Q(MOUNT_TOP)])), { size: 0.45 }));
  // Stator base, then the bell with its cooling slots between two seams.
  parts.push(S(k.cylinder(x, y, 7.2, Q(MOUNT_TOP), BELL_Z - MOUNT_TOP, P, 40), { tone: "lo" }));
  const bellZ = Q(BELL_Z);
  const vents = k.knurl(x, y, 8.2, bellZ + 1.4, bellZ + 4.6, 22, P, 0.3);
  const seams = k.sideArc(x, y, 8.2, bellZ + 1.4, P, 32) + k.sideArc(x, y, 8.2, bellZ + 4.6, P, 32);
  parts.push(S(k.cylinder(x, y, 8.2, bellZ, BELL_TOP - BELL_Z, P, 56, 0.6), { tone: "hi", crease: "lo", inner: L(vents, { tone: "lo" }) + L(seams, { tone: "faint" }) }));
  parts.push(L(k.ring(x, y, 5.2, Q(BELL_TOP), P, 32), { tone: "lo" }));
  const capScrews = [0, 1, 2, 3].map((i) => [x + 3.6 * Math.cos((i * Math.PI) / 2), y + 3.6 * Math.sin((i * Math.PI) / 2)]);
  parts.push(D(capScrews.map(([sx, sy]) => at([sx, sy, Q(BELL_TOP)])), { size: 0.4 }));
  put(`motor${m.id}`, [x, y, Q((MOUNT_TOP + BELL_TOP) / 2)], parts.join(""), [A.cylinder(x, y, 10.5, mount, MOUNT_TOP - ARM_TOP), A.cylinder(x, y, 8.2, Q(MOUNT_TOP), BELL_TOP - MOUNT_TOP)], { quad: true });

  // Prop disc: the blur of the spinning blades, the figure's lit accent. Live
  // code sets its opacity from the motor's speed and turns the blade ghosts.
  const discZ = Q(PROP_Z);
  put(
    `prop${m.id}.disc`,
    [x, y, discZ],
    `<g data-prop="${m.id}"><path class="q-disc" d="${k.ring(x, y, PROP_R, discZ, P, 96)}"/><path class="q-blade" d="${bladePath([x, y, discZ], STILL_SPIN * m.spin + m.id, P)}"/><path class="q-rim" d="${k.ring(x, y, PROP_R, discZ, P, 96)}"/></g>`,
    [A.cylinder(x, y, PROP_R, discZ - 0.3, 0.6)],
    { quad: true, bias: 0.3 },
  );

  // Prop hub and spinner nut, above the disc.
  const hubZ = Q(BELL_TOP);
  const F = G.frameOf([x, y, hubZ], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  // Cut where the disc plane crosses it: the hub below the disc, the nut above.
  const cut = PROP_Z - BELL_TOP;
  const hub = [[0, 3.4], [cut, 3.4]];
  const nut = [[cut, 3.4], [3.2, 3.4], [3.2, 2.7], [4.4, 2.7, 1], [6.4, 2.2, 1], [8.2, 1.2, 1], [9.2, 0.3, 1], [9.4, 0]];
  put(`prop${m.id}.hub`, [x, y, hubZ + cut / 2], S(G.solidOf(hub, F, P), { tone: "hi", crease: "lo" }), [A.solid(F, hub)], { quad: true });
  put(`prop${m.id}.spinner`, [x, y, hubZ + 5.5], S(G.solidOf(nut, F, P, { smooth: true }), { tone: "hi", crease: "lo" }), [A.solid(F, nut)], { quad: true, bias: 0.4 });
}

// --------------------------------------------------------------- the stack

function stack() {
  // Standoffs from the top plate to the perfboard.
  const posts = [[-25, -25], [25, -25], [25, 25], [-25, 25]];
  for (const [x, y] of posts) {
    put("stack.standoff", [x, y, Q((TOP_Z + DECK_Z) / 2)], S(k.cylinder(x, y, 2.1, Q(TOP_Z), DECK_Z - TOP_Z, P, 6), { tone: "mid" }), [A.cylinder(x, y, 2.1, Q(TOP_Z), DECK_Z - TOP_Z)], { quad: true });
  }

  // The flight controller: a perfboard, hand-populated.
  const board = { x: -30, y: -30, w: 60, d: 60, r: 2 };
  const holes = [];
  const grid = k.dotGrid(board.x + 4, board.y + 4, 21, 21, 2.6, Q(BOARD_TOP), P);
  for (const point of grid) holes.push(point);
  const boardSvg =
    S(k.slabOf(board, Q(DECK_Z), BOARD_TOP - DECK_Z, P, 3, 0.4), { tone: "hi", crease: "lo" }) +
    D(holes, { size: 0.32, tone: "lo" }) +
    L(posts.map(([x, y]) => k.ring(x, y, 2.4, Q(BOARD_TOP), P, 14)).join(""), { tone: "mid" }) +
    D(posts.map(([x, y]) => at([x, y, Q(BOARD_TOP)])), { size: 0.5, tone: "mid" });
  put("stack.board", [0, 0, Q(DECK_Z + 0.7)], boardSvg, [A.slab(board, Q(DECK_Z), BOARD_TOP - DECK_Z)], { quad: true });

  const top = Q(BOARD_TOP);
  // The STM32 module on two header rows.
  const mcu = { x: -22, y: -11, w: 30, d: 13, r: 0.8 };
  const pins = [];
  for (let i = 0; i < 12; i++) for (const y of [mcu.y + 1.4, mcu.y + mcu.d - 1.4]) pins.push(at([mcu.x + 2 + i * 2.4, y, top + 2.2]));
  put("stack.mcu", [mcu.x + mcu.w / 2, mcu.y + mcu.d / 2, top + 1.6], S(k.slabOf(mcu, top + 0.6, 1.6, P, 2, 0.3), { tone: "mid" }) + D(pins, { size: 0.35, tone: "hi" }), [A.slab(mcu, top, 2.2)], { quad: true });
  const chip = { x: -10.5, y: -7.5, w: 7, d: 6, r: 0.4 };
  put("stack.chip", [-7, -4.5, top + 2.8], S(k.slabOf(chip, top + 2.2, 1.1, P, 2), { tone: "lo", crease: "none" }) + L(k.ring(-9.2, -6.3, 0.5, top + 3.3, P, 8), { tone: "faint" }), [A.slab(chip, top + 2.2, 1.1)], { quad: true });
  // The IMU breakout: the sensor the loop reads 1000 times a second.
  const imu = { x: 11, y: -22, w: 12, d: 11, r: 0.6 };
  put("stack.imu", [17, -16.5, top + 0.8], S(k.slabOf(imu, top, 1.4, P, 2, 0.3), { tone: "mid" }) + D([0, 1, 2, 3, 4, 5].map((i) => at([imu.x + 1.4, imu.y + 1.4 + i * 1.65, top + 1.4])), { size: 0.35, tone: "hi" }), [A.slab(imu, top, 1.4)], { quad: true });
  const sensor = { x: 15.4, y: -18.6, w: 4.2, d: 4.2, r: 0.3 };
  put("stack.sensor", [17.5, -16.5, top + 1.9], S(k.slabOf(sensor, top + 1.4, 0.9, P, 2), { tone: "lo", crease: "none" }) + D([at([16, -18, top + 2.3])], { size: 0.3, tone: "mid" }), [A.slab(sensor, top + 1.4, 0.9)], { quad: true });
  // Regulator on its tab, and the bulk capacitor beside the power header.
  const reg = { x: 14, y: 6, w: 8, d: 3.2, r: 0.3 };
  const tab = { x: 14, y: 9.2, w: 8, d: 0.8, r: 0 };
  put("stack.reg", [18, 7.6, top + 3], S(k.slabOf(reg, top, 5.6, P, 2, 0.3), { tone: "lo" }), [A.slab(reg, top, 5.6)], { quad: true });
  put("stack.tab", [18, 9.6, top + 4], S(k.slabOf(tab, top, 8.4, P, 2), { tone: "mid", crease: "none" }) + L(k.sideRing([18, 10, top + 6.6], 1, "y", P), { tone: "lo" }), [A.slab(tab, top, 8.4)], { quad: true });
  const capR = 3;
  put("stack.cap", [3, 18, top + 4], S(k.cylinder(3, 18, capR, top, 8, P, 36, 0.4), { tone: "mid", inner: L(k.sideArc(3, 18, capR, top + 6.8, P, 24), { tone: "faint" }) }) + L(k.ring(3, 18, capR - 0.6, top + 8, P, 28), { tone: "lo" }), [A.cylinder(3, 18, capR, top, 8)], { quad: true });
  // Buzzer.
  put("stack.buzzer", [-18, 17, top + 2.4], S(k.cylinder(-18, 17, 4.2, top, 4.6, P, 40, 0.4), { tone: "lo" }) + L(k.ring(-18, 17, 1, top + 4.6, P, 12), { tone: "mid" }), [A.cylinder(-18, 17, 4.2, top, 4.6)], { quad: true });
  // ESC signal header: a row of pins on the near edge.
  const header = { x: -13, y: 22, w: 18, d: 3, r: 0.3 };
  const headerPins = [];
  for (let i = 0; i < 6; i++) for (const y of [header.y + 0.8, header.y + 2.2]) headerPins.push(at([header.x + 1.5 + i * 3, y, top + 2.4]));
  put("stack.header", [-4, 23.5, top + 1.2], S(k.slabOf(header, top, 2.4, P, 2, 0.3), { tone: "lo" }) + D(headerPins, { size: 0.32, tone: "hi" }), [A.slab(header, top, 2.4)], { quad: true });
}

// ------------------------------------------------------- battery and lead

function battery() {
  const pack = { x: -32, y: -17, w: 64, d: 34, r: 3 };
  const z = Q(-15);
  const h = 15;
  // Two straps round the pack: the pack is cut under each, like the arms at their ties.
  const STRAPS = [-16, 12];
  for (const [a, b] of spansBetween(pack.x, pack.x + pack.w, STRAPS.map((x) => [x - 2.2, x + 2.2]))) {
    const piece = { x: a, y: pack.y, w: b - a, d: pack.d, r: a === pack.x || b === pack.x + pack.w ? 3 : 0 };
    const label = k.sideSeam(piece, z + 3, P, 4) + k.sideSeam(piece, z + h - 3, P, 4);
    put("battery.pack", [(a + b) / 2, 0, z + h / 2], S(k.slabOf(piece, z, h, P, 4, 0.5), { tone: "lo", inner: L(label, { tone: "faint" }) }), [A.slab(piece, z, h)], { quad: true });
  }
  for (const x of STRAPS) {
    const strap = { x: x - 2.2, y: pack.y - 0.6, w: 4.4, d: pack.d + 1.2, r: 0.8 };
    put("battery.strap", [x, 0, z + h / 2], S(k.slabOf(strap, z - 0.6, h + 0.6, P, 2, 0.3), { tone: "mid", crease: "none" }), [A.slab(strap, z - 0.6, h + 0.6)], { quad: true, bias: 0.2 });
  }

  // The XT60 lead: out of the pack's end, up and away, ending in its plug.
  const zL = z + h - 4;
  const route = G.fillet([[-32, -6, zL], [-44, -6, zL], [-50, -6, zL - 7], [-50, -6, zL - 15]], 3.2, 7);
  const pieces = tubePieces(route, 1.6, P, { maxLength: 9 });
  pieces.forEach((piece) => R.put({ name: R.nameFor("battery.lead"), at: piece.mid, svg: tubeSvg(piece, { tone: "hi" }), quad: true, plane: piece.mid[2], shapes: [R.solid(A.tube(piece.points, 1.6, { name: "battery.lead", limp: true }))] }));
  const plug = { x: -54, y: -10.5, w: 8, d: 9, r: 1.2 };
  put("battery.xt60", [-50, -6, zL - 20], S(k.slabOf(plug, zL - 25, 10, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(plug, zL - 20, P, 3), { tone: "faint" }) }), [A.slab(plug, zL - 25, 10)], { quad: true });
}

// ------------------------------------------------------------------- build

frame();
stack();
battery();

A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
A.auditOrExit(R, P);

// Quad items carry the height of the plane the live tilt maps them through.
const planes = [...new Set(R.items.map((item) => Math.round(item.plane * 2) / 2))].sort((a, b) => a - b);
const body = [
  pad(),
  shadow(),
  `<g data-quad="">`,
  ...R.items.map((item) => `<g data-plane="${planes.indexOf(Math.round(item.plane * 2) / 2)}">${item.svg}</g>`),
  `</g>`,
].join("");

const label =
  "A quadcopter hovering over a launch pad: an X frame with lattice arms, a hand-populated flight-controller board on standoffs, an ESC and three motor wires on each arm, four bell motors on round mounts with two-blade props, and the battery strapped underneath. The frame tilts to the commanded attitude and the props on the side that has to rise spin faster.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body, className: "q-svg" });

// The live code needs the camera, the tilt pivot, the plane heights and where
// each prop is; nothing else of the geometry ships.
const data = {
  width: WIDTH,
  height: HEIGHT,
  P,
  pivot: PIVOT,
  planes,
  propR: PROP_R,
  blade: BLADE,
  stillSpin: STILL_SPIN,
  props: MOTORS.map((m) => ({ id: m.id, at: [...m.at, Q(PROP_Z)], spin: m.spin, arm: [m.dir[0] * MOTOR_R, m.dir[1] * MOTOR_R] })),
};

const outDir = join(ROOT, "src", "figures", "quadcopter");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "art.generated.ts"),
  `// Generated by figures/quadcopter/build.mjs. Do not edit.\n/* eslint-disable */\nexport const QUAD_SVG = ${JSON.stringify(svg)}\nexport const QUAD_DATA = ${JSON.stringify(data)} as const\n`,
);
const still = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body: `<style><![CDATA[${CARD_CSS}]]></style>` + body, standalone: "dark", className: "q-svg" });
writeFileSync(join(ROOT, "public", "projects", "quadcopter.svg"), still);
console.log(`wrote public/projects/quadcopter.svg (${(still.length / 1024).toFixed(0)} KB)`);
console.log(`wrote src/figures/quadcopter/art.generated.ts (${R.items.length} items, ${(svg.length / 1024).toFixed(0)} KB)`);
