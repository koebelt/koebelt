import type { SceneId } from '../three/types'

export type Locale = 'en' | 'fr'

export const LOCALES: readonly Locale[] = ['en', 'fr']

export type ProjectSlug =
  | 'koebelt-dash'
  | 'portfolio'
  | 'cbienla'
  | 'facix'
  | 'quadcopter'
  | 'drone-controller'
  | 'robotic-arm'

/** Ordered; also the order of the stops in the projects scene. */
export const PROJECT_SLUGS: readonly ProjectSlug[] = [
  // Most recent first.
  'koebelt-dash',
  'portfolio',
  'cbienla',
  'facix',
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
  /** Omitted for work still in progress, where hindsight is not yet due. */
  retrospective?: string
  /** Gallery captions, keyed by the image ids in projectGallery (site.ts). Also the alt text. */
  captions?: Record<string, string>
  /** One or two sentences under the download buttons, when the project has a release. */
  downloadNote?: string
  /** Diagrams listed in projectDiagrams (site.ts): a title, a caption that says what
      the drawing shows (also its accessible name), and the labels drawn in it. */
  diagrams?: Record<string, { title: string; caption: string; labels: Record<string, string> }>
}

export interface Copy {
  localeName: string
  /** The browser tab title for the home page. */
  documentTitle: string
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
    howLabel: string
    /** Under a diagram that is wider than the screen. */
    swipeHint: string
    galleryLabel: string
    downloadLabel: string
    linksLabel: string
    /** Precedes the version number: "Version 1.0.0". */
    versionLabel: string
    releaseNotes: string
    /** The full-screen image viewer. */
    viewer: { open: string; close: string; previous: string; next: string }
    entries: Record<ProjectSlug, ProjectCopy>
  }

  experience: {
    eyebrow: string
    title: string
    description: string
    /** Keyed by the role's stable id in content/experience.ts. */
    roles: Record<string, string>
    /** Keyed like roles: what the job actually involved. Two sentences at most. */
    details: Record<string, string>
  }

  education: {
    eyebrow: string
    title: string
    description: string
    degrees: Record<string, string>
    /** Keyed like degrees: what the programme covered. Two sentences at most. */
    details: Record<string, string>
  }

  contact: {
    eyebrow: string
    title: string
    description: string
    downloadCv: string
  }

  footerNote: string
  legal: {
    /** "Last updated", before the date. */
    updatedLabel: string
    /** Heading over the per-project sections. */
    productsLabel: string
    notice: LegalPage
    privacy: LegalPage
    terms: LegalPage
  }
  notFound: {
    eyebrow: string
    title: string
    /** `{path}` is replaced by the address that was asked for, set in mono. */
    body: string
    /** Stands in for the path until it is known (the page is prerendered). */
    pathFallback: string
    back: string
    email: string
    /** Beside the globe, which marks where Thomas is. */
    caption: string
    suggestions: string
  }
}

export interface LegalSection {
  title: string
  paragraphs?: string[]
  list?: string[]
}

/**
 * A legal page (/legal, /privacy, /terms): what applies to every koebelt
 * project, then what each project adds.
 */
export interface LegalPage {
  /** Also the footer link. */
  title: string
  /** Under the title: what the page covers. */
  intro: string
  sections: LegalSection[]
  products?: { name: string; sections: LegalSection[] }[]
}
