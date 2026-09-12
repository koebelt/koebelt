import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

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
export const useIsNarrow = () => useMediaQuery('(max-width: 899px)')
