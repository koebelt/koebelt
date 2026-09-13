import { useEffect } from 'react'

import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * How close a stop has to be, as a fraction of the screen, before it pulls.
 * The stop ahead (in the direction of travel) pulls from further away than the
 * one behind, so scrolling carries on through a gap rather than falling back.
 * Beyond both, the page stays where it was left.
 */
const AHEAD_ZONE = 0.3
const BACK_ZONE = 0.12
/** Fallback rest detection where the scrollend event is not supported. */
const REST_MS = 140

interface Span {
  /** Scroll position that puts the section's content at the top of the screen. */
  top: number
  /** Scroll position that puts its content's end at the bottom; equals top when it fits. */
  bottom: number
}

/**
 * Sticky scrolling between sections, in both directions.
 *
 * CSS scroll snapping was tried first. Its pull cannot be tuned, and it only
 * knows a section's start, so scrolling up into a section taller than the screen
 * found nothing to settle on. This decides on every rest instead:
 *  - inside a tall section, between its start and its end, scrolling is free;
 *  - near a stop, it settles onto it: the stop ahead in the direction of travel
 *    if that is within reach, otherwise the one behind if that is;
 *  - anywhere else it stays put. A first version always moved to a stop, which
 *    made reading anything between two stops impossible.
 *
 * A section's start is where scrollIntoView puts its content row (so nav links
 * and this agree), which already accounts for the sticky nav.
 */
export function useSectionSnap() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    let lastY = window.scrollY
    let direction = 0
    let restTimer = 0
    let snapping = false

    const spans = (): Span[] => {
      const y = window.scrollY
      const vh = window.innerHeight
      const out: Span[] = [{ top: 0, bottom: 0 }]
      const navOffset = px(getComputedStyle(document.documentElement).scrollPaddingTop)

      for (const section of document.querySelectorAll<HTMLElement>('main section.section')) {
        const content = section.querySelector<HTMLElement>(':scope > .grid12')
        if (!content) continue
        const margin = px(getComputedStyle(content).scrollMarginTop)
        const top = content.getBoundingClientRect().top + y - navOffset - margin

        const contentEnd =
          section.getBoundingClientRect().bottom + y - px(getComputedStyle(section).paddingBottom)
        const bottom = Math.max(top, contentEnd + margin - vh)

        out.push({ top, bottom })
      }

      const max = document.documentElement.scrollHeight - vh
      out.push({ top: max, bottom: max })
      return out.filter((s) => s.top <= max + 1)
    }

    const settle = () => {
      if (snapping) {
        snapping = false
        return
      }
      const y = window.scrollY
      const vh = window.innerHeight
      const all = spans()

      // Free inside a tall section.
      if (all.some((s) => y >= s.top - 1 && y <= s.bottom + 1)) return

      // Otherwise y sits between one span's bottom and the next span's top.
      let above = 0
      let below = document.documentElement.scrollHeight - vh
      for (const s of all) {
        if (s.bottom < y) above = Math.max(above, s.bottom)
        if (s.top > y) below = Math.min(below, s.top)
      }

      const back = direction > 0 ? above : below
      const ahead = direction > 0 ? below : above
      let target: number
      if (Math.abs(ahead - y) < vh * AHEAD_ZONE) target = ahead
      else if (Math.abs(back - y) < vh * BACK_ZONE) target = back
      else return
      if (Math.abs(target - y) < 1) return

      snapping = true
      window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' })
    }

    const onScroll = () => {
      const y = window.scrollY
      if (y !== lastY) direction = Math.sign(y - lastY)
      lastY = y
      if (!supportsScrollEnd) {
        clearTimeout(restTimer)
        restTimer = window.setTimeout(settle, REST_MS)
      }
    }

    // Any deliberate input takes over from a snap in progress.
    const onInput = () => {
      snapping = false
    }

    const supportsScrollEnd = 'onscrollend' in window
    window.addEventListener('scroll', onScroll, { passive: true })
    if (supportsScrollEnd) window.addEventListener('scrollend', settle)
    window.addEventListener('wheel', onInput, { passive: true })
    window.addEventListener('touchstart', onInput, { passive: true })
    window.addEventListener('keydown', onInput)

    return () => {
      clearTimeout(restTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', settle)
      window.removeEventListener('wheel', onInput)
      window.removeEventListener('touchstart', onInput)
      window.removeEventListener('keydown', onInput)
    }
  }, [reduced])
}

function px(value: string): number {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : 0
}
