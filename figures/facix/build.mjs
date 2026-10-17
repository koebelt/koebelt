// Fig: Facix, on a laptop and two phones: the app's screens from its Figma
// file, browsing on one phone, booking and paying on the other, and the web
// version on the laptop.
//
//   node figures/facix/build.mjs [--audit]

import { buildAppFigure } from "../apps.mjs";

buildAppFigure({
  slug: "facix",
  constName: "FACIX",
  base: { x: -112, y: -152, w: 210, d: 270, r: 8 },
  devices: [
    { kind: "laptop", id: "laptop", at: [-26, 62], yaw: 34, screens: ["web-home", "web-details", "web-success"] },
    { kind: "phone", id: "browse", at: [40, -40], yaw: 34, screens: ["home", "search", "details"] },
    { kind: "phone", id: "pay", at: [72, -100], yaw: 34, screens: ["pay", "success"] },
  ],
  label: "Facix on a laptop and two phones: activities to browse, search and an activity's details on one phone, paying with a saved card and the confirmation on the other, and the web version on the laptop.",
});
