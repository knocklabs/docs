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

Open either directly (`open prototypes/agents-hero/runners.html`). Both overlay
the real hero copy, veil, and CTA so legibility can be judged in place.

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

`stepped`, `etch`, and `targets` are **preset-only** — not reachable from the live
controls, so cross-combinations (clocked + reserve, etch + delivery) don't exist
as tabs yet. Exposing them as toggles is a small change if those combos matter.

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

Both galleries: no console errors, 120fps, dark and light.

## Before opening a PR

Neither this file nor the prototypes ship. Strip both in one commit:

```bash
git rm -r HANDOFF.md prototypes/ && git commit -m "chore: drop local prototypes and notes"
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
