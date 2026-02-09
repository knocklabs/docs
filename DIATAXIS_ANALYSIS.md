# Diátaxis framework analysis of Knock documentation

## Framework overview

The [Diátaxis framework](https://diataxis.fr/) classifies documentation into four distinct modes, each serving a different user need:

1. **Tutorials.** Learning-oriented content that takes the reader by the hand through a series of steps to complete a meaningful project. Aimed at beginners; the goal is learning by doing.
2. **How-to docs.** Task-oriented content that provides steps to solve a specific real-world problem. Assumes some existing knowledge; the goal is accomplishing a practical task.
3. **Reference.** Information-oriented content that describes the machinery — technical specifications, API surfaces, configuration options. Accurate and complete; structured for lookup, not reading.
4. **Explanation.** Understanding-oriented content that clarifies concepts, discusses trade-offs, and provides context. Helps users build mental models of *why* things work the way they do.

Each mode has distinct writing requirements. Mixing modes within a single page creates documentation that partially serves several needs but fully serves none.

---

## Current state mapping

Here is how the existing Knock docs sections map to the Diátaxis quadrants:

| Docs section | Primary Diátaxis mode | Secondary modes mixed in | Assessment |
|---|---|---|---|
| `/getting-started/what-is-knock` | Explanation | — | Good fit. Strong conceptual overview. |
| `/getting-started/quick-start/*` | Tutorial | — | Reasonable fit, but too thin (see below). |
| `/concepts/*` | Explanation | Reference (glossary-style entries) | Underdeveloped. Most entries are 1-3 sentences. |
| `/designing-workflows/*` | How-to | Reference (properties, variables) | Mode-blended. Each page mixes instructions with reference tables. |
| `/send-notifications/*` | How-to | Reference, explanation | Mode-blended. Triggering is how-to; message statuses is reference; debugging is how-to. |
| `/tutorials/*` | How-to | Explanation | Mislabeled. Most "tutorials" are actually how-to docs for specific use cases. |
| `/preferences/*` | How-to | Reference, explanation | Mode-blended but well-structured. The overview does a good job walking through setup steps. |
| `/managing-recipients/*` | How-to | Explanation | Decent fit. Some pages include good "why" sections. |
| `/integrations/*` | How-to (setup) | Reference (config options) | Consistent pattern but blends setup instructions with reference data. |
| `/in-app-ui/*` | Reference | How-to (setup/usage) | SDK reference is strong; UI component pages blend modes. |
| `/developer-tools/*` | Reference | How-to | Mixed. Some pages are pure reference, others are setup instructions. |
| `/api-reference/*`, `/mapi-reference/*`, `/cli/*` | Reference | — | Strong fit. Pure reference content. |
| `/version-control/*` | Explanation | How-to | Decent. Explains the mental model but also tells you how to use it. |
| `/manage-your-account/*` | How-to | Reference | Good fit. Task-oriented admin instructions. |

---

## Key findings

### 1. The "tutorials" section contains how-to docs, not tutorials

The Diátaxis framework draws a sharp distinction between tutorials and how-to docs. Tutorials are learning-oriented: they take a beginner through a carefully sequenced experience where the goal is to *learn*. How-to docs are goal-oriented: they help someone who already has context *accomplish a specific task*.

The current `/tutorials/` section contains pages like "Alerting," "Customer-facing webhooks," "Recurring digests," and "Implementing Knock." These are all how-to docs — they assume the reader has some knowledge of Knock and help them solve a specific problem. None of them walk a true beginner through a structured learning experience from zero to a working result.

### 2. The concepts section is too thin for explanation

The `/concepts/overview` page is a glossary: each concept gets a 1-3 sentence definition and a "Learn more" link. Individual concept pages (e.g., `workflows.mdx`) do go deeper, but they tend to focus on *what* the concept is and *how* to use it, rather than *why* it exists, what problems it solves, and how it relates to architectural decisions.

True Diátaxis explanation content would cover topics like: "Why does Knock use a commit model for version control?", "When should you use batching versus throttling?", "How should you think about modeling your data in Knock?", and "What are the trade-offs of different preference architectures?"

### 3. How-to content is scattered with no unified section

Task-oriented documentation lives across at least five different sections: `/designing-workflows/`, `/send-notifications/`, `/managing-recipients/`, `/preferences/`, and `/tutorials/`. A user looking to accomplish a task (e.g., "How do I set up batching?") has to guess which section to look in. There is no dedicated "How-to" area or consistent task-oriented navigation path.

### 4. Reference and how-to content are frequently blended on the same page

Many pages mix reference-style content (configuration tables, property listings, variable definitions) with how-to instructions (step-by-step setup). For example, `batch-function.mdx` contains both "how to set up a batch window" (how-to) and "batch variable reference" (reference). `sendgrid.mdx` contains both "how to connect SendGrid to Knock" (how-to) and "channel configuration settings" (reference).

### 5. The quick start is close to a real tutorial but lacks depth

The quick start pages are the closest thing to true tutorials in the docs. They walk someone through creating an account, setting up a workflow, and triggering it. However, they are quite brief and end abruptly. A full Diátaxis tutorial would continue through a more complete experience — adding a second channel, seeing how batching works, setting up preferences — so the reader builds a deep, practical understanding.

### 6. There is very little "explanation" content

Beyond `what-is-knock.mdx` and a few scattered paragraphs, the docs lack dedicated explanation content. Explanation is the most neglected quadrant. Topics like notification architecture patterns, when to use objects versus users, how to think about multi-tenant notifications, and the philosophy behind the commit-based versioning model are either absent or embedded within how-to content where they get lost.

### 7. Integration pages have a consistent and effective structure

One bright spot: the integration pages (`/integrations/email/*`, `/integrations/push/*`, etc.) follow a consistent pattern — features, getting started, channel configuration, additional data, recipient requirements. This consistency is good and aligns with how-to + reference patterns. The main improvement would be explicitly separating the how-to setup from the reference configuration.

---

## Recommendations

### 1. Reclassify the tutorials section as how-to docs and create real tutorials

**Priority.** High
**Impact.** Structural clarity; improved beginner experience

**Current problem.** The `/tutorials/` section is mislabeled. "Alerting," "Customer-facing webhooks," and "Recurring digests" are how-to docs for experienced users, not learning-oriented tutorials for beginners. Meanwhile, no true tutorials exist beyond the brief quick start pages.

**Recommended changes.**

- Rename the current `/tutorials/` section to something like "How-to docs" or a similarly task-oriented label in the sidebar and navigation. This accurately describes the content and sets correct reader expectations.
- Create 2-3 genuine tutorials that take a beginner from zero to a meaningful working result. For example:
  - **"Build your first cross-channel notification"** — Walk through creating a workflow that sends both email and in-app notifications, including setting up channels, designing templates, triggering the workflow, and viewing the result.
  - **"Add a notification feed to your React app"** — A complete walkthrough from `npm install` to a working in-app feed with real-time updates.
  - **"Set up user notification preferences"** — Build a preference center from scratch, covering default preferences, rendering the UI, and testing opt-out behavior.
- True tutorials should have a clear "what you'll build" introduction, take 15-30 minutes, and result in something the reader can see working.

### 2. Deepen the concepts section into genuine explanation content

**Priority.** High
**Impact.** User understanding; reduced support burden

**Current problem.** The `/concepts/overview` page is a glossary with brief definitions. Individual concept pages focus on usage mechanics rather than mental models and architectural reasoning. Users can learn *what* a batch step is, but not *why* they should choose batching over throttling, or how to think about designing their batch keys.

**Recommended changes.**

- Expand each concept page to include a "Why this matters" or "When to use this" section that explains the reasoning behind the concept, not just its mechanics. For example:
  - `workflows.mdx` could explain when to create one workflow versus many, the trade-offs of workflow complexity, and how workflows relate to the broader notification architecture.
  - `objects.mdx` could explain the mental model for deciding what should be an object versus a user, with concrete scenarios.
  - `preferences.mdx` could discuss the architectural philosophy behind the preference model and how to think about preference granularity.
- Add dedicated explanation pages for cross-cutting architectural topics:
  - "How to think about notification architecture in Knock" (workflow design patterns, data modeling decisions)
  - "Batching versus throttling: when to use each" (a decision framework)
  - "Multi-tenant notification patterns" (how tenants, preferences, and branding interact)
- The concepts overview should be more than a glossary — it should serve as a conceptual map that helps users understand how the pieces fit together.

### 3. Separate reference content from how-to content on blended pages

**Priority.** High
**Impact.** Findability; page clarity

**Current problem.** Many pages in `/designing-workflows/` and `/integrations/` mix step-by-step instructions with reference tables and property listings. For example, `batch-function.mdx` is both "how to use batching" and "batch properties reference." A user looking up a specific variable name has to scroll past setup instructions; a user trying to set up batching has to navigate around reference tables.

**Recommended changes.**

- For high-traffic blended pages (batch function, delay function, channel step, and similar), consider splitting into two linked pages or clearly delineating sections:
  - **How-to section** at the top: "How batching works," "How to set up a batch window," "How to use batch keys"
  - **Reference section** at the bottom (or a linked subpage): "Batch variables reference," "Window rule properties," "Duration properties"
- For integration pages, maintain the current structure but add clear visual separation between "Setup" (how-to) and "Configuration reference" (reference). The accordion pattern already helps here — consider standardizing the labels.
- Use consistent heading patterns across all pages to signal which mode the reader is in, e.g., "How to [verb]" for how-to sections and "[Noun] reference" for reference sections.

### 4. Create a dedicated how-to docs section with task-oriented navigation

**Priority.** Medium-high
**Impact.** Discoverability; reduced time-to-answer

**Current problem.** A user who wants to accomplish a specific task — "How do I cancel a workflow?", "How do I set up Slack notifications?", "How do I migrate from Courier?" — has no single place to look. Task-oriented content is scattered across `/designing-workflows/`, `/send-notifications/`, `/tutorials/`, `/integrations/`, and `/managing-recipients/`.

**Recommended changes.**

- Introduce a "How-to docs" section (or rename the existing tutorials section) that serves as a central index of task-oriented content. This section does not need to *contain* all how-to pages — it can link to them across the docs — but it should provide a task-oriented entry point.
- Organize how-to content by user goal rather than by Knock feature. For example:
  - "Sending notifications" — triggering workflows, canceling workflows, sending broadcasts
  - "Building notification logic" — using batching, delays, branches, throttles, conditions
  - "Managing recipients" — identifying users, setting channel data, merging users
  - "Integrating channels" — connecting email, push, SMS, chat providers
  - "Migrating to Knock" — from Courier, from Braze, general implementation
- Each how-to page should start with a clear statement of what the reader will accomplish, list any prerequisites, and provide numbered steps.

### 5. Expand the quick start into a proper tutorial experience

**Priority.** Medium-high
**Impact.** New user onboarding; time to first value

**Current problem.** The quick start pages are the closest thing to real tutorials, but they are brief (7 steps, mostly configuration) and end with "go deeper" links. They don't give the reader a substantial enough experience to build real understanding. A new user finishes the quick start having triggered one workflow, but without understanding batching, preferences, in-app feeds, or multi-channel routing.

**Recommended changes.**

- Extend the general quick start into a more complete tutorial (or create a "next steps" tutorial that picks up where the quick start leaves off). The extended tutorial should cover:
  - Adding a second channel to the workflow (e.g., email + in-app)
  - Using the workflow debugger to see what happened
  - Adding a delay or batch step to see how function steps work
  - Setting a preference and seeing it respected
- Each step should explain *why* the reader is doing what they are doing, not just *what* to do. This is the key difference between a tutorial and a how-to doc.
- Consider creating framework-specific tutorials (Next.js, React, etc.) that go deeper than the current quick starts, building a complete notification experience end-to-end.

### 6. Add "When to use this" decision content to workflow function pages

**Priority.** Medium
**Impact.** Better design decisions; fewer support questions

**Current problem.** The workflow function pages (batch, delay, branch, throttle, fetch) explain how each function works, but don't help the reader decide *which* function to use for their situation. A user who knows they need to "reduce notification volume" has to read all five pages to figure out whether they need batching, throttling, or delays.

**Recommended changes.**

- Add a decision-oriented explanation page (or a section within the designing workflows overview) that helps users choose the right function for their use case. For example: "Use **batching** when you want to aggregate multiple activities into one notification. Use **throttling** when you want to limit how often a notification can fire. Use **delays** when you want to wait before sending."
- On each function page, add a brief "When to use this" section near the top that explains the scenarios where this function is the right choice, and links to alternatives for other scenarios.
- Include a comparison table or decision tree in the designing workflows overview.

### 7. Standardize page structure with Diátaxis-aware templates

**Priority.** Medium
**Impact.** Consistency; contributor guidance; reader predictability

**Current problem.** Different pages across the docs use different structural patterns. Some pages have FAQs, some don't. Some have "How it works" sections, others jump straight into configuration. Some integration pages have troubleshooting sections, others don't. This inconsistency makes it harder for readers to build expectations about where to find information.

**Recommended changes.**

- Define standard page templates for each Diátaxis mode:
  - **Tutorial template.** What you'll build, prerequisites, numbered steps with explanations, what you learned, next steps.
  - **How-to template.** Goal statement, prerequisites, numbered steps, related how-to docs.
  - **Reference template.** Brief description, properties/parameters table, examples, related reference.
  - **Explanation template.** Context/motivation, how it works conceptually, trade-offs and alternatives, related concepts.
- Apply these templates to new content going forward, and gradually retrofit existing high-traffic pages.
- Add a `type` field to the frontmatter of each MDX file (e.g., `type: tutorial`, `type: how-to`, `type: reference`, `type: explanation`) to make the documentation mode explicit and enable tooling (e.g., different page layouts or navigation labels per type).

### 8. Add cross-linking between Diátaxis modes on every page

**Priority.** Medium
**Impact.** Navigation; user flow between learning modes

**Current problem.** Users often need to move between documentation modes — from reading an explanation of a concept to looking up the API reference, or from following a how-to to understanding why a certain approach is recommended. The current docs have some cross-linking, but it is not systematic. A user reading the batch function how-to has no clear path to an explanation of when batching is the right choice, or to the API reference for the batch endpoint.

**Recommended changes.**

- At the bottom of each page (or in a sidebar widget), add a "Related documentation" section that links to related content in other Diátaxis modes. For example, the batch function page should link to:
  - **Tutorial.** "Build your first cross-channel notification" (if it includes batching)
  - **How-to.** "How to set up recurring digests" (the current tutorial)
  - **Reference.** Batch step API reference, batch variables reference
  - **Explanation.** "Batching versus throttling: when to use each"
- Use consistent labels for these links: "Learn the concept," "See the reference," "Follow a tutorial," "Solve a specific problem."
- This systematic cross-linking helps users navigate between modes and find the right type of documentation for their current need.

---

## Implementation priority

| Priority | Recommendation | Effort | Impact |
|---|---|---|---|
| 1 | Reclassify tutorials as how-to docs; create real tutorials | Medium | High |
| 2 | Deepen concepts into genuine explanation content | High | High |
| 3 | Separate reference from how-to on blended pages | Medium | High |
| 4 | Create a dedicated how-to section with task-oriented nav | Low-medium | Medium-high |
| 5 | Expand quick start into proper tutorial experience | Medium | Medium-high |
| 6 | Add "when to use this" decision content to function pages | Low | Medium |
| 7 | Standardize page structure with Diátaxis-aware templates | Low-medium | Medium |
| 8 | Add systematic cross-linking between Diátaxis modes | Low | Medium |

Recommendations 1-3 are the highest priority as they address fundamental structural issues. Recommendations 4-5 improve the onboarding experience. Recommendations 6-8 create long-term consistency and maintainability.
