// Devices for the app figures: a laptop, a phone and a tablet, drawn with the
// kit at the shared camera, each with a screen that shows real screenshots.
//
// A device stands at a floor point, turned to face `yaw` degrees (0 faces +x;
// the camera looks from +x +y, so yaw near 45 faces the viewer). Its screen is
// a flat face, and a parallel projection maps a flat image onto it with one
// affine transform: each screenshot is an <image> under a matrix() that puts
// its corners on the face's corners, clipped to the screen's rounded corners.

import * as A from "./kit/audit.mjs";
import * as k from "./kit/iso-kit.mjs";
import * as G from "./kit/lathe.mjs";

const RAD = Math.PI / 180;
const add = (a, b) => a.map((v, i) => v + b[i]);
const mul = (a, s) => a.map((v) => v * s);

/** A frame for a device at `at` (x, y, z) facing yaw: f forward, r to its right, up. */
export function facing(at, yaw) {
  const f = [Math.cos(yaw * RAD), Math.sin(yaw * RAD), 0];
  const r = [Math.sin(yaw * RAD), -Math.cos(yaw * RAD), 0]; // the device's right, seen from the front
  return { at, f, r, up: [0, 0, 1] };
}
/** A point `fx` forward and `rx` to the right of the device, at absolute height z. */
const point = (D, fx, rx, z) => add(add([D.at[0], D.at[1], z], mul(D.f, fx)), mul(D.r, rx));
const floorRing = (D, plan) => k.roundedPlan(plan, 6).map(([fx, rx]) => point(D, fx, rx, 0)).map(([x, y]) => [x, y]);

/**
 * A screen on a tilted face: `origin` its top-left corner, `across` and `down`
 * unit directions along the face, `w` by `h` its size in mm. Returns the
 * markup that shows `images` on it (the first visible, the rest hidden for the
 * live code to cycle), and the face's corners.
 */
export function screen(P, { origin, across, down, w, h, radius = 2, images, id }) {
  const tl = k.iso(origin, P);
  const tr = k.iso(add(origin, mul(across, w)), P);
  const bl = k.iso(add(origin, mul(down, h)), P);
  const shots = images
    .map((img, i) => {
      const a = (tr[0] - tl[0]) / img.w;
      const b = (tr[1] - tl[1]) / img.w;
      const c = (bl[0] - tl[0]) / img.h;
      const d = (bl[1] - tl[1]) / img.h;
      const rx = (radius / w) * img.w;
      const ry = (radius / h) * img.h;
      const clip = `${id}-${i}`;
      return `<g data-screen="${i}"${i ? ' style="opacity:0"' : ""} transform="matrix(${a.toFixed(5)} ${b.toFixed(5)} ${c.toFixed(5)} ${d.toFixed(5)} ${tl[0].toFixed(2)} ${tl[1].toFixed(2)})"><clipPath id="${clip}"><rect width="${img.w}" height="${img.h}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}"/></clipPath><image href="${img.href}" width="${img.w}" height="${img.h}" preserveAspectRatio="none" clip-path="url(#${clip})"/></g>`;
    })
    .join("");
  const glass = k.pathOf([origin, add(origin, mul(across, w)), add(add(origin, mul(across, w)), mul(down, h)), add(origin, mul(down, h))].map((p) => k.iso(p, P)), true);
  return `<g class="v-screen" data-device="${id}"><path class="v-black" d="${glass}"/>${shots}<path class="v-glare" d="${glass}"/></g>`;
}

/**
 * A slab device (a phone or a tablet) leaning back on a stand: a rounded body
 * `w` wide, `h` tall and `t` thick, tilted back by `lean` degrees, its bottom
 * edge resting on the stand's lip at height `z0`.
 */
export function slabDevice(P, D, { w, h, t, lean = 12, z0, bezel = 3, images, id, radius = 5, ear = true }) {
  const items = [];
  const tilt = lean * RAD;
  const upFace = add(mul(D.up, Math.cos(tilt)), mul(D.f, -Math.sin(tilt))); // up the face, leaning back
  const normal = add(mul(D.f, Math.cos(tilt)), mul(D.up, Math.sin(tilt))); // out of the face
  // Leaning back, the body rests on its rear bottom edge: lift it until that edge meets z0.
  const base = point(D, 0, 0, z0 + t * Math.sin(tilt));
  // The body: its rounded face outline extruded back along the normal by t.
  const F = { o: base, a: normal, u: D.r, v: upFace };
  const outline = G.hullOf(k.roundedPlan({ x: -w / 2, y: 0, w, d: h, r: radius }, 6));
  items.push({ name: `${id}.body`, at: add(base, mul(upFace, h / 2)), svg: k.solidSvg(G.prismOf(F, outline, -t, 0, P), { tone: "lo" }), shapes: [A.prism(F, outline, -t, 0)] });
  // The screen: the face inset by the bezel.
  const origin = add(add(base, mul(D.r, -w / 2 + bezel)), mul(upFace, h - bezel - (ear ? bezel * 1.4 : 0)));
  const sw = w - 2 * bezel;
  const sh = h - 2 * bezel - (ear ? bezel * 1.4 : 0);
  const down = mul(upFace, -1);
  let svg = screen(P, { origin: add(origin, mul(normal, 0.05)), across: D.r, down, w: sw, h: sh, radius: radius - 1.5, images, id });
  if (ear) {
    const e = add(base, mul(upFace, h - bezel * 1.1));
    svg += k.lineSvg(k.pathOf([add(e, mul(D.r, -4)), add(e, mul(D.r, 4))].map((p) => k.iso(add(p, mul(normal, 0.05)), P))), { tone: "mid", free: true });
  }
  // Recorded as a 0.6 skin on the face (the depth pass ignores gaps under 0.3), so it orders in front of the body.
  const skin = G.hullOf(k.roundedPlan({ x: -w / 2 + bezel, y: bezel, w: sw, d: sh, r: 1 }, 2));
  items.push({ name: `${id}.screen`, at: add(base, add(mul(upFace, h / 2), mul(normal, 0.2))), svg, shapes: [A.prism(F, skin, 0, 0.6)], bias: 0.05 });
  return { items, normal, upFace, base };
}

/**
 * The stand a slab device leans on: a foot plate, a lip in front of the
 * device's face, and a back leg whose top meets the device's back at half its
 * height. `t`, `h` and `lean` are the device's thickness, height and lean.
 */
export function stand(P, D, { w, depth = 26, lip = 3, z = 0, id, t, h, lean = 12 }) {
  const items = [];
  const foot = { x: -depth + 6, y: -w / 2, w: depth, d: w, r: 3 };
  const ring = floorRing(D, foot);
  const footShape = A.extruded(ring, z, 4, { name: `stand.${id}.foot` });
  items.push({ name: `stand.${id}.foot`, at: point(D, -depth / 2 + 6, 0, z + 2), svg: k.solidSvg(k.extrude(ring, z, 4, P, { bevel: 0.5 }), { tone: "mid" }), shapes: [footShape] });
  // The lip stands just in front of the device's face, which rests on the foot.
  const lipRing = floorRing(D, { x: 0.6, y: -w / 2 + 2, w: 4, d: w - 4, r: 1 });
  items.push({ name: `stand.${id}.lip`, at: point(D, 2.6, 0, z + 4 + lip / 2), svg: k.solidSvg(k.extrude(lipRing, z + 4, lip, P, { bevel: 0.3 }), { tone: "mid" }), shapes: [A.extruded(lipRing, z + 4, lip)] });
  // The leg: where the device's back face reaches height zt, it is at fx = -t·cos − s·sin.
  const tilt = lean * RAD;
  const zt = 0.5 * h * Math.cos(tilt);
  const s = (zt - t * Math.sin(tilt) + t * Math.sin(tilt)) / Math.cos(tilt); // the body is lifted by t·sin, which cancels
  const back = -t * Math.cos(tilt) - s * Math.sin(tilt);
  const legRing = floorRing(D, { x: back - 6, y: -w / 6, w: 6, d: w / 3, r: 1 });
  items.push({ name: `stand.${id}.leg`, at: point(D, back - 3, 0, z + 4 + zt / 2), svg: k.solidSvg(k.extrude(legRing, z + 4, zt, P, { bevel: 0.3 }), { tone: "lo" }), shapes: [A.extruded(legRing, z + 4, zt)] });
  return { items, top: z + 4, seat: footShape };
}

/**
 * A laptop on the floor at D: a base with its keyboard and trackpad, a hinge,
 * and the lid opened by `open` degrees with its screen facing forward.
 */
export function laptop(P, D, { w = 150, d = 100, t = 6, lid = 98, open = 105, images, id }) {
  const items = [];
  // The base, its keyboard deck and keys, the trackpad.
  const plan = { x: -d / 2, y: -w / 2, w: d, d: w, r: 6 };
  const ring = floorRing(D, plan);
  const z = D.at[2];
  const keys = [];
  const kb = { f0: -d / 2 + 14, f1: -d / 2 + 52, r0: -w / 2 + 12, r1: w / 2 - 12 };
  const rows = 5;
  for (let i = 0; i <= rows; i++) {
    const fx = kb.f0 + ((kb.f1 - kb.f0) * i) / rows;
    keys.push(k.pathOf([point(D, fx, kb.r0, z + t), point(D, fx, kb.r1, z + t)].map((p) => k.iso(p, P))));
  }
  for (let i = 0; i < rows; i++) {
    const count = 12 - (i === rows - 1 ? 4 : 0);
    const fx0 = kb.f0 + ((kb.f1 - kb.f0) * i) / rows;
    const fx1 = kb.f0 + ((kb.f1 - kb.f0) * (i + 1)) / rows;
    for (let j = 1; j < count; j++) {
      const rx = kb.r0 + ((kb.r1 - kb.r0) * (j + (i % 2) * 0.4)) / (count + 0.4);
      keys.push(k.pathOf([point(D, fx0, rx, z + t), point(D, fx1, rx, z + t)].map((p) => k.iso(p, P))));
    }
  }
  const deck = k.pathOf([point(D, kb.f0, kb.r0, z + t), point(D, kb.f0, kb.r1, z + t), point(D, kb.f1, kb.r1, z + t), point(D, kb.f1, kb.r0, z + t)].map((p) => k.iso(p, P)), true);
  const padRing = k.roundedPlan({ x: kb.f1 + 6, y: -22, w: d / 2 - kb.f1 - 12, d: 44, r: 3 }, 4).map(([fx, rx]) => point(D, fx, rx, z + t));
  const pad = k.pathOf(padRing.map((p) => k.iso(p, P)), true);
  const baseShape = A.extruded(ring, z, t, { name: `${id}.base` });
  items.push({
    name: `${id}.base`,
    at: point(D, 0, 0, z + t / 2),
    svg: k.solidSvg(k.extrude(ring, z, t, P, { bevel: 0.8 }), { tone: "mid", inner: k.lineSvg(k.ringSeam(ring, z + 2, P), { tone: "faint" }) }) + k.lineSvg(deck, { tone: "lo" }) + k.lineSvg(keys.join(""), { tone: "faint" }) + k.lineSvg(pad, { tone: "lo" }),
    shapes: [baseShape],
  });
  // The lid, hinged at the base's back edge, opened back by `open` degrees.
  const tilt = (open - 90) * RAD;
  const upFace = add(mul(D.up, Math.cos(tilt)), mul(D.f, -Math.sin(tilt)));
  const normal = add(mul(D.f, Math.cos(tilt)), mul(D.up, Math.sin(tilt)));
  const axis = point(D, -d / 2 + 3, 0, z + t + 2.6); // the hinge barrel's axis; the barrel sits on the base
  // The lid's face stands 2.6 in front of the axis, so it covers the barrel as a real lid does.
  const hinge = add(axis, mul(normal, 2.6));
  const F = { o: hinge, a: normal, u: D.r, v: upFace };
  const outline = G.hullOf(k.roundedPlan({ x: -w / 2, y: 0, w, d: lid, r: 5 }, 6));
  // The lid's edge sits in the hinge barrel: they are one assembly (`owner`).
  items.push({ name: `${id}.lid`, at: add(hinge, mul(upFace, lid / 2)), svg: k.solidSvg(G.prismOf(F, outline, -4, 0, P), { tone: "lo" }), shapes: [A.prism(F, outline, -4, 0, { owner: `${id}.lid` })], bias: -0.2 });
  const bezel = 5;
  const origin = add(add(hinge, mul(D.r, -w / 2 + bezel)), mul(upFace, lid - bezel));
  const svg = screen(P, { origin: add(origin, mul(normal, 0.05)), across: D.r, down: mul(upFace, -1), w: w - 2 * bezel, h: lid - 2 * bezel - 3, radius: 1.5, images, id });
  const skin = G.hullOf(k.roundedPlan({ x: -w / 2 + bezel, y: 3 + bezel, w: w - 2 * bezel, d: lid - 2 * bezel - 3, r: 1 }, 2));
  items.push({ name: `${id}.screen`, at: add(hinge, add(mul(upFace, lid / 2), mul(normal, 0.2))), svg, shapes: [A.prism(F, skin, 0, 0.6)], bias: 0.05 });
  // The hinge barrel along the back edge.
  const H = G.frameOf(add(axis, mul(D.r, -w / 2 + 20)), D.r, D.f, D.up);
  items.push({ name: `${id}.hinge`, at: axis, svg: k.solidSvg(G.disc(0, w - 40, 2.6, H, P), { tone: "mid", crease: "lo" }), shapes: [A.disc(H, 0, w - 40, 2.6, { owner: `${id}.lid` })], bias: 0.1 });
  return { items };
}

/** The CSS the device screens need, appended to the figure palette. */
export const DEVICE_CSS = `.v-black{fill:#050505}.v-glare{fill:url(#v-glare);pointer-events:none}.v-screen image{image-rendering:auto}`;
/** A soft diagonal sheen across every screen, defined once per figure. */
export const GLARE_DEFS = `<defs><linearGradient id="v-glare" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.07"/><stop offset="0.45" stop-color="#fff" stop-opacity="0.02"/><stop offset="0.46" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
