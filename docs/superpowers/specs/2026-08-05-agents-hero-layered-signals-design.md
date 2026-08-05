# Design — `/agents` hero: layered signals

Date: 2026-08-05
Branch: `worktree-agents-hero-design`
Status: approved, ready for planning

Round 3 of the `/agents` hero exploration. Round 1 picked the runner grid from
five concepts; round 2 produced six variations on it. This round adds the
mechanic those rounds lacked and the depth the concept was reaching for.

Local-only, like `HANDOFF.md` and `prototypes/` — stripped before the PR.

---

## Goal

Keep the runner grid, and make it read as signals crossing space toward
destinations — converging, splitting, arriving. The reference points are a chip
circuit and a network graph.

## What round 2 was missing

The round-2 engine is a field: runners enter from the edges, wander with a turn
bias, swerve around each other, then collide or age out. `targets` gives some of
them destinations.

Nothing forks. Nothing merges. Convergence and divergence — the thing the concept
is actually about — have no representation in the engine at all. That gap, not
rendering fidelity, is what separates the current prototype from a circuit.

## Decisions

| Question | Answer |
| --- | --- |
| Structure | Emergent, with fork and merge added. Not an authored graph. |
| Visual language | Layered depth — parallel lattice planes at different z. |
| Rendering tech | Canvas 2D. WebGL deferred, see [WebGL](#webgl-deferred). |
| Destinations | A few pads on the front plane, placed deterministically. |
| Accent allocation | Depth drives color. Accent lives at the front only. |

---

## The law

Every runner carries a **mass** and sits on a **plane** (`z = 0` front, `1` mid,
`2` back). Two events change both, in opposite directions.

**Fork.** At a lattice node a runner may split. The child takes a perpendicular
direction and both continue. Mass halves for each. A fraction of forks send the
child back one plane; it recedes visibly as it goes.

**Merge.** Two runners meeting at the same node within `mergeWindow` combine.
Masses sum. The survivor pulls forward to the frontmost of the two planes,
warming as it arrives.

Everything visible derives from those two numbers:

| Property | Derived from |
| --- | --- |
| Trace weight | Mass. Branches are hairlines, merged trunks are heavy. |
| Color | Plane. Back is cold gray, front carries the accent. |
| Speed | Plane. Back is slow, front is quick. |
| Opacity and softness | Plane. Back is dim and soft-edged, front is crisp. |

The picture reads as one sentence: **things divide and fall back; things converge
and come forward.**

Accent restraint is therefore structural rather than a probability roll. Orange
appears where signals are closest and most active, plus on arrivals and
collisions. This preserves the property that made round 2's `reserve` preset the
ship candidate — the CTA stays the only reliable orange on the page — without
depending on a random 14%.

## Destinations

Four pads, snapped to lattice nodes on the front plane.

Placement is deterministic, derived from the hero copy's bounding box: three down
the right margin in the clear column, one lower-left for asymmetry. Identical on
every load at a given viewport size. This replaces round 2's random placement,
which the handoff flagged as producing lopsided compositions.

**Only a front-plane runner whose mass is at or above `claimMass` can claim a
pad.** Arrival is earned — a signal has to have converged to get there. That is
the payoff moment and the product story, with no labels and no diagram.

On arrival: flash, expanding ring, then the pad holds a lit state decaying over
roughly 8 seconds. A visitor who stays watches the board light up; one who leaves
immediately still sees a clean composition.

## Rendering

All three planes draw to one canvas, back to front. No offscreen buffers per
plane — the fill cost would triple for no benefit.

Depth is four cheap cues stacked:

- **Scale.** Each plane's lattice is scaled about the stage center, so back
  planes have a tighter pitch. Combined with a half-cell phase offset per plane,
  the lattices never align into moiré.
- **Softness.** Back traces draw wider and much dimmer, front traces thin and
  crisp. Wide-and-faint reads as defocus at a fraction of a blur's cost.
- **Glow.** One sprite per plane, scaled up and alpha-reduced with depth.
- **Parallax.** The two back planes translate against the pointer. The front
  plane does not, so pads never drift off their anchors. Magnitude is small — a
  handful of pixels at the back.

**Etch is front-plane only.** Residue on all three planes turns to mud; on the
front alone it accumulates the circuit that made round 2's `etch` preset
distinctive without fogging the depth.

**The pointer keeps both roles.** Global parallax moves the field; local
repel/block bends traffic. One is a camera, one is routing, and they do not
conflict.

**Substrate** stays dots, dimming per plane. The `none` option remains for
etch-only looks.

## Prototype

`prototypes/agents-hero/layers.html`, same shape as `runners.html`: one
parameterized engine, preset tabs, and the full parameter set exposed live so any
preset crosses with any other.

Setting `planes: 1` collapses the engine to round 2's behavior, giving a direct
A/B against the known baseline. At `planes: 1` every runner is front-plane, so
depth contributes nothing to color and `accentRatio` governs it alone — which is
exactly round 2's model. At `planes > 1`, depth is the primary gate and
`accentRatio` acts as a secondary filter within the front plane, so `reserve`-style
sparseness remains reachable as a cross.

### New parameters

Added on top of the existing set (`cell`, `speed`, `trail`, `accentRatio`,
`substrate`, `pointerMode`, `stepped`, `stepHold`, `trailStyle`, `etch`,
`etchDecay`, `targets`, `headGlow`, `turnBias`, `restraint`):

| Param | Controls |
| --- | --- |
| `planes` | 1–3. At 1 the depth system is off entirely. |
| `planeSpread` | How hard scale, dim, softness, and speed fall off with depth. |
| `forkRate` | Chance of splitting at a node. |
| `forkDrop` | Share of forks whose child recedes a plane. |
| `mergeWindow` | Time tolerance for two runners at a node to combine. |
| `massCurve` | Exponent mapping mass to trace weight: `width = base * mass^massCurve`. Below 1 compresses the range, above 1 exaggerates trunks. |
| `claimMass` | Mass a front-plane runner needs to claim a pad. |
| `parallax` | Back-plane translation against the pointer. |

### Preset tabs

1. **Flat** — `planes: 1`. Round 2's baseline, as the control.
2. **Layered** — the law at defaults. The recommendation.
3. **Converge** — high merge, low fork. Traffic funnels into a few heavy trunks
   and arrivals are frequent. Tests whether the earned-arrival payoff reads.
4. **Diverge** — inverted. Forks dominate, the field spreads and recedes,
   arrivals are rare. The opposite pole, to find where between them it sits.
5. **Circuit** — layered plus stepped, segment trails, and front-plane etch. The
   chip reading of the same law.

### Performance

Target 60fps at the full-restraint runner cap, using the existing FPS readout.

Trails move to `Path2D` bucketed by mass tier **before** planes are added, not
after. The round-2 engine calls `createLinearGradient` once per trail segment per
frame (`runners.html:1261`); tripling that across planes is the real cliff, and
mass tiers make solid strokes viable since weight is already quantized by the
law.

Runner count is capped globally. Forking is only permitted below the cap, so
`forkRate` cannot run away.

### Verification

Reuse the Playwright harness documented in `HANDOFF.md` — screenshot `#stage` not
the page, pointer parked inside the stage via `boundingBox()`, both themes, no
console errors.

Two additions this round needs:

- **Capture at ~2s and ~25s.** Pad lit-state and front-plane etch both
  accumulate, so a single early frame misrepresents the design.
- **One pass at mobile width** against the real `min(52vh, 420px)` stage rather
  than the prototype's fixed 460px. Three planes on a short stage is the case
  most likely to break.

---

## WebGL, deferred

Three things WebGL would genuinely buy this concept:

1. **Real depth of field.** Depth is the whole idea, and wide-and-faint is a
   fake. A true per-plane blur is the one cue 2D cannot approximate well.
2. **Lattice lit by passing signals.** Per-dot, per-head lighting across three
   planes is where canvas 2D falls over.
3. **Trails as vertex-colored strips**, erasing the per-segment gradient cost.

What it does not buy is particle count. The restraint is deliberate.

Deferred because the distinguishing feature is the fork/merge/mass law, which is
mechanics. 2D iterates in minutes and ports back into `AnimatedDotGrid.tsx`
intact. Revisit only if, after seeing the law move, true DOF or a lit lattice is
specifically wanted.

## Generative tooling

Higgsfield and similar generative image/video tools cannot produce this — the
hero must be interactive, theme-aware, and reduced-motion-safe.

Their real use is **art direction reference** after the structure moves: still
frames that fix glow character, depth falloff, and palette temperature, which we
then match in code. Doing this before the mechanic exists risks chasing a frame
that cannot run at 60fps.

No Higgsfield MCP is connected in this session. The Figma MCP does expose shader
fill and effect tools (`list_shader_fills`, `get_shader_effect`,
`get_motion_context`), which is a more direct path if the glow needs visual art
direction later — it yields parameters to port rather than a picture to
reverse-engineer.

---

## Carried forward, not blocking

- The bottom mask sits at 55% on the real page. Round 1 moved it to 76% for two
  concepts; that change does not survive a port. Unresolved for this round.
- `prefers-reduced-motion` is not honored in the prototypes by design. The
  shipped component must honor it, as `AnimatedDotGrid` already does.
- Porting back into `components/ui/AnimatedDotGrid.tsx` requires `useTheme()`,
  `IntersectionObserver`, `ResizeObserver` with debounce, the first-measure
  fade-in, and the 55% mask. See `HANDOFF.md` for the full list.
