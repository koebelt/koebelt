import { useId, type ReactNode } from 'react'

import { useCopy } from '../../i18n/LocaleContext'

/** Labels inside a diagram, from the project's copy; a missing one shows its key. */
export type Labels = Record<string, string>
export const label = (t: Labels, key: string) => t[key] ?? key

/**
 * A titled diagram with its caption. The SVG is drawn for --diagram-min and
 * scrolls sideways below it; the caption, which is also its accessible name,
 * says in words what the drawing shows.
 */
export function Diagram({ title, caption, viewBox, children }: { title: string; caption: string; viewBox: string; children: (ids: { arrow: string; arrowAccent: string }) => ReactNode }) {
  const id = useId().replace(/:/g, '')
  const { projects } = useCopy()
  const arrow = `dg-arrow-${id}`,
    arrowAccent = `dg-arrow-accent-${id}`
  return (
    <figure className="diagram" style={{ margin: 0 }}>
      <h3 className="diagram-title">{title}</h3>
      <div className="diagram-scroll">
        <svg viewBox={viewBox} role="img" aria-label={caption}>
          <defs>
            <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className="dg-arrow" />
            </marker>
            <marker id={arrowAccent} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className="dg-arrow-accent" />
            </marker>
          </defs>
          {children({ arrow: `url(#${arrow})`, arrowAccent: `url(#${arrowAccent})` })}
        </svg>
      </div>
      <span className="diagram-hint" aria-hidden="true">{projects.swipeHint} →</span>
      <figcaption className="diagram-caption">{caption}</figcaption>
    </figure>
  )
}
