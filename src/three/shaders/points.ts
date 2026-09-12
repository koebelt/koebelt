/**
 * The whole sphere is one THREE.Points, one ShaderMaterial, one draw call.
 * Everything reactive — shape, density, colour, size, motion — happens here on
 * the GPU against uniforms the engine writes once per frame.
 *
 * Brand colours arrive as uniforms read from CSS custom properties, so no hex
 * literal appears in any source file the design-system adherence lint reads.
 */

export const VERT = /* glsl */ `
  precision highp float;

  attribute vec3  aTarget;
  attribute vec3  aHome;
  attribute float aSeed;
  attribute float aIndex;
  attribute float aFlag;

  uniform float uTime;
  uniform float uMorph;
  uniform float uStagger;
  uniform float uDensity;
  uniform float uSize;
  uniform float uDpr;
  uniform float uPerspD;
  uniform float uCamZ;
  uniform float uRippleT;
  uniform float uRippleAmp;
  uniform float uBreathe;
  uniform float uAccentCut;
  uniform float uAlphaFloor;
  uniform float uAlphaGain;
  uniform float uDepthPow;
  uniform float uBackCull;
  uniform float uFocus;
  uniform float uFocusIndex;
  uniform float uClusterCount;

  varying float vAlpha;
  varying float vAccent;

  // The design system mandates one easing curve everywhere:
  // cubic-bezier(.2,.8,.2,1). Solved rather than approximated, because
  // smoothstep is symmetric and this curve is deliberately not.
  // Newton-solve u from x, then evaluate y(u). Control points are (.2,.8) and
  // (.2,1), so the x1 == x2 term in the derivative vanishes.
  float bezier(float t) {
    float u = t;
    for (int i = 0; i < 3; i++) {
      float v = 1.0 - u;
      float x = 3.0 * v * v * u * 0.2 + 3.0 * v * u * u * 0.2 + u * u * u;
      float dx = 3.0 * v * v * 0.2 + 3.0 * u * u * 0.8;
      u = clamp(u - (x - t) / max(dx, 1e-4), 0.0, 1.0);
    }
    float v = 1.0 - u;
    return 3.0 * v * v * u * 0.8 + 3.0 * v * u * u + u * u * u;
  }

  void main() {
    // Density: thin the cloud by dropping points whose seed is above the
    // threshold. Pushing them outside clip space costs less than a fragment
    // discard, because they never reach the rasteriser at all.
    if (aSeed > uDensity) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      vAlpha = 0.0;
      vAccent = 0.0;
      return;
    }

    // Staggered morph: each point starts its transition slightly later than the
    // one before it, so the change sweeps across the form.
    float d = clamp((uMorph - aIndex * uStagger) / max(1.0 - uStagger, 1e-4), 0.0, 1.0);
    vec3 p = mix(position, aTarget, bezier(d));

    // Idle breathing — the cloud is never perfectly still.
    p *= 1.0 + uBreathe * 0.006 * sin(uTime * 0.6 + aSeed * 6.2831853);

    // Ripple: a damped travelling wave along the point's own outward direction.
    if (uRippleAmp > 0.0) {
      vec3 dir = normalize(aHome + 1e-5);
      float wave = sin(uRippleT * 6.0) * exp(-uRippleT * 2.2);
      p += dir * uRippleAmp * wave * 0.16 * cos(aHome.y * 3.0 - uRippleT * 10.0);
    }

    // Focus: tighten the addressed cluster toward its own centroid and let the
    // others drift outward, so hovering a card visibly acts on the sphere.
    if (uFocus > 0.0 && uClusterCount > 0.0) {
      float cluster = floor(aIndex * uClusterCount);
      float mine = step(abs(cluster - uFocusIndex), 0.5);
      p *= 1.0 + uFocus * mix(0.05, -0.07, mine);
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Depth shading: points at the front of the cloud are brighter than those
    // behind it, with no depth buffer involved. View-space z is negative in
    // front of the camera, so distance runs [uCamZ-1, uCamZ+1] and b is 1 at the
    // nearest point. Normalised against the LIVE camera distance, not a constant,
    // because the camera dollies between scenes. The alpha curve is the
    // prototype's, verbatim.
    float b = clamp((uCamZ + 1.0 + mv.z) * 0.5, 0.0, 1.0);

    // Back-face cull. There is no depth buffer, so both hemispheres rasterise;
    // and the far one is compressed by perspective into a smaller area, where
    // even a very low alpha accumulates through blending into a solid mass that
    // competes with the near side. Fading it is not enough — where the
    // silhouette carries meaning, the far half is simply not drawn.
    // 0.56 rather than 0.5: the last few degrees before the silhouette are seen
    // so obliquely that they crowd into a bright rim, so they go with the back.
    if (uBackCull > 0.5 && b < 0.56) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      vAlpha = 0.0;
      vAccent = 0.0;
      return;
    }

    vAlpha = uAlphaFloor + pow(b, uDepthPow) * uAlphaGain;

    // The accent subset: ~5% of points, front-facing only. This is the only
    // place the brand's one saturated colour appears in the sphere.
    vAccent = step(aSeed, uAccentCut) * step(0.55, b);
    vAccent = max(vAccent, aFlag);
    vAlpha = mix(vAlpha, 1.0, aFlag);

    // Perspective attenuation: size falls off with distance from the camera,
    // so near points are larger. Also normalised against the live camera
    // distance, so dollying changes apparent size rather than point size.
    float attenuation = uCamZ / max(-mv.z, 0.1);
    // The location marker is drawn conspicuously larger — it is one point
    // among thousands and it is the whole reason the globe is here.
    gl_PointSize = max(1.0, uSize * uDpr * attenuation * (1.0 + aFlag * 2.6));
  }
`

export const FRAG = /* glsl */ `
  precision highp float;

  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;

  varying float vAlpha;
  varying float vAccent;

  void main() {
    // A crisp disc. The 0.05-wide smoothstep band is antialiasing, not a radial
    // falloff — the brand rules forbid glow, and a wider band would read as one.
    float d = length(gl_PointCoord - vec2(0.5));
    float a = 1.0 - smoothstep(0.45, 0.5, d);
    if (a <= 0.0) discard;

    gl_FragColor = vec4(mix(uColorBase, uColorAccent, vAccent), a * vAlpha);
  }
`
