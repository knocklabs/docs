# `/agents` hero round 4 — cinematic depth renderer implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `prototypes/agents-hero/depth.html` — the round-3 layered-signals simulation rendered cinematically: per-plane offscreen canvases with real defocus/fog/temperature, continuous depth transitions with via rings, a bloom pass, a mass→width trace ladder, and seeded pre-simulated composition.

**Architecture:** The law (`law.js`) and the simulation loop are untouched; every change is in the draw path and harness of a new gallery file copied from `layers.html`. New pure render arithmetic lives in `cine.js` (same classic-script + `module.exports` pattern as `law.js`), tested with `node --test`. Visual tasks are verified with the existing `shoot.js` Playwright harness.

**Tech Stack:** Vanilla JS, canvas 2D, `node --test`, playwright-core (pre-installed in the scratch worktree).

## Global constraints

- Spec: `docs/superpowers/specs/2026-08-06-agents-hero-cinematic-renderer-design.md`. Read it before starting.
- `prototypes/agents-hero/law.js` and `law.test.js` must not change. All round-3 rulings in `HANDOFF.md` stand — in particular `claimMass` stays above `1.00` and `setPlane()` stays the only writer of `r.z`.
- Canvas 2D only. No `ctx.filter` (Safari compat) — all blur is downscale/upscale resampling. No ES modules — `file://` blocks module loading; scripts are classic scripts.
- **Never run a bare `npm i` anywhere in this tree** — npm walks up to the real docs repo `package.json`. Playwright is used via `NODE_PATH=/Users/krisnasorathia/Code/docs/.claude/worktrees/scratch-shoot/node_modules`.
- Performance bar: `#fps` readout ≥ 58 at both 1280 and 390 widths, every preset.
- All commands run from the worktree root: `/Users/krisnasorathia/Code/docs/.claude/worktrees/agents-hero-design`.
- `shoot.js` usage (unchanged this round): `NODE_PATH=/Users/krisnasorathia/Code/docs/.claude/worktrees/scratch-shoot/node_modules node prototypes/agents-hero/shoot.js prototypes/agents-hero/depth.html <outDir> <presetIndex>` — captures both widths, both themes, 2s and 25s, and exits non-zero on any console error. One full run takes ~2 minutes.

---

### Task 1: `cine.js` — pure render arithmetic, TDD

**Files:**
- Create: `prototypes/agents-hero/cine.js`
- Test: `prototypes/agents-hero/cine.test.js`

**Interfaces:**
- Consumes: nothing (pure module, mirrors `law.js`'s structure).
- Produces: global `HeroCine` with exactly these members, used by every later task:
  - `layerSplit(zf, planes)` → `{lo, hi, wHi}` — integer layers a fractional depth draws into, and the deeper layer's cross-fade weight.
  - `approach(v, target, step)` → number — moves `v` toward `target` by at most `step`, arriving exactly.
  - `traceWidth(tier)` → number — px width for a `HeroLaw.massTier` value 0–4.
  - `grade(restraint, bloom, fog)` → `{bloomAlpha, fogAlpha, accentScale}`.
  - `viaAlpha(age, life)` → number 0–1.
  - `coolShift(rgb, k)` → `[r,g,b]` — mixes a color toward cool slate by `k`.
  - `mulberry32(seed)` → function returning deterministic floats in [0,1).
  - `spawnWeight(fx, fy)` → number — 1 in the margins, 0.25 inside the copy band.

- [ ] **Step 1: Write the failing tests**

Create `prototypes/agents-hero/cine.test.js`:

```js
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test prototypes/agents-hero/cine.test.js`
Expected: FAIL — `Cannot find module './cine.js'`.

- [ ] **Step 3: Write the implementation**

Create `prototypes/agents-hero/cine.js`:

```js
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
    viaAlpha,
    coolShift,
    mulberry32,
    spawnWeight,
  };
})();

if (typeof window !== "undefined") window.HeroCine = HeroCine;
if (typeof module !== "undefined" && module.exports) module.exports = HeroCine;
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test prototypes/agents-hero/cine.test.js`
Expected: PASS, all tests. Also run `node --test prototypes/agents-hero/law.test.js` — still PASS, untouched.

- [ ] **Step 5: Commit**

```bash
git add prototypes/agents-hero/cine.js prototypes/agents-hero/cine.test.js
git commit -m "feat: round 4 pure render arithmetic (HeroCine) with tests"
```

---

### Task 2: `depth.html` scaffold — copy, presets, params, controls

**Files:**
- Create: `prototypes/agents-hero/depth.html` (copied from `layers.html`, then edited)

**Interfaces:**
- Consumes: `HeroCine` (Task 1) — script include only in this task.
- Produces: the gallery file every later task edits; `DEFAULTS` gains `zEase: 0.4, bloom: 1, fog: 0.6, viaLife: 10`; `PRESETS` becomes exactly three entries with ids `layered`, `circuit`, `quiet` (indices 0, 1, 2 — the `shoot.js` preset indices used from here on).

- [ ] **Step 1: Copy the file and retitle**

```bash
cp prototypes/agents-hero/layers.html prototypes/agents-hero/depth.html
```

In `depth.html`, update the `<title>` and the visible round header text (search for the string "Round 3" / "layers" in the header markup near the top of `<body>`) to say round 4 / "depth — cinematic renderer". Add the `cine.js` include directly after the existing `law.js` one (`layers.html:633`):

```html
<script src="law.js"></script>
<script src="cine.js"></script>
```

- [ ] **Step 2: Extend `DEFAULTS`**

In the `DEFAULTS` object (search `const DEFAULTS`), after `parallax: 0,` add:

```js
        // Round 4 renderer params.
        zEase: 0.4, // seconds a runner takes to travel one plane of depth
        bloom: 1, // bloom pass strength; 0 disables the pass entirely
        fog: 0.6, // atmospheric fade toward bg per depth slice
        viaLife: 10, // seconds a fork/merge via ring persists
```

- [ ] **Step 3: Replace `PRESETS`**

Replace the entire `const PRESETS = [...]` array with:

```js
      const PRESETS = [
        {
          id: "layered",
          name: "layered",
          title: "1 — Layered",
          params: {
            planes: 3,
            planeSpread: 0.5,
            forkRate: 0.05,
            forkDrop: 0.5,
            mergeWindow: 0.14,
            merge: true,
            parallax: 1,
            targets: true,
            accentRatio: 0.7,
          },
          body: "The flowing signal field under the cinematic renderer: real defocus and fog between planes, visible dives and surfacings, bloom on what matters. This is the surface the converge/diverge tuning finally gets decided on.",
          chips: ["three planes", "luminous", "the recommendation"],
        },
        {
          id: "circuit",
          name: "circuit",
          title: "2 — Circuit",
          params: {
            planes: 3,
            forkRate: 0.06,
            mergeWindow: 0.16,
            merge: true,
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
          body: "The chip reading, lit: fresh residue glows briefly and cools into the permanent trace, while bloom-lit signals run the top layer of an accumulating board.",
          chips: ["stepped", "hot-then-cold etch", "fabrication"],
        },
        {
          id: "quiet",
          name: "quiet",
          title: "3 — Quiet",
          params: {
            planes: 3,
            planeSpread: 0.5,
            forkRate: 0.05,
            forkDrop: 0.5,
            mergeWindow: 0.14,
            merge: true,
            parallax: 1,
            targets: true,
            accentRatio: 0.4,
            bloom: 0.15,
            fog: 0.25,
          },
          body: "The same renderer graded down to round-3 restraint. The comparison floor, and the light-theme sanity check: if the design only works luminous, this tab shows it.",
          chips: ["graded down", "comparison floor"],
        },
      ];
```

- [ ] **Step 4: Add the four new sliders**

In the parameter column markup, find the existing `parallax` control row and add four rows directly after it, following its exact markup pattern (same classes, same label/input/value-span structure), with these ids and ranges:

| id | min | max | value | value span id |
| --- | --- | --- | --- | --- |
| `zEase` | 10 | 100 | 40 | `zEaseVal` |
| `bloom` | 0 | 150 | 100 | `bloomVal` |
| `fog` | 0 | 100 | 60 | `fogVal` |
| `viaLife` | 20 | 200 | 100 | `viaLifeVal` |

Wire them by adding four entries to the existing slider-wiring loop (the `for (const [id, key, valId, divisor] of [...]` block that already handles `planeSpread` … `parallax`):

```js
        ["zEase", "zEase", "zEaseVal", 100],
        ["bloom", "bloom", "bloomVal", 100],
        ["fog", "fog", "fogVal", 100],
        ["viaLife", "viaLife", "viaLifeVal", 10],
```

And add to `syncControlsFromParams()`, following the `parallax` pattern at the end of that function:

```js
        document.getElementById("zEase").value = Math.round(env.params.zEase * 100);
        document.getElementById("zEaseVal").textContent = env.params.zEase.toFixed(2);
        document.getElementById("bloom").value = Math.round(env.params.bloom * 100);
        document.getElementById("bloomVal").textContent = env.params.bloom.toFixed(2);
        document.getElementById("fog").value = Math.round(env.params.fog * 100);
        document.getElementById("fogVal").textContent = env.params.fog.toFixed(2);
        document.getElementById("viaLife").value = Math.round(env.params.viaLife * 10);
        document.getElementById("viaLifeVal").textContent = env.params.viaLife.toFixed(1);
```

- [ ] **Step 5: Verify with a smoke shoot**

Run: `NODE_PATH=/Users/krisnasorathia/Code/docs/.claude/worktrees/scratch-shoot/node_modules node prototypes/agents-hero/shoot.js prototypes/agents-hero/depth.html /tmp/r4-scaffold 0`
Expected: exits 0, "no console errors", fps readout ≥ 58. The imagery still looks like round 3 — only presets/params changed. Read one captured frame to confirm the stage renders.

- [ ] **Step 6: Commit**

```bash
git add prototypes/agents-hero/depth.html
git commit -m "feat: round 4 scaffold — depth.html with new presets and renderer params"
```

---

### Task 3: layer-canvas architecture — cached lattice, defocus, fog, temperature

This is the structural task: `draw()` stops painting planes directly onto the main canvas and instead paints each plane into its own offscreen layer, then composites back-to-front with fog between slices.

**Files:**
- Modify: `prototypes/agents-hero/depth.html` — `RunnerScene`'s `layout()`, `draw()`, and the `resize()` path.

**Interfaces:**
- Consumes: `HeroCine.coolShift`, `HeroCine.grade`.
- Produces: inside `RunnerScene`, for later tasks: `layerCv[z]` / `layerCtx[z]` offscreen canvases (index 0 = front), `latticeCv[z]` cached substrate canvases, `RES = [1, 0.5, 0.32]` per-plane resolution factors, and a `drawPlaneContent(lctx, z, gr)` function that later tasks extend. `draw(ctx)` keeps its signature.

- [ ] **Step 1: Allocate layers in `layout()`**

In `layout()` (after the etch canvas allocation), add:

```js
          // Per-plane offscreen layers. Front plane at full DPR; back planes
          // at reduced resolution — the upscale on composite IS the defocus,
          // so their blur hides both the resolution and the missing DPR.
          RES = [1, 0.5, 0.32];
          layerCv = [];
          layerCtx = [];
          latticeCv = [];
          for (let z = 0; z < PLANE_MAX; z++) {
            const res = RES[z] * (z === 0 ? env.dpr : 1);
            const cv = document.createElement("canvas");
            cv.width = Math.max(1, Math.round(env.w * res));
            cv.height = Math.max(1, Math.round(env.h * res));
            layerCv.push(cv);
            layerCtx.push(cv.getContext("2d"));
            latticeCv.push(null); // built lazily per (plane, substrate, theme)
          }
```

Declare `let layerCv = [], layerCtx = [], latticeCv = [], RES = [1, 0.5, 0.32];` alongside the existing scene-level `let etchCv = null` declarations. Also invalidate the lattice cache when the substrate or cell changes: `latticeCv = [null, null, null];` at the top of `layout()`, and add a `clearLatticeCache()` method next to `clearEtch()` that does the same, called from the harness's substrate `change` listener and the theme toggle (`setTheme` → `if (scene) scene.clearLatticeCache()`).

- [ ] **Step 2: Build the cached lattice**

Add inside `RunnerScene`:

```js
        // The substrate is static per (resize, cell, substrate, theme): render
        // it once per plane and blit. Deletes the ~2,850 per-frame fillRects
        // the handoff flagged as the largest draw cost — that saving funds
        // the bloom and compositing passes this round adds.
        function buildLattice(z) {
          const p = P();
          const res = RES[z] * (z === 0 ? env.dpr : 1);
          const cv = document.createElement("canvas");
          cv.width = layerCv[z].width;
          cv.height = layerCv[z].height;
          const g = cv.getContext("2d");
          g.setTransform(res, 0, 0, res, 0, 0);
          applyPlaneTransform(g, z);
          const st = HeroLaw.planeStyle(z, clamp(p.planes, 1, 3), p.planeSpread);
          const depth = z / Math.max(1, PLANE_MAX - 1);
          const gridCol = HeroCine.coolShift(env.palette.grid, depth * 0.6);
          if (p.substrate === "dots") {
            g.fillStyle = rgba(gridCol, lerp(0.032, 0.085, env.restraint) * st.dim);
            for (let j = 0; j < rows; j++)
              for (let i = 0; i < cols; i++)
                g.fillRect(px(i) - 0.6, py(j) - 0.6, 1.2, 1.2);
          } else if (p.substrate === "lines") {
            g.strokeStyle = rgba(gridCol, lerp(0.022, 0.05, env.restraint) * st.dim);
            g.lineWidth = 1;
            g.beginPath();
            for (let i = 0; i < cols; i++) {
              g.moveTo(px(i) + 0.5, 0);
              g.lineTo(px(i) + 0.5, env.h);
            }
            for (let j = 0; j < rows; j++) {
              g.moveTo(0, py(j) + 0.5);
              g.lineTo(env.w, py(j) + 0.5);
            }
            g.stroke();
          }
          latticeCv[z] = cv;
        }

        // The plane's scale-about-centre transform, shared by the lattice
        // cache and the live layer draw so they can never disagree.
        function applyPlaneTransform(g, z) {
          const p = P();
          const st = HeroLaw.planeStyle(z, clamp(p.planes, 1, 3), p.planeSpread);
          g.translate(env.w / 2, env.h / 2);
          g.scale(st.scale, st.scale);
          g.translate(-env.w / 2, -env.h / 2);
        }
```

Note the lattice bakes `env.restraint`, so the restraint slider's `input` listener must also call `scene.clearLatticeCache()`.

- [ ] **Step 3: Restructure `draw()` into layer passes plus composite**

Replace the body of the plane loop in `draw()` (`for (let z = nPlanes - 1; z >= 0; z--) { ... }` — currently everything from `ctx.save()` through `ctx.restore()`) with this structure. The inner content blocks — pointer field, endpoints, etch composite, the trails/heads batching, the batch stroke loop — **move verbatim** into `drawPlaneContent`, with `ctx` renamed to `lctx` and the substrate block deleted (the cache replaces it):

```js
            const gr = HeroCine.grade(r01, p.bloom, p.fog);

            for (let z = nPlanes - 1; z >= 0; z--) {
              const res = RES[z] * (z === 0 ? env.dpr : 1);
              const lctx = layerCtx[z];
              lctx.setTransform(1, 0, 0, 1, 0, 0);
              lctx.clearRect(0, 0, layerCv[z].width, layerCv[z].height);
              lctx.setTransform(res, 0, 0, res, 0, 0);
              if (!latticeCv[z]) buildLattice(z);
              lctx.drawImage(latticeCv[z], 0, 0, env.w, env.h);
              lctx.save();
              applyPlaneTransform(lctx, z);
              drawPlaneContent(lctx, z, gr);
              lctx.restore();

              /* composite this depth slice, back to front ---------------- */
              // Parallax moved from the per-plane transform to the composite
              // offset: the whole layer (lattice included) rides it, and the
              // front plane never moves so pads stay anchored.
              let dx = 0, dy = 0;
              if (z > 0 && ptr.active && p.parallax > 0) {
                const depth = z / (nPlanes - 1);
                dx = (ptr.x - env.w / 2) * -0.012 * p.parallax * depth;
                dy = (ptr.y - env.h / 2) * -0.012 * p.parallax * depth;
              }
              ctx.drawImage(layerCv[z], dx, dy, env.w, env.h);

              // Fog accumulates over depth: each slice fades everything
              // already composited toward the background before the nearer
              // slice draws on top — atmospheric perspective, not dimming.
              if (z > 0 && gr.fogAlpha > 0) {
                ctx.fillStyle = rgba(pal.bg, gr.fogAlpha);
                ctx.fillRect(0, 0, env.w, env.h);
              }
            }
```

`drawPlaneContent(lctx, z, gr)` is a new function inside `RunnerScene` containing, in this order, the blocks moved from the old loop body: the `z === 0` guard block (pointer field, endpoints, etch composite) and then the trails/heads/batch-stroke code. Inside it, apply temperature to neutrals: where the moved code uses `pal.neutral` for strokes/fills, use `HeroCine.coolShift(pal.neutral, (z / Math.max(1, nPlanes - 1)) * 0.6)` instead (accent stays accent — orange is front-plane-only by the law, so it never needs cooling). Delete the `+ st.soften` term from both `lineWidth` computations inside the moved code — defocus is now real resampling, and wide-and-faint was round 3's failed fake.

The sparks block after the plane loop stays on the main `ctx`, unchanged.

- [ ] **Step 4: Verify — smoke shoot both remaining presets**

Run: `NODE_PATH=/Users/krisnasorathia/Code/docs/.claude/worktrees/scratch-shoot/node_modules node prototypes/agents-hero/shoot.js prototypes/agents-hero/depth.html /tmp/r4-layers 0`
Then the same with preset `1`.
Expected: exit 0, fps ≥ 58 at both widths. Read the 1280-dark-25s frames: back planes visibly softer (resampled) and hazier than the front; no doubled lattice, no smearing, pads still in their corners. If fps < 58, drop `RES` to `[1, 0.45, 0.25]` before anything else.

- [ ] **Step 5: Commit**

```bash
git add prototypes/agents-hero/depth.html
git commit -m "feat: per-plane layer canvases with cached lattice, resample defocus, fog, temperature"
```

---

### Task 4: continuous depth — `zf` easing, cross-fade, via rings

**Files:**
- Modify: `prototypes/agents-hero/depth.html` — `spawn()`, the fork/merge sites in `advanceCell()`, `update()`, `drawPlaneContent()`.

**Interfaces:**
- Consumes: `HeroCine.layerSplit`, `HeroCine.approach`, `HeroCine.viaAlpha`, `RES`/layer machinery from Task 3.
- Produces: `r.zf` (render-side float depth; `r.z` remains the law's integer, written only by `setPlane`), and a scene-level `vias` array of `{i, j, z, age, accent, kind}` with `kind` `"via"` (this task) or `"pad"` (Task 6).

- [ ] **Step 1: Add `zf` and the vias array**

In `spawn()`, in the runner literal after `mass: 1,` add `zf: 0,`; then directly after the existing `setPlane(r, zPicked, nPlanes, p.planeSpread);` call add `r.zf = r.z;` (a fresh spawn starts at its own depth — no dive-in on entry). Declare `let vias = [];` next to `let sparks = [];` and clear it in `resize`/`rebuild` alongside `runners = []`.

- [ ] **Step 2: Make forks dive and merges surface, leaving vias**

In `advanceCell()`'s fork block, directly after the existing `setPlane(child, childZ, nPlanes, p.planeSpread);` line, add:

```js
              // The child is born AT the parent's depth and visibly sinks to
              // its own — the transition is the point of round 4.
              child.zf = r.z;
              if (child.z !== r.z)
                vias.push({ i: ni, j: nj, z: r.z, age: 0, accent: r.accent, kind: "via" });
```

In the merge block, directly after the existing `setPlane(other, zNew, nPlanes, p.planeSpread);` line (inside the `if (zNew !== other.z)` branch — restructure to capture the old plane first):

```js
                const zOld = other.z;
                const zNew = HeroLaw.mergePlane(other.z, r.z);
                if (zNew !== zOld) {
                  setPlane(other, zNew, nPlanes, p.planeSpread);
                  // Surface visibly from the depth the meeting happened at.
                  vias.push({ i: ni, j: nj, z: zOld, age: 0, accent: other.accent, kind: "via" });
                }
```

(`other.zf` is left alone — it is already at `zOld` and now eases toward the new `other.z`.)

- [ ] **Step 3: Ease `zf` and age vias in `update()`**

In the per-runner loop of `update()`, after the existing `if (r.z >= nPlanes) setPlane(...)` guard, add:

```js
              // Render depth chases law depth. p.zEase seconds per plane of
              // travel; approach() terminates exactly so settled runners
              // draw into a single layer with no residual cross-fade.
              r.zf = HeroCine.approach(r.zf, r.z, dt / Math.max(0.05, p.zEase));
```

After the targets update block at the end of `update()`, add:

```js
            for (const v of vias) v.age += dt;
            vias = vias.filter((v) => v.age < p.viaLife);
            if (vias.length > 80) vias = vias.slice(vias.length - 80);
```

- [ ] **Step 4: Cross-fade runners between layers, draw vias**

In `drawPlaneContent(lctx, z, gr)`, the runner loop currently selects `if (r.z !== z) continue;`. Replace that selection with:

```js
                const split = HeroCine.layerSplit(r.zf, nPlanes);
                let zAlpha;
                if (split.lo === z) zAlpha = 1 - split.wHi;
                else if (split.hi === z && split.wHi > 0) zAlpha = split.wHi;
                else continue;
```

Fold `zAlpha` into the existing brightness paths: for segments-style trails multiply the stroke alpha by `zAlpha`; for ribbon batches use `const gb = glowBucket(r.bright * r.fade * zAlpha);` in place of the current `glowBucket(r.bright * r.fade)`; multiply the head-dot and head-glow alphas by `zAlpha`. Style (width, planeA) continues to come from the layer being drawn into — the cross-fade between the two layers' transforms is what reads as travel through focus.

Then add via drawing at the end of `drawPlaneContent`, before the function returns (drawn on every plane, in that plane's transform, so a via left at depth stays at depth):

```js
              /* via rings: fork/merge events mark the board ------------- */
              for (const v of vias) {
                if (v.z !== z || v.kind !== "via") continue;
                const a = HeroCine.viaAlpha(v.age, p.viaLife);
                if (a <= 0.01) continue;
                const st = HeroLaw.planeStyle(z, nPlanes, p.planeSpread);
                lctx.strokeStyle = rgba(v.accent ? pal.accent : pal.dim, a * 0.55 * st.dim * baseA);
                lctx.lineWidth = 1;
                lctx.beginPath();
                lctx.arc(px(v.i), py(v.j), 3.2, 0, Math.PI * 2);
                lctx.stroke();
                lctx.fillStyle = rgba(v.accent ? pal.accent : pal.dim, a * 0.3 * st.dim * baseA);
                lctx.beginPath();
                lctx.arc(px(v.i), py(v.j), 1.1, 0, Math.PI * 2);
                lctx.fill();
              }
```

- [ ] **Step 5: Verify**

Run the preset-0 smoke shoot (same command as Task 3, outDir `/tmp/r4-zf`). Expected: exit 0, fps ≥ 58. Read the 25s frame: via rings visible at branch points. Then verify the transition live: the shoot can't show motion, so open the file (`open prototypes/agents-hero/depth.html`), set `zEase` to its max (1.0s) via the slider, and watch a fork — the child must visibly sink over ~a second, not pop. Confirm settled runners show no double-image (approach() must reach exactly).

- [ ] **Step 6: Commit**

```bash
git add prototypes/agents-hero/depth.html
git commit -m "feat: continuous depth with cross-fade transitions and via rings"
```

---

### Task 5: bloom pass

**Files:**
- Modify: `prototypes/agents-hero/depth.html` — `layout()`, `draw()`.

**Interfaces:**
- Consumes: layer machinery (Task 3), `vias` (Task 4), `HeroCine.grade`.
- Produces: `bloomCv`/`bloomCtx` (¼ res) and `bloomCv2`/`bloomCtx2` (⅛ res) scene canvases; a `drawBrightPass(bctx)` function later tasks extend.

- [ ] **Step 1: Allocate the bloom buffers**

In `layout()` after the layer allocation:

```js
          bloomCv = document.createElement("canvas");
          bloomCv.width = Math.max(1, Math.round(env.w * 0.25));
          bloomCv.height = Math.max(1, Math.round(env.h * 0.25));
          bloomCtx = bloomCv.getContext("2d");
          bloomCv2 = document.createElement("canvas");
          bloomCv2.width = Math.max(1, Math.round(env.w * 0.125));
          bloomCv2.height = Math.max(1, Math.round(env.h * 0.125));
          bloomCtx2 = bloomCv2.getContext("2d");
```

with matching `let bloomCv = null, bloomCtx = null, bloomCv2 = null, bloomCtx2 = null;` declarations at scene level.

- [ ] **Step 2: The bright pass**

Add inside `RunnerScene`:

```js
        // Everything that should glow, drawn once into the ¼-res buffer in
        // plain stage coordinates. Blur comes free from the two resamples.
        function drawBrightPass(bctx) {
          const p = P();
          const nPlanes = clamp(p.planes, 1, 3);
          bctx.setTransform(0.25, 0, 0, 0.25, 0, 0);
          bctx.clearRect(0, 0, env.w, env.h);

          for (const r of runners) {
            if (r.dying) continue;
            const split = HeroCine.layerSplit(r.zf, nPlanes);
            const frontness = 1 - HeroCine.layerSplit(r.zf, nPlanes).lo / Math.max(1, nPlanes - 1);
            // Signal heads: accent always, neutral only when heavy.
            const tier = HeroLaw.massTier(r.mass);
            if (!r.accent && tier < 4) continue;
            const st = HeroLaw.planeStyle(split.lo, nPlanes, p.planeSpread);
            const sx = env.w / 2 + (r.head.x - env.w / 2) * st.scale;
            const sy = env.h / 2 + (r.head.y - env.h / 2) * st.scale;
            bctx.globalAlpha = 0.7 * r.bright * frontness;
            const rr = r.accent ? 14 : 9;
            bctx.drawImage(r.accent ? env.glowAccent : env.glowNeutral, sx - rr, sy - rr, rr * 2, rr * 2);
          }

          // Lit pads and their rings.
          for (const t of targets) {
            const heat = Math.max(t.flash, t.lit * 0.55);
            if (heat < 0.05) continue;
            bctx.globalAlpha = heat;
            bctx.drawImage(env.glowAccent, px(t.i) - 22, py(t.j) - 22, 44, 44);
          }

          // Fresh vias flare briefly.
          for (const v of vias) {
            if (v.age > 1.2 || !v.accent) continue;
            bctx.globalAlpha = (1 - v.age / 1.2) * 0.6;
            bctx.drawImage(env.glowAccent, px(v.i) - 10, py(v.j) - 10, 20, 20);
          }

          // Sparks are already glow sprites; brighten them through bloom.
          for (const s of sparks) {
            bctx.globalAlpha = clamp(s.life, 0, 1) * 0.6;
            bctx.drawImage(s.accent ? env.glowAccent : env.glowNeutral, s.x - 8, s.y - 8, 16, 16);
          }
          bctx.globalAlpha = 1;
        }
```

- [ ] **Step 3: Blur and composite in `draw()`**

At the end of `draw()`, after the sparks block:

```js
            /* bloom ---------------------------------------------------- */
            if (gr.bloomAlpha > 0.01) {
              drawBrightPass(bloomCtx);
              // Two resamples ≈ a cheap gaussian: ¼ → ⅛ → composite at full.
              bloomCtx2.setTransform(1, 0, 0, 1, 0, 0);
              bloomCtx2.clearRect(0, 0, bloomCv2.width, bloomCv2.height);
              bloomCtx2.drawImage(bloomCv, 0, 0, bloomCv2.width, bloomCv2.height);
              // Additive bloom dies on white: the light theme composites the
              // same buffer as soft colored halos instead.
              ctx.globalCompositeOperation = pal.dark ? "lighter" : "source-over";
              ctx.globalAlpha = gr.bloomAlpha * (pal.dark ? 1 : 0.35);
              ctx.drawImage(bloomCv2, 0, 0, env.w, env.h);
              ctx.globalAlpha = 1;
              ctx.globalCompositeOperation = "source-over";
            }
```

(`gr` is computed at the top of `draw()` since Task 3; sparks/bloom run outside the plane loop so `gr` must be in scope there — it already is.)

- [ ] **Step 3b: Grade accent allocation with restraint**

In `spawn()`, the accent gate currently rolls `Math.random() < p.accentRatio`. Change it to:

```js
          const isAccent =
            boosted ||
            ((nPlanes === 1 || zPicked === 0) &&
              Math.random() <
                p.accentRatio *
                  HeroCine.grade(env.restraint, p.bloom, p.fog).accentScale);
```

This is the spec's "restraint grades bloom, fog, and accent allocation together": pulled to whisper, the field goes near-monochrome as well as dim.

- [ ] **Step 4: Verify**

Smoke shoot presets 0 and 2 (`/tmp/r4-bloom`). Expected: exit 0, fps ≥ 58 both widths. Read 1280-dark-25s of preset 0: accent heads and lit pads carry a soft halo that bleeds beyond their sprite; the field reads lit, not smudged. Read 1280-light-25s: no gray wash over the page — halos read as soft color. Read preset 2 (quiet): bloom near-invisible, confirming the `bloom` param gates the pass.

- [ ] **Step 5: Commit**

```bash
git add prototypes/agents-hero/depth.html
git commit -m "feat: quarter-res bloom pass, additive on dark, halos on light"
```

---

### Task 6: trace hierarchy — width ladder, trunk cores, turn pads, lit terminals

**Files:**
- Modify: `prototypes/agents-hero/depth.html` — `drawPlaneContent()`, `advanceCell()`, endpoint drawing.

**Interfaces:**
- Consumes: `HeroCine.traceWidth`, `vias` (`kind: "pad"`), bloom bright pass (extends nothing — trunk heads already glow via the tier gate in Task 5).
- Produces: nothing new for later tasks.

- [ ] **Step 1: Replace the width curve with the ladder**

In `drawPlaneContent`, both `lineWidth` computations currently call `HeroLaw.widthForMass(TIER_REP_MASS[...], base, p.massCurve)`. Replace both with `HeroCine.traceWidth(tier)` (segments style: `HeroCine.traceWidth(HeroLaw.massTier(r.mass))`; ribbon batches: `HeroCine.traceWidth(b.tier)`). Delete the now-unused `TIER_REP_MASS` constant.

The ladder makes `massCurve` inert, and a control that does nothing is a trap — remove it entirely: the slider row from the HTML, its entry in the wiring array, its lines in `syncControlsFromParams`, and the `massCurve` key from `DEFAULTS`. (`HeroLaw.widthForMass` itself stays — `law.js` is untouched.)

- [ ] **Step 2: Bright core on trunks**

In the ribbon-batch stroke loop, after the existing `ctx.stroke(b.path)` (now `lctx.stroke(b.path)`), add:

```js
                if (b.tier >= 4) {
                  // Trunks carry a bright core inside the wide stroke — the
                  // "lit conductor" read that makes mass legible at a glance.
                  lctx.strokeStyle = rgba(
                    b.accent ? pal.hot : pal.neutral,
                    Math.pow(fade, 1.6) * planeA * glow * 0.5,
                  );
                  lctx.lineWidth = 1.2;
                  lctx.stroke(b.path);
                }
```

For segments style, add the equivalent inside the segment loop after its `stroke()`: same condition (`HeroLaw.massTier(r.mass) >= 4`), same 1.2px core using the segment's own alpha times 0.6.

- [ ] **Step 3: Turn pads on heavy trunks**

In `advanceCell()`, at the very end where the runner commits its new direction (`r.d = nd;`), add before that assignment:

```js
          if (nd !== r.d && HeroLaw.massTier(r.mass) >= 4)
            vias.push({ i: ni, j: nj, z: r.z, age: 0, accent: r.accent, kind: "pad" });
```

And in the via renderer in `drawPlaneContent`, handle the kind: `"pad"` draws a small filled square instead of a ring:

```js
                if (v.kind === "pad") {
                  lctx.fillStyle = rgba(v.accent ? pal.accent : pal.dim, a * 0.5 * st.dim * baseA);
                  lctx.fillRect(px(v.i) - 2, py(v.j) - 2, 4, 4);
                  continue;
                }
```

Placement: in the via loop, keep the `v.z !== z` skip and the alpha computation, delete the `v.kind !== "via"` clause from the skip condition, and insert this `"pad"` branch after `a` and `st` are computed — so pads and vias share the plane filter and lifecycle, and only the shape differs.

- [ ] **Step 4: Lit terminals**

In the endpoint block (front plane only, inside `drawPlaneContent`), double the terminal footprint: outer square `strokeRect(x - 6, y - 6, 12, 12)` at the existing dim stroke, keep the existing inner `strokeRect(x - 4, ...)` as the second frame, and raise the idle glow so terminals read as sockets even unlit: change the heat gate `if (heat > 0.02)` to always draw the glow sprite with `ctx.globalAlpha = (0.12 + heat * 0.6)`.

- [ ] **Step 5: Verify**

Smoke shoot preset 0 (`/tmp/r4-traces`). Expected: exit 0, fps ≥ 58. Read 1280-dark-25s: at least three visibly distinct stroke weights; merged trunks read heavy with a bright core; terminals visible even unlit; small pads dot heavy trunks' corners. Read 390-dark-25s: hierarchy still legible at mobile width.

- [ ] **Step 6: Commit**

```bash
git add prototypes/agents-hero/depth.html
git commit -m "feat: trace hierarchy — width ladder, trunk cores, turn pads, lit terminals"
```

---

### Task 7: composition — seeded weighted spawning and pre-simulation

**Files:**
- Modify: `prototypes/agents-hero/depth.html` — `seed()`, `spawnFromEdge()`, the scene API, `mount()`.

**Interfaces:**
- Consumes: `HeroCine.mulberry32`, `HeroCine.spawnWeight`.
- Produces: `scene.presim(seconds)`.

- [ ] **Step 1: Weighted, seeded interior seeding**

Replace `seed()`:

```js
        function seed() {
          // Deterministic placement per stage size: the t=0 composition is
          // designed, not rolled. Live spawns after this stay Math.random —
          // only the opening frame needs to be reproducible.
          const rng = HeroCine.mulberry32(cols * 7919 + rows * 104729);
          for (let k = 0; k < targetCount(); k++) {
            let i = 0, j = 0, tries = 0;
            do {
              i = 1 + Math.floor(rng() * (cols - 2));
              j = 1 + Math.floor(rng() * (rows - 2));
            } while (
              rng() > HeroCine.spawnWeight(px(i) / env.w, py(j) / env.h) &&
              ++tries < 8
            );
            const r = spawn(i, j, Math.floor(rng() * 4), false);
            if (r) r.age = rng() * 4;
          }
        }
```

- [ ] **Step 2: Weighted edge refills**

Replace `spawnFromEdge()`'s body with a rejection-sampled version using `Math.random` (live refills need no determinism):

```js
        function spawnFromEdge() {
          for (let tries = 0; tries < 4; tries++) {
            const edge = randInt(0, 3);
            let i, j, d;
            if (edge === 0) { i = 0; j = randInt(0, rows - 1); d = 0; }
            else if (edge === 1) { i = cols - 1; j = randInt(0, rows - 1); d = 2; }
            else if (edge === 2) { i = randInt(0, cols - 1); j = 0; d = 1; }
            else { i = randInt(0, cols - 1); j = rows - 1; d = 3; }
            // Bias entries toward the margins so refills keep the copy band
            // clear; a runner may still wander in, which is fine — the veil
            // handles legibility, this handles density.
            if (Math.random() <= HeroCine.spawnWeight(px(i) / env.w, py(j) / env.h)) {
              spawn(i, j, d, false);
              return;
            }
          }
        }
```

(Note the direction fix ships with the structure: edge 1 previously spawned with `d = 2` pointing back out — keep `d = 2` (leftward, into the field) exactly as the original: edge 1 is the right edge and `DIRS[2] = [-1, 0]` moves left, which is inward. Do not change directions; only add the weighting.)

- [ ] **Step 3: Pre-simulation**

The returned scene object is currently an object literal; capture it so methods can call each other:

```js
        const api = {
          /* ...existing methods unchanged... */
          presim(seconds) {
            // Advance the law before first paint so t=0 is a composed image
            // — trails mid-flight, maybe a via or two — rather than a grid
            // warming up. Sparks are cleared so the frame doesn't open on an
            // explosion; vias and etch keep their accumulated state.
            const step = 1 / 60;
            for (let t = 0; t < seconds; t += step) api.update(step);
            sparks = [];
          },
        };
        return api;
```

In `mount()`, after `scene = RunnerScene(env);` add `scene.presim(4);`. Also call it after `scene.resize()` in the harness `resize()` path? No — resize during a live session should not jump 4 seconds; only `mount` pre-simulates. Leave `resize` as is.

- [ ] **Step 4: Verify**

Full shoot of preset 0 (`/tmp/r4-comp`). Expected: exit 0, fps ≥ 58. Read the **2s** frames (dark, both widths): the frame stands alone — several trails already mid-flight, density in the margins, copy band clear. Reload-consistency: run the shoot twice and compare the two 1280-dark-2s frames — compositions should be recognizably similar (same seeded placements; runner positions may differ slightly since live spawn timing uses `Math.random`).

- [ ] **Step 5: Commit**

```bash
git add prototypes/agents-hero/depth.html
git commit -m "feat: seeded weighted composition and 4s pre-simulation"
```

---

### Task 8: circuit etch — hot residue cooling into the permanent trace

**Files:**
- Modify: `prototypes/agents-hero/depth.html` — `layout()`, the etch write/composite block in `drawPlaneContent`, `clearEtch()`.

**Interfaces:**
- Consumes: existing etch machinery (`etchCv`/`etchCtx`), bloom pass (no change — hot etch is bright on its own).
- Produces: nothing for later tasks.

- [ ] **Step 1: Allocate the hot buffer**

In `layout()`, mirror the existing `etchCv` allocation as `etchHotCv`/`etchHotCtx` (same size, same transform). Declare at scene level next to `etchCv`. In `clearEtch()`, clear both buffers.

- [ ] **Step 2: Write hot, decay fast, composite additively**

In the etch block inside `drawPlaneContent` (front-plane guard), the per-frame decay currently runs once on `etchCtx`. Add the hot buffer's faster decay beside it:

```js
                  etchHotCtx.globalCompositeOperation = "destination-out";
                  etchHotCtx.fillStyle = `rgba(0,0,0,${Math.min(1, p.etchDecay * 14)})`;
                  etchHotCtx.fillRect(0, 0, env.w, env.h);
                  etchHotCtx.globalCompositeOperation = "source-over";
```

In the per-runner residue write loop, after the existing `etchCtx` stroke of each segment, write the same segment into `etchHotCtx` with the same plane transform mirroring, but hot: `strokeStyle = rgba(r.accent ? pal.hot : pal.accent, 0.5 * rst.dim)` on dark (`pal.accent` at `0.4 * rst.dim` on light), `lineWidth 1.4`. Extract the shared transform/moveTo/lineTo into a small local helper `writeResidue(g, style, width)` so the two writes cannot drift apart:

```js
                    const writeResidue = (g, style, width) => {
                      g.save();
                      g.translate(env.w / 2, env.h / 2);
                      g.scale(rst.scale, rst.scale);
                      g.translate(-env.w / 2, -env.h / 2);
                      g.strokeStyle = style;
                      g.lineWidth = width;
                      g.beginPath();
                      g.moveTo(last.x, last.y);
                      g.lineTo(r.head.x, r.head.y);
                      g.stroke();
                      g.restore();
                    };
                    writeResidue(etchCtx, rgba(colFor(r), (pal.dark ? 0.32 : 0.55) * rst.dim), 1);
                    writeResidue(
                      etchHotCtx,
                      pal.dark
                        ? rgba(r.accent ? pal.hot : pal.accent, 0.5 * rst.dim)
                        : rgba(pal.accent, 0.4 * rst.dim),
                      1.4,
                    );
```

After the existing cold-buffer composite (`ctx.drawImage(etchCv, ...)` — now `lctx`), composite the hot buffer:

```js
                  lctx.globalCompositeOperation = pal.dark ? "lighter" : "source-over";
                  lctx.globalAlpha = lerp(0.5, 0.95, r01);
                  lctx.drawImage(etchHotCv, 0, 0, env.w, env.h);
                  lctx.globalAlpha = 1;
                  lctx.globalCompositeOperation = "source-over";
```

- [ ] **Step 3: Verify**

Full shoot of preset 1 (`/tmp/r4-etch`). Expected: exit 0, fps ≥ 58. Read 1280-dark-2s: fresh trails carry a warm glowing edge. Read 1280-dark-25s: an accumulated board where recent paths are visibly warmer than old cooled gray traces — the "fabrication" read. Light theme: residue visible, not blown out.

- [ ] **Step 4: Commit**

```bash
git add prototypes/agents-hero/depth.html
git commit -m "feat: hot-then-cold etch residue for the circuit preset"
```

---

### Task 9: full verification sweep and handoff update

**Files:**
- Modify: `HANDOFF.md`
- No code changes expected; fixes found here get their own focused commits.

- [ ] **Step 1: Law and cine tests**

Run: `node --test prototypes/agents-hero/`
Expected: every test in `law.test.js` and `cine.test.js` passes.

- [ ] **Step 2: Full shoot sweep, every preset**

Run for presetIndex 0, 1, and 2, outDirs `/tmp/r4-final-{0,1,2}`:
`NODE_PATH=/Users/krisnasorathia/Code/docs/.claude/worktrees/scratch-shoot/node_modules node prototypes/agents-hero/shoot.js prototypes/agents-hero/depth.html /tmp/r4-final-<n> <n>`
Expected: all three exit 0 with "no console errors"; every fps readout ≥ 58 at both widths.

- [ ] **Step 3: Eyeball gates from the spec, in priority order**

Read the captured frames and judge:
1. **Depth reads.** Back planes visibly softer/foggier/cooler; the image no longer reads as "a couple of grids." (Compare against round 3's frames if needed: shoot `layers.html` preset 1 side by side.)
2. **2s frames stand alone** on every preset — composed, margins populated, copy band clear.
3. **Light theme reads as the same design**, not a washed-out export.
4. **Quiet preset** demonstrates the grade dial works: recognizably the same field at round-3 restraint.
Transition legibility (fork sinks / merge surfaces) was verified live in Task 4 — re-check in the browser only if `zEase` or layer code changed since.

Anything failing a gate gets fixed and committed (`fix: …`) before proceeding.

- [ ] **Step 4: Update `HANDOFF.md`**

Add a "Round 4 — cinematic depth renderer (`depth.html`)" section after the round 3 section, covering: the file table row for `depth.html` and `cine.js`/`cine.test.js`; the three presets and keys; what changed vs round 3 (layer canvases + cached lattice, resample defocus/fog/temperature, continuous `zf` with vias, bloom, trace ladder replacing `massCurve` width — note `massCurve` was removed, seeded presim composition, hot/cold etch); and mark the round-3 "reads flat" verdict resolved-or-not per the eyeball gates. Update the "Current state" table and the spec/plan pointers. Record any new judged-acceptable issues in the existing section.

- [ ] **Step 5: Commit**

```bash
git add HANDOFF.md
git commit -m "docs: round 4 results and handoff update"
```

---

## Out of scope for this plan

- Converge/diverge parameter pin — decided by eye on the finished preset 1, with Krisna, after this plan lands.
- fal.ai material layer, WebGL, the port into `AnimatedDotGrid.tsx`, `prefers-reduced-motion` — all per the spec's Deferred section.
