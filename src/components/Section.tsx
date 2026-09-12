import { useEffect, useRef, type ReactNode } from 'react'

import { useSceneRegistry } from '../scroll/SceneContext'
import type { SceneId } from '../three/types'

export interface SectionProps {
  id: SceneId
  /** Goes in columns 1—6, beside the sphere. */
  children: ReactNode
  /** Full-width content placed below the heading row, spanning all 12 columns. */
  wide?: ReactNode
  /** Height of the sphere's slot. Taller for scenes whose form is vertical. */
  slotMinHeight?: string
}

/**
 * A page section that registers itself with the scene controller, so scrolling
 * past it drives the sphere without any component having to know the sphere exists.
 *
 * Every section reserves columns 7—12 beside its heading for the sphere. That is
 * the design system's grid rule — headings 1—6, media 7—12 — and it is also what
 * keeps the sphere structurally incapable of drawing over body copy: the engine
 * scissors to this element's rect, so anything outside it is never rasterised.
 */
export function Section({ id, children, wide, slotMinHeight = 'var(--space-15)' }: SectionProps) {
  const registry = useSceneRegistry()
  const sectionRef = useRef<HTMLElement | null>(null)
  const slotRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    return registry.register(id, el, slotRef.current)
  }, [id, registry])

  return (
    <section ref={sectionRef} id={id} className="section container">
      <div className="grid12">
        <div className="col-1-6">{children}</div>
        <div
          ref={slotRef}
          className="col-7-12"
          aria-hidden="true"
          data-sphere-slot={id}
          // Empty on purpose: this element exists only so its rect can be
          // measured. The sphere is drawn by the WebGL canvas behind it.
          style={{ minHeight: slotMinHeight }}
        />
      </div>
      {wide}
    </section>
  )
}
