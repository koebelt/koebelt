// Fig: Cbienlà, on a laptop and a phone: the live site, cbienla.fr, server
// rendered by Nuxt, and its phone layout.
//
//   node figures/cbienla/build.mjs [--audit]

import { buildAppFigure } from "../apps.mjs";

buildAppFigure({
  slug: "cbienla",
  constName: "CBIENLA",
  base: { x: -86, y: -92, w: 170, d: 190, r: 8 },
  devices: [
    { kind: "laptop", id: "laptop", at: [-20, 34], yaw: 34, screens: ["home", "listing", "region", "home-scroll"] },
    { kind: "phone", id: "phone", at: [58, -46], yaw: 34, screens: ["mobile", "mobile-listing"] },
  ],
  label: "Cbienlà on a laptop and a phone: the home page with its search, a listing with its photos and price, the regional listings, and the same site on a phone.",
});
