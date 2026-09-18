# Knock docs

Documentation, tutorials, and the API reference for Knock. Built with Next.js and TypeScript.

## Running the project

### System requirements

- Node.js 20.19.3
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

`tags` are written into the search index, so a tag earns its place by grouping this page with others. A tag that appears on one page matches only what the title already matches. Check that a tag is in use elsewhere in `/content` before adding it, and prefer an existing tag over a more precise new one.

Match `section` to a value already in use. A new section value creates a group of one.

---

# Knock writing style guide

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
- agents
- agent function

"Agent" is lowercase everywhere except in "Agent Toolkit". Write "the Knock agent" in long-form prose and "Knock agents" for the plural.

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

Check the links in every file you edit, not just the ones you added or changed. Fix what's wrong.

- Internal links: the path resolves against `/content`, and any anchor matches a heading id on the target page.
- External links: `target="_blank"` and `rel="noopener"` are both present, except dashboard links, which skip `rel`.

## Images

Use the `Image` component from `lib/mdxComponents.tsx` for every image, including ones you'd otherwise write as markdown `![]()`. It wraps the image in a block-level `fit-content` container and applies the border and rounding itself. Its props are typed there too.

- `className="mx-auto"` centers it.
- `border={false}` removes the border, for logos and badges.
- Don't restate the component's own border or radius classes in `className`.

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

- Give `title` the point of the note, not a label. `title="Note:"` wastes the line the reader looks at first.
- `community_sourced` fills in its own title and text. Pass it alone: `<Callout type="community_sourced" />`.
- Use the `emoji` prop only when no `type` fits the content. Without a `type`, the callout falls back to the gray `default` background unless you also pass `bgColor`.
- Pass `text` as a fragment when it contains links or code: `text={<>… <a href="/concepts/workflows">workflows</a> …</>}`.
- `style` replaces the component's own width style, so passing it cancels `maxWidth` and `isCentered`'s 90% cap.
- Plan-gating callouts use `title="Enterprise plan feature."` and a `text` that names the feature and links "Enterprise plan" to `https://knock.app/pricing`.

A callout works by interrupting the page. Too many on one page undermines their ability to stand out. Place them against the page's structure, not on every point worth noticing.

- Never stack two callouts back to back. Content that needs two consecutive interruptions belongs in prose or in its own section.
- Limit callouts to the points a reader can't afford to miss. When a page accumulates them, its headings and ordering usually aren't carrying the content, and the fix is restructuring the page rather than adding another callout.

## Feature matrices

Use `FeaturesMatrix` for availability grids — which features are supported across a set of options, such as channels, plans, or SDKs. It renders check and X marks from a `columns` and `rowGroups` object rather than markup. Use `Table` for anything whose cells hold values rather than yes-or-no.

## Accordion anchor slugs

Set an `anchorSlug` on accordions worth linking to directly. It becomes the element `id`, so the accordion opens and scrolls into view when the URL hash matches, and it renders the "copy link" affordance on the accordion header.

Lean toward adding one. Readers and support link to individual panels often, and the affordance only renders when the slug is present, so a page where some accordions have one and others do not reads as broken rather than deliberate.

- Use lowercase `a-z0-9` with words joined by hyphens. No leading, trailing, or doubled hyphens.
- Use underscores only inside a code identifier reproduced verbatim from the title, such as `format_date_in_locale`.
- Keep slugs to 50 characters or fewer.
- Prefix accordions under a "Frequently asked questions" heading with `faq-`, then condense the question to a topic phrase rather than repeating it in full.
- Prefix the `Settings`, `Overrides`, and `Conditions` accordions under a provider's "Channel configuration" heading with `configuration-`.
- Prefix with a short token from the enclosing heading or `<Step>` title when a bare title would repeat on the page or match a heading id.
- Keep each slug unique within its page, and never equal to a heading id or a `<Step>` id on that page.

Skip it when the enclosing heading is the better link target. That covers accordions whose titles repeat across a page, and small groups presenting alternative routes to one outcome, where a reader wants the section rather than one branch. When you skip one, skip its siblings too so the group stays consistent.

✅ Correct:

```mdx
<Accordion title="Settings" anchorSlug="configuration-settings">
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

# Tutorial writing guidelines for /content/tutorials/\*

The following guidelines apply specifically to content in the `/content/tutorials/` directory:

## Always link to Knock docs when possible

Any time you first reference a Knock API, a Knock concept, or any other concept covered elsewhere in this documentation, link to it so the reader can learn more.

## Consistent terminology

Use consistent terminology for features and processes, such as "incoming replies URL" and "outbound webhook".

## Configuration instructions

Provide clear, step-by-step instructions for configuration tasks, including where to find necessary settings in the UI.

## Payload structure

When describing data structures, use tables to define properties, types, and descriptions for clarity.

## Examples

Include example payloads or code snippets to illustrate how features work in practice.

## Debugging and troubleshooting

Provide sections for debugging and troubleshooting, explaining where to find logs and how to interpret them.

## FAQs

Include a frequently asked questions section to address common concerns or limitations.

## Limitations and future features

Clearly state current limitations and potential future enhancements to manage user expectations.

## Educate the user

When introducing Knock concepts, make a point to educate the user about what they're doing. Don't just tell them how to do something, explain why they're doing it and what the benefits are.
