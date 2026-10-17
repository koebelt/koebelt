// Fig: this portfolio, on a laptop and a phone: the real pages of this site,
// captured from its production build.
//
//   node figures/portfolio/build.mjs [--audit]

import { buildAppFigure } from "../apps.mjs";

buildAppFigure({
  slug: "portfolio",
  constName: "PORTFOLIO",
  base: { x: -86, y: -92, w: 170, d: 190, r: 8 },
  devices: [
    { kind: "laptop", id: "laptop", at: [-20, 34], yaw: 34, screens: ["hero", "projects", "case"] },
    { kind: "phone", id: "phone", at: [58, -46], yaw: 34, screens: ["mobile", "mobile-skills"] },
  ],
  label: "This site on a laptop and a phone: the hero with its particle sphere, the projects, a case study, and the same pages laid out for a phone.",
});
