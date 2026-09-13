import type { SceneId } from '../three/types'

export type Locale = 'en' | 'fr'

export const LOCALES: readonly Locale[] = ['en', 'fr']

export type ProjectSlug = 'quadcopter' | 'cbienla' | 'drone-controller' | 'robotic-arm'

/** Ordered; also the order of the stops in the projects scene. */
export const PROJECT_SLUGS: readonly ProjectSlug[] = [
  // Most recent first.
  'cbienla',
  'quadcopter',
  'drone-controller',
  'robotic-arm',
]

export interface ProjectCopy {
  title: string
  /** One sentence. Feeds ProjectCard; never two. */
  summary: string
  tags: string[]
  role: string
  problem: string
  /** Bullet facts. Numbers over adjectives. */
  constraints: string[]
  decisions: { title: string; body: string }[]
  retrospective: string
}

export interface Copy {
  localeName: string
  nav: Record<Exclude<SceneId, 'hero'>, string>

  hero: {
    badge: string
    name: string
    /** One sentence. */
    statement: string
    lede: string
    cta: string
    scroll: string
  }

  about: {
    eyebrow: string
    title: string
    body: string
    languagesLabel: string
    softSkillsLabel: string
    languages: string[]
    softSkills: string[]
  }

  skills: {
    eyebrow: string
    title: string
    description: string
    /** Keyed by group id in content/site.ts. */
    groupLabels: Record<string, string>
    /** Keyed by skill id: how much of it he actually does. */
    levels: Record<string, string>
    /** Keyed by skill id: why he claims it. */
    why: Record<string, string>
    levelLabel: string
    close: string
    /** Under the languages card: they are shared by every domain, not one of them. */
    languagesNote: string
    /** How he works with AI tools. One string per paragraph. */
    ai: {
      label: string
      paragraphs: string[]
    }
  }

  projects: {
    eyebrow: string
    title: string
    description: string
    back: string
    roleLabel: string
    stackLabel: string
    problemLabel: string
    constraintsLabel: string
    decisionsLabel: string
    retrospectiveLabel: string
    entries: Record<ProjectSlug, ProjectCopy>
  }

  experience: {
    eyebrow: string
    title: string
    description: string
    /** Keyed by the role's stable id in content/experience.ts. */
    roles: Record<string, string>
  }

  education: {
    eyebrow: string
    title: string
    description: string
    degrees: Record<string, string>
  }

  contact: {
    eyebrow: string
    title: string
    description: string
    downloadCv: string
  }

  footerNote: string
  notFound: { eyebrow: string; title: string; back: string }
}
