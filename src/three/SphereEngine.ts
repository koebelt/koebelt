import {
  BufferAttribute,
  BufferGeometry,
  ColorManagement,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'

import { buildSphere, type SphereCloud } from './geometry/fibonacci'
import { markerIndex, sceneClusters, sceneDensity, targetGenerators } from './geometry/targets'
import { QUALITY_LADDER, detectQuality } from './quality'
import { FRAG, VERT } from './shaders/points'
import { cssColor, cssMs } from './tokens'
import type { EngineStats, QualityLevel, SceneId, ViewportRect } from './types'

/** Camera distance, and the divisor the shader uses for depth and size. */
const PERSP_D = 2.6
/**
 * Camera distance per scene. Larger is further away, so the sphere reads smaller
 * and more ambient; the hero sits back and the content scenes pull forward.
 */
const DOLLY_FAR = 3.4
const DOLLY_NEAR = 2.7
/**
 * How fast each scene spins.
 *
 * Round forms (the sphere, the globe, the orbits) read better rotating. Forms
 * that carry a layout — the row of project knots, the timeline column — would be
 * foreshortened into dashes by a full spin, so they hold still and rely on
 * pointer parallax for life instead.
 */
const SCENE_SPIN: Record<SceneId, number> = {
  hero: 1,
  about: 1,
  skills: 0.65,
  projects: 0,
  experience: 0.12,
  contact: 1,
}

const SCENE_DOLLY: Record<SceneId, number> = {
  hero: DOLLY_FAR,
  about: DOLLY_NEAR,
  skills: 3.0,
  projects: 2.3,
  experience: 3.0,
  contact: DOLLY_NEAR,
}

const RIPPLE_SECONDS = 1.4

export interface EngineOptions {
  reducedMotion?: boolean
}

/**
 * The sphere.
 *
 * One BufferGeometry, one Points, one ShaderMaterial, one draw call. The class
 * owns its own animation loop and never touches React — sections drive it through
 * plain method calls, and it reports back only through getStats().
 */
export class SphereEngine {
  private renderer: WebGLRenderer
  private scene = new Scene()
  private camera: PerspectiveCamera
  private geometry = new BufferGeometry()
  private material: ShaderMaterial
  private points: Points

  private cloud: SphereCloud
  private targets = new Map<SceneId, Float32Array>()
  private quality: QualityLevel
  private qualityRung = 0

  private currentScene: SceneId = 'hero'
  private morph = 1
  private morphFrom = 0
  private morphDurationMs: number

  private width = 0
  private height = 0
  private dpr = 1

  private pointerX = 0
  private pointerY = 0
  private yaw = 0
  private mouseYaw = 0
  private pitch = 0.15
  private scrollBoost = 0

  private rippleStart = -Infinity
  private rippleAmp = 0

  private focusTarget = 0

  private densityTarget = 1
  private dollyTarget = DOLLY_FAR

  private slot: ViewportRect | null = null
  private slotLerped: ViewportRect | null = null

  private raf = 0
  private running = false
  private reducedMotion: boolean
  private lastFrameMs = 0
  private frameTimes: number[] = []
  private fps = 0
  private contextLost = false

  // Declared rather than a constructor parameter property: `erasableSyntaxOnly`
  // rejects syntax that has to be compiled away rather than stripped.
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, opts: EngineOptions = {}) {
    this.canvas = canvas
    this.reducedMotion = opts.reducedMotion ?? false

    // Three does not convert Color uniforms on a custom ShaderMaterial, so with
    // management enabled the brand lime would ship linearised and render wrong.
    // Off means the token value lands on screen as exactly itself.
    ColorManagement.enabled = false

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    })
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.setClearAlpha(0)

    this.camera = new PerspectiveCamera(45, 1, 0.1, 100)
    this.camera.position.z = DOLLY_FAR

    this.quality = detectQuality()
    this.qualityRung = QUALITY_LADDER.indexOf(this.quality)
    if (this.qualityRung < 0) this.qualityRung = 0

    this.cloud = buildSphere(this.quality.points)
    this.morphDurationMs = cssMs('--dur-reveal', 640)

    this.material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 1 },
        uStagger: { value: 0.35 },
        uDensity: { value: 1 },
        uSize: { value: 2.4 },
        uDpr: { value: 1 },
        uPerspD: { value: PERSP_D },
        uCamZ: { value: DOLLY_FAR },
        uRippleT: { value: 999 },
        uRippleAmp: { value: 0 },
        uBreathe: { value: this.reducedMotion ? 0 : 1 },
        uAccentCut: { value: 0.05 },
        uAlphaFloor: { value: 0.1 },
        uAlphaGain: { value: 0.85 },
        uFocus: { value: 0 },
        uFocusIndex: { value: 0 },
        uClusterCount: { value: 0 },
        uColorBase: { value: cssColor('--text-primary') },
        uColorAccent: { value: cssColor('--accent') },
      },
    })

    this.buildGeometry()
    this.points = new Points(this.geometry, this.material)
    // The experience column is 2.2 units tall; culling against the original
    // sphere bounds would make it vanish mid-morph.
    this.points.frustumCulled = false
    this.scene.add(this.points)

    canvas.addEventListener('webglcontextlost', this.onContextLost)
    canvas.addEventListener('webglcontextrestored', this.onContextRestored)

    this.bakeTarget('hero')
    this.scheduleRemainingTargets()
  }

  // ---------------------------------------------------------------- lifecycle

  start() {
    if (this.running) return
    this.running = true
    this.lastFrameMs = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  dispose() {
    this.stop()
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost)
    this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored)
    this.geometry.dispose()
    this.material.dispose()
    // dispose() releases the GPU resources and the context. forceContextLoss()
    // is deliberately NOT called: it kills the canvas element permanently, and
    // StrictMode's mount/cleanup/mount cycle would then hand the second engine
    // a canvas that can never get a context again.
    this.renderer.dispose()
  }

  resize(width: number, height: number, dpr: number) {
    this.width = width
    this.height = height
    this.dpr = Math.min(dpr, this.quality.dprCap)
    this.renderer.setPixelRatio(this.dpr)
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / Math.max(1, height)
    this.camera.updateProjectionMatrix()
    this.material.uniforms.uDpr.value = this.dpr
    if (this.reducedMotion) this.renderOnce()
  }

  // ------------------------------------------------------------------- inputs

  setScene(id: SceneId, opts: { immediate?: boolean } = {}) {
    if (id === this.currentScene && this.morph >= 1) return

    // Bake whatever is visible right now into `position`, so an interrupted
    // morph continues from the exact shape on screen instead of popping back
    // to the shape it started from.
    if (this.morph < 1) this.bakeVisiblePositions()

    this.currentScene = id
    const target = this.targets.get(id) ?? this.bakeTarget(id)
    this.setAttribute('aTarget', target, 3)

    this.densityTarget = sceneDensity[id]
    this.material.uniforms.uClusterCount.value = sceneClusters[id]

    if (opts.immediate || this.reducedMotion) {
      this.commitMorph()
      this.material.uniforms.uDensity.value = this.densityTarget
      if (this.reducedMotion) this.renderOnce()
      return
    }

    this.morph = 0
    this.morphFrom = performance.now()
    this.material.uniforms.uMorph.value = 0
    this.ripple(0.6)
  }

  setProgress(p: number) {
    // Progress within a section pulls the sphere forward as the section is
    // entered and lets it settle once the copy is in view.
    const eased = Math.min(1, Math.max(0, p))
    const base = SCENE_DOLLY[this.currentScene]
    this.dollyTarget = base + (1 - eased) * 0.35
  }

  setPointer(nx: number, ny: number) {
    if (this.reducedMotion) return
    this.pointerX = nx
    this.pointerY = ny
  }

  setScrollVelocity(px: number) {
    if (this.reducedMotion) return
    this.scrollBoost = Math.min(this.scrollBoost + Math.abs(px) * 0.0006, 0.05)
  }

  setViewportRect(rect: ViewportRect | null) {
    this.slot = rect
  }

  setFocus(index: number | null) {
    if (index === null) {
      this.focusTarget = 0
      return
    }
    this.focusTarget = 1
    this.material.uniforms.uFocusIndex.value = index
  }

  ripple(amp = 1) {
    if (this.reducedMotion) return
    this.rippleStart = performance.now()
    this.rippleAmp = amp
  }

  setReducedMotion(on: boolean) {
    this.reducedMotion = on
    this.material.uniforms.uBreathe.value = on ? 0 : 1
    if (on) {
      this.stop()
      this.commitMorph()
      this.material.uniforms.uRippleAmp.value = 0
      this.material.uniforms.uDensity.value = this.densityTarget
      this.renderOnce()
    } else {
      this.start()
    }
  }

  // ------------------------------------------------------------------ readback

  /**
   * Where the marked point currently is on screen, so a DOM caption can hang off
   * it. Null when the sphere is not showing the marker, or it is behind the cloud.
   */
  getFlagScreenPosition(): { x: number; y: number; visible: boolean } | null {
    if (this.currentScene !== 'about' || !this.slotLerped) return null

    const i = markerIndex(this.cloud.n)
    const attr = this.geometry.getAttribute('aTarget') as BufferAttribute
    const v = new Vector3(attr.getX(i), attr.getY(i), attr.getZ(i))
    v.applyMatrix4(this.points.matrixWorld)
    const depth = v.z
    v.project(this.camera)

    const r = this.slotLerped
    return {
      x: r.x + ((v.x + 1) / 2) * r.width,
      y: r.y + ((1 - v.y) / 2) * r.height,
      visible: depth > -0.2,
    }
  }

  getStats(): EngineStats {
    return {
      points: this.cloud.n,
      fps: Math.round(this.fps),
      calls: this.renderer.info.render.calls,
      scene: this.currentScene,
    }
  }

  // -------------------------------------------------------------- internals

  private buildGeometry() {
    const { home, seed, index, n } = this.cloud
    this.setAttribute('position', Float32Array.from(home), 3)
    this.setAttribute('aTarget', Float32Array.from(home), 3)
    this.setAttribute('aHome', Float32Array.from(home), 3)
    this.setAttribute('aSeed', seed, 1)
    this.setAttribute('aIndex', index, 1)

    // Exactly one point is the location marker, and only the about scene uses it.
    const flag = new Float32Array(n)
    flag[markerIndex(n)] = 1
    this.setAttribute('aFlag', flag, 1)
  }

  private setAttribute(name: string, data: Float32Array, itemSize: number) {
    const existing = this.geometry.getAttribute(name) as BufferAttribute | undefined
    if (existing && existing.array.length === data.length) {
      ;(existing.array as Float32Array).set(data)
      existing.needsUpdate = true
      return
    }
    this.geometry.setAttribute(name, new BufferAttribute(data, itemSize))
  }

  private bakeTarget(id: SceneId): Float32Array {
    const data = targetGenerators[id](this.cloud)
    this.targets.set(id, data)
    return data
  }

  private scheduleRemainingTargets() {
    const rest = (Object.keys(targetGenerators) as SceneId[]).filter((id) => !this.targets.has(id))
    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1))
    idle(() => {
      for (const id of rest) this.bakeTarget(id)
    })
  }

  /** Freeze the in-flight interpolation into `position`. */
  private bakeVisiblePositions() {
    const pos = this.geometry.getAttribute('position') as BufferAttribute
    const tgt = this.geometry.getAttribute('aTarget') as BufferAttribute
    const a = pos.array as Float32Array
    const b = tgt.array as Float32Array
    const t = this.morph
    for (let i = 0; i < a.length; i++) a[i] += (b[i] - a[i]) * t
    pos.needsUpdate = true
  }

  private commitMorph() {
    this.morph = 1
    this.bakeVisiblePositions()
    this.material.uniforms.uMorph.value = 0
    const pos = this.geometry.getAttribute('position') as BufferAttribute
    const tgt = this.geometry.getAttribute('aTarget') as BufferAttribute
    ;(tgt.array as Float32Array).set(pos.array as Float32Array)
    tgt.needsUpdate = true
  }

  private renderOnce() {
    if (this.contextLost || !this.width) return
    this.material.uniforms.uCamZ.value = this.camera.position.z
    this.applyViewport()
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Confine drawing to the active section's slot, so the sphere is structurally
   * incapable of rendering over body copy. The hero passes no slot and draws full
   * bleed, which is safe because its copy sits in columns 1—6.
   */
  private applyViewport() {
    const r = this.slotLerped
    if (!r) {
      this.renderer.setViewport(0, 0, this.width, this.height)
      this.renderer.setScissorTest(false)
      this.camera.aspect = this.width / Math.max(1, this.height)
      this.camera.updateProjectionMatrix()
      return
    }
    // WebGL measures y from the bottom of the drawing buffer; CSS rects measure
    // from the top.
    const y = this.height - r.y - r.height
    this.renderer.setViewport(r.x, y, r.width, r.height)
    this.renderer.setScissor(r.x, y, r.width, r.height)
    this.renderer.setScissorTest(true)
    this.camera.aspect = r.width / Math.max(1, r.height)
    this.camera.updateProjectionMatrix()
  }

  private frame = (now: number) => {
    if (!this.running) return
    this.raf = requestAnimationFrame(this.frame)
    if (this.contextLost || !this.width) return

    const dt = Math.min(64, now - this.lastFrameMs)
    this.lastFrameMs = now
    this.trackFrame(dt)

    const u = this.material.uniforms
    u.uTime.value = now / 1000

    // Morph.
    if (this.morph < 1) {
      this.morph = Math.min(1, (now - this.morphFrom) / this.morphDurationMs)
      u.uMorph.value = this.morph
      if (this.morph >= 1) this.commitMorph()
    }

    // Density and focus ease toward their targets rather than stepping.
    u.uDensity.value += (this.densityTarget - u.uDensity.value) * 0.08
    u.uFocus.value += (this.focusTarget - u.uFocus.value) * 0.12

    // Rotation: a slow base spin, plus scroll velocity, plus eased pointer parallax.
    this.scrollBoost *= 0.92
    const spin = SCENE_SPIN[this.currentScene]
    this.yaw += (0.0016 + this.scrollBoost) * spin

    // A scene that barely spins must SETTLE face-on, not freeze at whatever
    // arbitrary angle it inherited — a row of knots seen edge-on collapses into
    // one blob. Ease to the nearest whole turn, so the form turns to face the
    // reader as the section is entered.
    if (spin < 0.3) {
      const faceOn = Math.round(this.yaw / (Math.PI * 2)) * Math.PI * 2
      this.yaw += (faceOn - this.yaw) * 0.05
    }
    // Parallax stays available even where the scene does not spin, so a still
    // form still responds to the pointer.
    this.mouseYaw += (this.pointerX * 0.6 * Math.max(spin, 0.35) - this.mouseYaw) * 0.04
    this.pitch += (0.15 + this.pointerY * 0.22 - this.pitch) * 0.04
    this.points.rotation.y = this.yaw + this.mouseYaw
    this.points.rotation.x = this.pitch

    // Ripple.
    const elapsed = (now - this.rippleStart) / 1000
    if (elapsed >= 0 && elapsed < RIPPLE_SECONDS) {
      u.uRippleT.value = elapsed
      u.uRippleAmp.value = this.rippleAmp
    } else {
      u.uRippleAmp.value = 0
    }

    // Camera dolly: the sphere grows as it comes forward into a section slot.
    this.camera.position.z += (this.dollyTarget - this.camera.position.z) * 0.06
    // Depth shading and point size normalise against the live camera distance,
    // so dollying changes apparent size instead of dimming the whole cloud.
    u.uCamZ.value = this.camera.position.z

    this.lerpSlot()
    this.applyViewport()
    this.renderer.render(this.scene, this.camera)
  }

  /** Ease between the outgoing and incoming slot rects so the transit is continuous. */
  private lerpSlot() {
    const target = this.slot
    if (!target) {
      this.slotLerped = null
      return
    }
    if (!this.slotLerped) {
      this.slotLerped = { ...target }
      return
    }
    const k = 0.12
    const s = this.slotLerped
    s.x += (target.x - s.x) * k
    s.y += (target.y - s.y) * k
    s.width += (target.width - s.width) * k
    s.height += (target.height - s.height) * k
  }

  private trackFrame(dt: number) {
    this.frameTimes.push(dt)
    if (this.frameTimes.length < 60) return

    const mean = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
    this.fps = 1000 / mean
    this.frameTimes.length = 0

    // One downgrade, never an upgrade back — oscillating between rungs would be
    // more visible than simply running at the lower one.
    if (mean > 20 && this.qualityRung < QUALITY_LADDER.length - 1) {
      this.qualityRung += 1
      this.applyQuality(QUALITY_LADDER[this.qualityRung])
    }
  }

  setQuality(q: QualityLevel) {
    this.applyQuality(q)
  }

  private applyQuality(q: QualityLevel) {
    this.quality = q
    this.cloud = buildSphere(q.points)
    this.targets.clear()
    this.buildGeometry()
    this.bakeTarget(this.currentScene)
    this.setAttribute('aTarget', this.targets.get(this.currentScene)!, 3)
    this.commitMorph()
    this.scheduleRemainingTargets()
    this.resize(this.width, this.height, window.devicePixelRatio)
  }

  private onContextLost = (e: Event) => {
    e.preventDefault()
    this.contextLost = true
  }

  private onContextRestored = () => {
    this.contextLost = false
    this.buildGeometry()
    this.bakeTarget(this.currentScene)
    this.setAttribute('aTarget', this.targets.get(this.currentScene)!, 3)
    this.commitMorph()
    this.resize(this.width, this.height, window.devicePixelRatio)
  }
}
