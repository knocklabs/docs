const test = require("node:test");
const assert = require("node:assert/strict");
const L = require("./law.js");

test("fork conserves mass", () => {
  const [a, b] = L.forkMasses(1);
  assert.equal(a + b, 1);
  assert.equal(a, b);
});

test("merge conserves mass", () => {
  assert.equal(L.mergeMass(0.5, 0.25), 0.75);
});

test("merge pulls the survivor one plane forward of the meeting", () => {
  assert.equal(L.mergePlane(2, 2), 1);
  assert.equal(L.mergePlane(1, 1), 0);
});

test("merge pull-forward floors at the front plane", () => {
  assert.equal(L.mergePlane(0, 0), 0);
});

test("fork child recedes one plane only when dropping", () => {
  assert.equal(L.forkChildPlane(0, 3, true), 1);
  assert.equal(L.forkChildPlane(0, 3, false), 0);
});

test("fork child never recedes past the back plane", () => {
  assert.equal(L.forkChildPlane(2, 3, true), 2);
  assert.equal(L.forkChildPlane(0, 1, true), 0);
});

test("width grows monotonically with mass", () => {
  const w1 = L.widthForMass(0.25, 2, 1);
  const w2 = L.widthForMass(1, 2, 1);
  assert.ok(w2 > w1);
});

test("mass tiers are quantized integers in 0..4", () => {
  const tiers = [0.05, 0.2, 0.5, 1, 4].map(L.massTier);
  for (const t of tiers) {
    assert.equal(Number.isInteger(t), true);
    assert.ok(t >= 0 && t <= 4);
  }
  assert.deepEqual([...tiers].sort((a, b) => a - b), tiers);
});

// The 1.3px trail-width parity guarantee against round 2 rests on two facts
// spread across two files: massTier(1) === 3 in law.js, and TIER_REP_MASS[3]
// === 1 in layers.html. Together they make widthForMass(1, base, curve) ===
// base for any massCurve. Nudging a TIER_EDGES value across 1 would silently
// change every trail's width, so pin the tier here.
test("mass 1 sits in tier 3, the width-calibration anchor", () => {
  assert.equal(L.massTier(1), 3);
  for (const c of [0.2, 0.55, 1, 1.2])
    assert.equal(L.widthForMass(1, 1.3, c), 1.3);
});

test("front plane style is identity", () => {
  const s = L.planeStyle(0, 3, 0.5);
  assert.equal(s.scale, 1);
  assert.equal(s.dim, 1);
  assert.equal(s.speedMul, 1);
  assert.equal(s.soften, 0);
});

// planes:1 is the parity control the whole branch is judged against: at one
// plane every depth cue must collapse to identity, not just z=0 of three.
test("a single plane collapses to identity", () => {
  for (const spread of [0, 0.5, 1]) {
    const s = L.planeStyle(0, 1, spread);
    assert.equal(s.scale, 1);
    assert.equal(s.dim, 1);
    assert.equal(s.speedMul, 1);
    assert.equal(s.soften, 0);
  }
});

test("plane style falls off monotonically with depth", () => {
  const a = L.planeStyle(0, 3, 0.5);
  const b = L.planeStyle(1, 3, 0.5);
  const c = L.planeStyle(2, 3, 0.5);
  assert.ok(a.dim > b.dim && b.dim > c.dim);
  assert.ok(a.scale > b.scale && b.scale > c.scale);
  assert.ok(a.speedMul > b.speedMul && b.speedMul > c.speedMul);
  assert.ok(a.soften < b.soften && b.soften < c.soften);
});

// Round 4.5: the linear 1 - 0.09k scale capped the back-plane shrink at 9%
// — below perceptual threshold, which left defocus blur as the only size
// cue and inverted the depth read (blurred back runners looked bigger than
// crisp front ones). The perspective form must shrink the back plane
// visibly at the shipped spreads.
test("back-plane perspective shrink is perceptible", () => {
  assert.ok(L.planeStyle(2, 3, 0.45).scale < 0.85); // layered's spread
  assert.ok(L.planeStyle(2, 3, 0.85).scale < 0.75); // deep's spread
  // ...but never so hard the field collapses toward the centre.
  assert.ok(L.planeStyle(2, 3, 1).scale > 0.6);
});

test("only front-plane runners above the mass gate can claim a pad", () => {
  assert.equal(L.canClaim({ z: 0, mass: 1 }, 0.9), true);
  assert.equal(L.canClaim({ z: 0, mass: 0.5 }, 0.9), false);
  assert.equal(L.canClaim({ z: 1, mass: 8 }, 0.9), false);
  // 0.9 above is arithmetic, not a sanctioned setting: base spawn mass is
  // exactly 1, so a gate at 0.9 lets a never-merged runner claim a pad. The
  // shipped gate is 1.05 and must stay above 1 — only a merge clears it.
  assert.equal(L.canClaim({ z: 0, mass: 1 }, 1.05), false);
  assert.equal(L.canClaim({ z: 0, mass: 2 }, 1.05), true);
});

test("pad anchors are deterministic, snapped, and clear of the copy band", () => {
  const a = L.padAnchors(900, 460, 26, 5, 5);
  const b = L.padAnchors(900, 460, 26, 5, 5);
  assert.equal(a.length, 4);
  assert.deepEqual(a, b);
  for (const p of a) {
    assert.equal(Number.isInteger(p.i), true);
    assert.equal(Number.isInteger(p.j), true);
    const x = 5 + p.i * 26;
    const y = 5 + p.j * 26;
    const inCopyBand =
      x > 900 * 0.18 && x < 900 * 0.82 && y > 460 * 0.24 && y < 460 * 0.66;
    assert.equal(inCopyBand, false, `pad at ${x},${y} overlaps the copy band`);
  }
});
