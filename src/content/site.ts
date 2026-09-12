/**
 * Everything here is locale-invariant: names, dates, URLs, technology names and
 * coordinates read the same in both languages. Translated copy lives in src/i18n.
 */

export const site = {
  name: 'Thomas Koebel',
  email: 'contact@koebelt.com',
  /** WGS84, used to place the marked point on the globe. */
  coords: { lat: 46.3239, lon: -0.4645 },
  github: 'https://github.com/koebelt',
  linkedin: 'https://linkedin.com/in/koebelt',
  /** No PDF exists yet. The Download CV button renders only once this is set. */
  cvUrl: undefined as string | undefined,
} as const

/** Hero caption dwell time, in ms. The fade itself uses --dur-slow. */
export const CAPTION_INTERVAL_MS = 3600

export interface Role {
  /** Stable key into copy.experience.roles. */
  id: string
  index: string
  org: string
  year: string
  href?: string
}

/** Five roles — one gaussian bulge each in the experience scene. */
export const roles: Role[] = [
  { id: 'cbienla', index: '01', org: 'Cbienlà.fr', year: '2025—', href: 'https://cbienla.fr' },
  { id: 'nagarro', index: '02', org: 'Nagarro', year: '2024—25' },
  { id: 'facix', index: '03', org: 'Facix', year: '2023—25' },
  { id: 'epitech', index: '04', org: 'EPITECH Strasbourg', year: '2023' },
  { id: 'ale', index: '05', org: 'ALE Enterprise', year: '2021—22' },
]

export interface Degree {
  /** Stable key into copy.education.degrees. */
  id: string
  index: string
  org: string
  year: string
}

/** Two degrees — one stratum each in the education scene. */
export const degrees: Degree[] = [
  { id: 'epitech', index: '01', org: 'EPITECH Strasbourg', year: '2020—2025' },
  { id: 'hft', index: '02', org: 'HFT Stuttgart', year: '2023—2024' },
]

/** Technology stacks are not translated. Keyed by project slug. */
export const projectStacks: Record<string, string[]> = {
  quadcopter: ['C', 'C++', 'KiCad', 'STM32', 'IMU sensor fusion'],
  'drone-controller': ['C++', 'CAD', 'FDM 3D printing', 'nRF24 radio', 'Embedded firmware'],
  cbienla: ['Flutter', 'Dart', 'Nuxt.js', 'Vue', 'Firebase', 'Cloud Functions'],
  'robotic-arm': ['C++', 'Microcontroller firmware', 'Bluetooth', 'Mobile client'],
}

/** Optional outbound links per project. */
export const projectLinks: Record<string, { label: string; href: string }[]> = {
  cbienla: [{ label: 'cbienla.fr', href: 'https://cbienla.fr' }],
}
