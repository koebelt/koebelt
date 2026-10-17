// Fig: the drone remote controller, on a cutting mat.
//
// Drawn from the build photo (originals/controller.png): a printed U-shaped
// shell in two halves with a seam round the side, a 20×4 character LCD in a
// raised bezel between the grips, two thumbsticks with stippled caps in turned
// bezels, four round buttons, cross-head screws holding the halves, and a slide
// switch on the inside of the notch.
//
// The geometry is built once here and depth-settled by the kit's audit; the
// live code (src/figures/drone-controller/live.ts) only moves the stick caps,
// presses buttons and writes the LCD.
//
//   node figures/drone-controller/build.mjs           build
//   node figures/drone-controller/build.mjs --audit   build and print the geometry audit

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { CAMERA } from "../camera.mjs";
import * as A from "../kit/audit.mjs";
import * as k from "../kit/iso-kit.mjs";
import * as G from "../kit/lathe.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const CARD_CSS = readFileSync(join(ROOT, "src", "figures", "palette.css"), "utf8");

const WIDTH = 640;
const HEIGHT = 480;

// World units are millimetres. The long axis runs along y, the grips point to +x.
const SHELL_Z = 0; // standing on the mat
const SEAM_Z = 11; // where the two printed halves meet
const TOP_Z = 24;
const BEZEL_TOP = TOP_Z + 5;
const WINDOW_Z = BEZEL_TOP - 2.2;

// The shell's outline: a control polygon with a fillet radius at each corner,
// concave ones included (the notch between the grips).
const OUTLINE = [
  [[-50, -112], 40],
  [[-50, 112], 40],
  [[76, 124], 34],
  [[80, 52], 24],
  [[22, 40], 22],
  [[22, -40], 22],
  [[80, -52], 24],
  [[76, -124], 34],
];

const LCD = { x: -44, y: -54, w: 44, d: 108, r: 3 }; // bezel plan
const WINDOW = { x: -39, y: -47, w: 34, d: 94, r: 1.2 };
const STICKS = [
  { id: "left", at: [30, 80] }, // throttle and yaw
  { id: "right", at: [30, -80] }, // pitch and roll
];
// Mirror-symmetric, as in the photo: on each grip both buttons sit behind the
// stick, one further back and inboard, one nearer and on the stick's line; one
// screw beside the LCD's end, one at the front of the grip.
const BUTTONS = [
  { id: 0, at: [-26, 74] }, // left grip: arm / disarm
  { id: 1, at: [-4, 96] },
  { id: 2, at: [-26, -74] }, // right grip: flight mode
  { id: 3, at: [-4, -96] },
];
const SCREWS = [[8, 62], [62, 104], [8, -62], [62, -104]];

const MAT = { x: -76, y: -150, w: 182, d: 300, r: 6 };

const P = k.fitProjection(
  [...k.boxCorners(MAT, -4, 0), [-50, 0, BEZEL_TOP], [30, 80, TOP_Z + 26], [30, -80, TOP_Z + 26], [-95, -22, 84]],
  WIDTH,
  HEIGHT,
  { pad: 26, ...CAMERA },
);
const V = G.viewOf(P);

const R = A.recorder(P, { ground: (shape) => shape.name?.startsWith("stand.") });
const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);

function put(name, centre, svg, shapes, { bias = 0, part } = {}) {
  const unique = R.nameFor(name);
  for (const shape of shapes) shape.name ??= unique;
  R.put({ name: unique, at: centre, bias, svg, part, shapes: shapes.map((s) => R.solid(s)) });
}

/** Rounds every corner of a closed polygon with its own radius (concave corners too). */
function roundedRing(spec, steps = 10) {
  const out = [];
  const n = spec.length;
  for (let i = 0; i < n; i++) {
    const [p, r] = spec[i];
    const a = spec[(i + n - 1) % n][0];
    const b = spec[(i + 1) % n][0];
    const ua = norm([a[0] - p[0], a[1] - p[1]]);
    const ub = norm([b[0] - p[0], b[1] - p[1]]);
    const cos = ua[0] * ub[0] + ua[1] * ub[1];
    const angle = Math.acos(Math.max(-1, Math.min(1, cos)));
    const tangent = r / Math.tan(angle / 2);
    const from = [p[0] + ua[0] * tangent, p[1] + ua[1] * tangent];
    const to = [p[0] + ub[0] * tangent, p[1] + ub[1] * tangent];
    const bis = norm([ua[0] + ub[0], ua[1] + ub[1]]);
    const centre = [p[0] + bis[0] * (r / Math.sin(angle / 2)), p[1] + bis[1] * (r / Math.sin(angle / 2))];
    const a0 = Math.atan2(from[1] - centre[1], from[0] - centre[0]);
    const a1 = Math.atan2(to[1] - centre[1], to[0] - centre[0]);
    let sweep = a1 - a0;
    while (sweep > Math.PI) sweep -= 2 * Math.PI;
    while (sweep < -Math.PI) sweep += 2 * Math.PI;
    for (let s = 0; s <= steps; s++) {
      const t = a0 + (sweep * s) / steps;
      out.push([centre[0] + r * Math.cos(t), centre[1] + r * Math.sin(t)]);
    }
  }
  return out;
}
function norm([x, y]) {
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
}
/** A closed ring moved inward by `by` along its vertex normals (fine for a smooth outline). */
function insetRing(ring, by) {
  const n = ring.length;
  let area = 0;
  for (let i = 0; i < n; i++) area += ring[i][0] * ring[(i + 1) % n][1] - ring[(i + 1) % n][0] * ring[i][1];
  const sign = area > 0 ? 1 : -1;
  return ring.map((p, i) => {
    const a = ring[(i + n - 1) % n];
    const b = ring[(i + 1) % n];
    const t = norm([b[0] - a[0], b[1] - a[1]]);
    const inward = [-t[1] * sign, t[0] * sign];
    return [p[0] + inward[0] * by, p[1] + inward[1] * by];
  });
}

// --------------------------------------------------------------------- mat

function mat() {
  const out = [`<path class="iso-halo" d="${k.haloOf(MAT, -4, 4, P)}"/>`];
  out.push(S(k.slabOf(MAT, -2.4, 2.4, P, 6, 0.6), { tone: "lo" }));
  // A 10 mm grid, edge to edge, with every fifth line a step stronger.
  const minor = [];
  const major = [];
  for (let x = MAT.x + 10; x < MAT.x + MAT.w - 4; x += 10) (Math.round((x - MAT.x) / 10) % 5 ? minor : major).push(k.lineOnTop([x, MAT.y + 3], [x, MAT.y + MAT.d - 3], 0, P));
  for (let y = MAT.y + 10; y < MAT.y + MAT.d - 4; y += 10) (Math.round((y - MAT.y) / 10) % 5 ? minor : major).push(k.lineOnTop([MAT.x + 3, y], [MAT.x + MAT.w - 3, y], 0, P));
  const border = k.planOutline(k.insetPlan(MAT, 3), 0, P);
  out.push(L(minor.join(""), { tone: "faint" }), L(major.join(""), { tone: "lo" }), L(border, { tone: "lo" }));
  return out.join("");
}

// ------------------------------------------------------------------- shell

const RING = roundedRing(OUTLINE, 12);

function shell() {
  const seam = k.ringSeam(RING, SEAM_Z, P);
  // Printed on an FDM printer: faint layer lines run round the sides, every
  // 2.2 mm here (the real layers are 0.2 mm; these stand for them).
  const layers = (from, to, ring) => {
    const out = [];
    for (let z = from + 2.2; z < to - 1; z += 2.2) out.push(k.ringSeam(ring, z, P));
    return L(out.join(""), { tone: "faint" });
  };
  // Bottom half, then the top half sitting on it: two prints, one seam.
  put("shell.bottom", [15, 0, SEAM_Z / 2], S(k.extrude(RING, SHELL_Z, SEAM_Z, P, { convex: false }), { tone: "mid", inner: layers(SHELL_Z, SEAM_Z, RING) }), [A.extruded(RING, SHELL_Z, SEAM_Z, { name: "stand.shell" })]);
  const top = insetRing(RING, 0.6);
  const groove = insetRing(RING, 7);
  const grooveLine = k.pathOf([...groove, groove[0]].map(([x, y]) => at([x, y, TOP_Z])));
  put(
    "shell.top",
    [15, 0, (SEAM_Z + TOP_Z) / 2],
    S(k.extrude(top, SEAM_Z, TOP_Z - SEAM_Z, P, { convex: false, bevel: 1.4 }), { tone: "mid", inner: layers(SEAM_Z, TOP_Z - 1.4, top) + L(seam, { tone: "lo" }) + L(grooveLine, { tone: "faint" }) }),
    [A.extruded(top, SEAM_Z, TOP_Z - SEAM_Z, { name: "stand.top" })],
  );

  // Cross-head screws holding the halves.
  for (const [x, y] of SCREWS) {
    const head = S(k.cylinder(x, y, 3.2, TOP_Z, 0.6, P, 24), { tone: "mid", crease: "none" });
    const cross = k.lineOnTop([x - 1.7, y], [x + 1.7, y], TOP_Z + 0.6, P) + k.lineOnTop([x, y - 1.7], [x, y + 1.7], TOP_Z + 0.6, P);
    put("screw", [x, y, TOP_Z + 0.3], head + L(cross, { tone: "lo", free: true }), [A.cylinder(x, y, 3.2, TOP_Z, 0.6)]);
  }

  // Slide switch on the inside face of the notch, with its charge LED.
  const sw = { x: 22, y: -9, w: 1.2, d: 18, r: 0.4 };
  put("switch.plate", [22.6, 0, 7], S(k.slabOf(sw, 3, 8, P, 2), { tone: "lo", crease: "none" }), [A.slab(sw, 3, 8)]);
  const knob = { x: 23.2, y: -6, w: 1.6, d: 5, r: 0.4 };
  const usb = { x: 22, y: 12, w: 0.8, d: 9.4, r: 0.4 };
  put("usb.shell", [22.4, 16.7, 6], S(k.slabOf(usb, 4.4, 3.4, P, 4), { tone: "mid", crease: "none" }) + L(k.pathOf([[22.8, 13.4, 5.4], [22.8, 19.9, 5.4], [22.8, 19.9, 6.8], [22.8, 13.4, 6.8]].map(at), true), { tone: "lo" }), [A.slab(usb, 4.4, 3.4)]);
  put("switch.knob", [24, -3.5, 7], S(k.slabOf(knob, 4.6, 4.8, P, 2, 0.3), { tone: "hi", crease: "lo" }), [A.slab(knob, 4.6, 4.8)]);
}

// ------------------------------------------------- shoulders and antenna

function back() {
  // Shoulder buttons over the back edge, one per grip.
  // On the straight run of the back edge, against its face.
  for (const y of [52, -52]) {
    const plan = { x: -60, y: y - 13, w: 10.6, d: 26, r: 4 }; // its front face on the top half's back face
    put("shoulder", [-55, y, 19], S(k.slabOf(plan, 15, 7, P, 6, 0.6), { tone: "mid", inner: L(k.sideSeam(plan, 18.5, P, 6), { tone: "faint" }) }), [A.slab(plan, 15, 7)], { bias: -0.2 });
  }
  // The nRF24L01's external antenna: an SMA connector out of the back face,
  // a hinge, and the rubber whip leaning back.
  const mount = [-50, -30, 12];
  const out = [-1, 0, 0];
  const Fs = G.frameAlong(mount, out);
  // The connector's end and the whip's foot each meet the hinge ball rim on
  // sphere: where a radius-2.6 rim lies on the 2.8 ball, √(2.8² − 2.6²) from its centre.
  const HINGE_R = 2.8;
  const seat = Math.sqrt(HINGE_R ** 2 - 2.6 ** 2);
  const hinge = G.add3(mount, [-11.6, 0, 0]);
  const ball = A.ball(hinge, HINGE_R, { name: "antenna.hinge" });
  const sma = [[0, 4.2], [2.2, 4.2], [2.2, 3.4], [6.4, 3.4], [6.4, 2.6], [11.6 - seat, 2.6]];
  put("antenna.sma", G.add3(mount, [-4, 0, 0]), S(G.solidOf(sma, Fs, P), { tone: "mid", crease: "lo" }), [A.solid(Fs, sma, { seated: true, cut: [ball] })]);
  put("antenna.hinge", hinge, S(G.sphereOf(hinge, HINGE_R, P), { tone: "mid" }), [ball], { bias: 0.1 });
  const lean = G.unit3([-0.45, 0.12, 1]);
  const Fw = G.frameAlong(hinge, lean);
  const whip = [[seat, 2.6], [8, 2.6], [9, 3.2, 1], [14, 3.4, 1], [56, 2.9, 1], [70, 2.4, 1], [73, 1.6, 1], [74, 0]];
  put("antenna.whip", G.add3(hinge, G.mul3(lean, 36)), S(G.solidOf(whip, Fw, P, { smooth: true }), { tone: "lo", crease: "none", inner: L(G.arcOf(Fw, 9, 3.2, P), { tone: "faint" }) }), [A.solid(Fw, whip, { seated: true, cut: [ball] })], { bias: 0.2 });
}

// --------------------------------------------------------------------- LCD

function lcd() {
  // The module's bezel stands on the top, the window recessed into it.
  const wall = [];
  const w = WINDOW;
  const corners = [[w.x, w.y], [w.x + w.w, w.y], [w.x + w.w, w.y + w.d], [w.x, w.y + w.d]];
  // Recess walls: the two far walls of the window are the ones you see into.
  for (const [a, b] of [[corners[3], corners[0]], [corners[0], corners[1]]]) {
    wall.push(`<path class="iso-shade" data-shade="0" d="${k.pathOf([[...a, BEZEL_TOP], [...b, BEZEL_TOP], [...b, WINDOW_Z], [...a, WINDOW_Z]].map(at), true)}"/>`);
  }
  const svg =
    S(k.slabOf(LCD, TOP_Z, BEZEL_TOP - TOP_Z, P, 4, 0.8), { tone: "mid" }) +
    `<path class="c-window" d="${k.planOutline(w, BEZEL_TOP, P, 3)}"/>` +
    wall.join("") +
    `<path class="c-glass" d="${k.planOutline(w, WINDOW_Z, P, 3)}"/>` +
    L(k.planOutline(w, BEZEL_TOP, P, 3), { tone: "lo" }) +
    D([[LCD.x + 2.6, LCD.y + 3], [LCD.x + 2.6, LCD.y + LCD.d - 3], [LCD.x + LCD.w - 2.6, LCD.y + 3], [LCD.x + LCD.w - 2.6, LCD.y + LCD.d - 3]].map(([x, y]) => at([x, y, BEZEL_TOP])), { size: 0.45 });
  // The four rows of the 20×4 character display, in the window's plane. Text a
  // machine shows is part of the object; it is clipped to the window.
  const rows = [0, 1, 2, 3]
    .map((row) => k.faceTextSvg(k.topMatrix([w.x + 7.4 + row * 8, w.y + w.d - 3.6], WINDOW_Z, P, "y"), ROWS_AT_REST[row], { size: 5.8, tone: "lit" }).replace("<text ", `<text data-row="${row}" `))
    .join("");
  const clip = `<clipPath id="c-lcd"><path d="${k.planOutline(w, WINDOW_Z, P, 3)}"/></clipPath>`;
  put("lcd", [LCD.x + LCD.w / 2, 0, (TOP_Z + BEZEL_TOP) / 2], svg + clip + `<g class="c-lcd" clip-path="url(#c-lcd)">${rows}</g>`, [A.slab(LCD, TOP_Z, BEZEL_TOP - TOP_Z)]);
}

// What the display shows before anything moves: the aircraft's answer.
export const ROWS_AT_REST = ["DISARMED  STAB 12.4V", "ROLL  +0  PITCH  +0", "THR   0%  LINK  99%", "TX 50Hz  #000000"];

// ------------------------------------------------------------------ sticks

function stick({ id, at: [x, y] }) {
  // Turned bezel round the gimbal opening.
  const F = G.frameOf([x, y, TOP_Z], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const bezel = [[0, 21], [1.6, 21], [1.6, 19.4], [2.4, 18.6, 1], [2.6, 15]];
  put(
    `stick.${id}.bezel`,
    [x, y, TOP_Z + 1],
    S(G.solidOf(bezel, F, P, { smooth: true }), { tone: "mid", crease: "lo" }) +
      L(k.ring(x, y, 15, TOP_Z + 2.6, P, 48), { tone: "lo" }) +
      D([0, 1, 2, 3].map((i) => at([x + 18 * Math.cos(Math.PI / 4 + (i * Math.PI) / 2), y + 18 * Math.sin(Math.PI / 4 + (i * Math.PI) / 2), TOP_Z + 1.6])), { size: 0.45 }),
    [A.solid(F, bezel)],
  );
  // The rubber gimbal boot: a low dome inside the bezel.
  const boot = [[2.6, 13.6], [3.6, 13.2, 1], [5.4, 11, 1], [6.6, 7.4, 1], [7.2, 3.2, 1], [7.3, 0]];
  put(`stick.${id}.boot`, [x, y, TOP_Z + 5], S(G.solidOf(boot, F, P, { smooth: true }), { tone: "lo", crease: "none" }), [A.solid(F, boot)], { bias: 0.1 });
  // Shaft (drawn live, it leans) and the stippled cap, built centred and moved.
  const capZ = TOP_Z + 7.3 + 11;
  const cap = S(k.cylinder(x, y, 9, capZ, 4.4, P, 48, 0.6), { tone: "hi", crease: "lo", lit: false });
  const dimple = k.ring(x, y, 5.6, capZ + 4.4, P, 40);
  const stipple = [];
  for (let r = 1.4; r < 8.4; r += 1.4) {
    const count = Math.round((2 * Math.PI * r) / 1.4);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * 2 * Math.PI + r;
      stipple.push(at([x + r * Math.cos(a), y + r * Math.sin(a), capZ + 4.4]));
    }
  }
  const capSvg = cap + L(dimple, { tone: "lo" }) + D(stipple, { size: 0.32, tone: "lo" }) + L(k.knurl(x, y, 9, capZ + 0.6, capZ + 3.8, 40, P, 0.3), { tone: "lo" });
  R.put({
    name: `stick.${id}.cap`,
    at: [x, y, capZ + 2],
    bias: 0.3,
    svg: `<path class="c-shaft" data-shaft="${id}" d=""/><g data-cap="${id}">${capSvg}</g>`,
    shapes: [R.solid(A.cylinder(x, y, 9, capZ, 4.4, { name: `stick.${id}.cap` })), R.solid(A.cylinder(x, y, 2.4, TOP_Z + 7.3, 11, { name: `stick.${id}.shaft` }))],
  });
  return { id, at: [x, y], pivot: [x, y, TOP_Z + 7.3], cap: [x, y, capZ] };
}

// ----------------------------------------------------------------- buttons

function button({ id, at: [x, y] }) {
  const collar = S(k.cylinder(x, y, 8.6, TOP_Z, 0.9, P, 40), { tone: "lo" });
  put(`button.${id}.collar`, [x, y, TOP_Z + 0.4], collar, [A.cylinder(x, y, 8.6, TOP_Z, 0.9)]);
  const cap = S(k.cylinder(x, y, 7, TOP_Z + 0.9, 4.2, P, 44, 0.6), { tone: "hi", crease: "lo" }) + L(k.ring(x, y, 5.4, TOP_Z + 5.1, P, 36), { tone: "faint" });
  put(`button.${id}`, [x, y, TOP_Z + 3], `<g data-button="${id}">${cap}</g>`, [A.cylinder(x, y, 7, TOP_Z + 0.9, 4.2)], { bias: 0.2 });
}

// ------------------------------------------------------------------- build

shell();
back();
lcd();
const sticks = STICKS.map(stick);
BUTTONS.forEach(button);

A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
A.auditOrExit(R, P);

const body = [mat(), `<g data-controller="">`, ...R.items.map((item) => item.svg), `</g>`].join("");
const label =
  "A handheld drone controller on a cutting mat: a 3D-printed U-shaped shell in two halves, a 20 by 4 character LCD in a raised bezel between the grips, two thumbsticks with stippled caps, four round buttons and the screws that hold the halves together. The sticks are sampled and sent 50 times a second; the screen shows what the aircraft sends back.";
const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body, className: "c-svg" });

const data = {
  width: WIDTH,
  height: HEIGHT,
  P,
  sticks,
  buttons: BUTTONS,
  reach: 7.5, // how far a cap travels from centre, mm
  shaftR: 2.4,
};

const outDir = join(ROOT, "src", "figures", "drone-controller");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "art.generated.ts"),
  `// Generated by figures/drone-controller/build.mjs. Do not edit.\n/* eslint-disable */\nexport const CONTROLLER_SVG = ${JSON.stringify(svg)}\nexport const CONTROLLER_DATA = ${JSON.stringify(data)} as const\n`,
);
const still = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body: `<style><![CDATA[${CARD_CSS}]]></style>` + body, standalone: "dark", className: "c-svg" });
writeFileSync(join(ROOT, "public", "projects", "drone-controller.svg"), still);
console.log(`wrote public/projects/drone-controller.svg (${(still.length / 1024).toFixed(0)} KB)`);
console.log(`wrote src/figures/drone-controller/art.generated.ts (${R.items.length} items, ${(svg.length / 1024).toFixed(0)} KB)`);
