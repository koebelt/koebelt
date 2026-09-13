import type { SceneId, ViewportRect } from '../three/types'

interface Entry {
  id: SceneId
  el: HTMLElement
  slot: HTMLElement | null
  /** Cached. Refreshed on IO callbacks, resize and font load — never per frame. */
  rect: DOMRect | null
  slotRect: DOMRect | null
}

export interface SceneState {
  scene: SceneId
  /** 0..1 through the active section. */
  progress: number
  /** Signed pixels scrolled since the previous frame. */
  velocity: number
  /** The active section's sphere slot, or null for full bleed. */
  slot: ViewportRect | null
}

type Listener = (state: SceneState) => void

/**
 * Owns scene selection and per-frame scroll derivation for the whole page.
 *
 * Two deliberate properties:
 *  - Scene selection is done by one IntersectionObserver, not by measuring.
 *  - Section rects are cached and only re-measured on events that can invalidate
 *    them. The design prototype called getBoundingClientRect on every section on
 *    every frame, which forces a layout each frame; this does not.
 */
export class SceneController {
  private entries = new Map<SceneId, Entry>()
  private listeners = new Set<Listener>()
  private observer: IntersectionObserver | null = null
  private resizeObserver: ResizeObserver | null = null

  private scene: SceneId = 'hero'
  private lastScrollY = 0
  private raf = 0
  private running = false
  private dirty = true

  start() {
    if (this.running) return
    this.running = true
    this.lastScrollY = window.scrollY

    // Whichever section straddles the viewport midline is the active scene.
    this.observer = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          if (r.isIntersecting) {
            const hit = [...this.entries.values()].find((e) => e.el === r.target)
            if (hit) this.scene = hit.id
          }
        }
        this.measure()
      },
      // adherence-ignore: IntersectionObserver rootMargin is not CSS; var() does not resolve here
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    for (const e of this.entries.values()) this.observer.observe(e.el)

    this.resizeObserver = new ResizeObserver(() => this.measure())
    this.resizeObserver.observe(document.documentElement)

    window.addEventListener('scroll', this.onScroll, { passive: true })
    document.fonts?.ready.then(() => this.measure())

    this.measure()
    this.raf = requestAnimationFrame(this.frame)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
    window.removeEventListener('scroll', this.onScroll)
    this.observer?.disconnect()
    this.resizeObserver?.disconnect()
    this.observer = null
    this.resizeObserver = null
  }

  register(id: SceneId, el: HTMLElement, slot: HTMLElement | null): () => void {
    this.entries.set(id, { id, el, slot, rect: null, slotRect: null })
    this.observer?.observe(el)
    this.measure()
    return () => {
      this.observer?.unobserve(el)
      this.entries.delete(id)
    }
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  /**
   * Publish the current state on the next frame even if nothing has moved.
   * State is only sent when something changes, so a listener that becomes ready
   * late (the engine loads as its own chunk) would otherwise see nothing until
   * the first scroll.
   */
  invalidate() {
    this.dirty = true
  }

  getScene(): SceneId {
    return this.scene
  }

  private onScroll = () => {
    this.dirty = true
  }

  /** The only place layout is read. */
  private measure() {
    for (const e of this.entries.values()) {
      e.rect = e.el.getBoundingClientRect()
      e.slotRect = e.slot?.getBoundingClientRect() ?? null
    }
    // Rects are viewport-relative; store them as document-relative so scrolling
    // does not invalidate them.
    const y = window.scrollY
    for (const e of this.entries.values()) {
      if (e.rect) e.rect = shift(e.rect, y)
      if (e.slotRect) e.slotRect = shift(e.slotRect, y)
    }
    this.dirty = true
  }

  private frame = () => {
    if (!this.running) return
    this.raf = requestAnimationFrame(this.frame)

    const y = window.scrollY
    const velocity = y - this.lastScrollY
    this.lastScrollY = y

    if (!this.dirty && velocity === 0) return
    this.dirty = false

    const active = this.entries.get(this.scene)
    let progress = 0
    let slot: ViewportRect | null = null

    if (active?.rect) {
      const span = Math.max(1, active.rect.height)
      progress = clamp01((y + window.innerHeight * 0.5 - active.rect.top) / span)
    }
    if (active?.slotRect) {
      slot = {
        x: active.slotRect.left,
        y: active.slotRect.top - y,
        width: active.slotRect.width,
        height: active.slotRect.height,
      }
    }

    const state: SceneState = { scene: this.scene, progress, velocity, slot }
    for (const fn of this.listeners) fn(state)
  }
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/** Viewport-relative rect -> document-relative. */
function shift(r: DOMRect, scrollY: number): DOMRect {
  return new DOMRect(r.left, r.top + scrollY, r.width, r.height)
}
