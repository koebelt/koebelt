import { Badge, Button, Icon } from '@ds'
import { useEffect, useRef } from 'react'

import { SphereCaption } from '../components/SphereCaption'
import { hero } from '../content/site'
import { useSceneRegistry } from '../scroll/SceneContext'

/**
 * Not a <Section>: the hero owns the full viewport height and its own slot
 * geometry. The sphere still sits in columns 7—12 — the design system's grid rule
 * puts headings in 1—6 and media in 7—12, and a display line at --fs-display-xl
 * has no margin to share.
 */
export function Hero() {
  const registry = useSceneRegistry()
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
      className="container"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        paddingBlock: 'var(--space-13) var(--space-11)',
      }}
    >
      <div className="grid12" style={{ width: '100%' }}>
        <div
          className="col-1-6"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}
        >
          <Badge tone="accent">{hero.badge}</Badge>

          {/* The design system has no hero-type component — SectionHeading is for
              sections. Display type is composed from tokens directly. */}
          <h1
            style={{
              font: 'var(--text-display-xl)',
              fontSize: 'clamp(var(--fs-heading-lg), 7vw, var(--fs-display-xl))',
              letterSpacing: 'var(--tr-display)',
              lineHeight: 'var(--lh-display)',
              color: 'var(--text-primary)',
              margin: 0,
              maxWidth: '14ch',
            }}
          >
            {hero.title}
          </h1>

          <SphereCaption scene="hero" />

          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
            <Button
              as="a"
              href="#projects"
              variant="secondary"
              size="lg"
              iconRight={<Icon name="arrow-right" size={18} />}
            >
              {hero.cta}
            </Button>
          </div>
        </div>

        <div
          ref={slotRef}
          className="col-7-12"
          aria-hidden="true"
          data-sphere-slot="hero"
          style={{ minHeight: 'min(70svh, calc(var(--space-15) * 1.9))' }}
        />
      </div>

      <ScrollHint />
    </section>
  )
}

function ScrollHint() {
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
      <span>Scroll</span>
      <Icon name="chevron-down" size={16} />
    </div>
  )
}
