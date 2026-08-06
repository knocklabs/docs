const test = require("node:test");
const assert = require("node:assert");
const Cine = require("./cine.js");

test("layerSplit: integer depths land wholly in one layer", () => {
  assert.deepEqual(Cine.layerSplit(0, 3), { lo: 0, hi: 1, wHi: 0 });
  assert.deepEqual(Cine.layerSplit(2, 3), { lo: 2, hi: 2, wHi: 0 });
});

test("layerSplit: fractional depth splits between adjacent layers", () => {
  const s = Cine.layerSplit(0.4, 3);
  assert.equal(s.lo, 0);
  assert.equal(s.hi, 1);
  assert.ok(Math.abs(s.wHi - 0.4) < 1e-9);
});

test("layerSplit: clamps outside [0, planes-1]", () => {
  assert.deepEqual(Cine.layerSplit(-0.5, 3), { lo: 0, hi: 1, wHi: 0 });
  assert.deepEqual(Cine.layerSplit(9, 3), { lo: 2, hi: 2, wHi: 0 });
});

test("approach: arrives exactly, never overshoots", () => {
  assert.equal(Cine.approach(0, 1, 0.3), 0.3);
  assert.equal(Cine.approach(0.9, 1, 0.3), 1);
  assert.equal(Cine.approach(1, 0, 0.3), 0.7);
  assert.equal(Cine.approach(1, 1, 0.3), 1);
});

test("traceWidth: ladder is monotonic and clamped", () => {
  const ws = [0, 1, 2, 3, 4].map(Cine.traceWidth);
  for (let i = 1; i < ws.length; i++) assert.ok(ws[i] >= ws[i - 1]);
  assert.equal(Cine.traceWidth(3), 2.6); // the unmerged-baseline tier
  assert.equal(Cine.traceWidth(4), 4); // trunks
  assert.equal(Cine.traceWidth(-1), Cine.traceWidth(0));
  assert.equal(Cine.traceWidth(9), Cine.traceWidth(4));
});

test("grade: bloom and fog scale with restraint and with their params", () => {
  const lo = Cine.grade(0, 1, 1);
  const hi = Cine.grade(1, 1, 1);
  assert.ok(hi.bloomAlpha > lo.bloomAlpha);
  assert.ok(hi.fogAlpha > lo.fogAlpha);
  assert.equal(Cine.grade(1, 0, 1).bloomAlpha, 0);
  assert.equal(Cine.grade(1, 1, 0).fogAlpha, 0);
  assert.ok(hi.accentScale > lo.accentScale); // restraint grades accent too
  assert.ok(lo.accentScale > 0); // quiet never goes fully monochrome
});

test("viaAlpha: zero at the edges, positive in the middle", () => {
  assert.equal(Cine.viaAlpha(-1, 10), 0);
  assert.equal(Cine.viaAlpha(10, 10), 0);
  assert.equal(Cine.viaAlpha(12, 10), 0);
  assert.ok(Cine.viaAlpha(1, 10) > 0.5);
  assert.ok(Cine.viaAlpha(9, 10) < Cine.viaAlpha(5, 10));
});

test("coolShift: k=0 is identity, k=1 is the cool target", () => {
  assert.deepEqual(Cine.coolShift([250, 100, 20], 0), [250, 100, 20]);
  const cooled = Cine.coolShift([250, 100, 20], 1);
  assert.ok(cooled[2] > cooled[0] - 40); // blue has caught up: slate, not orange
});

test("mulberry32: deterministic and in [0,1)", () => {
  const a = Cine.mulberry32(42);
  const b = Cine.mulberry32(42);
  const seqA = [a(), a(), a()];
  const seqB = [b(), b(), b()];
  assert.deepEqual(seqA, seqB);
  for (const v of seqA) assert.ok(v >= 0 && v < 1);
  assert.notDeepEqual(seqA, (() => { const c = Cine.mulberry32(43); return [c(), c(), c()]; })());
});

test("spawnWeight: suppressed inside the copy band, full in the margins", () => {
  assert.equal(Cine.spawnWeight(0.5, 0.45), 0.25); // dead center of the copy
  assert.equal(Cine.spawnWeight(0.05, 0.5), 1); // left margin
  assert.equal(Cine.spawnWeight(0.95, 0.5), 1); // right margin
  assert.equal(Cine.spawnWeight(0.5, 0.9), 1); // below the band
});

// Round 4.5/4.6: parallax magnitude comes from the camera (c * (1 - s),
// front plane pinned), but the direction is Krisna's ruling: the pointer
// PUSHES deeper planes away rather than dragging them along — the cursor
// repels the field. Deeper planes are pushed further.
test("parallaxShift: anchored at the front, grows with depth, pushes away from the pointer", () => {
  assert.equal(Cine.parallaxShift(900, 640, 1, 1), 0); // front plane pinned
  const mid = Cine.parallaxShift(900, 640, 1, 0.9);
  const back = Cine.parallaxShift(900, 640, 1, 0.8);
  assert.ok(mid < 0); // pointer right of centre -> deep planes pushed left
  assert.ok(back < mid); // deeper plane pushed further
  assert.ok(Cine.parallaxShift(300, 640, 1, 0.8) > 0); // pointer left pushes right
  assert.equal(Cine.parallaxShift(900, 640, 0, 0.8), 0); // dial at zero
});

// Round 4.6: bow/tilt warp. Front plane must stay untouched — the copy,
// pads, and etch all ride it — and the warp must be symmetric for bow,
// leaning for tilt.
test("bowScale: identity at the front and at zero dials, bows and leans with depth", () => {
  assert.equal(Cine.bowScale(1, 0, 1, 1), 1); // front plane: identity
  assert.equal(Cine.bowScale(-0.8, 0.5, 0, 0), 1); // dials at zero: identity
  const edge = Cine.bowScale(1, 0.5, 1, 0);
  assert.ok(edge < 1); // bow pulls edges away
  assert.equal(Cine.bowScale(-1, 0.5, 1, 0), edge); // symmetrically
  assert.ok(Cine.bowScale(0, 0.5, 1, 0) === 1); // centre line untouched
  const top = Cine.bowScale(-1, 0.5, 0, 1);
  const bottom = Cine.bowScale(1, 0.5, 0, 1);
  assert.ok(top < 1 && bottom > 1); // positive tilt leans the top away
  assert.ok(Cine.bowScale(1, 1, 1.5, 1) >= 0.5); // clamped, never collapses
});
