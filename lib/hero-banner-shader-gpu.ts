/**
 * WGSL source and placement constants for the hero MacBook banner shader
 * (components/hero-banner-shader.tsx). "Black glass" treatment: the filled
 * logo becomes a set of dark extruded slabs viewed in perspective on a
 * tilting plane. A blurred companion mask supplies rounded bevel normals, so
 * a drifting studio light draws bright glossy gradients along the edges,
 * with a soft bloom just outside them — dark faces, bright rims.
 *
 * Framework-free so the headless preview script
 * (scripts/render-hero-banner-shader.mjs) can render the exact same shader
 * through `vgpu/node` and read the pixels back.
 */

/** Logo canvas overscan on each side, as a fraction of the logo box. The
 * canvas bleeds past the static banner footprint so tilted edges and the
 * bloom never clip. CSS in app/globals.css must match
 * (`.minimal-hero-banner-canvas`). */
export const HERO_BANNER_BLEED_X = 0.16
export const HERO_BANNER_BLEED_Y = 0.32

/** Fraction of the canvas the untilted logo occupies, derived from the bleed. */
const SCALE_X = 1 / (1 + 2 * HERO_BANNER_BLEED_X)
const SCALE_Y = 1 / (1 + 2 * HERO_BANNER_BLEED_Y)

/** Intrinsic aspect of public/tiles_banner_outline_*.svg (viewBox 150 x 82). */
export const HERO_BANNER_LOGO_ASPECT = 150 / 82

/** Offscreen raster size for the logo mask textures. */
export const HERO_BANNER_RASTER_WIDTH = 1536
export const HERO_BANNER_RASTER_HEIGHT = Math.round(
  HERO_BANNER_RASTER_WIDTH / HERO_BANNER_LOGO_ASPECT,
)
/** Transparent border around the raster so clamp-to-edge sampling stays clear. */
export const HERO_BANNER_RASTER_PAD = 24

/** Gaussian standard deviation (raster pixels) for the soft bevel mask. */
export const HERO_BANNER_BEVEL_SIGMA = 7

/**
 * The outline SVG draws closed polygons with `fill:none`; the slab look
 * needs them solid. Only stroked paths are filled — the document also holds
 * a `fill:none;...;stroke:none` helper element that must stay invisible.
 */
export function fillBannerSvg(svg: string): string {
  return svg.replaceAll(
    "fill:none;fill-opacity:1;stroke:#000000",
    "fill:#000000;fill-opacity:1;stroke:#000000",
  )
}

export interface HeroBannerThemeParams {
  /** Slab face albedo — near-black glass in both themes. */
  faceInk: readonly [number, number, number]
  /** Bloom color outside the edges (light: acts as a soft ground shadow). */
  glowInk: readonly [number, number, number]
  rimGain: number
  glowGain: number
  specGain: number
}

export const HERO_BANNER_THEME_LIGHT: HeroBannerThemeParams = {
  faceInk: [0.08, 0.08, 0.09],
  glowInk: [0, 0, 0],
  rimGain: 0.85,
  glowGain: 0.3,
  specGain: 0.95,
}

export const HERO_BANNER_THEME_DARK: HeroBannerThemeParams = {
  faceInk: [0.05, 0.052, 0.058],
  glowInk: [0.62, 0.64, 0.68],
  rimGain: 1.1,
  glowGain: 0.55,
  specGain: 1.15,
}

export interface HeroBannerParams extends HeroBannerThemeParams {
  time: number
  tilt: readonly [number, number]
}

export const HERO_BANNER_WGSL = /* wgsl */ `
struct Params {
  faceInk: vec3f,
  time: f32,
  glowInk: vec3f,
  rimGain: f32,
  tilt: vec2f,
  glowGain: f32,
  specGain: f32,
}

@group(0) @binding(0) var maskTex: texture_2d<f32>;
@group(0) @binding(1) var softTex: texture_2d<f32>;
@group(0) @binding(2) var logoSamp: sampler;
@group(0) @binding(3) var<uniform> params: Params;

// Plane half extents in world units; the logo aspect (150 x 82) lives here.
const HALF_W = 1.0;
const HALF_H = ${(82 / 150).toFixed(6)};
// Fraction of the canvas the untilted logo covers (canvas overscan inverse).
const SCALE = vec2f(${SCALE_X.toFixed(6)}, ${SCALE_Y.toFixed(6)});
const CAM_Z = 3.2;
// Extrusion slab thickness in world units and parallax march layers.
const DEPTH = 0.09;
const LAYERS = 12u;
// How strongly the soft-mask gradient tips the bevel normals.
const BEVEL_GAIN = 6.0;

fn mask(uv: vec2f) -> f32 {
  let inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  return textureSampleLevel(maskTex, logoSamp, uv, 0.0).a * inside;
}

fn soft(uv: vec2f) -> f32 {
  let inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  return textureSampleLevel(softTex, logoSamp, uv, 0.0).a * inside;
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
    wall = max(wall, m * (1.0 - f * 0.55));
  }

  // Rounded bevel normal from the blurred mask gradient, lifted into world.
  let ts = 1.5 / vec2f(textureDimensions(softTex));
  let sHere = soft(uv0);
  let gx = soft(uv0 + vec2f(ts.x, 0.0)) - soft(uv0 - vec2f(ts.x, 0.0));
  let gy = soft(uv0 + vec2f(0.0, ts.y)) - soft(uv0 - vec2f(0.0, ts.y));
  let nLocal = normalize(vec3f(-gx * BEVEL_GAIN, gy * BEVEL_GAIN, 1.0));
  let normal = normalize(bu * nLocal.x + bv * nLocal.y + nrm * nLocal.z);

  // Drifting studio key light, plus the view/half vectors.
  let light = normalize(vec3f(
    cos(params.time * 0.33) * 0.7,
    0.6 + sin(params.time * 0.24) * 0.35,
    0.72,
  ));
  let view = -dir;
  let halfVec = normalize(light + view);
  let nh = clamp(dot(normal, halfVec), 0.0, 1.0);
  let nv = clamp(dot(normal, view), 0.0, 1.0);
  let diff = clamp(dot(normal, light), 0.0, 1.0);

  // Fixed fill light opposite the key, so edges catch light from two sides.
  let fill = normalize(vec3f(-0.55, -0.2, 0.6));
  let nh2 = clamp(dot(normal, normalize(fill + view)), 0.0, 1.0);

  // Glossy black glass: tight glints and mid highlights riding the bevels
  // (gated to the bevel band so flat faces stay dark), plus a faint sheen.
  let specTight = pow(nh, 90.0) * 1.1 + pow(nh2, 90.0) * 0.5;
  let specMid = pow(nh, 14.0) * 0.55 + pow(nh2, 14.0) * 0.22;
  let sheen = pow(nh, 4.0) * 0.09;
  // Bevel band: soft-mask mid-values trace the rounded edges.
  let band = clamp(sHere * (1.0 - sHere) * 4.0, 0.0, 1.0);
  // Curvature keeps gloss on the bevels and their rolloff into the face,
  // while truly flat interiors stay dark glass at any tilt.
  let curve = clamp((1.0 - nLocal.z) * 4.5, 0.0, 1.0);
  // Fresnel rim plus a constant softbox accent keep the edges softly lit.
  let rim = (pow(1.0 - nv, 2.4) + 0.16) * band * params.rimGain;
  let gloss = (specTight + specMid) * (0.15 + 0.85 * curve) + sheen;

  let faceCol = params.faceInk * (0.6 + 0.5 * diff)
    + vec3f(gloss * params.specGain + rim);
  // Extrusion walls: darker glass, fading with depth.
  let wallCol = params.faceInk * (0.35 + 0.45 * wall);

  let frontness = clamp(front * 1.6, 0.0, 1.0);
  let solidAlpha = max(front, min(wall * 1.4, 1.0));
  let solidCol = mix(wallCol, faceCol, frontness);

  // Soft bloom just outside the shapes (a shadow in light mode).
  let halo = clamp(sHere * 1.1 - solidAlpha, 0.0, 1.0) * params.glowGain;

  // Premultiplied output over a transparent canvas.
  let rgb = solidCol * solidAlpha + params.glowInk * halo;
  let alpha = clamp(solidAlpha + halo, 0.0, 1.0);
  return vec4f(rgb, alpha);
}
`
