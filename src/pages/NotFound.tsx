import { Button, Icon, WorkRow } from '@ds'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Reveal } from '../components/Reveal'
import { site } from '../content/site'
import { useCopy, useDocumentTitle } from '../i18n/LocaleContext'
import { PROJECT_SLUGS } from '../i18n/types'
import { useSceneRegistry } from '../scroll/SceneContext'
import { useSphere } from '../three/SphereContext'

/** 46.3239° N, 0.4645° W: the marked point on the globe, as a caption. */
const coords = [
  `${Math.abs(site.coords.lat).toFixed(4)}° ${site.coords.lat >= 0 ? 'N' : 'S'}`,
  `${Math.abs(site.coords.lon).toFixed(4)}° ${site.coords.lon >= 0 ? 'E' : 'W'}`,
].join(', ')

/**
 * Laid out like the hero: copy in columns 1—6, the sphere in 7—12. The sphere
 * takes the about scene, the globe with Niort marked, so the one thing on the
 * page that is certainly where it should be is its author.
 */
export default function NotFound() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { notFound, projects } = useCopy()
  const registry = useSceneRegistry()
  const sphere = useSphere()
  const ref = useRef<HTMLElement | null>(null)
  const slotRef = useRef<HTMLDivElement | null>(null)

  useDocumentTitle(`${notFound.title} | ${site.name}`)

  // Without a registered section the controller holds the sphere full-bleed
  // over the copy.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return registry.register('about', el, slotRef.current)
  }, [registry])

  // The prerendered 404.html is one file served for every unknown address, so
  // the path is only known in the browser. Set after hydration, not during it.
  const [path, setPath] = useState<string | null>(null)
  useEffect(() => setPath(pathname), [pathname])

  const go = (to: string) => (e: MouseEvent) => {
    // Let modified clicks open a new tab the way a real link should.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    navigate(to)
    window.scrollTo(0, 0)
  }

  const [before, after] = notFound.body.split('{path}')

  return (
    <>
      <section ref={ref} className="container not-found">
        <div className="grid12" style={{ width: '100%' }}>
          <div
            className="col-1-6"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-6)',
              alignSelf: 'center',
            }}
          >
            <Reveal order={0}>
              <span className="eyebrow">{notFound.eyebrow}</span>
            </Reveal>

            <Reveal order={1}>
              {/* The numeral is the picture; the sentence under it is the heading. */}
              <p className="not-found-code" aria-hidden="true">
                404
              </p>
              <h1 className="not-found-title">{notFound.title}</h1>
            </Reveal>

            <Reveal order={2}>
              <p className="prose not-found-body">
                {before}
                {path ? <code className="not-found-path">{path}</code> : notFound.pathFallback}
                {after}
              </p>
            </Reveal>

            <Reveal order={3}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                {/* Button renders a button or an anchor, never a router Link, so the
                    href is real and the click is intercepted for client-side routing. */}
                <Button
                  as="a"
                  href="/"
                  variant="primary"
                  size="lg"
                  iconRight={<Icon name="arrow-right" size={18} />}
                  onClick={go('/')}
                >
                  {notFound.back}
                </Button>
                <Button
                  as="a"
                  href={`mailto:${site.email}`}
                  variant="secondary"
                  size="lg"
                  iconLeft={<Icon name="mail" size={18} />}
                >
                  {notFound.email}
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="col-7-12 not-found-globe">
            <div ref={slotRef} className="hero-slot" aria-hidden="true" data-sphere-slot="about" />
            <p className="not-found-caption">
              <span>{notFound.caption}</span>
              <span className="not-found-coords">{coords}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--space-12)' }}>
        <Reveal>
          <span className="eyebrow">{notFound.suggestions}</span>
        </Reveal>
        <div style={{ marginTop: 'var(--space-6)' }}>
          {PROJECT_SLUGS.map((slug, i) => {
            const project = projects.entries[slug]
            return (
              <Reveal key={slug} order={i}>
                <WorkRow
                  className="work-row"
                  index={String(i + 1).padStart(2, '0')}
                  title={project.title}
                  discipline={project.tags[0]}
                  year={project.tags[1]}
                  href={`/work/${slug}`}
                  onMouseEnter={() => sphere?.ripple(0.4)}
                  onClick={go(`/work/${slug}`)}
                />
              </Reveal>
            )
          })}
        </div>
      </section>
    </>
  )
}
