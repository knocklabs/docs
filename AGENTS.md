# Knock docs

Documentation, tutorials, and the API reference for Knock. Built with Next.js and TypeScript.

## Running the project

### System requirements

- Node.js 26.13.0
- Yarn 1.22.10

See `.tool-versions` for the exact versions.

### Getting started

1. Install dependencies:

```bash
./bin/bootstrap.sh
```

2. Start the development server:

```bash
yarn dev
```

3. Open http://localhost:3002

### Available scripts

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `yarn dev`           | Start development server on port 3002     |
| `yarn build`         | Build for production                      |
| `yarn start`         | Start production server                   |
| `yarn lint`          | Run ESLint                                |
| `yarn type-check`    | Run TypeScript type checking              |
| `yarn format.check`  | Check code formatting with Prettier       |
| `yarn format.write`  | Fix code formatting with Prettier         |
| `yarn generate-llms` | Generate LLM-friendly documentation files |

## Project structure

| Path             | Description                                  |
| ---------------- | -------------------------------------------- |
| `/content`       | MDX documentation files organized by section |
| `/pages`         | Next.js pages and API routes                 |
| `/components`    | React components including UI primitives     |
| `/data/sidebars` | Sidebar navigation configuration             |
| `/data/specs`    | OpenAPI specification files                  |
| `/public/images` | Static images used in documentation          |
| `/layouts`       | Page layout components                       |
| `/lib`           | Utility functions and helpers                |
| `/styles`        | Global CSS and Tailwind configuration        |
| `/typedocs`      | Auto-generated SDK documentation             |

## Content organization

Documentation content lives in `/content` and is organized into:

- `concepts/` - Core Knock concepts (workflows, channels, users, etc.)
- `getting-started/` - Quick start and onboarding
- `designing-workflows/` - Workflow design and template editing
- `in-app-ui/` - In-app notification UI components and SDKs
- `integrations/` - Channel integrations (email, push, chat, SMS)
- `developer-tools/` - CLI, API, SDKs, and developer resources
- `tutorials/` - Step-by-step implementation tutorials
- `preferences/` - User preference management
- `send-notifications/` - Triggering and debugging workflows

## Frontmatter

Every page in `/content` opens with frontmatter. `title`, `description`, and `section` are required.

| Field                          | Notes                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| `title`                        | The page's H1 and browser tab title. Sentence case.                                 |
| `description`                  | One sentence. See below.                                                            |
| `section`                      | The page's grouping in search. Nested sections use `Parent > Child`.                |
| `tags`                         | Search keywords. See below.                                                         |
| `metaTitle`, `metaDescription` | Override the title and description for search engines only, leaving the page as is. |
| `layout`                       | Only when the page needs a non-default layout.                                      |

`description` does double duty: it renders as the subtitle under the page title, and it's the snippet a reader sees in search results. Write one sentence that says what the page covers, and make it stand on its own — a reader meets it before they've read anything else on the page. Keep it to a line, and don't restate the page's opening paragraph: the reader sees both in sequence, so a description that paraphrases the intro spends the line twice.

`tags` are written into the search index, so a tag earns its place by grouping this page with others. A tag that appears on one page matches only what the title already matches. Check that a tag is in use elsewhere in `/content` before adding it, and prefer an existing tag over a more precise new one. The exception is a former name: after a rename, tag the page with the old name so searches for it still land there.

## Renaming or moving a page

When a page moves, or the feature or integration it covers is renamed, update everything that points at the old name in the same change:

- Add a permanent redirect from the old path to the new one in `next.config.js`.
- Update the sidebar entry in `data/sidebars`.
- Update every link and mention in `/content` and `data/specs`. Don't rely on the redirect.
- Name the old term once, in the page's opening sentence, such as "Fivetran Activations, formerly Census". Add it to `tags`.
- Keep heading text the same when the content moves unchanged, so its anchors still work.

Match `section` to a value already in use. A new section value creates a group of one.

## Specs and sidebars

Resource descriptions in `data/specs/api/customizations.yml` and `data/specs/mapi/customizations.yml` render as prose on the API reference pages, so the style guide below applies to them. Sidebar labels for spec subresources are set there too, under `subresources`.

## Environments are opt-in

New Knock accounts start with a single production environment. Development, promotion, and branches exist only after an account owner or admin [enables environments](/version-control/environments#enable-environments). Accounts created before October 2026 started with both. Write every page so it reads correctly for both kinds of account.

- Write steps that work in any environment. Don't open a procedure with "in your development environment" or end it with "promote to production".
- Put anything that only applies with environments in a conditional sentence: "If you've enabled [environments](/version-control/environments), …". The pattern is in use across the docs, so match it.
- In production the dashboard labels the commit action **Publish**. In other environments it reads **Commit**.
- Name the environment you mean. Branches are created only from development, so write "merges into the development environment", not "merges into the parent environment".
- Don't add `environment=development` to example requests. It returns a 404 on accounts without environments.
- Resources that aren't promoted, such as goals and warehouse syncs, are set up in each environment that uses them. Say so where the reader sets one up.
- State the scope of every resource and action you document. Say whether it's account-wide or per environment ("Assets are account-wide"), whether an action reaches other environments ("Archive a goal in the current environment"), and whether a change waits for a commit or takes effect at once ("An update takes effect immediately in the target environment, including production").

---

# Knock writing style guide

Many existing pages predate these rules. They still have `Note:` callout titles, inline link styles, and capitalized role names. Don't copy a pattern because a nearby page uses it. Follow this guide, and fix the pattern in the lines you're editing.

## Use "enable", not "allow"

**Allow** is another way of saying permit.

> Example: Knock permits you to send notifications to your users.

**Enable** means providing the means or opportunity.

> Example: Knock enables you to ship in-app notifications in a day.

## Knock product names are proper nouns and should be capitalized

Capitalize these Knock product names:

- Agent Toolkit
- Management API

In "Knock MCP server", "server" stays lowercase.

## Knock concept and feature names are not proper nouns and should not be capitalized

Don't capitalize these:

- guides
- workflows
- broadcasts
- tenants
- users
- objects
- translations
- schedules
- subscriptions
- preferences
- messages
- environments
- audiences
- goals
- agents
- agent function

"Agent" is lowercase everywhere except in "Agent Toolkit". Write "the Knock agent" in long-form prose and "Knock agents" for the plural.

Environment names are lowercase in prose: "the development environment", "publish in production". Use code formatting only when you mean the slug, such as `development`.

## Account roles are lowercase

Write owner, admin, member, production-only member, support, and billing in lowercase: "you need the owner or admin role". Use code formatting when you mean the value a setting takes, such as setting the auto-join default to `member`. Link "role" to [roles and permissions](/manage-your-account/roles-and-permissions) the first time a page mentions one.

Describe a custom permission group by what it's allowed to do, such as "a custom permission group that's allowed to manage integrations". Don't use the capability's label, such as "Integrations: manage".

## Case: always use sentence case

Sentence case everywhere, titles and headers included: capitalize the first word and proper nouns, nothing else. "How Knock works", not "How Knock Works". Never title case.

This covers headers, page titles, bold list-item labels, technical terms, component names, and feature names.

✅ Correct:

- "Feed component documentation"
- "How to use the feed API"
- "CSS variables"
- "Notification feed"
- **Email template configuration**

❌ Incorrect:

- "Feed Component Documentation"
- "How To Use The Feed API"
- "CSS Variables"
- "Notification Feed"
- **Email Template Configuration**

Stays capitalized:

- Knock product names — see the list above.
- Plan names: Enterprise plan, Starter plan.
- Brand names (React, iOS, Android), programming languages (JavaScript, TypeScript), framework names (React Native).

Regex patterns that surface title case violations:

- `\*\*[A-Z][a-z]+ [A-Z]` — bold text
- `#{1,6} [A-Z][a-z]+ [A-Z]` — headers
- `\d+\. \*\*[A-Z][a-z]+ [A-Z]` — numbered list items

These over-match on headings whose second word is a proper noun, so read the hits rather than fixing them in bulk.

## Heading length

Headings become table-of-contents entries and a long one wraps into two or three lines, which can be difficult for readers. Keep them short where the wording allows.

Treat this as a consideration, not a limit. Some ideas don't compress, and a heading that reads well is worth more than a short one that doesn't. Past roughly 50 characters, stop and see whether it can be tightened.

Flag long headings in a file you're editing rather than rewriting them. A heading's text generates its anchor id, so changing one breaks every link pointing at it — `#anchors` elsewhere in the docs, and links people have shared outside the repo.

## Avoid adverbs

Adverbs are usually unnecessary, and they make copy sound like it's working to convince the reader.

- With adverb: "The delay step is **incredibly** useful for scheduling reminders or other longer lived notifications."
- Without adverb: "The delay step is useful for scheduling reminders or other longer lived notifications."

## Oxford comma

We use the oxford comma.

## No exclamation marks

Don't use exclamation marks in prose. Code samples are exempt — `!=` and `!important` aren't punctuation.

## We don't use "&"

Best to use "and" or if you need shorthand use "+".

## American, not British spelling

We use American English spelling throughout our docs. An example: "cancellation" not "cancelation", and "canceled" not "cancelled". (As you can see, "cancel", an important word in the Knock API, is an especially tricky word to stay consistent on between American and British English.)

## API should always be all caps

API, never api or Api

## Avoid using "guides" for documentation

Since guides is a Knock feature name, don't use the word for documentation that teaches a reader how to do something. Use "docs" or "tutorials" instead.

✅ Correct:

- "Check out our docs on how to set up notifications"
- "Follow this tutorial to implement the feed"

❌ Incorrect:

- "Check out our guides on how to set up notifications"
- "Follow this guide to implement the feed"

## Links

Internal links use a root-relative markdown link:

```mdx
Trigger the workflow from the [workflows API](/api-reference/workflows/trigger).
```

- Never link to a page in this repo through `https://docs.knock.app/…`.
- No file extensions. Link to `/concepts/workflows`, not `/concepts/workflows.mdx`.
- No trailing slash.
- Anchors append the target heading's id: `/preferences/overview#channels-vs-channel-types`.

Reach for a raw `<a>` where markdown can't go — inside a JSX prop, such as a `Callout` `text` or a `Table` cell, or for an external link, which needs `target` and `rel`. MDX renders a markdown link and an `<a>` as the same plain anchor otherwise, so use markdown wherever both are equivalent.

External links carry `target="_blank"` and `rel="noopener"`.

```mdx
<a href="https://example.com" target="_blank" rel="noopener">
  Example
</a>
```

Dashboard links (`dashboard.knock.app`) skip `rel` entirely — it's a Knock property. Substitute `~` for the account and environment slugs, which resolves to the signed-in user's own account and environment: `https://dashboard.knock.app/acme/development/broadcasts` becomes `https://dashboard.knock.app/~/broadcasts`.

When a step sends the reader to a dashboard page, link the bolded path itself, so the reader can click straight there:

```mdx
1. Go to <a href="https://dashboard.knock.app/~/sources" target="_blank">**Platform** > **Sources**</a>.
```

Do this in each procedure that names the page, not only the first. Take the URL from an existing link in `/content` (search for `dashboard.knock.app/~/`). If no page links that route yet and you can't confirm it, leave the path unlinked and list it in the PR description. Don't guess a route.

Link a Knock concept the first time a page mentions it in prose. Point the link at the section that answers the reader's question when there is one, such as `[static audiences](/concepts/audiences#static-audiences)`. One link per concept per page is enough.

Links inside tables get their color and underline from `styles/global.css`, like any other link. Don't add an inline `style` to a link, and remove one when you edit its line.

Don't put inline code in link text. The MDX `code` component sets its own color, so the link loses its link styling and doesn't read as a link. Link a plain-text phrase and keep the code beside it: "[exit the branch](/cli/branch/exit) with `knock branch exit`".

Check the links in every file you edit, not just the ones you added or changed. Fix what's wrong.

- Internal links: the path resolves against `/content`, and any anchor matches a heading id on the target page. A path that works only through a redirect in `next.config.js`, such as `/concepts/tenants` or `/concepts/environments`, is wrong. Point it at the redirect's destination.
- External links: `target="_blank"` and `rel="noopener"` are both present, except dashboard links, which skip `rel`. Replace `rel="noopener noreferrer"` with `rel="noopener"`.

## Images

Use the `Image` component from `lib/mdxComponents.tsx` for every image, including ones you'd otherwise write as markdown `![]()`. It wraps the image in a block-level `fit-content` container and applies the border and rounding itself. Its props are typed there too.

- `className="mx-auto"` centers it.
- `border={false}` removes the border, for logos and badges.
- Don't restate the component's own border or radius classes in `className`.

Don't add screenshots of third-party UIs, such as a CDP's or a warehouse's console. They go stale when the vendor changes its UI, and no one at Knock is notified. Describe those steps in text, naming each control by its label.

## Callouts

`Callout` takes a `type` that sets the emoji and the background color together. Props and the full type-to-emoji mapping are typed in `components/ui/Callout.tsx`.

| `type`              | Use for                                |
| ------------------- | -------------------------------------- |
| `info`              | General notes. The default.            |
| `warning`           | Caveats and things to watch for.       |
| `alert`             | Breaking changes, destructive actions. |
| `enterprise`        | Enterprise-tier features.              |
| `beta`              | Beta or in-development features.       |
| `roadmap`           | Planned but not shipped.               |
| `community_sourced` | Community-contributed tutorials.       |

- Give `title` the point of the note, not a label. `title="Note:"` wastes the line the reader looks at first. So does a title that only names a setting, such as `title="When null:"`. Many older pages use `Note:` titles, so don't copy them. Leave off the trailing colon.
- A JSX string prop can't contain a double quote. When a title quotes a UI label, pass a template literal: `` title={`Set "When null" per column`} ``.
- `community_sourced` fills in its own title and text. Pass it alone: `<Callout type="community_sourced" />`.
- Use the `emoji` prop only when no `type` fits the content. Without a `type`, the callout falls back to the gray `default` background unless you also pass `bgColor`.
- Pass `text` as a fragment when it contains links or code: `text={<>… <a href="/concepts/workflows">workflows</a> …</>}`.
- `style` replaces the component's own width style, so passing it cancels `maxWidth` and `isCentered`'s 90% cap.
- Plan-gating callouts use `title="Enterprise plan feature."` and a `text` that names the feature and links "Enterprise plan" to `https://knock.app/pricing`.

A callout works by interrupting the page. Too many on one page undermines their ability to stand out. Place them against the page's structure, not on every point worth noticing.

- Never stack two callouts back to back. Content that needs two consecutive interruptions belongs in prose or in its own section.
- Limit callouts to the points a reader can't afford to miss. When a page accumulates them, its headings and ordering usually aren't carrying the content, and the fix is restructuring the page rather than adding another callout.
- A rule that silently overrides the reader's other actions is one of those points. For example, while a sync manages an audience, its members can't be edited any other way. Put a rule like that in a `warning` callout, not in a sentence at the end of a step.

## Steps

Use `Steps` and `Step` from `components/ui/Step.tsx` for a procedure whose steps each need more than a sentence.

- `titleSize` sets the tag for every step title in the group. The default, `p`, renders bold body text that stays out of the table of contents. `h2` and `h3` render headings that appear in it. Under a `##` heading, use `titleSize="h3"` when a reader might link to a single step, such as "Map columns". Don't use `h4`. It stays out of the table of contents like `p` does, and heading styles at body-text size look out of place.
- Each step's id is its title, lowercased, with spaces replaced by hyphens. Keep step titles unique on the page and different from its headings.
- Include every action through the last one, such as **Save and publish**, as a step. Don't follow the `Steps` block with a separate heading for the final action.
- Introduce the steps with "Complete the following steps", not a count. A count goes stale when a step is added.

## Tables

Use a markdown table for short text and parameter lists. Use the `Table` component from `components/ui/Table.tsx` when cells hold components, links, or multi-line text. Don't use an HTML `<table>`, which renders without the docs' table styles.

## Feature matrices

Use `FeaturesMatrix` for availability grids — which features are supported across a set of options, such as channels, plans, or SDKs. It renders check and X marks from a `columns` and `rowGroups` object rather than markup. Use `Table` for anything whose cells hold values rather than yes-or-no.

## Accordion anchor slugs

Set an `anchorSlug` on accordions worth linking to directly. It becomes the element `id`, so the accordion opens and scrolls into view when the URL hash matches, and it renders the "copy link" affordance on the accordion header.

Lean toward adding one. Readers and support link to individual panels often, and the affordance only renders when the slug is present, so a page where some accordions have one and others do not reads as broken rather than deliberate.

- Use lowercase `a-z0-9` with words joined by hyphens. No leading, trailing, or doubled hyphens.
- Use underscores only inside a code identifier reproduced verbatim from the title, such as `format_date_in_locale`.
- Keep slugs to 50 characters or fewer.
- Prefix accordions under a "Frequently asked questions" heading with `faq-`, then condense the question to a topic phrase rather than repeating it in full.
- Prefix the `Settings`, `Advanced`, `Overrides`, and `Conditions` accordions under a provider's "Channel configuration" heading with `configuration-`.
- Prefix with a short token from the enclosing heading or `<Step>` title when a bare title would repeat on the page or match a heading id.
- Keep each slug unique within its page, and never equal to a heading id or a `<Step>` id on that page.

Skip it when the enclosing heading is the better link target. That covers accordions whose titles repeat across a page, and small groups presenting alternative routes to one outcome, where a reader wants the section rather than one branch. When you skip one, skip its siblings too so the group stays consistent.

✅ Correct:

```mdx
<Accordion title="Settings" anchorSlug="configuration-settings">
<Accordion title="Advanced" anchorSlug="configuration-advanced">
<Accordion title="`format_number`" anchorSlug="format_number">
<Accordion title="How do I set per-environment batch windows?" anchorSlug="faq-per-environment-batch-windows">
<Accordion title="Table definition example" anchorSlug="messages-table-definition-example">
```

❌ Incorrect:

```mdx
<Accordion title="Settings">
<Accordion title="How do I set per-environment batch windows?" anchorSlug="faq-how-do-i-set-per-environment-batch-windows">
<Accordion title="Supported locales" anchorSlug="supported-locales">
<Accordion title="Settings" anchorSlug="Settings_Panel">
```

The first omits `anchorSlug` entirely. The second repeats the question instead of condensing it. The third matches the `## Supported locales` heading id on the same page. The fourth uses uppercase and an underscore that is not a code identifier.

## FAQ sections

FAQ sections use the heading `Frequently asked questions` at `##`, sit last on the page, and wrap their accordions in an `AccordionGroup`.

## List formatting with bold introductory text

When using lists with bold introductory text, use a period after the bold text instead of a colon.

✅ Correct:

1. **Mark as read.** Notifications can be automatically marked as read when:
   - The feed is opened
   - A notification is clicked

❌ Incorrect:

1. **Mark as read:** Notifications can be automatically marked as read when:
   - The feed is opened
   - A notification is clicked

❌ Incorrect:

1. **Mark as read**: Notifications can be automatically marked as read when:
   - The feed is opened
   - A notification is clicked

## Active voice

Write in active voice.

- Active: "The workflow sends the notification."
- Passive: "The notification is sent by the workflow."

Passive is the right choice when the actor is the system and naming it adds nothing, or when the sentence is about what happened to its object: "The message is marked as read when the feed opens." Don't contort a sentence to avoid it.

## Document the product as it works today

Write what the reader can do and how to do it. Leave out:

- **What the reader can't do, unless they'd try it.** "`workflow.json` doesn't include a goal attachment" describes a path no one needs, and the goals page already says where to attach a goal. A limitation that blocks something the reader wants to do belongs in the page's limitations or FAQ section.
- **Deprecated fields and old behavior.** Document the supported way. History belongs in the changelog, so avoid "previously", "now", and "no longer".
- **Settings that make no difference.** If goals can be cloned into any environment, say that. Don't add "even when modify resources in any environment is disabled".
- **Hedges about the future.** Cut "currently", "at this time", and "in the future, we may". Planned work goes in a `roadmap` callout.

## Say it once

Give each fact one home on the page.

- When a step links to the section that explains something, don't explain it in the step as well.
- When two sentences say the same thing in different words, keep the clearer one.
- Cut sentences that reassure rather than inform, such as "That works for most tables."

Leave out detail the reader can't act on. That includes standard HTTP behavior, such as a 404 for a missing resource, and full lists of the checks or questions a tool runs internally.

A tutorial that runs a skill or the Knock agent should say what each phase does for the reader and link the skill. Listing the skill's internal checks repeats the skill, and the list goes stale when the skill changes.

## Say what happens at a limit

When you document a limit, a restriction, or a failure, say what happens when the reader hits it and what to do instead.

- "If the resolved time is more than 365 days out, Knock logs an error and halts the workflow run" tells the reader more than "the maximum is 365 days". Follow it with the alternative, such as a one-time schedule.
- Quote a dashboard error message exactly when the reader will see it.
- Give the reason when a reader would otherwise wonder about it: "Because sandbox mode never calls your provider, you can save the configuration without provider credentials."

## Write sentences that read one way

Reread each sentence as someone new to the feature. If it can be read two ways, rewrite it.

- **Separate what applies from what doesn't.** "Channel conditions, preferences, and send windows apply during a single-step test, but the step's own conditions are ignored."
- **Watch "and" between separate things.** "How many rows were read and failed" can read as rows that were read and then failed. "How many rows it read, and how many failed" can't.
- **Say which value does what.** Call a true-or-false column a boolean and name the value that triggers the behavior: "Knock removes rows where it's `true`." Format literal values as code, such as `true`, `null`, and `$tenants`.
- **Say what a cross-reference holds.** When a link ends a step, tell the reader what they'll find there: "See [deleted rows](#deleted-rows) for what happens when a row is removed from your source table." When the link text would repeat the action the sentence names, link the action instead. Write "Once the connection works, [create a sync](…) to start syncing data into Knock", not "Once the connection works, create a sync. See [create a sync](…)."
- **Use "must" for requirements.** "It should be a timestamp column" reads as advice. If Knock rejects anything else, write "It must be a timestamp or datetime column."
- **Explain what looks like a mistake.** When a value the reader copies looks stale or wrong, say that it's intentional: "This endpoint kept its `census` path when Census became Fivetran Activations, so use it as written."

## Keep facts consistent and sourced

- When a fact changes, such as a limit, a default, or a supported file type, search `/content` and `data/specs` for every statement of it. That includes FAQ answers, callouts, `Attribute` descriptions, and the CLI and API reference pages, which a concept-page update tends to miss. Update them in the same change.
- When a page lists behavior per provider, per SDK, or per resource type, cover every one the page supports. A timestamps section that covers Redshift and PostgreSQL but not BigQuery leaves BigQuery readers guessing. Update any shared troubleshooting row along with it.
- When the dashboard, the Management API, and the CLI behave differently, say which does what: "The dashboard accepts JPEG, PNG, GIF, and SVG files. The Management API and the CLI accept JPEG, PNG, and GIF files."
- Take lists of fields, options, and limits from a source: the OpenAPI specs in `data/specs`, the product code, or the ticket. A list a reviewer finds incomplete, such as user fields without `timezone` and `locale`, costs a review round. If you can't confirm an item, ask in the PR description.
- Make example values satisfy the rules the page states. If a timestamp must be in the future, set the example date years ahead.
- Don't leave `{/* TODO */}` or pending-review comments in MDX. Put open questions in the PR description.

## Before opening a PR

Reviewers keep catching the same issues. Check these in every file you changed:

- Steps read correctly for a production-only account. Environment-specific content sits in an "If you've enabled environments" sentence.
- Each resource and action you document states its scope: account-wide or per environment, and committed or immediate.
- Dashboard paths in steps link to the dashboard. No internal link relies on a redirect, and no link text is inline code.
- A renamed or moved page has a redirect, an updated sidebar entry, and no remaining links to the old path.
- Role names are lowercase, and the first mention of a Knock concept links to its page.
- No callout is titled `Note:` or ends in a colon. A rule that overrides the reader's other actions sits in a `warning` callout.
- No sentence describes what the reader can't do, deprecated behavior, or a setting that has no effect.
- Each fact appears once per page. When you changed a fact, every other page that states it, FAQs included, matches.
- No TODO comments are left in MDX.

# Tutorial writing guidelines for /content/tutorials/\*

The following guidelines apply specifically to content in the `/content/tutorials/` directory:

## Always link to Knock docs when possible

Any time you first reference a Knock API, a Knock concept, or any other concept covered elsewhere in this documentation, link to it so the reader can learn more. This applies to every page, as the links section describes, but tutorials lean on it most.

## Consistent terminology

Use consistent terminology for features and processes, such as "incoming replies URL" and "outbound webhook".

## Configuration instructions

Provide clear, step-by-step instructions for configuration tasks, including where to find necessary settings in the UI.

In a prerequisites list, mark anything the reader can skip with "Optional:" and say what it gets them: "Optional: a configured email provider. Setting it up first saves you from updating your workflows after the migration."

## Payload structure

When describing data structures, use tables to define properties, types, and descriptions for clarity.

## Examples

Include example payloads or code snippets to illustrate how features work in practice.

## Debugging and troubleshooting

Provide sections for debugging and troubleshooting, explaining where to find logs and how to interpret them.

## FAQs

Include a frequently asked questions section to address common concerns or limitations.

## Limitations and future features

State current limitations so readers know what to expect. Mention future enhancements only when they're planned, in a `roadmap` callout, and don't speculate about what Knock may support.

## Educate the user

When introducing Knock concepts, make a point to educate the user about what they're doing. Don't just tell them how to do something, explain why they're doing it and what the benefits are.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
