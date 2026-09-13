import { Badge, Button, Icon } from '@ds'
import { useEffect, useRef } from 'react'

import { Reveal } from '../components/Reveal'
import { useSplashDone } from '../components/Splash'
import { cvFiles, cvHref } from '../content/site'
import { useCopy, useLocale } from '../i18n/LocaleContext'
import { useSceneRegistry } from '../scroll/SceneContext'

/**
 * Not a <Section>: the hero owns the full viewport height and its own slot
 * geometry. The sphere still sits in columns 7—12 — the design system's grid rule
 * puts headings in 1—6 and media in 7—12, and a display line has no margin to share.
 */
export function Hero() {
  const registry = useSceneRegistry()
  const { hero, contact } = useCopy()
  const { locale } = useLocale()
  const cv = cvHref(locale)
  // The hero copy is the second half of the splash: it rises as the screen lifts.
  const splashDone = useSplashDone()
  const ref = useRef<HTMLElement | null>(null)
  const slotRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    return registry.register('hero', el, slotRef.current)
  }, [registry])

  return (
    <section
      ref={ref}
      id="hero"
      className="container hero"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        // Equal above and below, so the content sits on the middle of the screen.
        paddingBlock: 'var(--space-12)',
      }}
    >
      <div className="grid12" style={{ width: '100%' }}>
        <div
          className="col-1-6"
          // The sphere slot is taller than the copy, and the sphere is drawn centred
          // in it. Centring the copy in the same row puts both on one axis; left at
          // the top of the row, the copy sat well above the sphere's middle.
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
            alignSelf: 'center',
          }}
        >
          <Reveal order={0} wait={!splashDone}>
            <Badge tone="accent">{hero.badge}</Badge>
          </Reveal>

          {/* The design system has no hero-type component — SectionHeading is for
              sections. Display type is composed from tokens directly. Name and role
              share one style and sit tight together, reading as a single two-line mark. */}
          <Reveal order={1} wait={!splashDone}>
            <h1 style={displayStyle}>{hero.name}</h1>
            {/* Same size as the name, stepped back in colour so the two lines don't compete. */}
            <p style={{ ...displayStyle, color: 'var(--text-secondary)' }}>{hero.statement}</p>
          </Reveal>

          <Reveal order={2} wait={!splashDone}>
          <p
            className="prose"
            style={{
              font: 'var(--text-body-md)',
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            {hero.lede}
          </p>
          </Reveal>

          <Reveal order={3} wait={!splashDone}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-3)',
            }}
          >
            <Button
              as="a"
              href="#projects"
              variant="primary"
              size="lg"
              iconRight={<Icon name="arrow-right" size={18} />}
            >
              {hero.cta}
            </Button>
            {/* Same résumé and same locale rule as the contact section. */}
            {cv ? (
              <Button
                as="a"
                href={cv}
                download={cvFiles[locale]}
                variant="secondary"
                size="lg"
                iconLeft={<Icon name="download" size={18} />}
              >
                {contact.downloadCv}
              </Button>
            ) : null}
          </div>
          </Reveal>
        </div>

        <div
          ref={slotRef}
          className="col-7-12 hero-slot"
          aria-hidden="true"
          data-sphere-slot="hero"
        />
      </div>

      <ScrollHint label={hero.scroll} />
    </section>
  )
}

const displayStyle = {
  font: 'var(--text-display-lg)',
  fontSize: 'clamp(var(--fs-heading-md), 5vw, var(--fs-display-lg))',
  letterSpacing: 'var(--tr-display)',
  lineHeight: 'var(--lh-display)',
  color: 'var(--text-primary)',
  margin: 0,
} as const

function ScrollHint({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: 'var(--space-9)',
        left: 'var(--gutter-inline)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        font: 'var(--text-label-sm)',
        letterSpacing: 'var(--tr-label)',
        textTransform: 'uppercase',
        color: 'var(--text-faint)',
      }}
    >
      <span>{label}</span>
      <Icon name="chevron-down" size={16} />
    </div>
  )
}
