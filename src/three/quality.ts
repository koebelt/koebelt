import type { QualityLevel } from './types'

/**
 * Point counts are modest on purpose. The cloud is one draw call either way, so
 * the limit is fill rate and overdraw from alpha-blended points, not vertex work.
 *
 * The counts are set by the globe, which is the most demanding scene: the
 * continents only become recognisable — France in particular — once there are
 * enough points to resolve a coastline a few degrees across. Drawing coastlines
 * rather than filled land is what keeps that number modest.
 */
export const QUALITY: Record<'desktop' | 'tablet' | 'mobile', QualityLevel> = {
  desktop: { points: 7000, dprCap: 2 },
  tablet: { points: 5000, dprCap: 2 },
  mobile: { points: 3000, dprCap: 1.5 },
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
