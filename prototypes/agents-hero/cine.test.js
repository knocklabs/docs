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

// Round 4.5: parallax and scale come from one camera. The front plane
// (scale 1) is the anchor and never moves; a deeper plane slides WITH the
// pointer, further planes more — the round-4 version moved back planes
// against the pointer at a magnitude unrelated to their scale, so the two
// depth cues disagreed under mouse movement.
test("parallaxShift: anchored at the front, grows with depth, moves with the pointer", () => {
  assert.equal(Cine.parallaxShift(900, 640, 1, 1), 0); // front plane pinned
  const mid = Cine.parallaxShift(900, 640, 1, 0.9);
  const back = Cine.parallaxShift(900, 640, 1, 0.8);
  assert.ok(mid > 0); // pointer right of centre -> shifts right
  assert.ok(back > mid); // deeper plane rides further
  assert.ok(Cine.parallaxShift(300, 640, 1, 0.8) < 0); // and left goes left
  assert.equal(Cine.parallaxShift(900, 640, 0, 0.8), 0); // dial at zero
});
