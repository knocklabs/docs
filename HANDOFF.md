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

Two standalone prototype galleries, both self-contained HTML with no
dependencies and no build step. Neither is imported by the app.

| File | What it is |
| --- | --- |
| `prototypes/agents-hero/index.html` | Round 1 — five distinct hero concepts |
| `prototypes/agents-hero/runners.html` | Round 2 — six variations on the winning concept |
| `prototypes/agents-hero/layers.html` | Round 3 — layered depth with fork/merge |
| `prototypes/agents-hero/law.js` | Pure law arithmetic, tested via `node --test` |
| `prototypes/agents-hero/shoot.js` | Screenshot harness (needs `NODE_PATH` — see below) |

Open any of the three directly (`open prototypes/agents-hero/layers.html`). All
three overlay the real hero copy, veil, and CTA so legibility can be judged in
place.

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
exposed) is live in the second control row, so any preset can be pushed past
its tab.

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
locally. The screenshot harness used during this work:

```bash
cd <scratchpad> && npm i playwright-core@1.56.0
```

```js
chromium.launch({
  executablePath:
    "~/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/" +
    "Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
});
```

Screenshot `#stage`, not the page. Park the pointer **inside** the stage before
capturing or pointer behavior won't appear — the stage sits below two toolbars,
so use `boundingBox()` rather than guessing coordinates.

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
