// One camera for every anatomy figure, so they read as a set: true isometric,
// looking down the diagonal at 35.26° (atan(1/√2)).
export const CAMERA = { azimuth: 45, elevation: (Math.atan(1 / Math.SQRT2) * 180) / Math.PI };
