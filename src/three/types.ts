/** One scene per page section. The sphere holds exactly one at a time. */
export type SceneId = 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'contact'

export const SCENE_ORDER: readonly SceneId[] = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'contact',
]

/** A slot the sphere is allowed to draw into, in CSS pixels from the top-left. */
export interface ViewportRect {
  x: number
  y: number
  width: number
  height: number
}

export interface QualityLevel {
  points: number
  dprCap: number
}

export interface EngineStats {
  points: number
  fps: number
  calls: number
  scene: SceneId
}
