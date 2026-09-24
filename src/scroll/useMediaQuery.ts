import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  // False on the first render, as on the prerendered page, so hydration matches;
  // the effect below applies the real value straight after.
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', onChange)
    setMatches(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Matches the breakpoint where the 12-column grid collapses to one column. */
// adherence-ignore: media-query conditions are parsed outside CSS; var() does not resolve
export const NARROW_QUERY = '(max-width: 899px)'
export const useIsNarrow = () => useMediaQuery(NARROW_QUERY)
