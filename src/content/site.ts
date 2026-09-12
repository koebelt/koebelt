import type { SceneId } from '../three/types'

export const site = {
  name: 'Thomas Koebel',
  role: 'Software engineer',
  email: 'contact@koebelt.com',
  location: 'Niort, France',
  /** WGS84, used to place the marked point on the globe morph target. */
  coords: { lat: 46.3239, lon: -0.4645 },
  github: 'https://github.com/koebelt',
  linkedin: 'https://linkedin.com/in/koebelt',
  /** No PDF exists yet. The Download CV button renders only once this is set. */
  cvUrl: undefined as string | undefined,
  footerNote: 'Portfolio built as a live demonstration of the KOEBELT design system.',
} as const

export const hero = {
  badge: 'Open to new opportunities',
  title: 'Software engineer building systems and products.',
  cta: 'View work',
} as const

export const about = {
  body: "I'm Thomas Koebel, a software engineer working across backend, web, mobile, and cloud systems. My work spans architecture, development, and technical leadership, with a focus on building reliable software and keeping complexity under control. I value clear design, pragmatic decisions, and understanding the problem before choosing the solution.",
  languages: ['French — native', 'English — TOEIC 860', 'German — A2'],
  softSkills: ['Communication', 'Creativity', 'Problem solving', 'Adaptability'],
} as const

/**
 * What the sphere says about each scene. One sentence each — the design system's
 * voice rules, enforced by the dev-only assert below.
 *
 * `hero` cycles through its three; every other scene shows one and changes only
 * when the scene does. The sphere explains the section; it does not chatter.
 */
export const CAPTIONS: Record<SceneId, readonly string[]> = {
  hero: [
    'Working across backend, web, mobile and cloud systems.',
    'Based in Niort, France.',
    "Master's in software engineering from EPITECH Strasbourg.",
  ],
  about: ['One point on this globe is Niort, where I work.'],
  skills: ['Four shells, one per discipline I work in.'],
  projects: ['Each cluster is one project you can open.'],
  experience: ['The column beats once for every role.'],
  contact: ['The sphere reforms — same shape, five sections later.'],
}

/** Hero caption dwell time, in ms. The fade itself uses --dur-slow. */
export const CAPTION_INTERVAL_MS = 3600

if (import.meta.env.DEV) {
  for (const [scene, lines] of Object.entries(CAPTIONS)) {
    for (const line of lines) {
      if (!/^[^.!?]+[.]$/.test(line.trim())) {
        console.warn(`[voice] caption for "${scene}" is not one sentence: ${line}`)
      }
    }
  }
}
