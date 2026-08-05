# Layered signals — `/agents` hero, round 3 — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `prototypes/agents-hero/layers.html` — a round-3 hero prototype where signals fork and merge across three depth planes, converging to earn arrival at deterministically placed pads.

**Architecture:** The pure arithmetic of the design's law (fork halves mass and pushes back a plane, merge sums mass and pulls forward) is extracted into `prototypes/agents-hero/law.js`, a dependency-free classic script that both the browser prototype and Node's built-in test runner can load. Everything stateful — the lattice, runners, rendering — stays in the single-file prototype, matching rounds 1 and 2. `layers.html` starts as a copy of `runners.html` and is grown task by task, with `planes: 1` preserved throughout as a parity control against round 2.

**Tech Stack:** Vanilla JS, canvas 2D, no build step, no runtime dependencies. Tests use `node:test` (built in, Node 24). Visual verification uses the Playwright Chromium already cached at `~/Library/Caches/ms-playwright/chromium-1228`.

## Global constraints

- **No dependencies and no build step.** `layers.html` must open correctly via `open prototypes/agents-hero/layers.html` on a `file://` URL. `law.js` must therefore be a **classic** script, never an ES module — `file://` blocks module loading via CORS.
- **Accent is `#fa5902` in both themes.** Dark surface is `#191919`, light is `#ffffff`.
- **Plane indices:** `z = 0` is front, increasing z goes back. Maximum `planes` is 3.
- **`planes: 1` must always render identically to round 2's engine.** This is the parity control and it is checked in more than one task.
- **60fps at the full-restraint runner cap** is the performance bar, read off the existing on-screen FPS counter.
- `prefers-reduced-motion` is deliberately **not** honored in prototypes. Do not add it here.
- Prototypes and plans are local-only. Do not wire anything into `components/` or `pages/`.
- Commit after every task.

---

### Task 1: The law as a testable module

The design's whole thesis is arithmetic — mass and plane, changed in opposite directions by two events. That arithmetic is pure, so it gets real tests before any pixel is drawn.

**Files:**
- Create: `prototypes/agents-hero/law.js`
- Test: `prototypes/agents-hero/law.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: a global `HeroLaw` object (also `module.exports` under Node) with:
  - `forkMasses(mass: number) -> [number, number]`
  - `mergeMass(a: number, b: number) -> number`
  - `mergePlane(za: number, zb: number) -> number`
  - `forkChildPlane(z: number, planes: number, drop: boolean) -> number`
  - `widthForMass(mass: number, base: number, curve: number) -> number`
  - `massTier(mass: number) -> number` (integer 0-4)
  - `planeStyle(z: number, planes: number, spread: number) -> {scale, dim, soften, speedMul}`
  - `canClaim(runner: {z, mass}, claimMass: number) -> boolean`
  - `padAnchors(w, h, cell, ox, oy) -> [{i, j}, ...]` (exactly 4)

- [ ] **Step 1: Write the failing tests**

Create `prototypes/agents-hero/law.test.js`:

```js
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

test("merge pulls the survivor to the frontmost plane", () => {
  assert.equal(L.mergePlane(2, 0), 0);
  assert.equal(L.mergePlane(1, 2), 1);
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

test("front plane style is identity", () => {
  const s = L.planeStyle(0, 3, 0.5);
  assert.equal(s.scale, 1);
  assert.equal(s.dim, 1);
  assert.equal(s.speedMul, 1);
  assert.equal(s.soften, 0);
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

test("only front-plane runners above the mass gate can claim a pad", () => {
  assert.equal(L.canClaim({ z: 0, mass: 1 }, 0.9), true);
  assert.equal(L.canClaim({ z: 0, mass: 0.5 }, 0.9), false);
  assert.equal(L.canClaim({ z: 1, mass: 8 }, 0.9), false);
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
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
node --test prototypes/agents-hero/law.test.js
```

Expected: FAIL — `Cannot find module './law.js'`.

- [ ] **Step 3: Write the implementation**

Create `prototypes/agents-hero/law.js`:

```js
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

if (typeof module !== "undefined" && module.exports) module.exports = HeroLaw;
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --test prototypes/agents-hero/law.test.js
```

Expected: PASS, 11 tests.

If `padAnchors` fails the copy-band assertion, adjust the values in `PAD_FRACTIONS` — do not weaken the assertion. The guard band (`0.18`-`0.82` horizontal, `0.24`-`0.66` vertical) is copied from `runners.html:711-716` and is where the hero copy actually sits.

- [ ] **Step 5: Commit**

```bash
git add prototypes/agents-hero/law.js prototypes/agents-hero/law.test.js
git commit -m "prototype: pure arithmetic of the layered-signals law, with tests"
```

---

### Task 2: `layers.html` scaffold at plane parity

Copy round 2 forward, wire in `law.js`, add the `planes` param defaulted to 1, and prove nothing changed. Everything after this task is judged against this baseline.

**Files:**
- Create: `prototypes/agents-hero/layers.html` (copied from `runners.html`)
- Create: `prototypes/agents-hero/shoot.js` (screenshot harness)

**Interfaces:**
- Consumes: `HeroLaw` from Task 1.
- Produces: `layers.html` with `env.params.planes`, every runner carrying `z` and `mass`, and a `shoot.js` harness callable as `node prototypes/agents-hero/shoot.js <file.html> <outdir>`.

- [ ] **Step 1: Copy the round-2 prototype**

```bash
cp prototypes/agents-hero/runners.html prototypes/agents-hero/layers.html
```

- [ ] **Step 2: Load `law.js` and add the new params**

In `layers.html`, immediately before the existing `<script>` that contains `const clamp = ...`, add:

```html
<script src="law.js"></script>
```

Then in that main script, delete the local `const clamp = (v, a, b) => ...` line and replace it with a destructure so there is exactly one definition:

```js
const { clamp } = HeroLaw;
```

In `DEFAULTS`, add the round-3 parameters alongside the existing ones:

```js
planes: 1,
planeSpread: 0.5,
forkRate: 0,
forkDrop: 0.5,
mergeWindow: 0.12,
massCurve: 0.55,
claimMass: 0.9,
parallax: 0,
```

They all default to the round-2-equivalent value: one plane, no forking, no parallax.

- [ ] **Step 3: Give every runner a plane and a mass**

In `spawn()` (around `runners.html:740`), add two fields to the runner object literal, after `accent: isAccent,`:

```js
z: 0,
mass: 1,
```

Nothing reads them yet. This is deliberate — the fields land before the mechanics so later tasks touch one system at a time.

- [ ] **Step 4: Write the screenshot harness**

Create `prototypes/agents-hero/shoot.js`:

```js
/* Visual harness. Usage:
     node prototypes/agents-hero/shoot.js layers.html /tmp/out [presetIndex]
   Captures #stage in both themes at ~2s and ~25s with the pointer parked
   inside the stage, and fails loudly on any console error. */
const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require("playwright-core");

const EXEC =
  process.env.HOME +
  "/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/" +
  "Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";

const [, , file, outDir, presetArg] = process.argv;
const preset = Number(presetArg || 0);

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXEC });
  const errors = [];

  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`[${width}] ${m.text()}`);
    });
    page.on("pageerror", (e) => errors.push(`[${width}] ${e.message}`));

    await page.goto("file://" + path.resolve(file));
    await page.waitForTimeout(300);
    await page.keyboard.press(String(preset + 1));

    const stage = page.locator("#stage");
    // The stage sits below two toolbars, so the pointer must be placed from
    // its measured box. Guessing coordinates misses it and pointer behaviour
    // never appears in the capture.
    const box = await stage.boundingBox();
    await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.5);

    for (const theme of ["dark", "light"]) {
      if (theme === "light") await page.keyboard.press("t");
      for (const at of [2000, 25000]) {
        await page.waitForTimeout(at === 2000 ? 2000 : 23000);
        await stage.screenshot({
          path: `${outDir}/${width}-${theme}-${at / 1000}s.png`,
        });
      }
    }

    const fps = await page.locator("#fps").textContent();
    console.log(`width ${width}: fps readout = ${fps.trim()}`);
    await page.close();
  }

  await browser.close();
  if (errors.length) {
    console.error("CONSOLE ERRORS:\n" + errors.join("\n"));
    process.exit(1);
  }
  console.log("no console errors");
})();
```

- [ ] **Step 5: Install the one harness dependency in the scratchpad, not the repo**

The repo must stay dependency-free. Install `playwright-core` outside it and point Node at it:

```bash
SCRATCH="$(dirname "$(pwd)")/scratch-shoot"
mkdir -p "$SCRATCH"
(cd "$SCRATCH" && npm i --silent playwright-core@1.56.0)
```

The subshell matters — the harness commands below all run from the repo root, so
do not leave the shell parked in the scratch directory.

Run the harness from the repo with `NODE_PATH` set:

```bash
NODE_PATH="$SCRATCH/node_modules" node prototypes/agents-hero/shoot.js \
  prototypes/agents-hero/layers.html /tmp/hero-t2
```

Expected: `no console errors`, an FPS readout at or above 58, and eight PNGs in `/tmp/hero-t2`.

- [ ] **Step 6: Verify parity against round 2**

Run the same harness against `runners.html` and compare the dark 2s frames by eye:

```bash
NODE_PATH="$SCRATCH/node_modules" node prototypes/agents-hero/shoot.js \
  prototypes/agents-hero/runners.html /tmp/hero-r2
open /tmp/hero-r2/1280-dark-2s.png /tmp/hero-t2/1280-dark-2s.png
```

Expected: visually equivalent. They will not be pixel-identical — the engine is stochastic — but density, trail length, color, and pitch must match. Any visible difference means the copy or the `clamp` swap broke something; fix before committing.

- [ ] **Step 7: Commit**

```bash
git add prototypes/agents-hero/layers.html prototypes/agents-hero/shoot.js
git commit -m "prototype: layers.html scaffold at round-2 parity, plus screenshot harness"
```

---

### Task 3: Path2D trails bucketed by mass tier

The spec calls for this **before** planes, not after. Round 2 builds a `createLinearGradient` per trail segment per frame (`runners.html:1261`); tripling that across planes is the real performance cliff. Mass tiers make solid strokes viable because weight is already quantized.

**Files:**
- Modify: `prototypes/agents-hero/layers.html` — the `draw()` method's ribbon branch

**Interfaces:**
- Consumes: `HeroLaw.massTier`, `HeroLaw.widthForMass`.
- Produces: trail rendering that allocates no per-segment gradient objects.

- [ ] **Step 1: Replace the ribbon branch with tier batching**

In `draw()`, find the `else` branch that handles `trailStyle === "ribbon"` (the block containing `ctx.createLinearGradient(a0.x, a0.y, a1.x, a1.y)`). Replace the whole per-runner ribbon loop with a two-pass approach. Before the runner loop, build the batches:

```js
// One Path2D per (tier, accent, fade-bucket). Solid strokes, no gradients:
// the taper now comes from splitting each trail into a few fade buckets
// rather than a gradient object per segment.
const FADE_BUCKETS = 5;
const batches = new Map();
const batchKey = (tier, accent, fb) => tier * 100 + (accent ? 50 : 0) + fb;

function addSeg(tier, accent, fb, a0, a1) {
  const key = batchKey(tier, accent, fb);
  let p = batches.get(key);
  if (!p) {
    p = { path: new Path2D(), tier, accent, fb };
    batches.set(key, p);
  }
  p.path.moveTo(a0.x, a0.y);
  p.path.lineTo(a1.x, a1.y);
}
```

Inside the existing runner loop, in place of the gradient code:

```js
const pts = r.trail.concat([r.head]);
const total = Math.max(1, trailLength(r));
const tier = HeroLaw.massTier(r.mass);
let acc = 0;
for (let k = 0; k < pts.length - 1; k++) {
  const a0 = pts[k];
  const a1 = pts[k + 1];
  const seg = Math.hypot(a1.x - a0.x, a1.y - a0.y);
  // Fade bucket from the segment midpoint: 0 is the tail, 4 the head.
  const f = (acc + seg / 2) / total;
  const fb = Math.min(FADE_BUCKETS - 1, Math.floor(f * FADE_BUCKETS));
  addSeg(tier, r.accent, fb, a0, a1);
  acc += seg;
}
```

After the runner loop, stroke each batch once:

```js
for (const b of batches.values()) {
  const col = b.accent ? pal.accent : pal.neutral;
  const dimF = b.accent ? 1 : 0.62;
  const fade = (b.fb + 1) / FADE_BUCKETS;
  ctx.strokeStyle = rgba(col, baseA * dimF * fade * fade);
  ctx.lineWidth = HeroLaw.widthForMass(
    Math.pow(2, b.tier - 2),
    1.5,
    p.massCurve,
  );
  ctx.lineCap = "round";
  ctx.stroke(b.path);
}
```

- [ ] **Step 2: Verify visually and on FPS**

```bash
NODE_PATH="$SCRATCH/node_modules" node prototypes/agents-hero/shoot.js \
  prototypes/agents-hero/layers.html /tmp/hero-t3
open /tmp/hero-t3/1280-dark-2s.png /tmp/hero-t2/1280-dark-2s.png
```

Expected: `no console errors`; the taper now reads as five steps rather than a smooth ramp, which at these line widths is not distinguishable at normal viewing distance. FPS readout at or above the Task 2 number.

If the banding *is* visible, raise `FADE_BUCKETS` to 8 before reaching for any other fix — it is still one stroke per bucket, not per segment.

- [ ] **Step 3: Confirm no gradients remain in the hot path**

```bash
grep -n "createLinearGradient" prototypes/agents-hero/layers.html
```

Expected: no matches inside `draw()`. Matches elsewhere (target rings, sprite construction) are fine.

- [ ] **Step 4: Commit**

```bash
git add prototypes/agents-hero/layers.html
git commit -m "prototype: batch trails into Path2D by mass tier, drop per-segment gradients"
```

---

### Task 4: Depth planes

**Files:**
- Modify: `prototypes/agents-hero/layers.html` — `advanceCell`/`update` for per-plane speed, `draw()` for per-plane transform and style, occupancy arrays for per-plane separation

**Interfaces:**
- Consumes: `HeroLaw.planeStyle`.
- Produces: runners distributed across `planes`, drawn back-to-front with depth cues and pointer parallax.

- [ ] **Step 1: Separate occupancy per plane**

Collisions and merges must be plane-local — a back-plane runner passing "through" a front-plane one is correct, not a collision. In `layout()`, replace the two occupancy arrays with per-plane slabs:

```js
// Occupancy is per plane: crossing runners on different planes are at
// different depths and must not collide.
const PLANE_MAX = 3;
occTime = new Float32Array(cols * rows * PLANE_MAX);
occOwner = new Int32Array(cols * rows * PLANE_MAX);
```

Add an index helper next to `inBounds`:

```js
const occIdx = (i, j, z) => z * cols * rows + j * cols + i;
```

In `advanceCell`, replace `const idx = nj * cols + ni;` with:

```js
const idx = occIdx(ni, nj, r.z);
```

- [ ] **Step 2: Spawn across planes and scale speed by depth**

In `spawn()`, replace the fixed `z: 0` from Task 2 with a depth draw, and apply the plane's speed multiplier:

```js
z: (() => {
  const n = clamp(p.planes, 1, 3);
  // Weight toward the front so the plane carrying the accent stays the
  // busiest and the back reads as distance rather than clutter.
  const roll = Math.random();
  if (n === 1) return 0;
  if (n === 2) return roll < 0.62 ? 0 : 1;
  return roll < 0.5 ? 0 : roll < 0.8 ? 1 : 2;
})(),
mass: 1,
```

Because `speed` is set earlier in the same object literal, apply the multiplier right after `spawn()` builds `r`, before `runners.push(r)`:

```js
r.speed *= HeroLaw.planeStyle(r.z, clamp(p.planes, 1, 3), p.planeSpread)
  .speedMul;
```

- [ ] **Step 3: Draw back to front with depth cues**

In `draw()`, wrap the substrate, trail, and head rendering in a loop over planes descending from back to front, and apply the plane transform. At the top of `draw()`:

```js
const nPlanes = clamp(p.planes, 1, 3);
const ptr = env.pointer;
```

Then for each plane `z` from `nPlanes - 1` down to `0`:

```js
const st = HeroLaw.planeStyle(z, nPlanes, p.planeSpread);
ctx.save();
// Scale about the stage centre so the back planes sit "further in".
ctx.translate(env.w / 2, env.h / 2);
ctx.scale(st.scale, st.scale);
ctx.translate(-env.w / 2, -env.h / 2);
// Parallax: only the back planes move, so the front-plane pads never
// drift off their anchors.
if (z > 0 && ptr.active && p.parallax > 0) {
  const depth = z / (nPlanes - 1);
  ctx.translate(
    (ptr.x - env.w / 2) * -0.012 * p.parallax * depth,
    (ptr.y - env.h / 2) * -0.012 * p.parallax * depth,
  );
}
// ... existing substrate + trail-batch + head drawing, filtered to this
// plane, with every alpha multiplied by st.dim and every trail lineWidth
// increased by st.soften. Wide-and-faint reads as defocus.
ctx.restore();
```

Filter the runner loop with `if (r.z !== z) continue;`, build the Task 3 batches **inside** the plane loop so each plane strokes its own, multiply `baseA` by `st.dim`, and add `st.soften` to the computed `lineWidth`.

- [ ] **Step 4: Gate accent on the front plane**

In `spawn()`, replace the accent decision so depth is the primary gate:

```js
// Depth drives colour: accent lives at the front. At planes:1 every
// runner is front-plane, so accentRatio governs alone — round 2's model.
const isAccent =
  boosted ||
  ((clamp(p.planes, 1, 3) === 1 || zPicked === 0) &&
    Math.random() < p.accentRatio);
```

This requires computing the plane before the object literal. Hoist Step 2's IIFE into a `const zPicked = ...` above `const isAccent = ...`, and use `z: zPicked` in the literal.

- [ ] **Step 5: Verify parity is still intact and depth reads**

```bash
NODE_PATH="$SCRATCH/node_modules" node prototypes/agents-hero/shoot.js \
  prototypes/agents-hero/layers.html /tmp/hero-t4
```

Expected: `no console errors`, FPS at or above 58.

Then open `layers.html` directly and check by hand:
- With `planes` at 1, the field looks like `/tmp/hero-t2/1280-dark-2s.png`. Parity holds.
- At 3, there are visibly three depths: crisp accent at the front, dim soft gray behind.
- Moving the pointer shifts the back planes and leaves the front still.

- [ ] **Step 6: Commit**

```bash
git add prototypes/agents-hero/layers.html
git commit -m "prototype: three depth planes with per-plane speed, dim, softness, and parallax"
```

---

### Task 5: Fork

**Files:**
- Modify: `prototypes/agents-hero/layers.html` — `advanceCell`, plus a runner cap

**Interfaces:**
- Consumes: `HeroLaw.forkMasses`, `HeroLaw.forkChildPlane`.
- Produces: runners that split at nodes, halving mass, with a fraction of children receding a plane.

- [ ] **Step 1: Add a hard runner cap**

Forking is unbounded growth without one. Above `advanceCell`, add:

```js
// Forking can only run away if it is allowed to. The cap is absolute;
// forkRate cannot exceed it.
const runnerCap = () => Math.round(lerp(10, 90, env.restraint));
```

- [ ] **Step 2: Fork at the node**

In `advanceCell`, after `r.trail.push(...)` and after the `arriveAt` check, before the TTL check, add:

```js
const p = P();
if (
  p.forkRate > 0 &&
  runners.length < runnerCap() &&
  r.mass > 0.06 &&
  Math.random() < p.forkRate
) {
  const nPlanes = clamp(p.planes, 1, 3);
  const [pm, cm] = HeroLaw.forkMasses(r.mass);
  r.mass = pm;
  // The child leaves perpendicular, so the split is legible as a branch
  // rather than a wobble.
  const childDir = (r.d + (Math.random() < 0.5 ? 1 : 3)) % 4;
  const child = spawn(ni, nj, childDir, false);
  if (child) {
    child.mass = cm;
    child.z = HeroLaw.forkChildPlane(
      r.z,
      nPlanes,
      Math.random() < p.forkDrop,
    );
    child.accent = nPlanes === 1 || child.z === 0 ? r.accent : false;
    child.target = r.target;
    child.speed =
      r.speed *
      (HeroLaw.planeStyle(child.z, nPlanes, p.planeSpread).speedMul /
        Math.max(
          0.0001,
          HeroLaw.planeStyle(r.z, nPlanes, p.planeSpread).speedMul,
        ));
    burst(px(ni), py(nj), 4, 0.45, child.accent);
  }
}
```

`spawn()` sets its own `z` and `mass`; overriding both immediately after is intentional and keeps the fork rule in one place.

- [ ] **Step 3: Verify**

Open `layers.html`, set `planes` to 3 and `forkRate` to around 0.06, and watch:
- Branches leave at right angles and are visibly thinner than their parent.
- Some children recede to a back plane and dim.
- The runner count stops growing at the cap — the field gets busy, then holds. It must not lock up or drop frames.

Then run the harness:

```bash
NODE_PATH="$SCRATCH/node_modules" node prototypes/agents-hero/shoot.js \
  prototypes/agents-hero/layers.html /tmp/hero-t5
```

Expected: `no console errors`, FPS at or above 58 at the 25s capture — the frame most likely to be at the cap.

- [ ] **Step 4: Commit**

```bash
git add prototypes/agents-hero/layers.html
git commit -m "prototype: fork splits runners, halving mass and receding a plane"
```

---

### Task 6: Merge

Round 2 treats two runners meeting as a collision that kills both (`runners.html:937-943`). Merge replaces that outcome when the two are on the same plane and heading compatibly.

**Files:**
- Modify: `prototypes/agents-hero/layers.html` — the collision branch of `advanceCell`

**Interfaces:**
- Consumes: `HeroLaw.mergeMass`, `HeroLaw.mergePlane`.
- Produces: converging runners that combine into a heavier, faster, frontmost survivor.

- [ ] **Step 1: Turn the collision branch into a merge-or-collide decision**

Replace the collision block in `advanceCell`:

```js
const idx = occIdx(ni, nj, r.z);
if (occOwner[idx] !== r.id && now - occTime[idx] < P().mergeWindow) {
  const other = runners.find((o) => o.id === occOwner[idx]);
  if (other && !other.dying) {
    const nPlanes = clamp(P().planes, 1, 3);
    // Head-on meetings still annihilate; everything else converges.
    // Without that exception, two runners can merge and immediately
    // reverse into their own trail.
    const headOn = (other.d + 2) % 4 === r.d;
    if (!headOn) {
      other.mass = HeroLaw.mergeMass(other.mass, r.mass);
      const zNew = HeroLaw.mergePlane(other.z, r.z);
      if (zNew !== other.z) {
        // Pulled forward: rescale speed to the new plane and warm it.
        const from = HeroLaw.planeStyle(
          other.z,
          nPlanes,
          P().planeSpread,
        ).speedMul;
        const to = HeroLaw.planeStyle(
          zNew,
          nPlanes,
          P().planeSpread,
        ).speedMul;
        other.speed *= to / Math.max(0.0001, from);
        other.z = zNew;
      }
      if (nPlanes === 1 || other.z === 0)
        other.accent = other.accent || r.accent;
      other.bright = 1;
      if (!other.target && r.target) other.target = r.target;
      burst(px(ni), py(nj), 9, 0.8, other.accent);
      r.dying = true;
      return;
    }
  }
  burst(px(ni), py(nj), 12, 1, r.accent);
  r.dying = true;
  if (other && !other.dying) other.dying = true;
  return;
}
```

Note this also swaps the hardcoded `0.12` window for the `mergeWindow` param.

- [ ] **Step 2: Verify the law reads**

Open `layers.html` with `planes` 3, `forkRate` around 0.05, `mergeWindow` around 0.14. Watch for:
- Trails visibly thickening after two meet — mass is summing.
- A back-plane runner merging with a front one and coming forward, brightening as it does.
- Head-on meetings still producing the collision burst and killing both.

The sentence to check against: *things divide and fall back; things converge and come forward.* If the picture does not say that, the fork and merge rates are wrong relative to each other — tune `forkRate` and `mergeWindow`, not the law.

- [ ] **Step 3: Check mass does not run away**

Merge sums without bound, so a long-lived survivor could grow to an absurd width. Confirm by leaving the page open for a minute at high restraint and watching the heaviest trails. `massTier` caps at tier 4, so width is bounded by construction — verify that visually rather than trusting it.

```bash
NODE_PATH="$SCRATCH/node_modules" node prototypes/agents-hero/shoot.js \
  prototypes/agents-hero/layers.html /tmp/hero-t6
open /tmp/hero-t6/1280-dark-25s.png
```

Expected: the heaviest trails are visibly thicker than branches but not slabs. `no console errors`, FPS at or above 58.

- [ ] **Step 4: Commit**

```bash
git add prototypes/agents-hero/layers.html
git commit -m "prototype: merge sums mass and pulls the survivor forward a plane"
```

---

### Task 7: Pads

**Files:**
- Modify: `prototypes/agents-hero/layers.html` — `placeTargets`, `arriveAt`, target rendering

**Interfaces:**
- Consumes: `HeroLaw.padAnchors`, `HeroLaw.canClaim`.
- Produces: four deterministic pads, claimable only by converged front-plane runners, each holding a decaying lit state.

- [ ] **Step 1: Replace random placement with the deterministic anchors**

Replace the whole body of `placeTargets()`:

```js
function placeTargets() {
  targets = [];
  if (!P().targets) return;
  // Deterministic, derived from the copy's bounding box. Round 2 placed
  // these randomly, which made the composition differ on every load and
  // come out lopsided.
  for (const a of HeroLaw.padAnchors(env.w, env.h, cell, ox, oy)) {
    targets.push({ i: a.i, j: a.j, flash: 0, lit: 0, rings: [] });
  }
}
```

- [ ] **Step 2: Gate arrival on mass and plane**

Replace `arriveAt`:

```js
function arriveAt(r, ni, nj) {
  const t = r.target;
  if (!t || t.i !== ni || t.j !== nj) return false;
  // Arrival is earned: only a front-plane runner that has converged
  // enough to clear the mass gate can claim a pad. Anything lighter
  // passes through and keeps going.
  if (!HeroLaw.canClaim(r, P().claimMass)) return false;
  t.flash = 1;
  t.lit = 1;
  t.rings.push({ r: 3, a: 0.9 });
  burst(px(ni), py(nj), 10, 0.85, r.accent);
  r.dying = true;
  return true;
}
```

- [ ] **Step 3: Decay the lit state over ~8s**

In `update()`, in the loop over `targets`, add alongside the existing flash decay:

```js
t.lit = Math.max(0, t.lit - dt * 0.125);
```

In `draw()`, in the target rendering block, add `t.lit` as a floor under the pad's resting brightness so a claimed pad stays visible after its flash fades:

```js
const heat = Math.max(t.flash, t.lit * 0.55);
```

This replaces the existing `const heat = t.flash;` line.

- [ ] **Step 4: Draw pads on the front plane only**

Pad rendering must sit inside the `z === 0` iteration of the plane loop from Task 4, so pads are never scaled or parallaxed with the back planes.

- [ ] **Step 5: Verify**

Open `layers.html` with `targets` on, `planes` 3, `forkRate` around 0.05, `mergeWindow` around 0.14, `claimMass` 0.9. Check:
- Four pads, in the same places every reload, all clear of the hero copy.
- Light runners pass straight through a pad without triggering it.
- A pad only fires after a merge has produced a heavy front-plane runner.
- After firing, the pad stays faintly lit and fades over roughly 8 seconds.

Reload twice and confirm the pads land in identical positions.

```bash
NODE_PATH="$SCRATCH/node_modules" node prototypes/agents-hero/shoot.js \
  prototypes/agents-hero/layers.html /tmp/hero-t7
open /tmp/hero-t7/1280-dark-2s.png /tmp/hero-t7/1280-dark-25s.png
```

Expected: the 25s frame shows more lit pads than the 2s frame. That difference is exactly why the spec requires both captures.

If no pad ever fires, `claimMass` is above what merges actually produce — lower it toward 0.7 rather than weakening the gate in `canClaim`.

- [ ] **Step 6: Commit**

```bash
git add prototypes/agents-hero/layers.html
git commit -m "prototype: deterministic pads claimable only by converged front-plane runners"
```

---

### Task 8: Front-plane etch

**Files:**
- Modify: `prototypes/agents-hero/layers.html` — the etch write in `draw()`

**Interfaces:**
- Consumes: nothing new.
- Produces: residue written only by `z === 0` runners.

- [ ] **Step 1: Restrict the etch write**

In `draw()`, find the block that writes into `etchCtx` (around `runners.html:1202`, the comment reading *"Residue needs more weight on white than it does on black."*). Guard it:

```js
// Front plane only. Residue from all three turns to mud and fogs the
// depth cues the planes exist to create.
if (r.z === 0) {
  // ... existing etch write, unchanged
}
```

- [ ] **Step 2: Verify**

Open `layers.html`, set `etch` on, `substrate` to none, `planes` 3, and leave it for 30 seconds.

Expected: a faint accumulating circuit at the front, with the back planes still reading as separate live depths rather than dissolving into the residue.

Toggle `etch` off and on and confirm the buffer clears — the round-2 `clearEtch()` behavior must still work.

- [ ] **Step 3: Commit**

```bash
git add prototypes/agents-hero/layers.html
git commit -m "prototype: restrict etch residue to the front plane"
```

---

### Task 9: Presets and live controls

**Files:**
- Modify: `prototypes/agents-hero/layers.html` — `PRESETS`, `CONTROLS`, the control markup, `syncControlsFromParams`, the keyboard handler

**Interfaces:**
- Consumes: every param from Tasks 2-8.
- Produces: five preset tabs and live controls for all eight new parameters.

- [ ] **Step 1: Replace the preset list**

Replace the six round-2 presets with the five from the spec. Keep the existing `{id, name, title, params, body, chips}` shape so `mount()` needs no changes.

```js
const PRESETS = [
  {
    id: "flat",
    name: "flat",
    title: "1 — Flat",
    params: { planes: 1, forkRate: 0, parallax: 0 },
    body: "Round 2's engine, unchanged: one plane, no forking, no merging beyond the old collision. The control. Every other tab is judged against this, and if it ever stops looking like round 2 something has regressed.",
    chips: ["single plane", "no fork/merge", "the <b>control</b>"],
  },
  {
    id: "layered",
    name: "layered",
    title: "2 — Layered",
    params: {
      planes: 3,
      planeSpread: 0.5,
      forkRate: 0.05,
      forkDrop: 0.5,
      mergeWindow: 0.14,
      parallax: 1,
      targets: true,
      accentRatio: 0.7,
    },
    body: "The law at its defaults. Signals fork and fall back, converge and come forward, and the ones that have gathered enough mass claim a pad. Accent lives at the front, so orange marks what is closest and most active. This is the recommendation.",
    chips: [
      "three planes",
      "fork <b>and</b> merge",
      "accent at the front",
      "pads gated on mass",
    ],
  },
  {
    id: "converge",
    name: "converge",
    title: "3 — Converge",
    params: {
      planes: 3,
      forkRate: 0.02,
      mergeWindow: 0.2,
      targets: true,
      claimMass: 0.8,
      parallax: 1,
      accentRatio: 0.8,
    },
    body: "Merge dominates. Traffic funnels into a few heavy trunks that arrive often, and the field reads as a delivery network resolving. Tests whether the earned-arrival payoff actually lands — if convergence does not feel like a reward here, it will not anywhere.",
    chips: ["merge > fork", "heavy trunks", "frequent arrivals"],
  },
  {
    id: "diverge",
    name: "diverge",
    title: "4 — Diverge",
    params: {
      planes: 3,
      forkRate: 0.11,
      forkDrop: 0.75,
      mergeWindow: 0.08,
      targets: true,
      parallax: 1.4,
      accentRatio: 0.6,
    },
    body: "The opposite pole. Forks dominate, the field spreads and recedes into depth, and arrivals are rare enough to be an event. Useful less as a candidate than as the far end of the range — the shippable setting is somewhere between this and converge.",
    chips: ["fork > merge", "field recedes", "rare arrivals"],
  },
  {
    id: "circuit",
    name: "circuit",
    title: "5 — Circuit",
    params: {
      planes: 3,
      forkRate: 0.06,
      mergeWindow: 0.16,
      stepped: true,
      stepHold: 0.14,
      trailStyle: "segments",
      etch: true,
      substrate: "none",
      targets: true,
      speed: 92,
      trail: 200,
      parallax: 1,
    },
    body: "The chip reading of the same law. Motion quantizes to the lattice, trails break at every node, and front-plane residue accumulates a board that draws itself. Three depths of etched circuitry with live signals running the top layer.",
    chips: [
      "stepped motion",
      "segment trails",
      "front-plane etch",
      "reads as <b>fabrication</b>",
    ],
  },
];
```

- [ ] **Step 2: Add the control markup**

In the second control row, alongside the existing controls, add a range input per new numeric param and a number input for `planes`. Follow the exact markup of the existing `trail` control — a `<label>`, an `<input type="range">` with an id, and a `<span class="val">` with id `<name>Val`.

Ranges: `planes` 1-3 step 1; `planeSpread` 0-100 (÷100); `forkRate` 0-20 (÷100); `forkDrop` 0-100 (÷100); `mergeWindow` 4-30 (÷100); `massCurve` 20-120 (÷100); `claimMass` 40-200 (÷100); `parallax` 0-30 (÷10).

- [ ] **Step 3: Wire them live**

`planes` changes plane assignment for every runner, so it needs a scene rebuild like `cell` does (`layers.html`, the `cell` input handler). The other seven read from `env.params` each frame and need no rebuild.

Add each to `syncControlsFromParams()` so switching presets updates the sliders. Follow the existing pattern exactly — set `.value` on the input and `.textContent` on the `Val` span.

- [ ] **Step 4: Update the keyboard handler**

The handler maps `1`-`6`. Change it to `1`-`5` to match the new preset count. Leave `r`, `t`, `h`, and `v` as they are.

- [ ] **Step 5: Verify every preset and every control**

Open `layers.html`. For each tab 1-5: confirm the sliders update to that preset's values, and that the description matches what is on screen. Then drag every new slider through its full range on tab 2 and confirm none throws, none freezes, and `planes` rebuilds cleanly.

Confirm tab 1 still looks like `/tmp/hero-t2/1280-dark-2s.png`. That parity check is the whole point of the flat preset.

- [ ] **Step 6: Commit**

```bash
git add prototypes/agents-hero/layers.html
git commit -m "prototype: five presets and live controls for the layered-signals params"
```

---

### Task 10: Verification sweep and handoff

**Files:**
- Modify: `HANDOFF.md`

**Interfaces:**
- Consumes: everything.
- Produces: captured evidence across presets, themes, widths, and both timestamps, plus an updated handoff.

- [ ] **Step 1: Capture every preset**

```bash
for i in 0 1 2 3 4; do
  NODE_PATH="$SCRATCH/node_modules" node prototypes/agents-hero/shoot.js \
    prototypes/agents-hero/layers.html "/tmp/hero-final/p$i" "$i"
done
```

Expected: `no console errors` for all five, and an FPS readout at or above 58 at both widths for all five. Any preset below that bar is a finding, not a rounding error — record it.

- [ ] **Step 2: Judge the mobile case**

```bash
open /tmp/hero-final/p1/390-dark-2s.png /tmp/hero-final/p4/390-dark-2s.png
```

The spec flags three planes on a short stage as the case most likely to break. Check that the planes are still distinguishable at 390px and that the pads have not been squeezed into the copy band. If either fails, record it in `HANDOFF.md` under open questions — do not fix it here. Mobile tuning is its own decision, not a bug in this plan.

- [ ] **Step 3: Compare 2s against 25s**

```bash
open /tmp/hero-final/p1/1280-dark-2s.png /tmp/hero-final/p1/1280-dark-25s.png
open /tmp/hero-final/p4/1280-dark-2s.png /tmp/hero-final/p4/1280-dark-25s.png
```

Confirm the 25s frames show accumulated pad lighting and, on the circuit preset, accumulated etch. Confirm the 2s frames still read as a deliberate composition on their own — a visitor who leaves after three seconds sees something finished, not something half-drawn.

- [ ] **Step 4: Run the law tests once more**

```bash
node --test prototypes/agents-hero/law.test.js
```

Expected: PASS, 11 tests.

- [ ] **Step 5: Update the handoff**

In `HANDOFF.md`, replace the "Round 3 is designed but not built" note with a round-3 section in the same shape as rounds 1 and 2: the file, the five presets with one line each, and what the tabs are for. Add to the file table:

```markdown
| `prototypes/agents-hero/layers.html` | Round 3 — layered depth with fork/merge |
| `prototypes/agents-hero/law.js` | Pure law arithmetic, tested via `node --test` |
| `prototypes/agents-hero/shoot.js` | Screenshot harness (needs `NODE_PATH` — see below) |
```

Record under open questions whatever Steps 2 and 3 surfaced, plus the one question this round exists to answer: **where between converge and diverge the shipped setting sits.**

Confirm the strip command still covers everything new — it removes `prototypes/` wholesale, so `law.js`, `law.test.js`, and `shoot.js` are already covered.

- [ ] **Step 6: Commit**

```bash
git add HANDOFF.md
git commit -m "docs: record round 3 in the handoff"
```

---

## Self-review notes

Checked against the spec:

- Fork/merge law, mass and plane derivation → Tasks 1, 5, 6
- Depth via scale, softness, glow, parallax → Task 4
- Accent gated on depth, `accentRatio` as secondary filter → Task 4 Step 4
- Four deterministic pads, mass-gated claim, ~8s lit decay → Task 7
- Front-plane-only etch → Task 8
- Pointer keeping both roles → Task 4 Step 3 (parallax) plus untouched round-2 repel/block
- `Path2D` mass-tier trails **before** planes → Task 3, ordered ahead of Task 4
- Global runner cap, forking only below it → Task 5 Step 1
- Five presets → Task 9
- Captures at 2s and 25s, both themes, mobile width → `shoot.js`, Tasks 2 and 10
- `planes: 1` parity → Tasks 2, 4, 9, 10

One thing the spec left implicit that this plan decides: **head-on merges are still collisions** (Task 6). Merging two runners moving into each other would leave a survivor immediately reversing into its own trail. Recorded here because it is a behavior change a reviewer could reasonably question.
