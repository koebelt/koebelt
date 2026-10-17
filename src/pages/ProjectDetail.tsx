import { Button, Card, Divider, Icon, MediaFrame, SectionHeading, Tag } from '@ds'
import { Suspense, useEffect, useRef, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { DIAGRAMS } from '../components/diagrams'
import { Gallery } from '../components/Gallery'
import { FIGURES } from '../figures'
import { Reveal } from '../components/Reveal'
import { projectDiagrams, projectGallery, projectImages, projectLinks, projectReleases, projectStacks, type ProjectRelease } from '../content/site'
import { useCopy, useLocale } from '../i18n/LocaleContext'
import { PROJECT_SLUGS, type ProjectSlug } from '../i18n/types'
import { useSceneRegistry } from '../scroll/SceneContext'
import { useSphere } from '../three/SphereContext'
import NotFound from './NotFound'

const isSlug = (value: string | undefined): value is ProjectSlug =>
  !!value && (PROJECT_SLUGS as readonly string[]).includes(value)

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const sphere = useSphere()
  const registry = useSceneRegistry()
  const copy = useCopy()
  const articleRef = useRef<HTMLElement | null>(null)
  const slotRef = useRef<HTMLDivElement | null>(null)

  const valid = isSlug(slug)

  // Register as the projects scene. Without this the controller has no sections
  // on this route, so it would hold the sphere full-bleed over the copy and
  // overwrite any setScene call on the next frame.
  useEffect(() => {
    const el = articleRef.current
    if (!el || !valid) return
    return registry.register('projects', el, slotRef.current)
  }, [valid, registry])

  // Keep this project's stop spinning faster for as long as the page is open.
  useEffect(() => {
    if (!valid) return
    sphere?.setFocus(PROJECT_SLUGS.indexOf(slug))
    window.scrollTo(0, 0)
    return () => sphere?.setFocus(null)
  }, [valid, slug, sphere])

  if (!valid) return <NotFound />

  const project = copy.projects.entries[slug]
  const stack = projectStacks[slug] ?? []
  const links = projectLinks[slug] ?? []
  const gallery = projectGallery[slug] ?? []
  const diagrams = (projectDiagrams[slug] ?? []).filter((id) => DIAGRAMS[`${slug}/${id}`] && project.diagrams?.[id])
  const release = projectReleases[slug]
  const Figure = FIGURES[slug]

  return (
    <article ref={articleRef} className="container section">
      {/* Outside the grid and outside any flex column: as a flex child this
          stretched to the column width and centred its own label. */}
      <Button
        as="a"
        href="/#projects"
        variant="ghost"
        size="sm"
        iconLeft={<Icon name="arrow-right" size={16} style={{ transform: 'rotate(180deg)' }} />}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return
          e.preventDefault()
          navigate('/#projects')
        }}
        style={{ marginBottom: 'var(--space-8)' }}
      >
        {copy.projects.back}
      </Button>

      {/* One grid, not two. Splitting the heading and the body into separate
          grid rows meant the tall right column set the height of the first row,
          and the case study started a whole screen below the fold. */}
      {/* Three direct grid children — heading, media, body — so the DOM order
          is already right when they stack on a phone (title, illustration, then
          the write-up), and the media spans both rows on a wide screen. */}
      <div className="grid12 case-study">
        <div className="case-heading" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <Reveal>
            <SectionHeading
              eyebrow={copy.projects.title}
              title={project.title}
              description={project.summary}
            />
          </Reveal>

          <Reveal order={1}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              {project.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="case-media" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Reveal>
            {Figure && project.figure ? (
              // An empty frame holds the space while the figure's chunk loads after a
              // client-side navigation; prerendered pages already carry the figure.
              // No image here: React preloads every image it renders, fallbacks too.
              <Suspense fallback={<MediaFrame ratio="4/3" label={project.title} />}>
                <Figure fig="Fig 1" copy={project.figure} />
              </Suspense>
            ) : (
              <MediaFrame src={projectImages[slug]} alt={project.title} ratio="4/3" label={project.title} />
            )}
          </Reveal>
          <Reveal order={1}>
            <Card>
              <Meta label={copy.projects.roleLabel} value={project.role} />
              <Meta label={copy.projects.stackLabel} value={stack.join(' · ')} />
            </Card>
          </Reveal>
          {release ? (
            <Reveal order={2}>
              <Downloads release={release} note={project.downloadNote} />
            </Reveal>
          ) : null}
          {/* The sphere's home on this route, still in columns 7—12 so it never
              draws across the case study. */}
          <div
            ref={slotRef}
            aria-hidden="true"
            data-sphere-slot="projects"
            style={{ minHeight: 'var(--space-14)' }}
          />
        </div>

        <div className="case-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-11)' }}>
          <Reveal>
            <Block title={copy.projects.problemLabel}>
              <p style={body}>{project.problem}</p>
            </Block>
          </Reveal>

          <Reveal>
            <Block title={copy.projects.constraintsLabel}>
              <ul style={{ ...body, margin: 0, paddingLeft: 'var(--space-6)' }}>
                {project.constraints.map((c) => (
                  <li key={c} style={{ marginBottom: 'var(--space-3)' }}>
                    {c}
                  </li>
                ))}
              </ul>
            </Block>
          </Reveal>

          <Reveal>
            <Block title={copy.projects.decisionsLabel}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                {project.decisions.map((d) => (
                  <div key={d.title}>
                    <h3
                      style={{
                        font: 'var(--text-heading-xs)',
                        letterSpacing: 'var(--tr-heading)',
                        color: 'var(--text-primary)',
                        margin: '0 0 var(--space-4)',
                      }}
                    >
                      {d.title}
                    </h3>
                    <p style={body}>{d.body}</p>
                  </div>
                ))}
              </div>
            </Block>
          </Reveal>

          {project.retrospective ? (
            <Reveal>
              <Block title={copy.projects.retrospectiveLabel}>
                <p style={body}>{project.retrospective}</p>
              </Block>
            </Reveal>
          ) : null}

          {links.length > 0 ? (
            <Reveal>
              <Block title={copy.projects.linksLabel}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                  {links.map((l) => (
                    <Button
                      key={l.href}
                      as="a"
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      variant="secondary"
                      iconLeft={l.href.includes('github.com') ? <Icon name="github" size={16} /> : undefined}
                      iconRight={<Icon name="arrow-up-right" size={16} />}
                    >
                      {l.label}
                    </Button>
                  ))}
                </div>
              </Block>
            </Reveal>
          ) : null}
        </div>
      </div>

      {diagrams.length > 0 ? (
        <section style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
          <Divider label={copy.projects.howLabel} />
          {diagrams.map((id) => {
            const Drawing = DIAGRAMS[`${slug}/${id}`]
            const d = project.diagrams![id]
            return (
              <Reveal key={id}>
                <Drawing title={d.title} caption={d.caption} t={d.labels} />
              </Reveal>
            )
          })}
        </section>
      ) : null}

      {gallery.length > 0 ? (
        <section style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <Divider label={copy.projects.galleryLabel} />
          <Gallery images={gallery} captions={project.captions ?? {}} />
        </section>
      ) : null}
    </article>
  )
}

const body = {
  font: 'var(--text-body-lg)',
  color: 'var(--text-secondary)',
  maxWidth: 'var(--measure-prose)',
  margin: 0,
} as const

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <Divider label={title} />
      {children}
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-6)',
      }}
    >
      <span
        style={{
          font: 'var(--text-label-sm)',
          letterSpacing: 'var(--tr-label)',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
        }}
      >
        {label}
      </span>
      <span style={{ font: 'var(--text-body-md)', color: 'var(--text-secondary)' }}>{value}</span>
    </div>
  )
}

function Downloads({ release, note }: { release: ProjectRelease; note?: string }) {
  const { projects } = useCopy()
  const { locale } = useLocale()
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(release.date))
  return (
    <Card>
      <Meta label={projects.downloadLabel} value={`${projects.versionLabel} ${release.version} · ${date}`} />
      <div className="downloads">
        {release.downloads.map((d) => (
          <div key={d.href}>
            <Button as="a" href={d.href} variant="secondary" fullWidth iconLeft={<Icon name="download" size={16} />}>
              {d.platform}
            </Button>
            <span className="download-detail">{d.detail}</span>
          </div>
        ))}
      </div>
      {note ? <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-secondary)', margin: 'var(--space-6) 0 0' }}>{note}</p> : null}
      <Button
        as="a"
        href={release.notes}
        target="_blank"
        rel="noreferrer"
        variant="ghost"
        size="sm"
        iconRight={<Icon name="arrow-up-right" size={16} />}
        style={{ marginTop: 'var(--space-4)', paddingInline: 0 }}
      >
        {projects.releaseNotes}
      </Button>
    </Card>
  )
}
