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
} as const

/**
 * One résumé per language, served straight out of public/.
 *
 * The filenames are Thomas's own and contain a space, so they are encoded for
 * the URL; the download attribute still hands the reader the original name.
 * The contact button renders only for a locale that has a file here.
 */
export const cvFiles: Record<string, string> = {
  en: 'Resume_Thomas_KOEBEL.pdf',
  fr: 'CV_Thomas KOEBEL.pdf',
}

export function cvHref(locale: string): string | undefined {
  const file = cvFiles[locale]
  return file ? '/' + encodeURIComponent(file) : undefined
}

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
  { id: 'cbienla', index: '01', org: 'Cbienlà.fr', year: '2025–', href: 'https://cbienla.fr' },
  { id: 'nagarro', index: '02', org: 'Nagarro', year: '2024–25' },
  { id: 'facix', index: '03', org: 'Facix', year: '2023–25' },
  { id: 'epitech', index: '04', org: 'EPITECH Strasbourg', year: '2023' },
  { id: 'ale', index: '05', org: 'ALE Enterprise', year: '2021–22' },
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
  { id: 'epitech', index: '01', org: 'EPITECH Strasbourg', year: '2020–2025' },
  { id: 'hft', index: '02', org: 'HFT Stuttgart', year: '2023–2024' },
]

/** Technology stacks are not translated. Keyed by project slug. */
export const projectStacks: Record<string, string[]> = {
  'koebelt-dash': ['Flutter', 'Dart', 'C++ (Arduino)', 'Python', 'Rust', 'ROS 2', 'MAVLink', 'Bluetooth LE', 'GitHub Actions'],
  quadcopter: ['C', 'C++', 'KiCad', 'STM32', 'IMU sensor fusion'],
  'drone-controller': ['C++', 'CAD', 'FDM 3D printing', 'nRF24L01', 'LCD telemetry'],
  cbienla: ['Flutter', 'Dart', 'Nuxt.js', 'Vue', 'Firebase', 'Cloud Functions'],
  facix: ['Flutter', 'Dart', 'flutter_stripe', 'AWS Lambda', 'Cognito', 'DynamoDB', 'S3'],
  portfolio: ['React', 'TypeScript', 'Three.js', 'GLSL', 'Vite'],
  'robotic-arm': ['C++', 'Servo control', 'Inverse kinematics', 'Bluetooth', 'Flutter'],
}

/**
 * Project illustrations, keyed by slug.
 *
 * Prepared by scripts/build-project-images.py from originals/: cropped to
 * the card's 4:3 frame and written as greyscale, which is what they already are.
 */
export const projectImages: Record<string, string> = {
  'koebelt-dash': '/projects/koebelt-dash.png',
  quadcopter: '/projects/quadcopter.png',
  'drone-controller': '/projects/drone-controller.png',
  cbienla: '/projects/cbienla.png',
  facix: '/projects/facix.png',
  portfolio: '/projects/portfolio.png',
  'robotic-arm': '/projects/robotic-arm.png',
}

export interface ProjectImage {
  /** Stable key into the project's copy.captions, which is also the alt text. */
  id: string
  src: string
  /** The image's own width / height, so a screen keeps its shape. */
  ratio: string
  /** A desktop or tablet screen takes half a row, a phone a quarter. */
  shape: 'wide' | 'tall'
}

/**
 * Case-study galleries, keyed by slug. Prepared by scripts/build-project-images.py
 * from originals/<slug>/, at their own size and in colour; only card images are grey.
 */
export const projectGallery: Record<string, ProjectImage[]> = {
  'koebelt-dash': [
    { id: 'wall', src: '/projects/koebelt-dash/wall.png', ratio: '1180/820', shape: 'wide' },
    { id: 'arm-control', src: '/projects/koebelt-dash/arm-control.png', ratio: '1440/900', shape: 'wide' },
    { id: 'sequences', src: '/projects/koebelt-dash/sequences.png', ratio: '1440/900', shape: 'wide' },
    { id: 'replay', src: '/projects/koebelt-dash/replay.png', ratio: '1440/900', shape: 'wide' },
    { id: 'phone-live', src: '/projects/koebelt-dash/phone-live.png', ratio: '780/1688', shape: 'tall' },
    { id: 'phone-control', src: '/projects/koebelt-dash/phone-control.png', ratio: '780/1688', shape: 'tall' },
    { id: 'phone-sequences', src: '/projects/koebelt-dash/phone-sequences.png', ratio: '780/1688', shape: 'tall' },
    { id: 'phone-bench', src: '/projects/koebelt-dash/phone-bench.png', ratio: '780/1688', shape: 'tall' },
  ],
}

export interface ProjectDownload {
  /** Platform names read the same in every language. */
  platform: string
  /** File type and what it runs on, e.g. ".dmg · macOS 12+". */
  detail: string
  href: string
}

export interface ProjectRelease {
  version: string
  /** ISO date, formatted for the reader's language. */
  date: string
  notes: string
  downloads: ProjectDownload[]
}

/**
 * Downloadable releases, keyed by slug. The file names carry the version, so
 * this is updated with each release.
 */
const dashRelease = 'https://github.com/koebelt/koebelt_dash/releases/download/app-v1.0.0/koebelt-dash-1.0.0'
export const projectReleases: Record<string, ProjectRelease> = {
  'koebelt-dash': {
    version: '1.0.0',
    date: '2026-10-15',
    notes: 'https://github.com/koebelt/koebelt_dash/releases/tag/app-v1.0.0',
    downloads: [
      { platform: 'macOS', detail: '.dmg · macOS 12+', href: `${dashRelease}-macos.dmg` },
      { platform: 'Windows', detail: '.exe · Windows 10+, x64', href: `${dashRelease}-windows-x64-setup.exe` },
      { platform: 'Linux', detail: '.tar.gz · x64, GTK 3', href: `${dashRelease}-linux-x64.tar.gz` },
      { platform: 'Android', detail: '.apk · Android 7+', href: `${dashRelease}-android.apk` },
    ],
  },
}

/** Optional outbound links per project. */
export const projectLinks: Record<string, { label: string; href: string }[]> = {
  'koebelt-dash': [
    { label: 'github.com/koebelt/koebelt_dash', href: 'https://github.com/koebelt/koebelt_dash' },
    { label: 'pypi.org/project/koebelt-link', href: 'https://pypi.org/project/koebelt-link/' },
    { label: 'crates.io/crates/koebelt-link', href: 'https://crates.io/crates/koebelt-link' },
  ],
  cbienla: [{ label: 'cbienla.fr', href: 'https://cbienla.fr' }],
}

export interface SkillEntry {
  /** Stable key into copy.skills.levels / copy.skills.why. */
  id: string
  /** Technology names are the same in every language, so they live here. */
  name: string
}

export interface SkillGroup {
  /** Stable key into copy.skills.groupLabels. */
  id: string
  items: SkillEntry[]
}

/**
 * Four groups — one orbital shell each in the skills scene. Languages come first
 * on purpose: they are shared by every domain, and index 0 is the innermost,
 * untilted shell the other three orbit.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    items: [
      { id: 'c', name: 'C / C++' },
      { id: 'ts', name: 'JavaScript / TypeScript' },
      { id: 'python', name: 'Python' },
      { id: 'bash', name: 'Bash' },
      { id: 'sql', name: 'SQL' },
      { id: 'dart', name: 'Dart' },
      { id: 'haskell', name: 'Haskell' },
      { id: 'rust', name: 'Rust' },
      { id: 'java', name: 'Java' },
    ],
  },
  {
    id: 'web',
    items: [
      { id: 'node', name: 'NodeJS' },
      { id: 'react', name: 'ReactJS' },
      { id: 'vue', name: 'VueJS' },
      { id: 'nuxt', name: 'NuxtJS' },
      { id: 'angular', name: 'AngularJS' },
      { id: 'spring', name: 'Spring Boot' },
    ],
  },
  {
    id: 'mobile',
    items: [
      { id: 'react-native', name: 'React Native' },
      { id: 'flutter', name: 'Flutter' },
    ],
  },
  {
    id: 'cloud',
    items: [
      { id: 'aws', name: 'AWS' },
      { id: 'gcp', name: 'GCP' },
      { id: 'firebase', name: 'Firebase' },
      { id: 'docker', name: 'Docker' },
      { id: 'linux', name: 'Linux (Arch, Debian)' },
    ],
  },
]

/** Flat list of names, for the marquee band. */
export const skillNames: string[] = skillGroups.flatMap((g) => g.items.map((i) => i.name))
