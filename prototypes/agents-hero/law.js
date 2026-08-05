/* Pure arithmetic of the layered-signals law. No DOM, no state.
   Loaded as a classic script in the browser (window.HeroLaw) and
   via require() in node --test. Must never become an ES module:
   file:// blocks module loading. */
const HeroLaw = (function () {
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  // Fork halves mass; merge sums it. Together these conserve total mass,
  // which is what keeps trace weight meaningful over long sessions.
  const forkMasses = (mass) => [mass / 2, mass / 2];
  const mergeMass = (a, b) => a + b;

  // Merge pulls the survivor forward, fork pushes the child back.
  const mergePlane = (za, zb) => Math.min(za, zb);
  const forkChildPlane = (z, planes, drop) =>
    drop ? Math.min(z + 1, planes - 1) : z;

  const widthForMass = (mass, base, curve) =>
    base * Math.pow(Math.max(mass, 0.0001), curve);

  // Trails batch into Path2D by tier, so tiers must be few and stable.
  const TIER_EDGES = [0.12, 0.3, 0.7, 1.6];
  function massTier(mass) {
    let t = 0;
    while (t < TIER_EDGES.length && mass >= TIER_EDGES[t]) t++;
    return t;
  }

  // Depth cues. z=0 is identity so planes:1 collapses to round 2 exactly.
  function planeStyle(z, planes, spread) {
    const depth = planes > 1 ? z / (planes - 1) : 0;
    const k = depth * spread;
    return {
      scale: 1 - 0.09 * k,
      dim: 1 - 0.82 * k,
      soften: 2.1 * k,
      speedMul: 1 - 0.45 * k,
    };
  }

  const canClaim = (runner, claimMass) =>
    runner.z === 0 && runner.mass >= claimMass;

  // Deterministic placement, derived from the copy's bounding box: three
  // down the right margin, one lower-left for asymmetry. Replaces round 2's
  // random placement, which produced lopsided compositions.
  const PAD_FRACTIONS = [
    [0.9, 0.2],
    [0.93, 0.44],
    [0.88, 0.78],
    [0.11, 0.83],
  ];
  function padAnchors(w, h, cell, ox, oy) {
    const cols = Math.floor(w / cell) + 1;
    const rows = Math.floor(h / cell) + 1;
    return PAD_FRACTIONS.map(([fx, fy]) => ({
      i: clamp(Math.round((w * fx - ox) / cell), 1, cols - 2),
      j: clamp(Math.round((h * fy - oy) / cell), 1, rows - 2),
    }));
  }

  return {
    clamp,
    forkMasses,
    mergeMass,
    mergePlane,
    forkChildPlane,
    widthForMass,
    massTier,
    planeStyle,
    canClaim,
    padAnchors,
  };
})();

if (typeof window !== "undefined") window.HeroLaw = HeroLaw;
if (typeof module !== "undefined" && module.exports) module.exports = HeroLaw;
