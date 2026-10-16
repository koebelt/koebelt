import { Divider, SectionHeading } from '@ds'
import { useEffect, useRef } from 'react'

import { Reveal } from '../components/Reveal'
import { legalUpdated, site } from '../content/site'
import { useCopy, useDocumentTitle, useLocale } from '../i18n/LocaleContext'
import { useSceneRegistry } from '../scroll/SceneContext'

/**
 * /privacy and /terms. Copy in columns 1—7 at prose width; the sphere keeps
 * its contact form in 7—12, like the other text-only pages.
 */
export default function Legal({ page }: { page: 'privacy' | 'terms' }) {
  const { legal } = useCopy()
  const { locale } = useLocale()
  const registry = useSceneRegistry()
  const ref = useRef<HTMLElement | null>(null)
  const slotRef = useRef<HTMLDivElement | null>(null)
  const copy = legal[page]

  useDocumentTitle(`${copy.title} | ${site.name}`)

  // Without a registered section the controller holds the sphere full-bleed
  // over the copy.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return registry.register('contact', el, slotRef.current)
  }, [registry])

  useEffect(() => window.scrollTo(0, 0), [page])

  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(legalUpdated))

  return (
    <article ref={ref} className="container section">
      <div className="grid12">
        <div className="legal-body">
          <Reveal>
            <SectionHeading eyebrow={`${legal.updatedLabel} ${date}`} title={copy.title} description={copy.intro} />
          </Reveal>
          {copy.sections.map((s) => (
            <Reveal key={s.title}>
              <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <Divider label={s.title} />
                {s.paragraphs?.map((p) => (
                  <p key={p} className="legal-text">
                    {p}
                  </p>
                ))}
                {s.list ? (
                  <ul className="legal-text legal-list">
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            </Reveal>
          ))}
        </div>
        <div ref={slotRef} aria-hidden="true" data-sphere-slot="contact" className="legal-slot" />
      </div>
    </article>
  )
}
