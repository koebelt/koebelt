import { Logo } from '@ds'
import { useEffect, useState, useSyncExternalStore } from 'react'

/**
 * Decided once, when the module loads: the splash plays on every page load,
 * except for anyone who has asked for reduced motion.
 */
function shouldPlay(): boolean {
  if (typeof window === 'undefined') return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Whether this page load opens with the splash. Fixed for the life of the page. */
export const splashPlays = shouldPlay()

let done = !splashPlays
const listeners = new Set<() => void>()

function finish() {
  if (done) return
  done = true
  for (const fn of listeners) fn()
}

/** True once the splash has lifted, or immediately when it does not play. */
export function useSplashDone(): boolean {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => done,
    () => true,
  )
}

/** For code outside React (the engine loads on its own schedule). */
export function whenSplashDone(fn: () => void): () => void {
  if (done) {
    fn()
    return () => {}
  }
  const once = () => {
    listeners.delete(once)
    fn()
  }
  listeners.add(once)
  return () => listeners.delete(once)
}

/** How long the mark holds before the screen lifts, in multiples of --dur-slow. */
const HOLD_STEPS = 2

/**
 * A short opening: the mark fades up with a lime rule drawing beneath it, then
 * the whole screen lifts away. Everything after — the sphere gathering and the
 * hero copy rising — keys off useSplashDone/whenSplashDone, so the page's own
 * elements are the second half of the animation rather than a separate one.
 */
export function Splash() {
  const isDone = useSplashDone()
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>(isDone ? 'gone' : 'in')

  // No scrolling the page away underneath while the screen covers it.
  useEffect(() => {
    if (phase !== 'in') return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'in') return
    const slow = durMs('--dur-slow', 380)
    const toOut = setTimeout(() => {
      setPhase('out')
      // The page starts its own entrance as the screen begins to lift, not after.
      finish()
    }, slow * HOLD_STEPS)
    return () => clearTimeout(toOut)
  }, [phase])

  useEffect(() => {
    if (phase !== 'out') return
    const toGone = setTimeout(() => setPhase('gone'), durMs('--dur-reveal', 640))
    return () => clearTimeout(toGone)
  }, [phase])

  if (phase === 'gone') return null

  const out = phase === 'out'

  return (
    <div
      aria-hidden="true"
      className="splash"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-6)',
        background: 'var(--surface-page)',
        opacity: out ? 0 : 1,
        transform: out ? 'translateY(calc(var(--space-5) * -1))' : 'none',
        transition: 'var(--transition-reveal)',
        pointerEvents: out ? 'none' : 'auto',
      }}
    >
      <Logo size={56} className="splash-mark" />
      <span className="splash-rule" />
    </div>
  )
}

function durMs(token: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  const n = parseFloat(raw)
  if (!Number.isFinite(n)) return fallback
  return raw.endsWith('ms') ? n : n * 1000
}
