// Fig: koebelt/dash on the three screens it ships on: the desktop app, a
// tablet and a phone, each showing its real screens.
//
//   node figures/koebelt-dash/build.mjs [--audit]

import { buildAppFigure } from "../apps.mjs";

buildAppFigure({
  slug: "koebelt-dash",
  constName: "DASH",
  base: { x: -112, y: -152, w: 210, d: 270, r: 8 },
  devices: [
    { kind: "laptop", id: "laptop", at: [-26, 62], yaw: 34, screens: ["replay", "sequences", "arm-control"] },
    { kind: "tablet", id: "tablet", at: [48, -52], yaw: 34, screens: ["wall"] },
    { kind: "phone", id: "phone", at: [86, -122], yaw: 34, screens: ["phone-live", "phone-control", "phone-sequences", "phone-bench"] },
  ],
  label: "koebelt/dash on a laptop, a tablet and a phone: replaying a recorded flight, programming a sequence, jogging a robot arm, the sensor wall, and the phone's live view, controls, sequences and test bench.",
});
