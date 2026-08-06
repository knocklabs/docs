# Design — `/agents` hero: cinematic depth renderer

Date: 2026-08-06
Branch: `worktree-agents-hero-design`
Status: approved, ready for planning

Round 4 of the `/agents` hero exploration. Round 3 built the fork/merge/mass
law across three depth planes and verified it mechanically sound. Krisna's
verdict on the result: it reads as "a couple of grids with runners on them,"
not the hi-fi circuit/signal hero he had in mind — missing depth, and missing
a clear transition between planes.

Local-only, like `HANDOFF.md` and `prototypes/` — stripped before the PR.

---

## Goal

Keep the law untouched and rebuild the rendering until the same simulation
reads as a lit, layered circuit: real defocus between planes, visible travel
when a runner changes depth, bloom on the bright things, and trace hierarchy
that spends the mass the law already computes.

## Diagnosis — why round 3 reads flat

Confirmed against fresh `shoot.js` frames of `layered` and `circuit`:

1. **The only depth cues are scale and alpha.** A back-plane runner is a
   smaller, fainter copy of a front-plane one — same hairline, same color,
   same sharpness. No blur, no fog, no temperature shift, so three planes
   collapse into "some lines are dimmer."
2. **Plane transitions are invisible.** `setPlane()` swaps `r.z` in one
   frame. Forks don't recede; merge survivors don't surface. The design's
   central motion — divide and fall back, converge and come forward — never
   appears on screen as motion.
3. **One stroke class.** Everything is a ~1.3px hairline. The mass→width
   curve moves fractions of a pixel, so trunks and branches look alike.
4. **The light is weak.** `lighter`-composited sprites at low alpha produce
   smudges, not glow. The hi-fi signal look is mostly bloom, and there is no
   bloom pass.
5. **Composition is luck.** Random spawns produce lopsided frames, and the
   first seconds are near-empty.

Round 3's spec called wide-and-faint "defocus at a fraction of a blur's
cost." That bet is the thing this round reverses: the fake did not read.

## Decisions

| Question | Answer |
| --- | --- |
| Direction | Cinematic renderer on the existing law (option A). fal.ai art layer deferred, WebGL deferred. |
| Rest-state intensity | Luminous. Visible bloom, glowing pads, felt haze. Restraint dials it back; quiet is no longer the default. |
| Looks covered | Both: cinematic layered and cinematic circuit, as presets of one renderer. |
| Converge/diverge tuning | Deferred until this renderer exists — the judgment ("does convergence read as earned") needs legible depth first. |
| Law changes | None. `law.js` and its tests are untouched. |

## Renderer

New gallery `prototypes/agents-hero/depth.html`, same harness conventions as
round 3 (tabs, live param column, `t`/`h`/`v`/`r` keys, `#stage`, `#fps`,
compatible with `shoot.js` unchanged). Five changes, all draw-path:

### 1. Continuous depth with visible transitions

`r.z` becomes a render-side float easing toward an integer `r.zTarget` over
~400ms. The law — collision, occupancy, merge eligibility, pad claims — keeps
operating on the integer plane exactly as today, so `setPlane()` remains the
only writer of the target and the round-3 rulings stand.

A transitioning runner draws into both adjacent plane layers with cross-fading
alpha, so a fork's child visibly sinks out of focus and a merge survivor
visibly rises into it. Fork and merge nodes leave a **via ring** that fades
over ~10s — the event marks the board after the runners move on.

### 2. Real depth grading per plane

Each plane renders to its own offscreen canvas, composited back to front:

- **Back planes: true defocus** via downscale/upscale redraw (draw the plane
  at 1/2 or 1/4 size, draw it back up smoothed). No `ctx.filter` — the
  resample blur works in every browser and is cheaper.
- **Fog.** Back planes fade toward the background color, not just toward
  transparent — atmospheric depth rather than dimness.
- **Temperature.** Back planes shift slightly cool; the front plane stays
  warm and sharp.

### 3. Bloom

Bright content — signal heads, accent trunks, lit pads, fresh vias — draws a
second time into a quarter-resolution buffer, gets blurred by the same
resample trick, and composites additively (`lighter`) over the dark theme.
The light theme replaces additive bloom (which dies on white) with soft
colored halos at low alpha.

`restraint` rewires to grade bloom strength, fog density, and accent
allocation together. Default rest state is luminous; the slider still reaches
quiet.

### 4. Trace hierarchy

Mass tiers map to strongly distinct widths — roughly 1 / 1.6 / 2.6 / 4px —
with a bright core plus glow on the heaviest tier. Heavy trunks drop pads at
their turns; the four endpoint pads render as lit terminals. The existing
`massCurve` param becomes a visible control instead of a sub-pixel one.

### 5. Art-directed composition

- Seeded spawn weighting: density biased to the left/right thirds, repelled
  from the copy band.
- **Pre-simulation:** the scene advances ~4 simulated seconds before first
  paint, so t=0 is a composed image. This also fixes "a 3-second visitor sees
  almost nothing" for etch.
- Endpoint pads keep round 3's deterministic placement.

## Presets

1. **Layered** — the flowing signal field under the new renderer. The
   recommendation, and the surface on which converge/diverge finally gets
   tuned.
2. **Circuit** — stepped motion, segment trails, etch. Fresh residue glows
   briefly, then cools into the faint permanent trace; accumulated board sits
   under the live bloom-lit signals.
3. **Quiet** — the same renderer graded down to round-3 restraint. The
   comparison floor, and the light-theme sanity check.

Full parameter set stays live in the side column. New params: `zEase`
(transition duration), `bloom` (strength), `fog`, `viaLife`. `planes: 1` with
`bloom: 0`, `fog: 0` remains reachable as a parity check against round 3's
`flat`, but parity is no longer a preset — this round intends to look
different.

## Performance

Budget: the 58fps bar from rounds 2–3, at both widths.

New costs are the per-plane offscreen composites and the bloom pass.
Mitigations, in order of expected payoff:

- **Cached lattice.** The substrate is static per resize; render it once per
  plane to a cached canvas and blit. This deletes the ~2,850 per-frame
  `fillRect`s the handoff already flagged as the largest draw cost, funding
  most of the new budget.
- **Back planes at half resolution.** Their defocus hides the resample.
- **Bloom at quarter resolution.** Standard practice; the blur hides it.
- Offscreen canvases allocate once per resize, never per frame.

If the budget still misses, degrade in this order: drop bloom resolution to
1/8, drop the mid-plane's defocus (keep the back's), then reduce runner cap.

## Verification

- `law.js` tests pass unchanged (`node --test`).
- Full `shoot.js` sweep: all presets, both widths (1280/390), both themes,
  2s and 25s, pointer parked in-stage, zero console errors, fps readout ≥58.
- Eyeball gates, in priority order: (1) a fork visibly recedes and a merge
  visibly surfaces — the plane transition reads as travel, not a state swap;
  (2) the 2s frame of every preset stands alone as a composed image; (3) the
  light theme reads as the same design, not a washed-out export.

## Deferred

- **Converge/diverge pin.** Decided by eye on preset 1 once depth is legible;
  expected to land near round 3's `layered` defaults.
- **fal.ai material layer.** If the procedural result still wants texture,
  generate substrate grain/lighting (not full artwork) and composite under
  the live field. Needs dark and light variants and a responsive story —
  scoped only if round 4 leaves an appetite for it.
- **WebGL.** Round 3's deferral logic stands, with one update: this round
  takes the "real depth of field" and bloom items off WebGL's exclusive list
  via resampling. What remains exclusive is per-dot lattice lighting and
  particle count, neither currently wanted.

## Carried forward, not blocking

- Bottom mask at 55% on the real page; `prefers-reduced-motion` deliberately
  ignored in prototypes but mandatory in the port; port checklist
  (`useTheme()`, `IntersectionObserver`, `ResizeObserver`, first-measure
  fade-in) lives in `HANDOFF.md`.
- Round 3's open design calls — accent never reaching converged trunks,
  sub-threshold runners loitering at pads — are unchanged by this round and
  get judged under the new light before deciding whether they matter.
