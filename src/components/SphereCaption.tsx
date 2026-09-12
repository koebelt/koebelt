import { useEffect, useState } from 'react'

import { CAPTION_INTERVAL_MS } from '../content/site'
import { useCopy } from '../i18n/LocaleContext'
import { usePrefersReducedMotion } from '../scroll/usePrefersReducedMotion'
import { useSphere } from '../three/SphereContext'
import type { SceneId } from '../three/types'

export interface SphereCaptionProps {
  scene: SceneId
}

/**
 * What the sphere is saying about the current scene.
 *
 * Styled as a mono label rather than a card — the design system's own label
 * language, preceded by a hairline. The canvas is aria-hidden, so this is where
 * the sphere's meaning actually lives for anyone not looking at it.
 */
export function SphereCaption({ scene }: SphereCaptionProps) {
  const { captions } = useCopy()
  const lines = captions[scene]
  const reduced = usePrefersReducedMotion()
  const sphere = useSphere()
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  const cycles = lines.length > 1 && !reduced

  // A language switch changes the line count; start over rather than index past it.
  useEffect(() => setIndex(0), [lines])

  useEffect(() => {
    if (!cycles) return
    let fade: ReturnType<typeof setTimeout>
    const tick = setInterval(() => {
      setVisible(false)
      fade = setTimeout(() => {
        setIndex((i) => (i + 1) % lines.length)
        setVisible(true)
        sphere?.ripple(0.45)
      }, 380) // --dur-slow
    }, CAPTION_INTERVAL_MS)
    return () => {
      clearInterval(tick)
      clearTimeout(fade)
    }
  }, [cycles, lines.length, sphere])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-5)',
        minHeight: 'var(--space-6)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 'var(--space-7)',
          height: 1,
          background: 'var(--border-subtle)',
          flex: '0 0 auto',
        }}
      />
      <p
        aria-live="polite"
        style={{
          font: 'var(--text-label-md)',
          letterSpacing: 'var(--tr-label)',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          margin: 0,
          opacity: visible ? 1 : 0,
          transition: 'opacity var(--dur-slow) var(--ease-standard)',
        }}
      >
        {lines[index] ?? lines[0]}
      </p>
    </div>
  )
}
