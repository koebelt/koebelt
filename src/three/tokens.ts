import { Color } from 'three'

/**
 * Reads design-system values out of CSS custom properties at runtime.
 *
 * Two reasons this is not a table of constants in TypeScript:
 *  - the adherence lint forbids raw hex and raw px literals in source, and
 *  - a token change in the design system must reach the sphere without an edit here.
 *
 * Custom properties are substituted at computed-value time, so `--accent` resolves
 * through its `var(--lime-500)` indirection to a literal colour.
 */
function raw(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function cssColor(name: string, fallback = 'white'): Color {
  const value = raw(name)
  try {
    return new Color(value || fallback)
  } catch {
    return new Color(fallback)
  }
}

/** Parses "640ms" or "0.64s" into milliseconds. */
export function cssMs(name: string, fallback: number): number {
  const value = raw(name)
  if (!value) return fallback
  const n = Number.parseFloat(value)
  if (Number.isNaN(n)) return fallback
  return value.endsWith('ms') ? n : n * 1000
}
