// Builds an app figure: devices on a base plate, each screen showing the app's
// real screenshots (figures/screens.json, from public/figures/<slug>/). The
// page gets the drawing with every screen layered for the live code to cycle;
// the project card gets a still with each device's first screen embedded, since
// an SVG shown as an <img> cannot load outside images.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { CAMERA } from "./camera.mjs";
import { GLARE_DEFS, facing, laptop, slabDevice, stand } from "./devices.mjs";
import * as A from "./kit/audit.mjs";
import * as k from "./kit/iso-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SCREENS = JSON.parse(readFileSync(join(HERE, "screens.json"), "utf8"));
const CARD_CSS = readFileSync(join(ROOT, "src", "figures", "palette.css"), "utf8");

const WIDTH = 640;
const HEIGHT = 480;
const BASE_H = 10;

/**
 * `devices`: [{ kind: "laptop" | "phone" | "tablet", id, at: [x, y], yaw, screens: [names] }].
 * `base`: the plate's plan. Writes src/figures/<slug>/art.generated.ts and public/projects/<slug>.svg.
 */
export function buildAppFigure({ slug, constName, base, devices, label }) {
  const corners = [...k.boxCorners(base, -4, 0)];
  // Fit to each device's real extent: its footprint and the top of its lid or body.
  for (const dev of devices) {
    const a = (dev.yaw * Math.PI) / 180;
    const at = (fx, rx, z) => [dev.at[0] + Math.cos(a) * fx + Math.sin(a) * rx, dev.at[1] + Math.sin(a) * fx - Math.cos(a) * rx, z];
    const [w, back, top] = dev.kind === "laptop" ? [150, -50 - 98 * Math.sin(0.26), BASE_H + 8 + 98 * Math.cos(0.26)] : dev.kind === "tablet" ? [104, -20, BASE_H + 6 + 74] : [40, -20, BASE_H + 6 + 84];
    for (const rx of [-w / 2, w / 2]) corners.push(at(52, rx, BASE_H), at(back, rx, top));
  }
  const P = k.fitProjection(corners, WIDTH, HEIGHT, { pad: 28, ...CAMERA });
  // The plate is drawn outside the sorted layer; what stands on it is the ground.
  const R = A.recorder(P, { ground: (shape) => shape.name?.startsWith("stand.") || shape.name?.endsWith(".base") });
  const put = ({ name, at, svg, shapes = [], bias = 0 }) => {
    const unique = R.nameFor(name);
    for (const shape of shapes) shape.name ??= unique;
    R.put({ name: unique, at, bias, svg, shapes: shapes.map((s) => R.solid(s)) });
  };

  // The plate everything stands on, as on the hardware figures.
  const plate = (() => {
    const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
    const out = [`<path class="iso-halo" d="${k.haloOf(base, -4, 4, P)}"/>`];
    for (const [x, y] of byDepth(k.corners(base, 14))) {
      out.push(k.solidSvg(k.cylinder(x, y, 6, -4, 1.4, P, 24), { tone: "lo" }));
      out.push(k.solidSvg(k.cylinder(x, y, 4.6, -2.6, 2.6, P, 24), { tone: "mid" }));
    }
    out.push(k.solidSvg(k.slabOf(base, 0, BASE_H, P, 8, 1.2), { tone: "mid", inner: k.lineSvg(k.sideSeam(base, 4, P, 8), { tone: "faint" }) }));
    out.push(k.lineSvg(k.planOutline(k.insetPlan(base, 5), BASE_H, P), { tone: "lo" }));
    const strip = { x: base.x + base.w - 12, y: base.y + 24, w: 6, d: base.d - 48, r: 1 };
    out.push(k.solidSvg(k.slabOf(strip, BASE_H, 0.6, P, 3), { tone: "lo", crease: "none" }));
    const ticks = k.topTicks(strip.y + 3, strip.y + strip.d - 3, 5, 5, strip.x + 0.8, BASE_H + 0.6, [1.8, 3.2], P, "y");
    out.push(k.lineSvg(ticks.minor, { tone: "lo" }), k.lineSvg(ticks.major, { tone: "mid" }));
    return out.join("");
  })();

  const images = (dev, { firstOnly = false, inline = false } = {}) =>
    (firstOnly ? dev.screens.slice(0, 1) : dev.screens).map((name) => {
      const shot = SCREENS[slug][name];
      if (!shot) throw new Error(`no screenshot ${slug}/${name} in figures/screens.json`);
      const href = inline ? `data:image/webp;base64,${readFileSync(join(ROOT, "public", shot.href)).toString("base64")}` : shot.href;
      return { ...shot, href };
    });

  const draw = (opts) => {
    R.items.length = 0;
    R.solids.length = 0;
    for (const dev of devices) {
      const D = facing([dev.at[0], dev.at[1], BASE_H], dev.yaw);
      if (dev.kind === "laptop") {
        laptop(P, D, { images: images(dev, opts), id: dev.id, ...(dev.size ?? {}) }).items.forEach(put);
      } else {
        const size = dev.kind === "tablet" ? { w: 104, h: 74, t: 5, bezel: 4, radius: 6, ear: false } : { w: 40, h: 84, t: 5, bezel: 2.6, radius: 6, ear: true };
        const s = stand(P, D, { w: size.w * 0.8, depth: 26, lip: 3, z: BASE_H, id: dev.id, t: size.t, h: size.h, lean: 12 });
        s.items.forEach(put);
        slabDevice(P, D, { ...size, lean: 12, z0: s.top, images: images(dev, opts), id: dev.id }).items.forEach(put);
      }
    }
    A.settle(R, P);
    R.items.sort((a, b) => a.key - b.key);
    return R.items.map((item) => item.svg).join("");
  };

  const live = draw({});
  A.auditOrExit(R, P);
  const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body: GLARE_DEFS + plate + live, className: "v-svg" });
  const card = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body: `<style><![CDATA[${CARD_CSS}]]></style>` + GLARE_DEFS + plate + draw({ firstOnly: true, inline: true }), standalone: "dark", className: "v-svg" });

  const data = { devices: Object.fromEntries(devices.map((dev) => [dev.id, dev.screens])) };
  const outDir = join(ROOT, "src", "figures", slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "art.generated.ts"), `// Generated by figures/${slug}/build.mjs. Do not edit.\n/* eslint-disable */\nexport const ${constName}_SVG = ${JSON.stringify(svg)}\nexport const ${constName}_DATA = ${JSON.stringify(data)} as const\n`);
  writeFileSync(join(ROOT, "public", "projects", `${slug}.svg`), card);
  console.log(`wrote public/projects/${slug}.svg (${(card.length / 1024).toFixed(0)} KB) and src/figures/${slug}/art.generated.ts (${(svg.length / 1024).toFixed(0)} KB)`);
}
