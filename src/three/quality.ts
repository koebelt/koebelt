import type { QualityLevel } from './types'

/**
 * Point counts are modest on purpose. The cloud is one draw call either way, so
 * the limit is fill rate and overdraw from alpha-blended points, not vertex work
 * — and a denser sphere reads as noise rather than as more detail.
 */
export const QUALITY: Record<'desktop' | 'tablet' | 'mobile', QualityLevel> = {
  desktop: { points: 3600, dprCap: 2 },
  tablet: { points: 2400, dprCap: 2 },
  mobile: { points: 1536, dprCap: 1.5 },
}

export const QUALITY_LADDER: QualityLevel[] = [QUALITY.desktop, QUALITY.tablet, QUALITY.mobile]

export function detectQuality(): QualityLevel {
  if (typeof window === 'undefined') return QUALITY.mobile
  // adherence-ignore: media-query conditions are parsed outside CSS; var() does not resolve
  if (window.matchMedia('(max-width: 768px)').matches) return QUALITY.mobile
  const cores = navigator.hardwareConcurrency ?? 8
  // adherence-ignore: media-query conditions are parsed outside CSS; var() does not resolve
  if (cores <= 4 || window.matchMedia('(max-width: 1200px)').matches) return QUALITY.tablet
  return QUALITY.desktop
}
