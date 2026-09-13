import { Button, Card, Divider, Icon, MediaFrame, SectionHeading, Tag } from '@ds'
import { useEffect, useRef, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Reveal } from '../components/Reveal'
import { projectImages, projectLinks, projectStacks } from '../content/site'
import { useCopy } from '../i18n/LocaleContext'
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
            <MediaFrame src={projectImages[slug]} alt={project.title} ratio="4/3" label={project.title} />
          </Reveal>
          <Reveal order={1}>
            <Card>
              <Meta label={copy.projects.roleLabel} value={project.role} />
              <Meta label={copy.projects.stackLabel} value={stack.join(' · ')} />
            </Card>
          </Reveal>
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

          <Reveal>
            <Block title={copy.projects.retrospectiveLabel}>
              <p style={body}>{project.retrospective}</p>
            </Block>
          </Reveal>

          {links.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              {links.map((l) => (
                <Button
                  key={l.href}
                  as="a"
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  iconRight={<Icon name="arrow-up-right" size={16} />}
                >
                  {l.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
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
