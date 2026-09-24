import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Live-tracked, not read once. Someone toggling the OS setting while the page is
 * open must stop the sphere, not wait for a reload.
 */
export function usePrefersReducedMotion(): boolean {
  // False on the first render, as on the prerendered page, so hydration matches.
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    setReduced(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
