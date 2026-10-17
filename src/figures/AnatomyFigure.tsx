import { useEffect, useRef } from 'react'

export interface FigureCopy {
  /** Top right of the plate. */
  title: string
  /** Bottom left: how to drive it. */
  hint: string
  /** Bottom right before any motion. */
  rest: string
  /** Bottom right while it moves: `{name}` slots the live code fills. */
  readout: string
  /** Words for a `{state}` slot, keyed by what the live code reports. */
  states?: Record<string, string>
  /** Legend under the plate: what the lit part is, then the rest. */
  keys: { mark: 'lit' | 'raised' | 'flat'; label: string }[]
  /** One or two true sentences about what the figure shows. */
  caption: string
}

export type Say = (values: Record<string, string>) => void
export type Mount = (stage: HTMLElement, say: Say) => { stop(): void }

interface Props {
  fig: string
  copy: FigureCopy
  /** The finished drawing, from the figure's build script. */
  svg: string
  /** Starts the motion. Loaded on demand, so the page never waits for it. */
  load: () => Promise<Mount>
}

/** Fills `{name}` slots in a readout template. */
const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')

/**
 * An anatomy figure: a drawing built at compile time (figures/<name>/build.mjs),
 * framed in the kit's plate with its four corner labels, and moved by a small
 * live module once it is on screen. The resting drawing is in the prerendered
 * HTML, so it reads without JavaScript.
 */
export function AnatomyFigure({ fig, copy, svg, load }: Props) {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const readoutRef = useRef<HTMLSpanElement | null>(null)
  const template = useRef(copy.readout)
  template.current = copy.readout
  const states = useRef(copy.states)
  states.current = copy.states

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let live: { stop(): void } | null = null
    let cancelled = false
    // Written straight to the element: the readout changes every frame and
    // must never re-render the drawing.
    const say: Say = (values) => {
      const named = values.state && states.current?.[values.state] ? { ...values, state: states.current[values.state] } : values
      const text = fill(template.current, named)
      if (readoutRef.current && readoutRef.current.textContent !== text) readoutRef.current.textContent = text
    }
    void load().then((mount) => {
      if (!cancelled) live = mount(stage, say)
    })
    return () => {
      cancelled = true
      live?.stop()
    }
  }, [load])

  return (
    <figure className="anatomy iso">
      <div className="iso-plate">
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">{fig}</span>
          <span className="iso-plate-corner" data-corner="title">{copy.title}</span>
          <span className="iso-plate-corner" data-corner="hint">{copy.hint}</span>
          <span ref={readoutRef} className="iso-plate-corner" data-corner="readout" data-readout aria-live="off">
            {copy.rest}
          </span>
        </div>
        <div
          ref={stageRef}
          className="iso-stage"
          tabIndex={0}
          role="group"
          aria-label={`${copy.title}. ${copy.hint}`}
          // The drawing is generated markup with no user input in it.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
      <figcaption className="iso-legend">
        <span className="iso-keys">
          {copy.keys.map((key) => (
            <span key={key.label} className="iso-key">
              <span className="anatomy-swatch" data-mark={key.mark} aria-hidden="true" />
              {key.label}
            </span>
          ))}
        </span>
        <span className="iso-caption">{copy.caption}</span>
      </figcaption>
    </figure>
  )
}
