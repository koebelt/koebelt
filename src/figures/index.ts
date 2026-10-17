import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

import type { ProjectSlug } from '../i18n/types'
import type { FigureCopy } from './AnatomyFigure'

export interface FigureProps {
  fig: string
  copy: FigureCopy
}

/**
 * One anatomy figure per project that has one. Each is its own chunk (a drawing
 * is a few hundred kB of paths), loaded only on its case study.
 */
export const FIGURES: Partial<Record<ProjectSlug, LazyExoticComponent<ComponentType<FigureProps>>>> = {
  'koebelt-dash': lazy(() => import('./koebelt-dash')),
  portfolio: lazy(() => import('./portfolio')),
  cbienla: lazy(() => import('./cbienla')),
  quadcopter: lazy(() => import('./quadcopter')),
  'drone-controller': lazy(() => import('./drone-controller')),
  'robotic-arm': lazy(() => import('./robotic-arm')),
  facix: lazy(() => import('./facix')),
}
