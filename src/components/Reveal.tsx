import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

import { usePrefersReducedMotion } from '../scroll/usePrefersReducedMotion'

/**
 * One module-level observer for every Reveal on the page, rather than one per
 * element. Elements unobserve themselves on first intersection — a reveal
 * happens once.
 *
 * The -12% bottom margin puts the trigger line at ~88% of the viewport height,
 * matching the threshold the design prototype used.
 */
const callbacks = new WeakMap<Element, () => void>()

let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        callbacks.get(entry.target)?.()
        callbacks.delete(entry.target)
        observer?.unobserve(entry.target)
      }
    },
    // adherence-ignore: IntersectionObserver rootMargin is not CSS; var() does not resolve here
    { threshold: 0.15, rootMargin: '0px 0px -12% 0px' },
  )
  return observer
}

export interface RevealProps {
  children: ReactNode
  /** Stagger index within a list; each step delays by --dur-fast. */
  order?: number
  as?: 'div' | 'section' | 'li'
  className?: string
  style?: CSSProperties
  /** Hold the reveal until this is false, even once in view. */
  wait?: boolean
}

export function Reveal({
  children,
  order = 0,
  as: Tag = 'div',
  className,
  style,
  wait = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (reduced || shown || wait) return
    const el = ref.current
    if (!el) return
    callbacks.set(el, () => setShown(true))
    getObserver().observe(el)
    return () => {
      callbacks.delete(el)
      getObserver().unobserve(el)
    }
  }, [reduced, shown, wait])

  const visible = reduced || shown

  return (
    <Tag
      // One ref callback for three possible tags; the union is wider than any one of them.
      ref={ref as React.Ref<never>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        // --space-5 is exactly the 16px rise the design system specifies,
        // so the value comes from a token rather than a raw literal.
        transform: visible ? 'none' : 'translateY(var(--space-5))',
        transition: 'var(--transition-reveal)',
        transitionDelay: visible ? `calc(var(--dur-fast) * ${order})` : '0ms',
        willChange: visible ? undefined : 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
