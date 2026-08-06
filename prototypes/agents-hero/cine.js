/* Pure arithmetic of the round-4 cinematic renderer. No DOM, no state.
   Loaded as a classic script in the browser (window.HeroCine) and via
   require() in node --test. Must never become an ES module: file://
   blocks module loading. */
const HeroCine = (function () {
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  // A fractional depth draws into its two neighbouring integer layers,
  // cross-faded — that is what makes a fork read as *sinking* and a merge
  // as *surfacing* instead of a one-frame state swap.
  function layerSplit(zf, planes) {
    const z = clamp(zf, 0, planes - 1);
    const lo = Math.floor(z);
    const hi = Math.min(planes - 1, lo + 1);
    return { lo, hi, wHi: z - lo };
  }

  // Frame-rate independent chase that terminates: exact arrival matters
  // because layerSplit treats wHi === 0 as "wholly in one layer".
  const approach = (v, target, step) =>
    Math.abs(target - v) <= step ? target : v + Math.sign(target - v) * step;

  // Mass tier -> stroke px. Tiers come from HeroLaw.massTier: 0-1 are
  // fork hairlines, 2 light branches, 3 the unmerged baseline (mass 1),
  // 4 merged trunks. Round 3's sub-pixel width curve is what this ladder
  // replaces; the values are the spec's "roughly 1 / 1.6 / 2.6 / 4".
  const TRACE_WIDTHS = [1, 1, 1.6, 2.6, 4];
  const traceWidth = (tier) => TRACE_WIDTHS[clamp(tier, 0, 4)];

  // One grading function so restraint, bloom, fog, and accent allocation
  // always move together. fogAlpha is the per-depth-slice background fill
  // alpha, so it is kept small — it compounds once per plane.
  function grade(restraint, bloom, fog) {
    return {
      bloomAlpha: bloom * lerp(0.35, 1, restraint),
      fogAlpha: fog * lerp(0.5, 1, restraint) * 0.16,
      accentScale: lerp(0.55, 1, restraint),
    };
  }

  // Via ring left at a fork/merge node: quick pop in, slow quadratic decay.
  function viaAlpha(age, life) {
    if (age < 0 || age >= life) return 0;
    const t = age / life;
    return Math.min(1, age / 0.25) * (1 - t * t);
  }

  // One camera for scale and parallax: the offset magnitude is c * (1 - s),
  // exactly the screen displacement of a plane at scale s when the camera
  // translates by c with the front plane pinned under the copy. The SIGN is
  // a judged override of that derivation: the physical camera slides the
  // deep world WITH the pointer, but Krisna preferred the pointer *pushing*
  // the deeper planes away — it reads as the cursor repelling the field,
  // matching the pointer-bias interaction story. Magnitude stays
  // scale-derived so the cues remain coherent; only the direction is art.
  const PARALLAX_GAIN = 0.055;
  const parallaxShift = (pointer, center, parallax, scale) =>
    (center - pointer) * PARALLAX_GAIN * parallax * (1 - scale);

  // Per-depth bow and tilt: a composite-time horizontal warp that curves
  // the planes away from the viewer so they stop reading as flat
  // cardboard. v is the vertical position in [-1, 1] (top = -1), k the
  // plane's depth (planeStyle's k). `bow` pulls only the TOP edge away —
  // the viewer is looking at the top section of a sphere, so curvature
  // grows toward the top and the bottom half stays planar (the quadratic
  // term is zero at v=0 with zero slope, so the halves join without a
  // crease). The stack is nested sphere sections, so the FRONT plane
  // curves too: the bow term rides a floored depth, BOW_FRONT + the rest
  // by k, rather than vanishing at k=0. `tilt` stays strictly per-depth
  // (front plane never leans) so the copy's backdrop cannot shear.
  // Returns the strip's horizontal scale; the draw side slices each layer
  // into strips and the bright pass warps halo positions through the same
  // function so glow stays on its trace.
  const BOW_FRONT = 0.45;
  const bowScale = (v, k, bow, tilt) =>
    clamp(
      1 -
        (BOW_FRONT + (1 - BOW_FRONT) * k) * bow * 0.22 * (v < 0 ? v * v : 0) +
        k * tilt * 0.18 * v,
      0.5,
      1.25,
    );

  // Atmospheric temperature: back planes cool toward slate. k=0 identity.
  const COOL = [110, 122, 146];
  const coolShift = (rgb, k) => [
    Math.round(lerp(rgb[0], COOL[0], k)),
    Math.round(lerp(rgb[1], COOL[1], k)),
    Math.round(lerp(rgb[2], COOL[2], k)),
  ];

  // Small deterministic PRNG for the seeded first composition.
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // The hero copy sits in a fractional band of the stage; interior spawns
  // are suppressed there so density lives in the margins. Fractions match
  // the prototype hero block (title + sub + CTA) with breathing room.
  const BAND = { x0: 0.17, x1: 0.83, y0: 0.22, y1: 0.72 };
  const spawnWeight = (fx, fy) =>
    fx > BAND.x0 && fx < BAND.x1 && fy > BAND.y0 && fy < BAND.y1 ? 0.25 : 1;

  return {
    layerSplit,
    approach,
    traceWidth,
    grade,
    parallaxShift,
    bowScale,
    viaAlpha,
    coolShift,
    mulberry32,
    spawnWeight,
  };
})();

if (typeof window !== "undefined") window.HeroCine = HeroCine;
if (typeof module !== "undefined" && module.exports) module.exports = HeroCine;
