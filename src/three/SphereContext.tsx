import { createContext, useContext } from 'react'

import type { SphereEngine } from './SphereEngine'

/**
 * The engine is null whenever there is no sphere: before it mounts, when WebGL is
 * unavailable, and under prefers-reduced-motion where it renders statically. Every
 * caller must tolerate that — `sphere?.ripple()` is the expected shape.
 */
export const SphereContext = createContext<SphereEngine | null>(null)

export function useSphere(): SphereEngine | null {
  return useContext(SphereContext)
}
