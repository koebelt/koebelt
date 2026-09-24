/**
 * The portfolio as text and structured data, for AI agents and search engines.
 *
 * Built from the same copy the page renders, so it cannot drift from it. Unlike
 * the prerendered HTML it also carries what the page hides behind interaction
 * (the per-skill notes in the skills dialog) and the French copy, which has no
 * URL of its own. Written to dist/ by scripts/prerender.mjs.
 */
import { cvHref, degrees, projectImages, projectLinks, projectStacks, roles, site, skillGroups } from './content/site'
import { en } from './i18n/en'
import { fr } from './i18n/fr'
import { PROJECT_SLUGS, type Copy, type Locale } from './i18n/types'

export const ORIGIN = 'https://koebelt.com'

const DICTIONARIES: Record<Locale, Copy> = { en, fr }

/** Where each locale's text file is served. */
export const LLMS_FILES: Record<Locale, string> = { en: 'llms.txt', fr: 'llms-fr.txt' }

/** Headings that have no key in the copy, since the page never prints them. */
const LABELS: Record<Locale, Record<string, string>> = {
  en: {
    location: 'Location',
    email: 'Email',
    cv: 'Résumé (PDF)',
    otherLanguage: 'Version française',
    caseStudy: 'Case study',
    links: 'Links',
    level: 'Level',
    colon: ': ',
  },
  fr: {
    location: 'Localisation',
    email: 'E-mail',
    cv: 'CV (PDF)',
    otherLanguage: 'English version',
    caseStudy: 'Étude de cas',
    links: 'Liens',
    level: 'Niveau',
    // French sets a space before a colon.
    colon: ' : ',
  },
}

const list = (items: string[]) => items.map((item) => `- ${item}`).join('\n')

/**
 * Follows the llms.txt proposal (llmstxt.org): an H1, a one-line summary as a
 * blockquote, then plain Markdown. The whole site is small enough to inline
 * rather than only link to.
 */
export function llmsTxt(locale: Locale): string {
  const c = DICTIONARIES[locale]
  const l = LABELS[locale]
  const other: Locale = locale === 'en' ? 'fr' : 'en'
  const cv = cvHref(locale)

  const out: string[] = []
  const section = (title: string, ...body: string[]) => out.push(`## ${title}`, ...body)

  out.push(
    `# ${site.name}: ${c.hero.statement}`,
    `> ${c.hero.lede}`,
    [
      `- ${c.hero.badge}`,
      `- ${l.location}${l.colon}Niort, France`,
      `- ${l.email}${l.colon}${site.email}`,
      cv ? `- ${l.cv}${l.colon}${ORIGIN}${cv}` : null,
      `- GitHub${l.colon}${site.github}`,
      `- LinkedIn${l.colon}${site.linkedin}`,
      `- ${l.otherLanguage}${l.colon}${ORIGIN}/${LLMS_FILES[other]}`,
    ]
      .filter(Boolean)
      .join('\n'),
  )

  section(
    c.about.title,
    c.about.body,
    `### ${c.about.languagesLabel}`,
    list(c.about.languages),
    `### ${c.about.softSkillsLabel}`,
    list(c.about.softSkills),
  )

  section(c.skills.title, c.skills.description)
  for (const group of skillGroups) {
    out.push(`### ${c.skills.groupLabels[group.id]}`)
    for (const skill of group.items) {
      out.push(
        `#### ${skill.name}`,
        `${l.level}${l.colon}${c.skills.levels[skill.id]}`,
        c.skills.why[skill.id],
      )
    }
  }
  out.push(`### ${c.skills.ai.label}`, ...c.skills.ai.paragraphs)

  section(c.projects.title, c.projects.description)
  for (const slug of PROJECT_SLUGS) {
    const p = c.projects.entries[slug]
    const links = projectLinks[slug] ?? []
    out.push(
      `### ${p.title}`,
      p.summary,
      [
        `- ${l.caseStudy}${l.colon}${ORIGIN}/work/${slug}`,
        `- ${c.projects.roleLabel}${l.colon}${p.role}`,
        `- ${c.projects.stackLabel}${l.colon}${(projectStacks[slug] ?? []).join(', ')}`,
        links.length ? `- ${l.links}${l.colon}${links.map((link) => link.href).join(', ')}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
      `#### ${c.projects.problemLabel}`,
      p.problem,
      `#### ${c.projects.constraintsLabel}`,
      list(p.constraints),
      `#### ${c.projects.decisionsLabel}`,
      ...p.decisions.map((d) => `**${d.title}.** ${d.body}`),
    )
    if (p.retrospective) out.push(`#### ${c.projects.retrospectiveLabel}`, p.retrospective)
  }

  section(c.experience.title, c.experience.description)
  for (const role of roles) {
    out.push(
      `### ${role.org} (${role.year})${l.colon}${c.experience.roles[role.id]}`,
      c.experience.details[role.id],
    )
  }

  section(c.education.title, c.education.description)
  for (const degree of degrees) {
    out.push(
      `### ${degree.org} (${degree.year})${l.colon}${c.education.degrees[degree.id]}`,
      c.education.details[degree.id],
    )
  }

  section(c.contact.title, c.contact.description, `${l.email}${l.colon}${site.email}`)

  return out.join('\n\n') + '\n'
}

/**
 * schema.org data for a prerendered page, in English: a ProfilePage about the
 * Person on the home page, and a CreativeWork by that Person on each case study.
 * Search engines read this directly; it states name, role and links as facts
 * rather than prose.
 */
export function jsonLd(path: string): string {
  const person = {
    '@type': 'Person',
    '@id': `${ORIGIN}/#person`,
    name: site.name,
    jobTitle: en.hero.statement,
    description: en.hero.lede,
    url: `${ORIGIN}/`,
    image: `${ORIGIN}/og-image.png`,
    email: `mailto:${site.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Niort', addressCountry: 'FR' },
    sameAs: [site.github, site.linkedin],
    alumniOf: degrees.map((d) => ({ '@type': 'CollegeOrUniversity', name: d.org })),
    knowsAbout: skillGroups.flatMap((g) => g.items.map((i) => i.name)),
    knowsLanguage: ['fr', 'en', 'de'],
  }

  const slug = PROJECT_SLUGS.find((s) => path === `/work/${s}`)
  const data = slug
    ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        url: `${ORIGIN}${path}`,
        name: en.projects.entries[slug].title,
        description: en.projects.entries[slug].summary,
        keywords: (projectStacks[slug] ?? []).join(', '),
        image: `${ORIGIN}${projectImages[slug]}`,
        author: person,
      }
    : { '@context': 'https://schema.org', '@type': 'ProfilePage', url: `${ORIGIN}/`, mainEntity: person }

  // `<` escaped so no string in the copy can close the script element early.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
