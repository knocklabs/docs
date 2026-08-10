import React, { useEffect, useRef, useState } from "react";

import { useTheme } from "@/components/theme/ThemeProvider";

/**
 * Layered signal field for the /agents hero.
 *
 * Runners travel a lattice across three depth planes. They fork (mass
 * halves, the child sinks a plane) and merge (mass sums, the survivor
 * surfaces a plane); only a front-plane runner heavy enough to have merged
 * can claim one of four endpoint pads. Depth is rendered as one camera's
 * worth of cues: perspective scale, resample defocus, fog, and cooling on
 * the back planes, bloom on the front.
 *
 * The engine is a port of a standalone prototype tuned against the real
 * hero copy. Settings that shipped as "off" there (etch residue, stepped
 * motion, segment trails, plane bow/tilt) are omitted here rather than
 * carried as dead code. Pointer parallax came back in after launch: the
 * back planes shift slightly away from the pointer at composite time.
 */

/* ------------------------------------------------------------------ */
/* shipped configuration                                              */
/* ------------------------------------------------------------------ */

const SETTINGS = {
  /** Overall energy: drives runner count, cap, and ink alpha. 0–1.
   *  Tuned at 0.69, brought down after team feedback that the field ran
   *  busy — this also clamps the early fork froth a fresh field opens
   *  with, since the runner cap scales with it. */
  restraint: 0.6,
  /** Lattice cell size, px. */
  cell: 20,
  /** Base runner speed, px/s (each runner spawns at 0.78–1.28×). */
  speed: 60,
  /** Max trail length, px (each runner gets 0.7–1.3×). */
  trail: 240,
  /** Chance a front-plane spawn gets the accent color. */
  accentRatio: 0.6,
  /** Straight-ahead weight when choosing a direction at a node. */
  turnBias: 0.62,
  /** Head glow strength, 0 disables. */
  headGlow: 1,
  /** Depth planes. The renderer allocates exactly this many layers. */
  planes: 3,
  /** How far apart the planes feel; feeds every depth cue. 0–1. */
  planeSpread: 1,
  /** Chance a runner forks when crossing a node. */
  forkRate: 0.16,
  /** Given a fork, chance the child sinks one plane. */
  forkDrop: 0.5,
  /** Seconds a cell stays "occupied" — arrivals within it merge. */
  mergeWindow: 0.16,
  /** Minimum mass to claim a pad. Base spawn mass is 1: keep above 1 so
   *  arrival stays earned (only merged runners qualify). */
  claimMass: 2,
  /** Seconds a runner takes to travel one plane of depth. Tuned down
   *  from 1 to halve the cross-fade window where a mid-dive runner draws
   *  into two layers at different parallax offsets (a moving pointer can
   *  double-image the trail there); dives still read as travel. */
  zEase: 0.5,
  /** Bloom pass strength. */
  bloom: 1.5,
  /** Atmospheric fade toward the background per depth slice. 0–1. */
  fog: 1,
  /** Seconds a fork/merge via ring persists. */
  viaLife: 8,
  /** Pointer attract radius, px, and force multiplier. */
  pointerRadius: 150,
  pointerForce: 2.6,
  /** Pointer parallax dial: back planes shift away from the pointer at
   *  composite time; the front plane stays pinned under the copy. The
   *  magnitude is camera-derived (see parallaxShift); this scales it.
   *  0 disables. */
  parallax: 0.8,
  /** Simulated seconds run before the first painted frame. */
  presim: 4,
  /** Entry: the field wakes up rather than switching on. Runner density,
   *  simulation speed, and ink (layer/spark/bloom brightness) start at
   *  these floors and ease (cubic out) to full over `duration` seconds
   *  of live time. Reduced-motion scenes skip the intro — their single
   *  still should be the full field at full brightness.
   *
   *  `duration` is set so this envelope lands with the canvas opacity fade
   *  (450ms delay + 1.8s, below) instead of stacking a second, longer
   *  dissolve on top of it — one arrival, not two. */
  intro: { duration: 2.4, density: 0.35, timeScale: 0.2, ink: 0.3 },
  /** Pad lifecycle: a pad completes after `quota` earned claims, plays a
   *  done cascade, fades out, and a successor fades in at another slot
   *  after `respawnDelay`. Fades are in seconds. */
  pads: { count: 4, quota: 2, fadeIn: 0.8, fadeOut: 1.2, respawnDelay: 1 },
} as const;

const PLANES = SETTINGS.planes;
/** Per-plane render resolution: the upscale on composite is the defocus. */
const LAYER_RES = [1, 0.5, 0.32] as const;

type Rgb = [number, number, number];

type Palette = {
  dark: boolean;
  bg: Rgb;
  grid: Rgb;
  dim: Rgb;
  neutral: Rgb;
  accent: Rgb;
  hot: Rgb;
};

const PALETTES: Record<"light" | "dark", Palette> = {
  dark: {
    dark: true,
    bg: [25, 25, 25], // fallback; replaced by --tgph-surface-1 at runtime
    grid: [255, 255, 255],
    dim: [111, 116, 128],
    neutral: [141, 147, 160],
    accent: [250, 89, 2],
    hot: [255, 178, 122],
  },
  light: {
    dark: false,
    bg: [255, 255, 255],
    grid: [0, 0, 0],
    dim: [185, 188, 196],
    neutral: [124, 130, 141],
    accent: [250, 89, 2],
    hot: [201, 63, 0],
  },
};

/* ------------------------------------------------------------------ */
/* pure arithmetic (ported from the prototype's law.js / cine.js)     */
/* ------------------------------------------------------------------ */

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1));
const rgba = (c: Rgb, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/** Fork halves mass; merge sums it — total mass is conserved. */
const forkMasses = (mass: number): [number, number] => [mass / 2, mass / 2];
const mergeMass = (a: number, b: number) => a + b;

/** Merge pulls the survivor one plane forward of the meeting (collision
 *  detection is same-plane-only, so min() of the two would be a no-op). */
const mergePlane = (za: number, zb: number) =>
  Math.max(0, Math.min(za, zb) - 1);
const forkChildPlane = (z: number, drop: boolean) =>
  drop ? Math.min(z + 1, PLANES - 1) : z;

/** Trails batch into Path2D by tier, so tiers must be few and stable. */
const TIER_EDGES = [0.12, 0.3, 0.7, 1.6];
function massTier(mass: number) {
  let t = 0;
  while (t < TIER_EDGES.length && mass >= TIER_EDGES[t]) t++;
  return t;
}

/** Mass tier → stroke px: fork hairlines / light branches / the unmerged
 *  baseline / merged trunks. */
const TRACE_WIDTHS = [1, 1, 1.6, 2.6, 4];
const traceWidth = (tier: number) => TRACE_WIDTHS[clamp(tier, 0, 4)];

/** Depth cues from one camera: a plane at normalized depth k sits at
 *  distance (1 + 0.5k), so its screen scale is the reciprocal. z=0 is
 *  identity. */
function planeStyle(z: number) {
  const depth = PLANES > 1 ? z / (PLANES - 1) : 0;
  const k = depth * SETTINGS.planeSpread;
  return {
    scale: 1 / (1 + 0.5 * k),
    dim: 1 - 0.82 * k,
    speedMul: 1 - 0.45 * k,
  };
}

/** One camera for scale and parallax: the offset magnitude is c * (1 - s),
 *  exactly the screen displacement of a plane at scale s when the camera
 *  translates by c with the front plane pinned under the copy. The SIGN is
 *  a judged override of that derivation: the physical camera slides the
 *  deep world WITH the pointer, but the pointer *pushing* the deeper
 *  planes away reads as the cursor repelling the field, matching the
 *  pointer-bias interaction story. Magnitude stays scale-derived so the
 *  cues remain coherent; only the direction is art. Zero at scale 1, so
 *  the front plane never moves. */
const PARALLAX_GAIN = 0.055;
const parallaxShift = (
  pointer: number,
  center: number,
  amount: number,
  scale: number,
) => (center - pointer) * PARALLAX_GAIN * amount * (1 - scale);

const canClaim = (z: number, mass: number) =>
  z === 0 && mass >= SETTINGS.claimMass;

/** Curated pad anchor slots, all derived from the copy's bounding box and
 *  clear of the copy band. Placement separates two things the old random
 *  placement fused: where pads MAY go is curated (these slots), which are
 *  active is random — one pad per region, so a reload varies but can
 *  never stack pads on one side or drop one under the veil. */
const PAD_SLOTS: Array<{ fx: number; fy: number; region: number }> = [
  { fx: 0.9, fy: 0.2, region: 0 }, // right-top
  { fx: 0.85, fy: 0.12, region: 0 },
  { fx: 0.93, fy: 0.44, region: 1 }, // right-mid
  { fx: 0.88, fy: 0.55, region: 1 },
  { fx: 0.88, fy: 0.78, region: 2 }, // right-low
  { fx: 0.94, fy: 0.68, region: 2 },
  { fx: 0.11, fy: 0.83, region: 3 }, // left-low
  { fx: 0.16, fy: 0.74, region: 3 },
  { fx: 0.08, fy: 0.3, region: 4 }, // left-top
  { fx: 0.13, fy: 0.14, region: 4 },
];

/** One grading function so restraint, bloom, fog, and accent allocation
 *  always move together. */
function grade() {
  const r = SETTINGS.restraint;
  return {
    bloomAlpha: SETTINGS.bloom * lerp(0.35, 1, r),
    fogAlpha: SETTINGS.fog * lerp(0.5, 1, r) * 0.16,
    accentScale: lerp(0.55, 1, r),
  };
}

/** A fractional depth draws into its two neighbouring integer layers,
 *  cross-faded — a fork reads as *sinking*, a merge as *surfacing*. */
function layerSplit(zf: number) {
  const z = clamp(zf, 0, PLANES - 1);
  const lo = Math.floor(z);
  const hi = Math.min(PLANES - 1, lo + 1);
  return { lo, hi, wHi: z - lo };
}

/** Frame-rate independent chase that terminates exactly: layerSplit treats
 *  wHi === 0 as "wholly in one layer". */
const approach = (v: number, target: number, step: number) =>
  Math.abs(target - v) <= step ? target : v + Math.sign(target - v) * step;

/** Via ring alpha: quick pop in, slow quadratic decay. */
function viaAlpha(age: number, life: number) {
  if (age < 0 || age >= life) return 0;
  const t = age / life;
  return Math.min(1, age / 0.25) * (1 - t * t);
}

/** Atmospheric temperature: back planes cool toward slate. */
const COOL: Rgb = [110, 122, 146];
const coolShift = (rgb: Rgb, k: number): Rgb => [
  Math.round(lerp(rgb[0], COOL[0], k)),
  Math.round(lerp(rgb[1], COOL[1], k)),
  Math.round(lerp(rgb[2], COOL[2], k)),
];

/** Small deterministic PRNG for the seeded first composition. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Interior spawns are suppressed inside the hero copy's band so density
 *  lives in the margins. */
const BAND = { x0: 0.17, x1: 0.83, y0: 0.22, y1: 0.72 };
const spawnWeight = (fx: number, fy: number) =>
  fx > BAND.x0 && fx < BAND.x1 && fy > BAND.y0 && fy < BAND.y1 ? 0.25 : 1;

/* ------------------------------------------------------------------ */
/* engine                                                             */
/* ------------------------------------------------------------------ */

type Runner = {
  id: number;
  i: number;
  j: number;
  d: number;
  t: number;
  speed: number;
  speedMul: number;
  trail: Array<{ x: number; y: number }>;
  head: { x: number; y: number };
  maxTrail: number;
  age: number;
  ttl: number;
  fade: number;
  dying: boolean;
  accent: boolean;
  mass: number;
  z: number;
  zf: number;
  bright: number;
  target: Target | null;
  exiting: boolean;
};

type Target = {
  i: number;
  j: number;
  flash: number;
  lit: number;
  rings: Array<{ r: number; a: number }>;
  /** Lifecycle: fade in → live → (quota reached) fade out and retire. */
  state: "in" | "live" | "out";
  alpha: number;
  claims: number;
  region: number;
  slot: number;
};

type Via = {
  i: number;
  j: number;
  z: number;
  age: number;
  accent: boolean;
  kind: "via" | "pad";
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  accent: boolean;
  /** Spawn plane's scale, baked in so draw sites stay depth-correct. */
  ps: number;
};

type SceneEnv = {
  w: number;
  h: number;
  dpr: number;
  palette: Palette;
  pointer: { x: number; y: number; active: boolean };
  glowAccent: HTMLCanvasElement;
  glowNeutral: HTMLCanvasElement;
};

const DIRS: Array<[number, number]> = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

/** One Path2D per (tier, accent, fade-bucket, glow-bucket): the taper comes
 *  from a few fade buckets instead of a gradient per segment. */
const FADE_BUCKETS = 8;
const GLOW_BUCKETS = 4;
const glowBucket = (v: number) =>
  Math.min(GLOW_BUCKETS - 1, Math.max(0, Math.floor(v * GLOW_BUCKETS)));
const batchKey = (tier: number, accent: boolean, fb: number, gb: number) =>
  tier * 1000 + (accent ? 500 : 0) + fb * 10 + gb;

function makeGlowSprite(rgb: Rgb) {
  const s = 96;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const g = cv.getContext("2d")!;
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, rgba(rgb, 1));
  grd.addColorStop(0.22, rgba(rgb, 0.55));
  grd.addColorStop(0.55, rgba(rgb, 0.14));
  grd.addColorStop(1, rgba(rgb, 0));
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  return cv;
}

function createScene(env: SceneEnv, intro: boolean) {
  const cell = SETTINGS.cell;
  const cols = Math.floor(env.w / cell) + 1;
  const rows = Math.floor(env.h / cell) + 1;
  const ox = (env.w - (cols - 1) * cell) / 2;
  const oy = (env.h - (rows - 1) * cell) / 2;

  const px = (i: number) => ox + i * cell;
  const py = (j: number) => oy + j * cell;
  const inBounds = (i: number, j: number) =>
    i >= 0 && j >= 0 && i < cols && j < rows;
  /** Occupancy is per plane: crossing runners at different depths must not
   *  collide. */
  const occIdx = (i: number, j: number, z: number) =>
    z * cols * rows + j * cols + i;

  const occTime = new Float32Array(cols * rows * PLANES).fill(-1e9);
  const occOwner = new Int32Array(cols * rows * PLANES);

  let runners: Runner[] = [];
  let sparks: Spark[] = [];
  let vias: Via[] = [];
  let nextId = 1;
  let now = 0;
  let refillAcc = 0;

  // Intro envelope: 0 → 1 (cubic out) over the intro duration of LIVE
  // time. Presim advances the simulation, not this clock, so the first
  // painted frame is the sparse waking field and density grows on screen.
  // With intro off the clock starts at Infinity and the envelope is 1.
  let introClock = intro ? 0 : Infinity;
  const introE = () =>
    1 - Math.pow(1 - clamp(introClock / SETTINGS.intro.duration, 0, 1), 3);

  /* pads ------------------------------------------------------------ */
  let targets: Target[] = [];
  // Countdown per retired pad until its successor fades in.
  let padTimers: number[] = [];

  /** Spawn a pad at an unused slot, preferring a region with no active
   *  pad so attention migrates instead of piling up. `initial` pads
   *  arrive already live; successors fade in. */
  function spawnPad(initial: boolean) {
    const used = new Set(targets.map((t) => t.slot));
    const activeRegions = new Set(
      targets.filter((t) => t.state !== "out").map((t) => t.region),
    );
    const open = PAD_SLOTS.map((s, idx) => ({ s, idx })).filter(
      (c) => !used.has(c.idx),
    );
    if (!open.length) return;
    const fresh = open.filter((c) => !activeRegions.has(c.s.region));
    const pool = fresh.length ? fresh : open;
    const pick = pool[randInt(0, pool.length - 1)];
    targets.push({
      i: clamp(Math.round((env.w * pick.s.fx - ox) / cell), 1, cols - 2),
      j: clamp(Math.round((env.h * pick.s.fy - oy) / cell), 1, rows - 2),
      flash: 0,
      lit: 0,
      rings: [],
      state: initial ? "live" : "in",
      alpha: initial ? 1 : 0,
      claims: 0,
      region: pick.s.region,
      slot: pick.idx,
    });
  }

  /** Fresh pad set: one per region, random slot within it (this is where
   *  reload-to-reload variety comes from). */
  function seedPads() {
    targets = [];
    padTimers = [];
    for (let k = 0; k < SETTINGS.pads.count; k++) spawnPad(true);
  }
  seedPads();

  const livePads = () => targets.filter((t) => t.state !== "out");

  /* parallax camera -------------------------------------------------- */
  // Chases the pointer instead of tracking it raw, and fades activity in
  // and out, so entering or leaving the hero eases the planes over rather
  // than snapping them. Reduced-motion scenes never call update(), so
  // their still renders with the camera at rest.
  const par = { x: env.w / 2, y: env.h / 2, amt: 0 };

  function updateParallax(dt: number) {
    const ptr = env.pointer;
    const k = 1 - Math.exp(-dt * 6);
    if (ptr.active) {
      par.x += (ptr.x - par.x) * k;
      par.y += (ptr.y - par.y) * k;
    }
    par.amt += ((ptr.active ? 1 : 0) - par.amt) * k;
  }

  /** Composite offset for a plane at `scale`. Everything that belongs to
   *  a plane (layer, sparks, bloom halos) rides the same offset, or a
   *  pointer at the stage edge drags a trunk's glow off its own stroke. */
  function parAt(scale: number) {
    const amount = SETTINGS.parallax * par.amt;
    if (amount <= 0.001 || scale >= 1) return { dx: 0, dy: 0 };
    return {
      dx: parallaxShift(par.x, env.w / 2, amount, scale),
      dy: parallaxShift(par.y, env.h / 2, amount, scale),
    };
  }

  /* per-plane offscreen layers ------------------------------------- */
  // Front plane at full DPR; back planes at reduced resolution — the
  // upscale on composite IS the defocus.
  const layerCv: HTMLCanvasElement[] = [];
  const layerCtx: CanvasRenderingContext2D[] = [];
  const latticeCv: Array<HTMLCanvasElement | null> = [];
  for (let z = 0; z < PLANES; z++) {
    const res = LAYER_RES[z] * (z === 0 ? env.dpr : 1);
    const cv = document.createElement("canvas");
    cv.width = Math.max(1, Math.round(env.w * res));
    cv.height = Math.max(1, Math.round(env.h * res));
    layerCv.push(cv);
    layerCtx.push(cv.getContext("2d")!);
    latticeCv.push(null);
  }

  const bloomCv = document.createElement("canvas");
  bloomCv.width = Math.max(1, Math.round(env.w * 0.25));
  bloomCv.height = Math.max(1, Math.round(env.h * 0.25));
  const bloomCtx = bloomCv.getContext("2d")!;
  const bloomCv2 = document.createElement("canvas");
  bloomCv2.width = Math.max(1, Math.round(env.w * 0.125));
  bloomCv2.height = Math.max(1, Math.round(env.h * 0.125));
  const bloomCtx2 = bloomCv2.getContext("2d")!;

  /** The plane's scale-about-centre transform, shared by the lattice cache
   *  and the live layer draw so they can never disagree. */
  function applyPlaneTransform(g: CanvasRenderingContext2D, z: number) {
    const st = planeStyle(z);
    g.translate(env.w / 2, env.h / 2);
    g.scale(st.scale, st.scale);
    g.translate(-env.w / 2, -env.h / 2);
  }

  /** The substrate is static per plane: render once and blit. Overscan
   *  covers the wider world rect a scaled-down plane exposes, plus the
   *  few pixels the parallax offset slides into view (world-space, so
   *  24px comfortably covers the shipped range). */
  function buildLattice(z: number) {
    const res = LAYER_RES[z] * (z === 0 ? env.dpr : 1);
    const cv = document.createElement("canvas");
    cv.width = layerCv[z].width;
    cv.height = layerCv[z].height;
    const g = cv.getContext("2d")!;
    g.setTransform(res, 0, 0, res, 0, 0);
    applyPlaneTransform(g, z);
    const st = planeStyle(z);
    const depth = z / Math.max(1, PLANES - 1);
    const gridCol = coolShift(env.palette.grid, depth * 0.6);
    const mx = (env.w * (1 / st.scale - 1)) / 2 + 24;
    const my = (env.h * (1 / st.scale - 1)) / 2 + 24;
    const iPad = Math.ceil(mx / cell);
    const jPad = Math.ceil(my / cell);
    g.fillStyle = rgba(
      gridCol,
      lerp(0.032, 0.085, SETTINGS.restraint) * st.dim,
    );
    for (let j = -jPad; j < rows + jPad; j++)
      for (let i = -iPad; i < cols + iPad; i++)
        g.fillRect(px(i) - 0.6, py(j) - 0.6, 1.2, 1.2);
    latticeCv[z] = cv;
  }

  /** Moving a runner between planes must undo the depth speed falloff it
   *  already carries before applying the new one — this is the only writer
   *  of r.z, so the rescale can never desynchronize. */
  function setPlane(r: Runner, z: number) {
    const mul = planeStyle(z).speedMul;
    r.speed *= mul / r.speedMul;
    r.speedMul = mul;
    r.z = z;
  }

  function spawn(
    i: number,
    j: number,
    d: number,
    boosted = false,
  ): Runner | null {
    if (!inBounds(i, j)) return null;
    // Weight toward the front so the plane carrying the accent stays the
    // busiest and the back reads as distance rather than clutter. Boosted
    // (click) spawns always take the front plane: a back plane renders
    // scaled about the stage center, so a deep spawn would materialize
    // away from the click it answers.
    const roll = Math.random();
    const zPicked = boosted ? 0 : roll < 0.5 ? 0 : roll < 0.8 ? 1 : 2;
    // Depth drives color: accent lives at the front (boosted spawns are
    // front-plane, so always accent).
    const isAccent =
      boosted ||
      (zPicked === 0 &&
        Math.random() < SETTINGS.accentRatio * grade().accentScale);
    const pads = livePads();
    const tgt =
      pads.length && Math.random() < 0.75
        ? pads[randInt(0, pads.length - 1)]
        : null;
    const r: Runner = {
      id: nextId++,
      i,
      j,
      d,
      t: 0,
      speed: rand(0.78, 1.28) * SETTINGS.speed,
      speedMul: 1,
      trail: [{ x: px(i), y: py(j) }],
      head: { x: px(i), y: py(j) },
      maxTrail: SETTINGS.trail * rand(0.7, 1.3) * (boosted ? 1.3 : 1),
      age: 0,
      ttl: rand(9, 24) * (boosted ? 0.8 : 1),
      fade: 1,
      dying: false,
      accent: isAccent,
      mass: 1,
      z: 0,
      zf: 0,
      bright: boosted ? 1 : rand(0.6, 1),
      target: tgt,
      exiting: false,
    };
    setPlane(r, zPicked);
    r.zf = r.z;
    runners.push(r);
    return r;
  }

  // Both scale by the intro envelope: the field opens at a fraction of
  // its population and refills/forks its way up to the tuned density.
  const introDensity = () => lerp(SETTINGS.intro.density, 1, introE());
  const targetCount = () =>
    Math.round(lerp(4, 34, SETTINGS.restraint) * introDensity());
  /** Forking can only run away if it is allowed to; the cap is absolute. */
  const runnerCap = () =>
    Math.round(lerp(10, 90, SETTINGS.restraint) * introDensity());

  function spawnFromEdge() {
    for (let tries = 0; tries < 4; tries++) {
      const edge = randInt(0, 3);
      let i: number, j: number, d: number;
      if (edge === 0) {
        i = 0;
        j = randInt(0, rows - 1);
        d = 0;
      } else if (edge === 1) {
        i = cols - 1;
        j = randInt(0, rows - 1);
        d = 2;
      } else if (edge === 2) {
        i = randInt(0, cols - 1);
        j = 0;
        d = 1;
      } else {
        i = randInt(0, cols - 1);
        j = rows - 1;
        d = 3;
      }
      // Bias entries toward the margins so refills keep the copy band clear.
      if (Math.random() <= spawnWeight(px(i) / env.w, py(j) / env.h)) {
        spawn(i, j, d);
        return;
      }
    }
  }

  /** Deterministic opening composition per stage size: the t=0 frame is
   *  designed, not rolled. Live spawns after this stay Math.random. */
  function seed() {
    const rng = mulberry32(cols * 7919 + rows * 104729);
    for (let k = 0; k < targetCount(); k++) {
      let i = 0;
      let j = 0;
      let tries = 0;
      do {
        i = 1 + Math.floor(rng() * (cols - 2));
        j = 1 + Math.floor(rng() * (rows - 2));
      } while (
        rng() > spawnWeight(px(i) / env.w, py(j) / env.h) &&
        ++tries < 8
      );
      const r = spawn(i, j, Math.floor(rng() * 4));
      if (r) r.age = rng() * 4;
    }
  }

  /** Spark coordinates convert to the plane's scale at spawn so a
   *  back-plane collision sparks on top of the trails that caused it. */
  function burst(
    x: number,
    y: number,
    n: number,
    strength: number,
    accent: boolean,
    z: number,
  ) {
    const scale = planeStyle(z).scale;
    const sx = scale === 1 ? x : env.w / 2 + (x - env.w / 2) * scale;
    const sy = scale === 1 ? y : env.h / 2 + (y - env.h / 2) * scale;
    for (let k = 0; k < n; k++) {
      const a = rand(0, Math.PI * 2);
      const s = rand(20, 95) * strength;
      sparks.push({
        x: sx,
        y: sy,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 1,
        decay: rand(1.4, 3),
        accent,
        ps: scale,
      });
    }
  }

  function chooseDir(r: Runner) {
    const straight = r.d;
    const left = (r.d + 3) % 4;
    const right = (r.d + 1) % 4;
    const turnW = (1 - SETTINGS.turnBias) / 2;
    const base: Array<[number, number]> = [
      [straight, SETTINGS.turnBias],
      [left, turnW],
      [right, turnW],
    ];
    const ptr = env.pointer;
    const opts: Array<[number, number]> = [];

    for (const [d, w0] of base) {
      const ni = r.i + DIRS[d][0];
      const nj = r.j + DIRS[d][1];
      let w = w0;

      if (inBounds(ni, nj)) {
        // Only this runner's own plane counts as busy.
        const idx = occIdx(ni, nj, r.z);
        if (occOwner[idx] !== r.id && now - occTime[idx] < 0.5) w *= 0.05;
      }

      // Head for an assigned endpoint, without going fully deterministic.
      if (r.target) {
        const di = r.target.i - r.i;
        const dj = r.target.j - r.j;
        const toward = DIRS[d][0] * Math.sign(di) + DIRS[d][1] * Math.sign(dj);
        if (toward > 0) w *= 3.2;
        else if (toward < 0) w *= 0.25;
      }

      // Pointer attract: weight directions that close the distance.
      if (ptr.active) {
        const cx = px(r.i);
        const cy = py(r.j);
        const dist = Math.hypot(ptr.x - cx, ptr.y - cy);
        const R = SETTINGS.pointerRadius;
        if (dist < R) {
          const away =
            ((cx - ptr.x) * DIRS[d][0] + (cy - ptr.y) * DIRS[d][1]) /
            (dist || 1);
          const force = (1 - dist / R) * SETTINGS.pointerForce * -1;
          w *= Math.max(0.05, 1 + away * force);
        }
      }

      opts.push([d, w]);
    }

    const total = opts.reduce((s, o) => s + o[1], 0);
    if (total < 0.06 * SETTINGS.turnBias) return -1;
    let roll = Math.random() * total;
    for (const [d, w] of opts) {
      roll -= w;
      if (roll <= 0) return d;
    }
    return opts[0][0];
  }

  function trimTrail(r: Runner) {
    let len = Math.hypot(
      r.head.x - r.trail[r.trail.length - 1].x,
      r.head.y - r.trail[r.trail.length - 1].y,
    );
    let cut = -1;
    for (let k = r.trail.length - 1; k > 0; k--) {
      const seg = Math.hypot(
        r.trail[k].x - r.trail[k - 1].x,
        r.trail[k].y - r.trail[k - 1].y,
      );
      if (len + seg > r.maxTrail) {
        const remain = Math.max(0, r.maxTrail - len);
        const f = seg > 0 ? remain / seg : 0;
        r.trail[k - 1] = {
          x: lerp(r.trail[k].x, r.trail[k - 1].x, f),
          y: lerp(r.trail[k].y, r.trail[k - 1].y, f),
        };
        cut = k - 1;
        break;
      }
      len += seg;
    }
    if (cut > 0) r.trail = r.trail.slice(cut);
  }

  function trailLength(r: Runner) {
    let len = 0;
    for (let k = r.trail.length - 1; k > 0; k--) {
      len += Math.hypot(
        r.trail[k].x - r.trail[k - 1].x,
        r.trail[k].y - r.trail[k - 1].y,
      );
    }
    return (
      len +
      Math.hypot(
        r.head.x - r.trail[r.trail.length - 1].x,
        r.head.y - r.trail[r.trail.length - 1].y,
      )
    );
  }

  function arriveAt(r: Runner, ni: number, nj: number) {
    const t = r.target;
    if (!t || t.i !== ni || t.j !== nj) return false;
    // A retiring pad takes no more claims; the seeker wanders on.
    if (t.state === "out") {
      r.target = null;
      return false;
    }
    // Arrival is earned: only a front-plane runner that has converged
    // enough to clear the mass gate can claim a pad.
    if (!canClaim(r.z, r.mass)) return false;
    t.flash = 1;
    t.lit = 1;
    t.rings.push({ r: 3, a: 0.9 });
    burst(px(ni), py(nj), 10, 0.85, r.accent, r.z);
    r.dying = true;
    // Quota reached: the pad is done. A brighter ring cascade signals
    // completion, the pad fades out, and everyone still heading here is
    // released to wander (documented safe — they just keep going).
    t.claims += 1;
    if (t.claims >= SETTINGS.pads.quota) {
      t.state = "out";
      t.rings.push({ r: 8, a: 0.8 }, { r: 16, a: 0.6 });
      for (const o of runners) if (o.target === t) o.target = null;
    }
    return true;
  }

  function advanceCell(r: Runner) {
    const ni = r.i + DIRS[r.d][0];
    const nj = r.j + DIRS[r.d][1];

    if (!inBounds(ni, nj)) {
      r.exiting = true;
      r.dying = true;
      return;
    }

    const idx = occIdx(ni, nj, r.z);
    if (occOwner[idx] !== r.id && now - occTime[idx] < SETTINGS.mergeWindow) {
      const other = runners.find((o) => o.id === occOwner[idx]);
      if (other && !other.dying) {
        // Head-on meetings still annihilate; everything else converges.
        // Without the exception, a merged survivor would immediately
        // reverse into its own trail.
        const headOn = (other.d + 2) % 4 === r.d;
        if (!headOn) {
          other.mass = mergeMass(other.mass, r.mass);
          const zOld = other.z;
          const zNew = mergePlane(other.z, r.z);
          if (zNew !== zOld) {
            setPlane(other, zNew);
            // Surface visibly from the depth the meeting happened at.
            vias.push({
              i: ni,
              j: nj,
              z: zOld,
              age: 0,
              accent: other.accent,
              kind: "via",
            });
          }
          // Resolve the plane before the accent gate so it reads the
          // survivor's final plane, not the one it merged from.
          if (other.z === 0) other.accent = other.accent || r.accent;
          other.bright = 1;
          if (!other.target && r.target) other.target = r.target;
          burst(px(ni), py(nj), 9, 0.8, other.accent, r.z);
          r.dying = true;
          return;
        }
      }
      burst(px(ni), py(nj), 12, 1, r.accent, r.z);
      r.dying = true;
      if (other && !other.dying) other.dying = true;
      return;
    }

    r.i = ni;
    r.j = nj;
    occTime[idx] = now;
    occOwner[idx] = r.id;
    r.trail.push({ x: px(ni), y: py(nj) });

    if (arriveAt(r, ni, nj)) return;

    if (
      runners.length < runnerCap() &&
      r.mass > 0.06 &&
      Math.random() < SETTINGS.forkRate
    ) {
      // The child leaves perpendicular, so the split is legible as a
      // branch rather than a wobble.
      const childDir = (r.d + (Math.random() < 0.5 ? 1 : 3)) % 4;
      const child = spawn(ni, nj, childDir);
      if (child) {
        // Debit the parent only once the child is confirmed to exist.
        const [pm, cm] = forkMasses(r.mass);
        r.mass = pm;
        child.mass = cm;
        const childZ = forkChildPlane(r.z, Math.random() < SETTINGS.forkDrop);
        setPlane(child, childZ);
        // The child is born AT the parent's depth and visibly sinks.
        child.zf = r.z;
        if (child.z !== r.z)
          vias.push({
            i: ni,
            j: nj,
            z: r.z,
            age: 0,
            accent: r.accent,
            kind: "via",
          });
        child.accent = child.z === 0 ? r.accent : false;
        child.target = r.target;
        burst(px(ni), py(nj), 4, 0.45, child.accent, r.z);
      }
    }

    if (r.age > r.ttl) {
      r.dying = true;
      return;
    }

    const nd = chooseDir(r);
    if (nd < 0) {
      burst(px(ni), py(nj), 8, 0.8, r.accent, r.z);
      r.dying = true;
      return;
    }
    if (nd !== r.d && massTier(r.mass) >= 4)
      vias.push({
        i: ni,
        j: nj,
        z: r.z,
        age: 0,
        accent: r.accent,
        kind: "pad",
      });
    r.d = nd;
  }

  /** One raw simulation step. Public callers go through update(), which
   *  applies the intro time-scale; presim calls this directly so its
   *  simulated seconds are real seconds. */
  function step(dt: number) {
    now += dt;

    const deficit = targetCount() - runners.filter((r) => !r.dying).length;
    if (deficit > 0) {
      refillAcc += dt * deficit * 1.4;
      while (refillAcc >= 1) {
        refillAcc -= 1;
        spawnFromEdge();
      }
    } else refillAcc = 0;

    for (const r of runners) {
      r.age += dt;

      // Render depth chases law depth: zEase seconds per plane of travel;
      // approach() terminates exactly so settled runners draw into a
      // single layer with no residual cross-fade.
      r.zf = approach(r.zf, r.z, dt / Math.max(0.05, SETTINGS.zEase));

      // Dying trails fade in place — the alpha ramp alone clears them in
      // ~0.5s, well under any visible lingering.
      if (r.dying) {
        r.fade -= dt * 1.9;
        continue;
      }

      r.t += (r.speed * dt) / cell;
      let guard = 0;
      while (r.t >= 1 && !r.dying && guard++ < 4) {
        r.t -= 1;
        advanceCell(r);
      }

      const f = clamp(r.t, 0, 1);
      r.head = {
        x: px(r.i) + DIRS[r.d][0] * cell * f,
        y: py(r.j) + DIRS[r.d][1] * cell * f,
      };
      if (r.exiting) {
        r.head.x += DIRS[r.d][0] * cell;
        r.head.y += DIRS[r.d][1] * cell;
      }
      trimTrail(r);
    }

    runners = runners.filter(
      (r) => r.fade > 0 && (r.trail.length > 1 || !r.dying),
    );

    for (const s of sparks) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vx *= 1 - dt * 2.4;
      s.vy *= 1 - dt * 2.4;
      s.life -= dt * s.decay;
    }
    sparks = sparks.filter((s) => s.life > 0);

    for (const t of targets) {
      t.flash = Math.max(0, t.flash - dt * 1.6);
      t.lit = Math.max(0, t.lit - dt * 0.125);
      for (const ring of t.rings) {
        ring.r += dt * 54;
        ring.a -= dt * 1.3;
      }
      t.rings = t.rings.filter((ring) => ring.a > 0);

      if (t.state === "in") {
        t.alpha = Math.min(1, t.alpha + dt / SETTINGS.pads.fadeIn);
        if (t.alpha >= 1) t.state = "live";
      } else if (t.state === "out") {
        t.alpha = Math.max(0, t.alpha - dt / SETTINGS.pads.fadeOut);
      }
    }
    // Retired pads leave once fully faded; each schedules a successor.
    const gone = targets.filter((t) => t.state === "out" && t.alpha <= 0);
    if (gone.length) {
      targets = targets.filter((t) => !(t.state === "out" && t.alpha <= 0));
      for (let k = 0; k < gone.length; k++)
        padTimers.push(SETTINGS.pads.respawnDelay);
    }
    if (padTimers.length) {
      padTimers = padTimers.map((v) => v - dt);
      const due = padTimers.filter((v) => v <= 0).length;
      padTimers = padTimers.filter((v) => v > 0);
      for (let k = 0; k < due; k++) spawnPad(false);
    }

    for (const v of vias) v.age += dt;
    vias = vias.filter((v) => v.age < SETTINGS.viaLife);
    if (vias.length > 80) vias = vias.slice(vias.length - 80);
  }

  /** Advance the field by dt real seconds. During the intro the
   *  simulation runs slowed — the scene surfaces rather than switching
   *  on — easing to full speed as the envelope completes. */
  function update(dt: number) {
    introClock += dt;
    // The camera chase runs on real time — the intro slows the field, not
    // the pointer response.
    updateParallax(dt);
    step(dt * lerp(SETTINGS.intro.timeScale, 1, introE()));
  }

  /* draw ------------------------------------------------------------ */

  function drawPlaneContent(lctx: CanvasRenderingContext2D, z: number) {
    const pal = env.palette;
    const baseA = lerp(0.55, 1, SETTINGS.restraint);
    const st = planeStyle(z);
    const planeA = baseA * st.dim;
    // Atmospheric temperature: neutrals cool toward slate with depth.
    // Accent is front-plane-only by the law, so it is never cooled.
    const neutral = coolShift(pal.neutral, (z / Math.max(1, PLANES - 1)) * 0.6);
    const colFor = (r: Runner) => (r.accent ? pal.accent : neutral);

    // Endpoints belong to the field as a whole; they ride the front plane.
    if (z === 0) {
      for (const t of targets) {
        const x = px(t.i);
        const y = py(t.j);
        const heat = Math.max(t.flash, t.lit * 0.55);
        // The pad's lifecycle alpha scales the socket, not the rings —
        // the done cascade stays visible while its pad fades under it.
        // Idle glow always renders, even unlit, so terminals read as
        // sockets rather than only lighting up on contact.
        lctx.globalCompositeOperation = pal.dark ? "lighter" : "source-over";
        lctx.globalAlpha = (0.12 + heat * 0.6) * t.alpha;
        lctx.drawImage(env.glowAccent, x - 20, y - 20, 40, 40);
        lctx.globalAlpha = 1;
        lctx.globalCompositeOperation = "source-over";
        lctx.strokeStyle = rgba(
          heat > 0.05 ? pal.accent : pal.dim,
          (0.5 + heat * 0.45) * baseA * t.alpha,
        );
        lctx.lineWidth = 1;
        lctx.strokeRect(x - 6, y - 6, 12, 12);
        lctx.strokeRect(x - 4, y - 4, 8, 8);
        lctx.fillStyle = rgba(
          heat > 0.05 ? pal.accent : pal.dim,
          (0.2 + heat * 0.7) * baseA * t.alpha,
        );
        lctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        for (const ring of t.rings) {
          lctx.strokeStyle = rgba(pal.accent, clamp(ring.a, 0, 1) * 0.5);
          lctx.beginPath();
          lctx.arc(x, y, ring.r, 0, Math.PI * 2);
          lctx.stroke();
        }
      }
    }

    /* trails --------------------------------------------------------- */
    lctx.lineCap = "round";
    lctx.lineJoin = "round";

    const batches = new Map<
      number,
      { path: Path2D; tier: number; accent: boolean; fb: number; gb: number }
    >();
    const addSeg = (
      tier: number,
      accent: boolean,
      fb: number,
      gb: number,
      a0: { x: number; y: number },
      a1: { x: number; y: number },
    ) => {
      const key = batchKey(tier, accent, fb, gb);
      let b = batches.get(key);
      if (!b) {
        b = { path: new Path2D(), tier, accent, fb, gb };
        batches.set(key, b);
      }
      b.path.moveTo(a0.x, a0.y);
      b.path.lineTo(a1.x, a1.y);
    };

    for (const r of runners) {
      const split = layerSplit(r.zf);
      let zAlpha: number;
      if (split.lo === z) zAlpha = 1 - split.wHi;
      else if (split.hi === z && split.wHi > 0) zAlpha = split.wHi;
      else continue;
      const pts = r.trail.concat([r.head]);
      if (pts.length < 2) continue;
      const total = Math.max(1, trailLength(r));

      const tier = massTier(r.mass);
      const gb = glowBucket(r.bright * r.fade * zAlpha);
      let acc = 0;
      for (let k = 0; k < pts.length - 1; k++) {
        const a0 = pts[k];
        const a1 = pts[k + 1];
        const seg = Math.hypot(a1.x - a0.x, a1.y - a0.y);
        if (seg < 0.01) continue;
        const f = (acc + seg / 2) / total;
        const fb = Math.min(FADE_BUCKETS - 1, Math.floor(f * FADE_BUCKETS));
        addSeg(tier, r.accent, fb, gb, a0, a1);
        acc += seg;
      }

      if (!r.dying) {
        const dimF = r.accent ? 1 : 0.62;
        if (SETTINGS.headGlow > 0.01) {
          lctx.globalCompositeOperation = pal.dark ? "lighter" : "source-over";
          const rr = 13 * lerp(0.8, 1.15, SETTINGS.restraint);
          lctx.globalAlpha =
            0.5 * r.bright * planeA * SETTINGS.headGlow * dimF * zAlpha;
          lctx.drawImage(
            r.accent ? env.glowAccent : env.glowNeutral,
            r.head.x - rr,
            r.head.y - rr,
            rr * 2,
            rr * 2,
          );
          lctx.globalAlpha = 1;
          lctx.globalCompositeOperation = "source-over";
        }
        lctx.fillStyle = rgba(
          r.accent ? (pal.dark ? pal.hot : pal.accent) : colFor(r),
          0.95 * planeA * dimF * zAlpha,
        );
        lctx.beginPath();
        lctx.arc(r.head.x, r.head.y, 1.7, 0, Math.PI * 2);
        lctx.fill();
      }
    }

    // Stroke each ribbon batch once: discrete fade steps stand in for the
    // per-segment gradient taper, glow steps for per-runner brightness.
    for (const b of batches.values()) {
      const col = b.accent ? pal.accent : neutral;
      const dimF = b.accent ? 1 : 0.62;
      // Bucket midpoints, not upper edges — an upper-edge representative
      // biases every quantized value bright. Exponent and 0.85 are the
      // measured originals; changing them changes total ink.
      const fade = (b.fb + 0.5) / FADE_BUCKETS;
      const glow = (b.gb + 0.5) / GLOW_BUCKETS;
      lctx.strokeStyle = rgba(
        col,
        Math.pow(fade, 1.6) * planeA * dimF * glow * 0.85,
      );
      lctx.lineWidth = traceWidth(b.tier);
      lctx.lineCap = "round";
      lctx.stroke(b.path);
      if (b.tier >= 4) {
        // Trunks carry a bright core inside the wide stroke — the "lit
        // conductor" read that makes mass legible at a glance.
        lctx.strokeStyle = rgba(
          b.accent ? pal.hot : neutral,
          Math.pow(fade, 1.6) * planeA * glow * 0.5,
        );
        lctx.lineWidth = 1.2;
        lctx.stroke(b.path);
      }
    }

    /* via rings: fork/merge events mark the board -------------------- */
    for (const v of vias) {
      if (v.z !== z) continue;
      const a = viaAlpha(v.age, SETTINGS.viaLife);
      if (a <= 0.01) continue;
      if (v.kind === "pad") {
        lctx.fillStyle = rgba(
          v.accent ? pal.accent : pal.dim,
          a * 0.5 * st.dim * baseA,
        );
        lctx.fillRect(px(v.i) - 2, py(v.j) - 2, 4, 4);
        continue;
      }
      lctx.strokeStyle = rgba(
        v.accent ? pal.accent : pal.dim,
        a * 0.55 * st.dim * baseA,
      );
      lctx.lineWidth = 1;
      lctx.beginPath();
      lctx.arc(px(v.i), py(v.j), 3.2, 0, Math.PI * 2);
      lctx.stroke();
      lctx.fillStyle = rgba(
        v.accent ? pal.accent : pal.dim,
        a * 0.3 * st.dim * baseA,
      );
      lctx.beginPath();
      lctx.arc(px(v.i), py(v.j), 1.1, 0, Math.PI * 2);
      lctx.fill();
    }
  }

  /** Everything that should glow, drawn once into the ¼-res buffer in
   *  plain stage coordinates. Blur comes free from the two resamples. */
  function drawBrightPass(bctx: CanvasRenderingContext2D) {
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.clearRect(0, 0, bloomCv.width, bloomCv.height);
    bctx.setTransform(0.25, 0, 0, 0.25, 0, 0);

    for (const r of runners) {
      if (r.dying) continue;
      // Depth is continuous (zf), so bloom samples it continuously —
      // keying off the integer plane made alpha and halo size pop.
      const zc = clamp(r.zf, 0, PLANES - 1);
      const frontness = 1 - zc / Math.max(1, PLANES - 1);
      const tier = massTier(r.mass);
      // Signal heads: accent always, neutral only when heavy.
      if (!r.accent && tier < 4) continue;
      const scale = 1 / (1 + 0.5 * (zc / (PLANES - 1)) * SETTINGS.planeSpread);
      // Halos ride the same composite parallax as the layer their trace
      // lives on, or a pointer at the stage edge drags a trunk's glow off
      // its own stroke. Zero at the front plane (scale 1).
      const hp = parAt(scale);
      const sx = env.w / 2 + (r.head.x - env.w / 2) * scale + hp.dx;
      const sy = env.h / 2 + (r.head.y - env.h / 2) * scale + hp.dy;
      bctx.globalAlpha = 0.7 * r.bright * frontness;
      // The halo is projected geometry like everything else: a head one
      // plane back glows smaller, not just dimmer.
      const rr = (r.accent ? 14 : 9) * scale;
      bctx.drawImage(
        r.accent ? env.glowAccent : env.glowNeutral,
        sx - rr,
        sy - rr,
        rr * 2,
        rr * 2,
      );
    }

    for (const t of targets) {
      const heat = Math.max(t.flash, t.lit * 0.55) * t.alpha;
      if (heat < 0.05) continue;
      bctx.globalAlpha = heat;
      bctx.drawImage(env.glowAccent, px(t.i) - 22, py(t.j) - 22, 44, 44);
    }

    // Fresh vias flare briefly, at their plane's scale.
    for (const v of vias) {
      if (v.age > 1.2 || !v.accent) continue;
      bctx.globalAlpha = (1 - v.age / 1.2) * 0.6;
      const vs = planeStyle(v.z).scale;
      const vp = parAt(vs);
      const vx = env.w / 2 + (px(v.i) - env.w / 2) * vs + vp.dx;
      const vy = env.h / 2 + (py(v.j) - env.h / 2) * vs + vp.dy;
      const vr = 10 * vs;
      bctx.drawImage(env.glowAccent, vx - vr, vy - vr, vr * 2, vr * 2);
    }

    for (const s of sparks) {
      bctx.globalAlpha = clamp(s.life, 0, 1) * 0.6;
      const sr = 8 * s.ps;
      const sp = parAt(s.ps);
      bctx.drawImage(
        s.accent ? env.glowAccent : env.glowNeutral,
        s.x + sp.dx - sr,
        s.y + sp.dy - sr,
        sr * 2,
        sr * 2,
      );
    }
    bctx.globalAlpha = 1;
  }

  function draw(ctx: CanvasRenderingContext2D) {
    const pal = env.palette;
    const baseA = lerp(0.55, 1, SETTINGS.restraint);
    const gr = grade();
    const introInk = lerp(SETTINGS.intro.ink, 1, introE());

    // Each plane paints into its own offscreen layer, then composites
    // back to front with fog between slices. Back layers are allocated
    // below full resolution, so the upscale on composite is a real
    // resample blur — that is the defocus.
    for (let z = PLANES - 1; z >= 0; z--) {
      const res = LAYER_RES[z] * (z === 0 ? env.dpr : 1);
      const lctx = layerCtx[z];
      lctx.setTransform(1, 0, 0, 1, 0, 0);
      lctx.clearRect(0, 0, layerCv[z].width, layerCv[z].height);
      lctx.setTransform(res, 0, 0, res, 0, 0);
      if (!latticeCv[z]) buildLattice(z);
      lctx.drawImage(latticeCv[z]!, 0, 0, env.w, env.h);
      lctx.save();
      applyPlaneTransform(lctx, z);
      drawPlaneContent(lctx, z);
      lctx.restore();

      // Parallax rides the composite offset so the whole layer (lattice
      // included) moves and the front plane stays anchored under the copy.
      const { dx, dy } = parAt(planeStyle(z).scale);

      // Intro ink: the whole field brightens as it wakes. Layers, sparks,
      // and bloom all ride the same envelope, so the first runners emerge
      // dim and the shine develops with the population. 1 outside the
      // intro (and always 1 for reduced-motion scenes).
      ctx.globalAlpha = introInk;
      ctx.drawImage(layerCv[z], dx, dy, env.w, env.h);
      ctx.globalAlpha = 1;

      // Fog accumulates over depth: each slice fades everything already
      // composited toward the background before the nearer slice draws —
      // atmospheric perspective, not dimming.
      if (z > 0 && gr.fogAlpha > 0) {
        ctx.fillStyle = rgba(pal.bg, gr.fogAlpha);
        ctx.fillRect(0, 0, env.w, env.h);
      }
    }

    /* sparks ---------------------------------------------------------- */
    ctx.globalCompositeOperation = pal.dark ? "lighter" : "source-over";
    for (const s of sparks) {
      ctx.globalAlpha = clamp(s.life, 0, 1) * 0.75 * baseA * introInk;
      const rr = 7 * s.ps;
      // A burst belongs to a plane; it shifts with that plane's composite.
      const sp = parAt(s.ps);
      ctx.drawImage(
        s.accent ? env.glowAccent : env.glowNeutral,
        s.x + sp.dx - rr,
        s.y + sp.dy - rr,
        rr * 2,
        rr * 2,
      );
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    /* bloom ------------------------------------------------------------ */
    if (gr.bloomAlpha > 0.01) {
      drawBrightPass(bloomCtx);
      // Two resamples ≈ a cheap gaussian: ¼ → ⅛ → composite at full.
      bloomCtx2.setTransform(1, 0, 0, 1, 0, 0);
      bloomCtx2.clearRect(0, 0, bloomCv2.width, bloomCv2.height);
      bloomCtx2.drawImage(bloomCv, 0, 0, bloomCv2.width, bloomCv2.height);
      // Additive bloom dies on white: the light theme composites the same
      // buffer as soft colored halos instead.
      ctx.globalCompositeOperation = pal.dark ? "lighter" : "source-over";
      ctx.globalAlpha = gr.bloomAlpha * (pal.dark ? 1 : 0.35) * introInk;
      ctx.drawImage(bloomCv2, 0, 0, env.w, env.h);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
  }

  /** Advance the law before first paint so t=0 is a composed image —
   *  trails mid-flight, maybe a via or two — rather than a grid warming
   *  up. Uses raw steps: the intro clock stays at zero, so an intro
   *  scene presims the sparse waking field and wakes up on screen.
   *  Sparks are cleared so the frame doesn't open on an explosion. */
  function presim(seconds: number) {
    const dt = 1 / 60;
    for (let t = 0; t < seconds; t += dt) step(dt);
    sparks = [];
    // The presim may have partially claimed or even retired pads; a
    // visitor should land on a steady board, not mid-retirement (and the
    // reduced-motion still must show pads at their idle state). Reseed
    // the pad set and repoint in-flight seekers at the new pads.
    seedPads();
    for (const r of runners) {
      r.target =
        targets.length && Math.random() < 0.75
          ? targets[randInt(0, targets.length - 1)]
          : null;
    }
  }

  /** Click seeds a hand of boosted runners at the nearest node — one per
   *  direction, front-plane, always accent, brighter and longer-trailed
   *  but shorter-lived — plus a burst, so the field answers the tap
   *  exactly where it lands. */
  function click(x: number, y: number) {
    const i = clamp(Math.round((x - ox) / cell), 0, cols - 1);
    const j = clamp(Math.round((y - oy) / cell), 0, rows - 1);
    for (let d = 0; d < 4; d++) spawn(i, j, d, true);
    burst(px(i), py(j), 16, 1.2, true, 0);
  }

  seed();

  return { update, draw, presim, click };
}

type Scene = ReturnType<typeof createScene>;

/* ------------------------------------------------------------------ */
/* React shell                                                        */
/* ------------------------------------------------------------------ */

function debounce<T extends (...args: never[]) => void>(fn: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = undefined;
  };
  return debounced;
}

/** Resolve the page surface for the fog fills: fog must fade toward the
 *  real background or the back planes tint the hero. */
function resolveSurfaceRgb(fallback: Rgb): Rgb {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--tgph-surface-1")
    .trim();
  if (!raw) return fallback;
  const hex = raw.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const fn = raw.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (fn) return [Number(fn[1]), Number(fn[2]), Number(fn[3])];
  return fallback;
}

type AnimatedAgentRunsProps = {
  /** Fires once, after the first frame is drawn. The agents hero uses it
   *  to start its copy animation from the same moment the field appears. */
  onReady?: () => void;
};

/**
 * Animated hero background: layered lattice runners with depth-of-field.
 * Clicking the hero seeds boosted runners at the nearest node. Adapts to
 * light/dark appearance, pauses offscreen, honors prefers-reduced-motion
 * by rendering a single pre-simulated frame (no click, no parallax).
 */
export const AnimatedAgentRuns = ({ onReady }: AnimatedAgentRunsProps = {}) => {
  const { appearance } = useTheme();
  const themeKey = appearance === "dark" ? "dark" : "light";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<SceneEnv | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const animationFrameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const hasIntroducedRef = useRef(false);
  const hasReportedReadyRef = useRef(false);

  // Held in a ref so a caller passing an inline callback can't retrigger
  // the scene-building effect below.
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Size canvas to wrapper; a real resize rebuilds the scene
  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !wrapper) return;

      const { width, height } = wrapper.getBoundingClientRect();
      if (!width || !height) return;
      setDimensions((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
      setIsInitialized(true);
    };

    const debouncedUpdate = debounce(updateDimensions, 250);

    // Measure right away rather than waiting on `load`: the wrapper is
    // already laid out, and waiting made the field's start time depend on
    // network speed, which the hero copy now synchronizes against. The
    // load listener stays as a re-measure for late layout shifts.
    updateDimensions();
    if (document.readyState !== "complete") {
      window.addEventListener("load", updateDimensions);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === wrapperRef.current) {
          debouncedUpdate();
        }
      }
    });

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      window.removeEventListener("load", updateDimensions);
      resizeObserver.disconnect();
      debouncedUpdate.cancel();
    };
  }, []);

  // Track pointer relative to the canvas for the attract bias
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      const env = envRef.current;
      if (!canvas || !env) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      env.pointer.x = x;
      env.pointer.y = y;
      env.pointer.active = inside;
    };

    const handleMouseLeave = () => {
      const env = envRef.current;
      if (env) env.pointer.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Pause the loop when the hero leaves the viewport
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "50px" },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // Build the scene and run the loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensions.width || !dimensions.height || !isVisible) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(dimensions.width * dpr);
    canvas.height = Math.round(dimensions.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const palette: Palette = {
      ...PALETTES[themeKey],
      bg: resolveSurfaceRgb(PALETTES[themeKey].bg),
    };
    const env: SceneEnv = {
      w: dimensions.width,
      h: dimensions.height,
      dpr,
      palette,
      pointer: { x: 0, y: 0, active: false },
      glowAccent: makeGlowSprite(palette.accent),
      glowNeutral: makeGlowSprite(palette.neutral),
    };
    envRef.current = env;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // The wake-up intro plays once per page visit: a rebuild from a
    // resize, theme switch, or scroll-return respawns the field at full
    // density instead of replaying it. Reduced motion always skips it —
    // its single still should be the complete field.
    const intro = !reducedMotion && !hasIntroducedRef.current;
    hasIntroducedRef.current = true;

    const scene = createScene(env, intro);
    scene.presim(SETTINGS.presim);
    sceneRef.current = scene;

    ctx.clearRect(0, 0, env.w, env.h);
    scene.draw(ctx);

    // First frame is on screen. Rebuilds (resize, theme, scroll-return)
    // must not re-announce — the gate only opens once per page visit.
    if (!hasReportedReadyRef.current) {
      hasReportedReadyRef.current = true;
      onReadyRef.current?.();
    }

    if (reducedMotion) {
      // The presim frame is the whole experience: a composed still.
      return;
    }

    // Click-to-spawn: the wrapper is pointer-events: none so the copy
    // stays interactive; listen at the window and map into canvas space.
    // Clicks on links still land — the spawn is a side effect, not a
    // capture. "click" rather than "pointerdown" so touch scroll gestures
    // through the hero never fire; the target-containment guard keeps
    // clicks on overlaying chrome (the sticky masthead once scrolled over
    // the hero) from spawning through it — a rect test alone can't tell
    // those apart.
    const handleClick = (e: MouseEvent) => {
      const wrapper = wrapperRef.current;
      const section = wrapper?.parentElement;
      if (!section || !(e.target instanceof Node)) return;
      if (!section.contains(e.target)) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      scene.click(x, y);
    };
    window.addEventListener("click", handleClick);

    lastTimeRef.current = 0;
    const animate = (timestamp: number) => {
      if (!canvasRef.current) return;
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      // Clamp dt so a background-tab pause doesn't teleport the field.
      const dt =
        Math.min(0.05, (timestamp - lastTimeRef.current) / 1000) || 0.016;
      lastTimeRef.current = timestamp;

      ctx.clearRect(0, 0, env.w, env.h);
      scene.update(dt);
      scene.draw(ctx);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("click", handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions.width, dimensions.height, isVisible, themeKey]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          opacity: isInitialized ? 1 : 0,
          // Same curve and family of duration as the hero copy's entrance
          // (see .hero-rise in global.css) so the two read as one motion.
          // The delay puts the field second: the copy lands, then the
          // lattice blooms up behind it.
          transition: "opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1) 450ms",
          // Soft bottom fade into the page surface behind the hero
          maskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
      />
    </div>
  );
};
