import { Divider, SectionHeading } from '@ds'
import { useEffect, useRef } from 'react'

import { Reveal } from '../components/Reveal'
import { legalUpdated, site } from '../content/site'
import { useCopy, useDocumentTitle, useLocale } from '../i18n/LocaleContext'
import type { LegalSection } from '../i18n/types'
import { useSceneRegistry } from '../scroll/SceneContext'

/**
 * /legal, /privacy and /terms. Copy in columns 1—7 at prose width; the sphere
 * keeps its contact form in 8—12. What applies to every koebelt project comes
 * first, then each project's own sections.
 */
export default function Legal({ page }: { page: 'notice' | 'privacy' | 'terms' }) {
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

  // A block, not `() => window.scrollTo(0, 0)`: recent browsers make scrollTo
  // return a promise, and React would call it as this effect's cleanup.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(legalUpdated))

  return (
    <article ref={ref} className="container section">
      <div className="grid12">
        <div className="legal-body">
          <Reveal>
            <SectionHeading eyebrow={`${legal.updatedLabel} ${date}`} title={copy.title} description={copy.intro} />
          </Reveal>
          {copy.sections.map((s) => (
            <Section key={s.title} s={s} />
          ))}
          {copy.products?.length ? (
            <Reveal>
              <h2 className="legal-group">{legal.productsLabel}</h2>
            </Reveal>
          ) : null}
          {copy.products?.map((product) => (
            <div key={product.name} className="legal-product">
              <Reveal>
                <h3 className="legal-product-name">{product.name}</h3>
              </Reveal>
              {product.sections.map((s) => (
                <Section key={s.title} s={s} />
              ))}
            </div>
          ))}
        </div>
        <div ref={slotRef} aria-hidden="true" data-sphere-slot="contact" className="legal-slot" />
      </div>
    </article>
  )
}

function Section({ s }: { s: LegalSection }) {
  return (
    <Reveal>
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
  )
}
