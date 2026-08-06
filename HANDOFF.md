# Handoff — `/agents` hero design

**Local-only. This file and `prototypes/` are both stripped before opening a
PR** — see [Before opening a PR](#before-opening-a-pr). Only changes to real app
code (`components/`, `pages/`) are meant to ship.

Worktree: `.claude/worktrees/agents-hero-design`
Branch: `worktree-agents-hero-design`, based on `origin/main` @ `86962994`
Started: 2026-08-03

---

## Goal

Replace the `/agents` hero background with something more interesting and more
deliberate than the current `AnimatedDotGrid`. Explore wide first, then narrow to
what fits the voice and tone of the page and the agent-first product story.

This is an iterative design process, not a defined implementation task. Nothing
here is wired into the Next.js app yet.

## Current state

Four standalone prototype galleries, all self-contained HTML with no
dependencies and no build step. None is imported by the app.

| File | What it is |
| --- | --- |
| `prototypes/agents-hero/index.html` | Round 1 — five distinct hero concepts |
| `prototypes/agents-hero/runners.html` | Round 2 — six variations on the winning concept |
| `prototypes/agents-hero/layers.html` | Round 3 — layered depth with fork/merge |
| `prototypes/agents-hero/depth.html` | Round 4 — the cinematic renderer over round 3's law |
| `prototypes/agents-hero/law.js` | Pure law arithmetic, tested via `node --test` |
| `prototypes/agents-hero/cine.js` | Pure round-4 render arithmetic (`HeroCine`), tested |
| `prototypes/agents-hero/law.test.js` | 14 law tests |
| `prototypes/agents-hero/cine.test.js` | 10 cine tests |
| `prototypes/agents-hero/shoot.js` | Screenshot harness (needs `NODE_PATH` — see below) |

Open any of them directly (`open prototypes/agents-hero/depth.html`). All four
overlay the real hero copy, veil, and CTA so legibility can be judged in place.
`depth.html` is the current front runner; `layers.html` is kept as the
before-picture the round-4 grade is judged against.

### Round 1 — five concepts (`index.html`)

Keys `1`–`5` switch, `t` theme, `h` hero copy, `v` veil, `←`/`→` restraint.

1. **Runner grid** — near-invisible lattice, right-angle runners with trails that
   swerve around each other, exit, age out, or collide. **← Krisna picked this one.**
2. **Prompt → workflow assembly** — a typed prompt shatters into particles that
   assemble into a workflow DAG, a signal walks it, it dissolves.
3. **Fan-out delivery field** — packets from one source to five channel endpoints
   along bezier routes the cursor bends.
4. **Terminal resolve** — monospace noise field where regions settle into real
   tokens (`$ knock workflow run …`) and decay back.
5. **Tool-call constellation** — CLI/MCP/skills/agent/API/dashboard orbit a hub,
   firing calls inward.

Concepts 2 and 5 place their content in a band **below** the hero copy — centered,
the veil ate the workflow's middle nodes and the constellation's hub. To keep that
readable the canvas mask fades at 76% instead of the real page's 55%. **That mask
change will not survive a straight port** and needs revisiting if either concept
comes back.

### Round 2 — six runner variations (`runners.html`)

Keys `1`–`6`, plus `r` to reset params. All six run **one parameterized engine**;
the tabs are presets and the second control row is that parameter set exposed
live (pitch, speed, trail, accent ratio, substrate, pointer mode).

1. **Baseline** — round 1's version, as a reference.
2. **Clocked** — motion quantized to the lattice; eases one cell, pauses on the
   intersection, then commits to a turn. Segment trails with a gap at each node.
   Reads as *a program executing*.
3. **Reserve** — 14% accent runners, rest neutral gray. Orange spent only on
   events. Near-monochrome until you engage.
4. **Delivery** — runners bound for endpoint nodes; arrivals flash and ring, some
   collide en route. The fan-out story in the runner grid's language.
5. **Etch** — no visible grid; persistent residue decays over ~a minute so the
   hero accumulates a faint circuit of everywhere anything has been.
6. **Wall** — cursor is a hard forbidden zone rather than a soft bias. Runners
   route around it; interaction is discoverable in one pass.

Every parameter is exposed live, including `stepped`, `etch`, `targets`, and
trail style — so any preset can be crossed with any other. Two combinations that
have no tab and are worth a look: **reserve + clocked** (gray segmented circuit,
orange only on events) and **delivery + etch** (accumulated routes converging on
endpoints, like a delivery map drawing itself).

Toggling mid-run is handled rather than ignored: turning `targets` off nulls the
destination on runners already in flight so none seeks a phantom, and cycling
`etch` clears the residue buffer instead of resurrecting old traces.

### Round 3 — layered depth with fork/merge (`layers.html`)

Same lattice-runner engine as round 2, extended to up to three depth planes.
Runners fork (mass halves, child recedes a plane) and merge (mass sums,
survivor comes forward a plane); only a front-plane runner heavy enough to
have converged can claim one of four deterministic endpoint pads, which stay
lit for roughly 8 seconds. With `etch` on, every plane leaves residue, scaled
by that plane's own dim factor — the front etches strong, the back etches
faint, so the accumulated board carries a depth gradient of its own.
Keys `1`–`5` switch presets, `t` theme, `h` hero copy, `v` veil, `r` resets the
current preset. The full parameter set (planes, plane spread, fork rate/drop,
merge window, mass curve, claim mass, parallax, plus everything round 2
exposed) is live in the column to the right of the stage, so any preset can be
pushed past its tab. Under 900px that column stacks back into rows below the
canvas.

1. **Flat** — round 2's engine unchanged, one plane, no fork/merge beyond the
   old collision. The control every other tab is judged against.
2. **Layered** — the law at its defaults: fork and fall back, converge and
   come forward, accent lives at the front. The recommendation.
3. **Converge** — merge dominates; traffic funnels into a few heavy trunks
   that arrive at pads often. Tests whether earned arrival actually pays off.
4. **Diverge** — the opposite pole; forks dominate, the field spreads back
   into depth, arrivals are rare. Not a shipping candidate on its own — it
   marks the far end of the range from converge.
5. **Circuit** — stepped motion, segmented trails, depth-scaled etch on; the
   same law read as a circuit board fabricating itself.

The tabs are presets over one parameterized engine, same as round 2 — they
exist to bound the design space (flat as the floor, converge/diverge as the
two poles, circuit as a stylistic variant) rather than to enumerate final
candidates. The shippable setting is expected to land somewhere between
converge and diverge; see open questions.

### Round 4 — cinematic depth renderer (`depth.html`)

Round 3 answered the law question and failed the look question: three planes of
identically crisp 1px hairlines, separated only by brightness, read as **"a
couple of grids"** rather than as depth. Round 4 keeps that law untouched and
replaces the renderer.

Spec: `docs/superpowers/specs/2026-08-06-agents-hero-cinematic-renderer-design.md`
Plan: `docs/superpowers/plans/2026-08-06-agents-hero-cinematic-renderer.md`
Ledger: `.superpowers/sdd/2026-08-06-agents-hero-cinematic-renderer/progress.md`

Keys `1`–`3` switch presets, `t` theme, `h` hero copy, `v` veil, `r` resets the
current preset. The parameter column to the right of the stage carries round 3's
full set plus the four new renderer dials (`zEase`, `bloom`, `fog`, `viaLife`).

1. **Layered** — three planes at the renderer's defaults, accent-heavy. The
   recommendation, and the surface the converge/diverge tuning gets decided on.
2. **Circuit** — stepped motion, segmented trails, hot-then-cold etch. Fresh
   residue glows and cools into a permanent trace as the board accumulates.
3. **Quiet** — the same field graded down to round-3 restraint (`bloom: 0.15`,
   `fog: 0.25`, `accentRatio: 0.4`). The comparison floor and the light-theme
   sanity check: if the design only works luminous, this tab shows it.

What changed against round 3:

- **Per-plane layer canvases with a cached lattice.** Each plane draws into its
  own offscreen canvas so a whole plane can be filtered at once. The substrate
  lattice is rendered once per plane and blitted, replacing round 3's ~2,850
  `fillRect` calls per frame.
- **Resample defocus, fog, and temperature.** Back planes are drawn at reduced
  resolution and scaled up (a cheap, real defocus rather than a blur filter),
  faded toward the background by `fog`, and cooled by `coolShift`. Depth now
  reads as three focal treatments, not three brightnesses.
- **Continuous `zf` with via rings.** Depth is a float, not an integer plane.
  A runner crossing planes cross-fades between two layers over `zEase` seconds
  and leaves a via ring at the crossing point that persists for `viaLife`. Forks
  visibly sink; merges visibly surface.
- **Bloom.** A quarter-res bright pass, composited additively on dark and as
  soft halos on light, so the front plane and lit terminals carry glow.
- **Trace hierarchy.** A discrete width ladder plus trunk cores, turn pads, and
  lit terminals. **`massCurve` was removed entirely** — round 3's continuous
  mass→width curve is gone, and `traceWidth`'s ladder is the only width source.
  Anything still referencing `massCurve` is round-3 code.
- **Seeded weighted composition and a 4s presim.** Spawn weight is suppressed
  inside the copy band and full in the margins, driven by a seeded `mulberry32`,
  and the scene runs 4 simulated seconds before the first painted frame — so a
  cold load opens on a composed field rather than an empty one.
- **Hot-then-cold etch.** Residue is written hot and cools into the permanent
  trace, instead of round 3's single-temperature write.

**Round 3's "reads flat" verdict is resolved.** Judged against the spec's four
eyeball gates on the final sweep (all three presets, both widths, both themes,
2s and 25s):

| Gate | Verdict |
| --- | --- |
| 1. Depth reads | **Pass.** Side by side with a freshly shot round-3 `layered` frame, the difference is not subtle: round 3's back planes are the same hard hairlines dimmed, round 4's are soft, fogged, cool patches under crisp bloom-lit front traces. It no longer reads as stacked grids. |
| 2. 2s frames stand alone | **Pass** on all three presets, both widths, both themes. Margins are populated, the composition is balanced left and right, and the copy band stays clear. The presim is doing its job. |
| 3. Light theme is the same design | **Pass.** Light reads as the same field, not a washed-out export — the halo bloom substitutes for the additive pass, and the fogged back planes survive as visible soft rectangles. `layered` arguably reads stronger on light than on dark. |
| 4. Quiet demonstrates the grade dial | **Pass.** Recognizably the same field at round-3 restraint: crisper, flatter, less glow, but the same depth structure. The dial spans the range it was built to span. |

Transition legibility (fork sinks, merge surfaces) was verified live during
Task 4. Tasks 5–8 changed the draw path, so it was re-checked on the final
frames: no console errors on any preset, and no runner shows a double-image
ghost at 2s or 25s on any capture — every cross-fade settles rather than
leaving two copies on adjacent layers.

## Decisions made

| Question | Answer |
| --- | --- |
| Concepts for round 1 | All four proposed, plus the runner grid |
| Tech budget | "Anything goes" — but everything so far is canvas 2D |
| Resting state | Restraint slider per concept, whisper → ambient |
| Theme scope | Both, dark-first |
| Winner | Concept 1, the runner grid |
| Handoff doc | Commit locally, strip before PR |

Canvas 2D was chosen despite the open budget because nothing needed a shader yet,
and staying 2D means the winner ports back into `AnimatedDotGrid.tsx` almost
directly. If a look genuinely needs WebGL — true bloom, volumetric fields, huge
particle counts — that's still on the table for a single concept.

### Round 3 rulings — do not undo these without knowing why

Each of these overrode the written plan mid-build, for a reason that is not
obvious from reading the code. They look like arbitrary constants; they aren't.

| Ruling | Why it exists |
| --- | --- |
| `merge` defaults to **`false`** | Without an off switch, `planes: 1` no longer equals round 2 and the parity control is gone. `flat` pins it explicitly so a preset edit can't silently break it. |
| `claimMass` must stay **above 1.00** | Base spawn mass is exactly `1`. At `0.9` — the plan's original value — never-merged runners claimed pads and "arrival is earned" was simply false. Shipped at `1.05`; `converge` uses `1.02`. **Lowering this to make pads fire more re-opens the hole.** |
| `mergePlane` is `max(0, min(za,zb) - 1)`, not `min` | Collision detection is same-plane-only, so `min` of two equal planes never moved anything — the come-forward branch was unreachable dead code and the design's payoff could not happen. |
| Trail width pinned to **1.3px at mass 1** | Via `TIER_REP_MASS[3] === 1`, which makes width curve-independent at base mass. This is what holds parity against round 2. `law.test.js` guards both halves of the dependency. |
| Ribbon alpha uses bucket **midpoints**, `pow(fade, 1.6)`, and `* 0.85` | Reconstructed from round 2's formula. An earlier version drifted **32.6% brighter** — invisible to eye comparison across a stochastic field, caught only by measuring mean ink. If you touch this, measure it. |
| Etch is **depth-scaled**, not front-plane-only | A boolean front-plane guard left residue sparse and lopsided at three planes, since only ~half the runners are front-plane. Every plane now writes, scaled by its own dim factor. |
| `setPlane()` is the **only** writer of `r.z` | It rescales speed from the multiplier stored on the runner, so a runtime `planeSpread` change never desynchronizes. A second assignment path breaks that silently. |

## Open questions

- Which variation (or blend) wins. My read: **reserve** and **etch** are the two
  worth shipping, and they pull in opposite directions — reserve makes the orange
  CTA the only orange on the page, which matches how the rest of the docs treat
  the accent; etch is more distinctive but its look depends on dwell time, so a
  3-second visitor sees almost nothing and a screenshot isn't representative.
- **Delivery's endpoints are placed randomly** outside the copy's bounding box, so
  the composition differs on every load and is occasionally lopsided. If that
  direction survives, placement should become deliberate.
- Nothing has been tested at mobile widths or on a low-end GPU. The stage is a
  fixed 460px in the prototypes; the real hero is `min(52vh, 420px)`.
- `prefers-reduced-motion` is deliberately **not** honored in the prototypes so
  every concept stays visible. The real component must honor it — the existing
  `AnimatedDotGrid` does.
- **Where between converge and diverge the shipped setting sits.** This is the
  question round 3 exists to answer and it is still open. Layered (the
  defaults) sits closer to converge than to diverge and is the current
  recommendation, but nobody has picked a final `forkRate`/`mergeWindow` pair.
- **Depth census on converge holds up over a long session.** Sampling
  `converge` at 5s/15s/30s with temporary per-plane instrumentation gave
  `{plane0, plane1, plane2}` counts of `[9,3,2]`, `[6,2,4]`, `[8,4,2]` (total
  runners 14, 12, 14). All three planes stay populated through 30s — the field
  does not drift to the front even under the merge-heaviest preset.
- **Mobile (390px) is legible but thin.** On `layered` and `circuit` at 390px
  the front/back plane distinction is still visible (brighter near-white/orange
  lines up close, fainter gray lines further back) and the four pads land in
  the corners, clear of the copy band, same as at 1280px. But at 390px only a
  sliver of lattice is visible outside the copy block, so the layered depth
  reads as a few scattered lines rather than a full field — this is a real
  thinning, not a break. Worth a look before shipping mobile as-is.
- **2s frames stand alone; 25s frames show real accumulation.** Reshooting with
  the theme-reset fix below, the 2s frames on both `layered` and `circuit`
  already read as deliberate, balanced compositions — a few trails and one or
  two lit accents distributed around the copy, not a blank or half-drawn
  canvas. The 25s frames clearly add on top of that: pads carry lit rings from
  claimed arrivals, and `circuit`'s etch has grown into a dense accumulated
  board. The two timestamps are visibly different, which they were not before
  the harness fix (see below).
- **Etch depth legibility (circuit, 25s): reads as fine, not a problem.**
  Back-plane residue is dimmer than front-plane residue (the etch write is
  scaled by the same per-plane dim factor as trails and heads), so there is a
  real gradient in the accumulated board, not a flat wash. But because
  spawning is front-weighted and accent color only shows up on the front
  plane, the eye is drawn to the live front-plane runners for depth far more
  than to the residue gradient — the accumulated trace reads as "circuitry"
  rather than as three distinct depths on its own. That is an acceptable
  trade for this look: circuit's chip metaphor doesn't need the residue itself
  to carry depth as long as the live signals do.

- **Accent never reaches a converged trunk.** Accent is decided once, at spawn,
  and only a front-plane spawn can get it (`spawn()` in `layers.html`). A merge
  survivor pulled forward to `z === 0` inherits accent only if one of its
  parents already had it, and a back-plane runner is never accent by
  construction — so a heavy trunk that converged its way to the front can stay
  permanently gray. Nothing grants accent after spawn. "Accent lives at the
  front" is therefore true of *spawns* but not of the trunks the design most
  wants marked. Re-rolling `accentRatio` when a merge pulls a survivor forward
  would fix it; whether that reads as intent or as flicker is a design call,
  not a bug fix, so it was left alone.
- **Sub-threshold runners loiter at pads they cannot claim.** A runner that
  reaches its pad but fails the `claimMass` gate keeps `r.target` set, and
  `chooseDir` still weights toward that target by 3.2x, so it circles a pad it
  can never take. Benign at the shipped presets, where merges are frequent
  enough that most seekers eventually qualify. It goes bad at `planes: 1` with
  `targets` on and `merge` off: no runner can ever gain mass, no pad can ever
  fire, and traffic piles onto four dead nodes. Options if it matters: clear
  `r.target` on a failed claim, or only assign a target to a runner that
  already clears the gate.

## Known minor issues, judged acceptable

Reviewed and deliberately left alone. Recorded because two of them bear on the
port, and none is visible at the shipped presets.

- **The substrate lattice redraws in full per plane** — roughly 2,850
  `fillRect` calls at 1280px, cell 26, three planes. Measured at 120–123fps
  against a 58fps bar, so it is headroom rather than a problem. It is the
  largest per-plane cost in the draw path, and the first thing to look at if
  the runner cap or the plane count ever rises.
- **`clamp(p.planes, 1, 3)` hard-codes `3`** at several sites where a
  `PLANE_MAX` constant already exists. They agree today. If `PLANE_MAX` were
  ever lowered without touching the clamps, `occIdx` would index past its
  allocation and collision detection would silently stop working on the
  orphaned plane. Worth reconciling during the port.
- **Sparks correct for plane scale but not for pointer parallax.** The draw
  loop also applies a small parallax translate to back planes; spark spawn
  points do not account for it. Sub-pixel at the shipped `parallax` values.
- **`planeSpread` at maximum is near-invisible on the light theme** — plane 2's
  dim reaches 0.18 by construction. No preset ships above 0.5, so this is the
  control behaving as specified at an extreme rather than a defect.

Round 4 added these, each reviewed at the task that found it and left:

- **`viaAlpha`'s pop-in uses an absolute 0.25s**, so a ring whose `viaLife` is
  under 0.25s would never reach full alpha. Unreachable at the shipped
  `viaLife` range of 2–20.
- **`PLANE_MAX` and `nPlanes` diverge in the cooling math at `planes: 2`.**
  They agree at the shipped `planes: 3`. Worth unifying on `nPlanes` during the
  port.
- **Dragging the restraint slider rebuilds every lattice per input event** —
  no debounce. Imperceptible in practice; it is a dev control, not a runtime
  path.
- **A dead `latticeCv = [null, null, null]` assignment survives in `layout()`.**
  Layers are always allocated for `PLANE_MAX` regardless.
- **`drawBrightPass` draws back-plane vias unscaled**, so a halo can sit
  slightly off its ring at high `planeSpread`. Invisible once the pass is
  blurred from 1/4 to 1/8 res.
- **`writeResidue` allocates a closure per runner per frame**, and a redundant
  `etchCtx.lineWidth = 1` is left at the top of the etch block. Both are
  cosmetic against a 120fps measurement.

Two of these — the `PLANE_MAX`/`nPlanes` divergence and the per-frame closure —
are worth cleaning up in the port rather than in the prototype.

## Porting back

The target is `components/ui/AnimatedDotGrid.tsx`, used only by
`pages/agents.tsx`. Things the existing component does that the prototypes do
not, and that must be carried over:

- `useTheme()` from `@/components/theme/ThemeProvider` for the light/dark palette
  (prototypes hardcode both palettes and a manual toggle).
- `IntersectionObserver` to pause the RAF loop when the hero scrolls out of view.
- `ResizeObserver` + debounce for canvas sizing.
- `prefers-reduced-motion` handling.
- The one-time fade-in on first measure, and the bottom mask at 55%.

Accent is `#fa5902` in both themes. The prototypes' dark surface is `#191919`;
the real page uses `--tgph-surface-1`.

## Verifying visually

No browser tooling in this repo, but Playwright's Chromium is already cached
locally, and a self-contained scratch install already exists at
`.claude/worktrees/scratch-shoot`. Point Node at it inline — shell state does
not persist between tool calls:

```bash
NODE_PATH=/Users/krisnasorathia/Code/docs/.claude/worktrees/scratch-shoot/node_modules
```

⚠️ **Do not run a bare `npm i` in this tree.** npm walks up to the nearest
ancestor `package.json`, which is the real docs repo — it will install into
`package.json` and `yarn.lock` for real. This happened once during round 3 and
had to be reverted. If a fresh scratch dir is ever needed, run `npm init -y`
inside it *before* installing anything.

Three things every Playwright script here must get right:

```js
// 1. Without executablePath, playwright-core consults its own browser
//    registry and fails. This cost an agent an entire session.
chromium.launch({
  executablePath:
    process.env.HOME +
    "/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/" +
    "Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
});

// 2. `window.env` is UNDEFINED. `env` is a script-scope const, reachable in
//    page.evaluate only as a bare identifier. This is how you drive any
//    parameter that has no UI control, or set one without a slider drag.
await page.evaluate((o) => {
  for (const k in o) env.params[k] = o[k];
}, { planes: 3, merge: true, forkRate: 0.05 });

// 3. Screenshot #stage, not the page.
```

Park the pointer **inside** the stage before capturing or pointer behavior
won't appear — the stage sits below the tab bar, so use `boundingBox()` rather
than guessing coordinates.

Round 3 packages this as `prototypes/agents-hero/shoot.js`:

```bash
NODE_PATH=<scratchpad>/node_modules node prototypes/agents-hero/shoot.js \
  prototypes/agents-hero/layers.html /tmp/out <presetIndex>
```

It captures both widths (1280, 390), both themes, and both timestamps (2s,
25s), and fails loudly on any console error. It reloads the page between
themes so each theme's clock starts at zero — an earlier version pressed `t`
mid-run instead, which meant the "light" 2s/25s captures were actually taken
at roughly +27s/+50s of accumulated animation, silently invalidating any
2s-vs-25s comparison for that theme. `boundingBox()` also now throws a clear
error if `#stage` isn't found rather than crashing on a null dereference.

Both galleries: no console errors, 120fps, dark and light. Round 3's sweep
(all five presets, both widths): no console errors on any preset, FPS
readouts 120–123 at both widths — well clear of the 58fps bar.

Round 4's final sweep (`depth.html`, all three presets, both widths): no
console errors on any preset, FPS readouts **120–121** at both widths. The
layer canvases, bloom pass, and cached lattice cost nothing measurable against
round 3 — the cache pays for the pass. `node --test prototypes/agents-hero/*.test.js`
runs 24 tests (14 law, 10 cine), all passing. Note the glob: `node --test` on
the bare directory tries to load it as a module and fails.

## Before opening a PR

Neither this file nor the prototypes ship. Strip both in one commit:

```bash
git rm -r HANDOFF.md prototypes/ docs/superpowers/ && git commit -m "chore: drop local prototypes and notes"
```

GitHub's Files-changed view is a `base…head` diff, so files added and later
removed on the branch do not appear in it. The repo squash-merges, so they never
reach `main` either. They remain in this branch's local history, and would be
visible to anyone opening the PR's **Commits** tab.

**Do this last.** Once stripped, the galleries are gone from the working tree —
recoverable with `git show f44d6d0f:prototypes/agents-hero/runners.html` or by
checking out the commit before the strip, but not sitting there to open. If the
design isn't settled, don't strip yet.

After stripping, the PR should contain only real app code — expect changes to
`components/ui/AnimatedDotGrid.tsx` (or its replacement) and possibly
`pages/agents.tsx`. If `git diff origin/main --stat` shows anything under
`prototypes/`, the strip didn't take.
