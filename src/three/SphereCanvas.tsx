import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

import { splashPlays, whenSplashDone } from '../components/Splash'
import { useSceneFrame, useSceneRegistry } from '../scroll/SceneContext'
import { usePrefersReducedMotion } from '../scroll/usePrefersReducedMotion'
import { SphereContext } from './SphereContext'
import type { SphereEngine } from './SphereEngine'
import type { SceneId } from './types'

/**
 * Owns the engine's lifetime and publishes it to the tree.
 *
 * Mounted above the router outlet so navigating to a project page never tears
 * down the WebGL context.
 */
export function SphereCanvas({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<SphereEngine | null>(null)
  const [engine, setEngine] = useState<SphereEngine | null>(null)
  const reduced = usePrefersReducedMotion()
  const registry = useSceneRegistry()

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let instance: SphereEngine | null = null
    let disposed = false
    const teardown: Array<() => void> = []

    // three.js is ~600 kB and nothing on the page waits for it, so it loads as
    // its own chunk after first paint rather than blocking the content.
    void import('./SphereEngine')
      .then(({ SphereEngine }) => {
        if (disposed) return
        instance = new SphereEngine(canvas, { reducedMotion: reducedAtMount() })
        engineRef.current = instance
        instance.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio)
        instance.start()
        setEngine(instance)
        // The scroll state for the page as loaded was published before the engine
        // existed; without this the sphere sits full-bleed until the first scroll.
        registry.invalidate()

        // Gather in as the splash lifts. If the chunk arrives after that, this
        // fires straight away; if the splash never played, it does not fire at all.
        const gathering = instance
        if (splashPlays) teardown.push(whenSplashDone(() => gathering.intro()))

        // Dev-only handle, so the sphere can be driven from the console or a
        // screenshot harness. Stripped from production builds.
        if (import.meta.env.DEV) {
          ;(window as unknown as Record<string, unknown>).__sphere = instance
        }

        const engine = instance
        const onResize = () => {
          engine.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio)
        }
        let resizeRaf = 0
        const ro = new ResizeObserver(() => {
          cancelAnimationFrame(resizeRaf)
          resizeRaf = requestAnimationFrame(onResize)
        })
        ro.observe(document.documentElement)
        teardown.push(() => {
          ro.disconnect()
          cancelAnimationFrame(resizeRaf)
        })

        const onPointer = (e: PointerEvent) => {
          engine.setPointer(
            (e.clientX / window.innerWidth) * 2 - 1,
            (e.clientY / window.innerHeight) * 2 - 1,
          )
        }
        window.addEventListener('pointermove', onPointer, { passive: true })
        teardown.push(() => window.removeEventListener('pointermove', onPointer))

        // Nothing to draw while the tab is hidden.
        const onVisibility = () => {
          if (document.hidden) engine.stop()
          else engine.start()
        }
        document.addEventListener('visibilitychange', onVisibility)
        teardown.push(() => document.removeEventListener('visibilitychange', onVisibility))
      })
      .catch((err) => {
        // No WebGL, or the chunk failed. The page is fully readable without the
        // sphere, so this is a missing enhancement rather than a failure.
        console.warn('[sphere] unavailable, continuing without it', err)
      })

    return () => {
      disposed = true
      for (const fn of teardown) fn()
      instance?.dispose()
      engineRef.current = null
      setEngine(null)
    }
    // Created once. Reduced-motion changes are pushed in through setReducedMotion
    // below rather than by rebuilding the engine.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    engineRef.current?.setReducedMotion(reduced)
  }, [reduced])

  // Scroll state reaches the engine as uniform writes, never as React state.
  useSceneFrame((state) => {
    const e = engineRef.current
    if (!e) return
    e.setScene(state.scene as SceneId)
    e.setProgress(state.progress)
    e.setScrollVelocity(state.velocity)
    e.setViewportRect(state.slot)
  })

  return (
    <SphereContext.Provider value={engine}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {children}
    </SphereContext.Provider>
  )
}

function reducedAtMount(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
