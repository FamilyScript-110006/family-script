// components/transition/PageTransitionShader.ts

export const RIPPLE_VERTEX_SHADER = `#version 300 es

precision highp float;

const vec2 POSITIONS[3] = vec2[3](
  vec2(-1.0, -1.0),
  vec2( 3.0, -1.0),
  vec2(-1.0,  3.0)
);

out vec2 vUv;

void main() {
  vec2 position = POSITIONS[gl_VertexID];

  vUv = position * 0.5 + 0.5;

  gl_Position = vec4(
    position,
    0.0,
    1.0
  );
}
`;

export const RIPPLE_FRAGMENT_SHADER = `#version 300 es

precision highp float;

in vec2 vUv;

out vec4 fragColor;

/* ============================================================
   TEXTURES
============================================================ */

uniform sampler2D u_before;
uniform sampler2D u_after;

/* ============================================================
   SCREEN
============================================================ */

uniform vec2 u_resolution;

/* ============================================================
   TRANSITION
============================================================ */

uniform float u_progress;

uniform vec2 u_origin;

uniform float u_strength;

uniform float u_time;

/* ============================================================
   NOISE
============================================================ */

float hash(vec2 p) {
  p = fract(
    p *
    vec2(
      127.1,
      311.7
    )
  );

  p += dot(
    p,
    p + 74.7
  );

  return fract(
    sin(p.x + p.y) *
    43758.5453123
  );
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(
    i + vec2(
      1.0,
      0.0
    )
  );

  float c = hash(
    i + vec2(
      0.0,
      1.0
    )
  );

  float d = hash(
    i + vec2(
      1.0,
      1.0
    )
  );

  vec2 u =
    f *
    f *
    (
      3.0 -
      2.0 * f
    );

  return mix(
    a,
    b,
    u.x
  )
  +
  (
    c -
    a
  ) *
  u.y *
  (
    1.0 -
    u.x
  )
  +
  (
    d -
    b
  ) *
  u.x *
  u.y;
}

/* ============================================================
   FRACTIONAL BROWNIAN MOTION
============================================================ */

float fbm(vec2 p) {
  float value = 0.0;

  float amplitude = 0.5;

  value +=
    noise(p) *
    amplitude;

  p *= 2.0;
  amplitude *= 0.5;

  value +=
    noise(p) *
    amplitude;

  p *= 2.0;
  amplitude *= 0.5;

  value +=
    noise(p) *
    amplitude;

  p *= 2.0;
  amplitude *= 0.5;

  value +=
    noise(p) *
    amplitude;

  return value;
}

/* ============================================================
   ASPECT CORRECTION
============================================================ */

vec2 coverUV(
  vec2 uv,
  vec2 resolution
) {
  float aspect =
    resolution.x /
    max(
      resolution.y,
      1.0
    );

  vec2 centered =
    uv -
    0.5;

  centered.x *= aspect;

  return centered;
}

/* ============================================================
   MAIN
============================================================ */

void main() {

  vec2 uv =
    vUv;

  /*
   * ==========================================================
   * ASPECT-CORRECTED COORDINATES
   * ==========================================================
   */

  vec2 p =
    coverUV(
      uv,
      u_resolution
    );

  /*
   * ==========================================================
   * RIPPLE ORIGIN
   * ==========================================================
   */

  vec2 origin =
    u_origin;

  float aspect =
    u_resolution.x /
    max(
      u_resolution.y,
      1.0
    );

  origin.x =
    (
      origin.x -
      0.5
    ) *
    aspect;

  origin.y =
    origin.y -
    0.5;

  /*
   * Distance from ripple origin.
   */

  vec2 delta =
    p -
    origin;

  float distanceFromOrigin =
    length(delta);

  vec2 direction =
    normalize(
      delta +
      vec2(
        0.00001
      )
    );

  /*
   * ==========================================================
   * LIQUID NOISE
   * ==========================================================
   */

  vec2 noisePosition =
    p * 3.2;

  noisePosition +=
    vec2(
      u_time * 0.08,
      -u_time * 0.05
    );

  float liquidNoise =
    fbm(
      noisePosition
    );

  /*
   * ==========================================================
   * RIPPLE RADIUS
   * ==========================================================
   */

  float rippleRadius =
    u_progress *
    1.55;

  /*
   * Organic distortion of the ripple boundary.
   */

  float radiusDistortion =
    (
      liquidNoise -
      0.5
    ) *
    0.22 *
    u_strength;

  float distortedRadius =
    rippleRadius +
    radiusDistortion;

  /*
   * ==========================================================
   * RIPPLE EDGE
   * ==========================================================
   */

  float edge =
    smoothstep(
      distortedRadius -
        0.18,

      distortedRadius +
        0.18,

      distanceFromOrigin
    );

  /*
   * Inside the ripple = incoming section.
   */

  float reveal =
    1.0 -
    edge;

  /*
   * ==========================================================
   * GUARANTEE COMPLETION
   * ==========================================================
   */

  reveal =
    max(
      reveal,

      smoothstep(
        0.84,
        1.0,
        u_progress
      )
    );

  /*
   * ==========================================================
   * LIQUID WAVE
   * ==========================================================
   */

  float wave =
    sin(
      distanceFromOrigin *
        20.0 -
      u_time *
        2.5
    );

  float secondaryWave =
    sin(
      distanceFromOrigin *
        42.0 +
      u_time *
        1.8
    );

  /*
   * Combined displacement field.
   */

  float displacement =
    wave *
      0.65
    +
    secondaryWave *
      0.20
    +
    (
      liquidNoise -
      0.5
    ) *
      1.15;

  /*
   * ==========================================================
   * EDGE DISPLACEMENT
   * ==========================================================
   *
   * Distortion is strongest around the moving liquid boundary.
   */

  float edgeStrength =
    exp(
      -pow(
        (
          distanceFromOrigin -
          distortedRadius
        ) *
        7.0,

        2.0
      )
    );

  displacement *=
    edgeStrength *
    u_strength *
    0.055;

  /*
   * ==========================================================
   * PRIMARY DISTORTION
   * ==========================================================
   */

  vec2 distortedUV =
    uv +
    direction *
    displacement;

  /*
   * ==========================================================
   * SECONDARY LIQUID MOTION
   * ==========================================================
   */

  distortedUV.x +=
    displacement *
    0.35 *
    sin(
      uv.y *
        14.0 +
      u_time
    );

  distortedUV.y +=
    displacement *
    0.20 *
    cos(
      uv.x *
        17.0 -
      u_time
    );

  /*
   * ==========================================================
   * CHROMATIC DISTORTION
   * ==========================================================
   *
   * Very subtle RGB separation around the liquid boundary.
   *
   * This does NOT add any black colour.
   */

  float chromatic =
    edgeStrength *
    u_strength *
    0.006;

  vec2 redUV =
    distortedUV +
    direction *
    chromatic;

  vec2 blueUV =
    distortedUV -
    direction *
    chromatic;

  /*
   * ==========================================================
   * CURRENT SECTION
   * ==========================================================
   */

  vec4 beforeCenter =
    texture(
      u_before,
      clamp(
        distortedUV,
        0.001,
        0.999
      )
    );

  vec4 beforeRed =
    texture(
      u_before,
      clamp(
        redUV,
        0.001,
        0.999
      )
    );

  vec4 beforeBlue =
    texture(
      u_before,
      clamp(
        blueUV,
        0.001,
        0.999
      )
    );

  /*
   * ==========================================================
   * NEXT SECTION
   * ==========================================================
   */

  vec4 afterCenter =
    texture(
      u_after,
      clamp(
        distortedUV,
        0.001,
        0.999
      )
    );

  vec4 afterRed =
    texture(
      u_after,
      clamp(
        redUV,
        0.001,
        0.999
      )
    );

  vec4 afterBlue =
    texture(
      u_after,
      clamp(
        blueUV,
        0.001,
        0.999
      )
    );

  /*
   * ==========================================================
   * RGB COMBINATION
   * ==========================================================
   */

  vec3 beforeColor =
    vec3(
      beforeRed.r,
      beforeCenter.g,
      beforeBlue.b
    );

  vec3 afterColor =
    vec3(
      afterRed.r,
      afterCenter.g,
      afterBlue.b
    );

  /*
   * ==========================================================
   * COLOUR TRANSITION
   * ==========================================================
   *
   * IMPORTANT:
   *
   * There is NO artificial black layer here.
   *
   * The incoming texture is whatever RippleTextures.ts
   * provides — currently the grayscale version of the actual
   * next section background.
   */

  vec3 finalColor =
    mix(
      beforeColor,
      afterColor,
      clamp(
        reveal,
        0.0,
        1.0
      )
    );

  /*
   * ==========================================================
   * FINAL OUTPUT
   * ==========================================================
   */

  fragColor =
    vec4(
      finalColor,
      1.0
    );
}
`;