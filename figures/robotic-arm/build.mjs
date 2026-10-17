// Fig: the robotic arm, picking a block from one pad and placing it on another.
//
// Drawn from the build photo (originals/robotarm.png). The static scene (bench,
// base, turntable, the shoulder servo's cradle, the pads and the controller box
// with its Bluetooth module) is built and depth-settled here. The arm itself
// comes from src/figures/robotic-arm/geometry.ts, the same module the browser
// uses to redraw it in every pose; this script draws its rest pose into the page.
//
//   node --experimental-strip-types figures/robotic-arm/build.mjs [--audit]

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as A from "../kit/audit.mjs";
import * as k from "../kit/iso-kit.mjs";
import * as G from "../kit/lathe.mjs";
import { tubePieces, tubeSvg } from "../kit/tube.mjs";
import { BENCH, HEIGHT, P, PADS, WIDTH, drawArm, drawTarget, solve } from "../../src/figures/robotic-arm/geometry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const CARD_CSS = readFileSync(join(ROOT, "src", "figures", "palette.css"), "utf8");

const R = A.recorder(P, { ground: (shape) => shape.name?.startsWith("stand.") });
const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);

function put(name, centre, svg, shapes, { bias = 0 } = {}) {
  const unique = R.nameFor(name);
  for (const shape of shapes) shape.name ??= unique;
  R.put({ name: unique, at: centre, bias, svg, shapes: shapes.map((s) => R.solid(s)) });
}

const BASE = { x: -50, y: -50, w: 100, d: 100, r: 7 };
const BASE_H = 9;
const HOUSING = { r: 40, z0: BASE_H, z1: 46 };
const TABLE = { r: 45, z0: 46, z1: 52 };
const CRADLE = { x: -17, y: -19, w: 34, d: 38, r: 2 };
const CRADLE_TOP = 74; // the shoulder servo's underside (its shaft is 30 above, at the shoulder)
const BOX = { x: -92, y: 56, w: 40, d: 30, r: 3 };
const BOX_H = 18;

// ------------------------------------------------------------------ bench

function bench() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BENCH, -6, 6, P)}"/>`];
  out.push(S(k.slabOf(BENCH, -6, 6, P, 6, 0.8), { tone: "lo", inner: L(k.sideSeam(BENCH, -3, P, 6), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(BENCH, 4), 0, P), { tone: "faint" }));
  // Ruler strip along the near edge, ticks every 5 mm, from the arm's axis out.
  const strip = { x: BENCH.x + 40, y: BENCH.y + BENCH.d - 14, w: BENCH.w - 64, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 5, 5, strip.y + 0.8, 0.6, [2, 3.8], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  // Pick and place pads: squares with a crosshair, inlaid.
  for (const [x] of PADS) {
    const pad = { x: x - 16, y: -16, w: 32, d: 32, r: 2 };
    out.push(S(k.slabOf(pad, 0, 0.4, P, 3), { tone: "lo", flat: true, crease: "none" }));
    out.push(L(k.planOutline(k.insetPlan(pad, 2.4), 0.4, P, 3), { tone: "faint" }));
    out.push(L(k.lineOnTop([x - 13.6, 0], [x + 13.6, 0], 0.4, P) + k.lineOnTop([x, -13.6], [x, 13.6], 0.4, P), { tone: "faint" }));
  }
  return out.join("");
}

// ------------------------------------------------------------- base stack

function base() {
  const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  const holes = k.corners(BASE, 9);
  put(
    "stand.base",
    [0, 0, BASE_H / 2],
    S(k.slabOf(BASE, 0, BASE_H, P, 8, 1), { tone: "mid", inner: L(k.sideSeam(BASE, BASE_H - 3, P, 8), { tone: "faint" }) }) +
      L(byDepth(holes).map(([x, y]) => k.ring(x, y, 3.4, BASE_H, P, 20)).join(""), { tone: "lo" }) +
      D(holes.map(([x, y]) => at([x, y, BASE_H])), { size: 0.55, tone: "mid" }),
    [A.slab(BASE, 0, BASE_H)],
  );
  // Turntable housing: the base servo lives inside; vents round its side.
  const vents = k.knurl(0, 0, HOUSING.r, HOUSING.z0 + 8, HOUSING.z1 - 8, 64, P, 0.3);
  const seams = k.sideArc(0, 0, HOUSING.r, HOUSING.z0 + 8, P, 64) + k.sideArc(0, 0, HOUSING.r, HOUSING.z1 - 8, P, 64);
  put(
    "stand.housing",
    [0, 0, (HOUSING.z0 + HOUSING.z1) / 2],
    S(k.cylinder(0, 0, HOUSING.r, HOUSING.z0, HOUSING.z1 - HOUSING.z0, P, 96, 0.8), { tone: "mid", inner: L(vents, { tone: "lo" }) + L(seams, { tone: "faint" }) }),
    [A.cylinder(0, 0, HOUSING.r, HOUSING.z0, HOUSING.z1 - HOUSING.z0)],
  );
  // Turntable with degree ticks round its rim.
  const ticks = k.radialTicks(0, 0, TABLE.r - 1, 72, 6, TABLE.z1, [1.4, 3], P);
  put(
    "stand.table",
    [0, 0, (TABLE.z0 + TABLE.z1) / 2],
    S(k.cylinder(0, 0, TABLE.r, TABLE.z0, TABLE.z1 - TABLE.z0, P, 96, 0.8), { tone: "hi", crease: "lo" }) +
      L(ticks.minor, { tone: "lo" }) +
      L(ticks.major, { tone: "mid" }) +
      L(k.ring(0, 0, TABLE.r - 5, TABLE.z1, P, 96), { tone: "faint" }),
    [A.cylinder(0, 0, TABLE.r, TABLE.z0, TABLE.z1 - TABLE.z0)],
  );
  // The shoulder servo's cradle, screwed to the turntable.
  const screws = [[CRADLE.x + 3, CRADLE.y + 3], [CRADLE.x + CRADLE.w - 3, CRADLE.y + 3], [CRADLE.x + 3, CRADLE.y + CRADLE.d - 3], [CRADLE.x + CRADLE.w - 3, CRADLE.y + CRADLE.d - 3]];
  put(
    "stand.cradle",
    [0, 0, (TABLE.z1 + CRADLE_TOP) / 2],
    S(k.slabOf(CRADLE, TABLE.z1, CRADLE_TOP - TABLE.z1, P, 3, 0.6), { tone: "mid", inner: L(k.sideSeam(CRADLE, TABLE.z1 + 5, P, 3), { tone: "faint" }) }) +
      D(screws.map(([x, y]) => at([x, y, CRADLE_TOP])), { size: 0.45 }),
    [A.slab(CRADLE, TABLE.z1, CRADLE_TOP - TABLE.z1)],
  );
}

// --------------------------------------------------- controller and cable

function controller() {
  // The arm's controller: a box with the microcontroller under a clear lid and
  // the Bluetooth module the phone talks to, cabled to the base.
  put(
    "stand.box",
    [BOX.x + BOX.w / 2, BOX.y + BOX.d / 2, BOX_H / 2],
    S(k.slabOf(BOX, 0, BOX_H, P, 4, 0.8), { tone: "mid", inner: L(k.sideSeam(BOX, BOX_H - 4, P, 4), { tone: "faint" }) }) +
      L(k.planOutline(k.insetPlan(BOX, 3), BOX_H, P, 3), { tone: "lo" }) +
      D(k.corners(BOX, 4.5).map(([x, y]) => at([x, y, BOX_H])), { size: 0.45 }),
    [A.slab(BOX, 0, BOX_H)],
  );
  const bt = { x: BOX.x + 6, y: BOX.y + 5, w: 12, d: 20, r: 1 };
  const ledAt = [bt.x + 10, bt.y + 4, BOX_H + 1.6];
  put(
    "stand.bt",
    [bt.x + bt.w / 2, bt.y + bt.d / 2, BOX_H + 0.8],
    S(k.slabOf(bt, BOX_H, 1.6, P, 2, 0.3), { tone: "lo" }) +
      L(k.planOutline(k.insetPlan(bt, 2), BOX_H + 1.6, P, 2), { tone: "faint" }) +
      `<circle data-led="" class="a-led" cx="${at(ledAt)[0].toFixed(1)}" cy="${at(ledAt)[1].toFixed(1)}" r="1.4"/>`,
    [A.slab(bt, BOX_H, 1.6)],
  );
  const mcu = { x: BOX.x + 22, y: BOX.y + 4, w: 12, d: 22, r: 1 };
  const pins = [];
  for (let i = 0; i < 7; i++) for (const x of [mcu.x + 1.6, mcu.x + mcu.w - 1.6]) pins.push(at([x, mcu.y + 2 + i * 2.8, BOX_H + 2.4]));
  put("stand.mcu", [mcu.x + 6, mcu.y + 11, BOX_H + 1.2], S(k.slabOf(mcu, BOX_H, 2.4, P, 2, 0.3), { tone: "lo" }) + D(pins, { size: 0.32, tone: "hi" }), [A.slab(mcu, BOX_H, 2.4)]);
  // The servo cable: out of the box's end, along the bench, into the base.
  const z = 2.2;
  const route = G.fillet([[BOX.x + BOX.w, BOX.y + 12, 8], [BOX.x + BOX.w + 10, BOX.y + 12, z], [-24, BOX.y + 12, z], [-24, BASE.y + BASE.d + 8, z], [-24, BASE.y + BASE.d, 4]], 6, 8);
  const pieces = tubePieces(route, 1.6, P, { maxLength: 30 });
  pieces.forEach((piece) => R.put({ name: R.nameFor("cable"), at: piece.mid, svg: tubeSvg(piece, { tone: "mid" }), shapes: [R.solid(A.tube(piece.points, 1.6, { name: "cable", limp: true }))] }));
}

// ------------------------------------------------------------------- build

bench();
base();
controller();
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
A.auditOrExit(R, P);

// Rest pose: the jaws open over the pick pad, the block waiting on it.
const REST = { ...solve(PADS[0][0], 70), grip: 34, carrying: false, blockAt: PADS[0][0] };
const body = [bench(), ...R.items.map((item) => item.svg), `<g data-target="">${drawTarget(PADS[0][0], 70)}</g>`, `<g data-arm="">${drawArm(REST)}</g>`].join("");

const label =
  "A desktop robotic arm on a bench: a square base and turntable, three servo joints whose round horns drive the next link's side plates, and a two-jaw gripper with toothed fingers. A controller box with a Bluetooth module is cabled to the base. The arm picks a block from one pad and sets it on the other: the phone sends only where the jaws should go, and the firmware works out the joint angles.";
const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body, className: "a-svg" });

const outDir = join(ROOT, "src", "figures", "robotic-arm");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "art.generated.ts"), `// Generated by figures/robotic-arm/build.mjs. Do not edit.\n/* eslint-disable */\nexport const ARM_SVG = ${JSON.stringify(svg)}\nexport const ARM_REST = ${JSON.stringify(REST)} as const\n`);
const still = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body: `<style><![CDATA[${CARD_CSS}]]></style>` + body, standalone: "dark", className: "a-svg" });
writeFileSync(join(ROOT, "public", "projects", "robotic-arm.svg"), still);
console.log(`wrote public/projects/robotic-arm.svg (${(still.length / 1024).toFixed(0)} KB)`);
console.log(`wrote src/figures/robotic-arm/art.generated.ts (${(svg.length / 1024).toFixed(0)} KB)`);
