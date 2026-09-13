import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import type { SceneId } from '../three/types'
import { SceneController, type SceneState } from './SceneController'

const ControllerContext = createContext<SceneController | null>(null)

export function SceneProvider({ children }: { children: ReactNode }) {
  // One controller for the life of the app; it owns its own rAF and observers.
  const controllerRef = useRef<SceneController | null>(null)
  controllerRef.current ??= new SceneController()

  useEffect(() => {
    const c = controllerRef.current!
    c.start()
    return () => c.stop()
  }, [])

  return (
    <ControllerContext.Provider value={controllerRef.current}>{children}</ControllerContext.Provider>
  )
}

function useController(): SceneController {
  const c = useContext(ControllerContext)
  if (!c) throw new Error('SceneProvider is missing above this component')
  return c
}

/** Section registration. Returns a stable object so effects do not re-run. */
export function useSceneRegistry() {
  const c = useController()
  return useMemo(
    () => ({
      register: (id: SceneId, el: HTMLElement, slot: HTMLElement | null) => c.register(id, el, slot),
      invalidate: () => c.invalidate(),
    }),
    [c],
  )
}

/**
 * Subscribe to scroll state without re-rendering on every frame.
 *
 * Frame-rate state (progress, velocity, slot) is delivered to the callback and
 * never stored in React. Only the scene id — which changes a handful of times per
 * page — is React state.
 */
export function useSceneFrame(onFrame: (state: SceneState) => void) {
  const c = useController()
  const cb = useRef(onFrame)
  cb.current = onFrame

  useEffect(() => c.subscribe((s) => cb.current(s)), [c])
}

/** The active scene id, as React state. Changes rarely. */
export function useActiveScene(): SceneId {
  const c = useController()
  const [scene, setScene] = useState<SceneId>(() => c.getScene())

  useEffect(
    () =>
      c.subscribe((s) => {
        setScene((prev) => (prev === s.scene ? prev : s.scene))
      }),
    [c],
  )

  return scene
}
