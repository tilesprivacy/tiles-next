/**
 * WGSL source and placement constants for the hero MacBook banner shader
 * (components/hero-banner-shader.tsx). The logo is treated as a thin extruded
 * slab in 3D: each fragment casts a perspective ray against a tilting plane,
 * marches the slab for parallax side walls, and shades the front face with a
 * gradient-derived normal, a drifting key light, and a specular sheen.
 *
 * Framework-free so the headless preview script
 * (scripts/render-hero-banner-shader.mjs) can render the exact same shader
 * through `vgpu/node` and read the pixels back.
 */

/** Logo canvas overscan on each side, as a fraction of the logo box. The
 * canvas bleeds past the static banner footprint so tilted edges and the
 * extrusion never clip. CSS in app/globals.css must match
 * (`.minimal-hero-banner-canvas`). */
export const HERO_BANNER_BLEED_X = 0.16
export const HERO_BANNER_BLEED_Y = 0.32

/** Fraction of the canvas the untilted logo occupies, derived from the bleed. */
const SCALE_X = 1 / (1 + 2 * HERO_BANNER_BLEED_X)
const SCALE_Y = 1 / (1 + 2 * HERO_BANNER_BLEED_Y)

/** Intrinsic aspect of public/tiles_banner_outline_*.svg (viewBox 150 x 82). */
export const HERO_BANNER_LOGO_ASPECT = 150 / 82

/** Offscreen raster size for the logo mask texture. */
export const HERO_BANNER_RASTER_WIDTH = 1536
export const HERO_BANNER_RASTER_HEIGHT = Math.round(
  HERO_BANNER_RASTER_WIDTH / HERO_BANNER_LOGO_ASPECT,
)
/** Transparent border around the raster so clamp-to-edge sampling stays clear. */
export const HERO_BANNER_RASTER_PAD = 4

/** Theme ink for the strokes; matches the black/white outline SVG pair. */
export const HERO_BANNER_INK_LIGHT = [0.06, 0.06, 0.07] as const
export const HERO_BANNER_INK_DARK = [0.93, 0.94, 0.95] as const
export const HERO_BANNER_SPEC_LIGHT = 0.4
export const HERO_BANNER_SPEC_DARK = 0.65

export interface HeroBannerParams {
  ink: readonly [number, number, number]
  time: number
  tilt: readonly [number, number]
  reveal: number
  specGain: number
}

export const HERO_BANNER_WGSL = /* wgsl */ `
struct Params {
  ink: vec3f,
  time: f32,
  tilt: vec2f,
  reveal: f32,
  specGain: f32,
}

@group(0) @binding(0) var logoTex: texture_2d<f32>;
@group(0) @binding(1) var logoSamp: sampler;
@group(0) @binding(2) var<uniform> params: Params;

// Plane half extents in world units; the logo aspect (150 x 82) lives here.
const HALF_W = 1.0;
const HALF_H = ${(82 / 150).toFixed(6)};
// Fraction of the canvas the untilted logo covers (canvas overscan inverse).
const SCALE = vec2f(${SCALE_X.toFixed(6)}, ${SCALE_Y.toFixed(6)});
const CAM_Z = 3.2;
// Extrusion slab thickness in world units and parallax march layers.
const DEPTH = 0.075;
const LAYERS = 12u;

fn mask(uv: vec2f) -> f32 {
  let inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  return textureSampleLevel(logoTex, logoSamp, uv, 0.0).a * inside;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  // Canvas uv -> world point on the untilted logo plane (z = 0, y up).
  let world = vec2f(
    (uv.x - 0.5) * (2.0 * HALF_W / SCALE.x),
    (0.5 - uv.y) * (2.0 * HALF_H / SCALE.y),
  );
  let cam = vec3f(0.0, 0.0, CAM_Z);
  let dir = normalize(vec3f(world, 0.0) - cam);

  // Plane basis: R = Ry(tilt.y) * Rx(tilt.x) applied to the unit axes.
  let ca = cos(params.tilt.x);
  let sa = sin(params.tilt.x);
  let cb = cos(params.tilt.y);
  let sb = sin(params.tilt.y);
  let bu = vec3f(cb, 0.0, -sb);
  let bv = vec3f(sa * sb, ca, sa * cb);
  let nrm = vec3f(ca * sb, -sa, ca * cb);

  // Ray and camera in plane-local coordinates.
  let dl = vec3f(dot(dir, bu), dot(dir, bv), dot(dir, nrm));
  let cl = vec3f(dot(cam, bu), dot(cam, bv), dot(cam, nrm));
  if (dl.z > -1e-4) {
    return vec4f(0.0);
  }

  // Front-face hit (local z = 0) and its logo uv.
  let xy0 = cl.xy - dl.xy * (cl.z / dl.z);
  let uv0 = vec2f(xy0.x / (2.0 * HALF_W) + 0.5, 0.5 - xy0.y / (2.0 * HALF_H));
  // Local-uv drift per world unit of slab depth along the view ray.
  let duv = vec2f(
    (-dl.x / dl.z) / (2.0 * HALF_W),
    (dl.y / dl.z) / (2.0 * HALF_H),
  );

  let front = mask(uv0);

  // March the slab: nearest wall sample wins, deeper layers fade.
  var wall = 0.0;
  for (var k = 1u; k <= LAYERS; k++) {
    let f = f32(k) / f32(LAYERS);
    let m = mask(uv0 + duv * (f * DEPTH));
    wall = max(wall, m * (1.0 - f * 0.72));
  }

  // Front-face normal from the mask gradient, lifted into world space.
  let ts = 1.5 / vec2f(textureDimensions(logoTex));
  let gx = mask(uv0 + vec2f(ts.x, 0.0)) - mask(uv0 - vec2f(ts.x, 0.0));
  let gy = mask(uv0 + vec2f(0.0, ts.y)) - mask(uv0 - vec2f(0.0, ts.y));
  let nLocal = normalize(vec3f(-gx * 1.7, gy * 1.7, 1.0));
  let normal = normalize(bu * nLocal.x + bv * nLocal.y + nrm * nLocal.z);

  // Drifting key light plus a half-vector specular sheen.
  let light = normalize(vec3f(
    cos(params.time * 0.4) * 0.55,
    0.55 + sin(params.time * 0.31) * 0.25,
    0.85,
  ));
  let view = -dir;
  let halfVec = normalize(light + view);
  let diff = clamp(dot(normal, light), 0.0, 1.0);
  let spec = pow(clamp(dot(normal, halfVec), 0.0, 1.0), 42.0);

  // Side walls read as brushed metal between the theme ink and mid gray.
  let sideCol = mix(params.ink, vec3f(0.5), 0.5);
  let faceCol = params.ink * (0.82 + 0.2 * diff) + vec3f(spec * params.specGain);
  let frontness = clamp(front * 2.0, 0.0, 1.0);
  var rgb = mix(sideCol, faceCol, frontness);
  var alpha = max(front, wall);

  // Left-to-right reveal wipe in logo space.
  let edge = params.reveal * 1.3 - 0.15;
  alpha *= 1.0 - smoothstep(edge, edge + 0.12, uv0.x);

  // Premultiplied output over a transparent canvas.
  return vec4f(rgb * alpha, alpha);
}
`
