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

  // One camera for scale and parallax. A plane whose perspective scale is
  // s sits at depth Z = Z0/s; translating the camera laterally by c and
  // re-anchoring so the front plane stays pinned under the copy shifts
  // that plane on screen by c * (1 - s). Positive output moves WITH the
  // pointer — the front plane is the anchor and the deeper world slides
  // behind it. Round 4 moved back planes *against* the pointer with a
  // magnitude unrelated to their scale, so the two depth cues disagreed.
  const PARALLAX_GAIN = 0.055;
  const parallaxShift = (pointer, center, parallax, scale) =>
    (pointer - center) * PARALLAX_GAIN * parallax * (1 - scale);

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
    viaAlpha,
    coolShift,
    mulberry32,
    spawnWeight,
  };
})();

if (typeof window !== "undefined") window.HeroCine = HeroCine;
if (typeof module !== "undefined" && module.exports) module.exports = HeroCine;
