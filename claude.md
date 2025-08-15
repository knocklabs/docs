# Knock writing style guide

## Use "enable", not "allow"

**Allow** is another way of saying permit.

> Example: Knock permits you to send notifications to your users.

**Enable** means providing the means or opportunity.

> Example: Knock enables you to ship in-app notifications in a day.

## Knock product names are proper nouns and should be capitalized, unless being used as a verb

Here is a list of Knock product names (singular/plural) that should be capitalized:

- Agent Toolkit
- Management API

Best practice is to not use Knock product names as verbs. Use a synonym instead.

If you must use a Knock product name as a verb, do not capitalize the word.

## Knock concept or feature names are not proper nouns and should not be capitalized

Here is a list of Knock concept/feature names that should not be capitalized unless at beginning of sentence:

- Guides
- Workflows
- Broadcasts
- Tenants
- Users
- Objects
- Translations
- Schedules
- Subscriptions
- Preferences
- Messages
- Environments
- Audiences

## Case: always use sentence case

We always use sentence case, even for titles. This means that a header should always be capitalized as "How Knock works" and not "How Knock Works". The only exception to this rule is for proper nouns (i.e. Knock products such as Broadcasts).

### Sentence case rules

1. **Headers and titles**: Only capitalize the first word and proper nouns

   - ✅ "Feed component documentation"
   - ❌ "Feed Component Documentation"
   - ✅ "How to use the feed API"
   - ❌ "How To Use The Feed API"

2. **Technical terms**: Keep technical terms in sentence case unless they are proper nouns

   - ✅ "CSS variables"
   - ❌ "CSS Variables"
   - ✅ "API reference"
   - ❌ "API Reference"
   - ✅ "React Native components"
   - ❌ "React Native Components"

3. **Component names**: Keep component names in sentence case unless they are proper nouns

   - ✅ "Notification feed"
   - ❌ "Notification Feed"
   - ✅ "Feed provider"
   - ❌ "Feed Provider"

4. **Feature names**: Keep feature names in sentence case unless they are proper nouns

   - ✅ "Theme support"
   - ❌ "Theme Support"
   - ✅ "Custom UI guide"
   - ❌ "Custom UI Guide"

5. **Common patterns to avoid**:

   - ❌ Capitalizing every word in a title
   - ❌ Capitalizing feature names
   - ❌ Capitalizing component names
   - ❌ Capitalizing common nouns in titles

6. **Proper nouns that should remain capitalized**:
   - Knock product names (Agent Toolkit, Management API)
   - Brand names (React, iOS, Android)
   - Programming languages (JavaScript, TypeScript)
   - Framework names (React Native)

### List item formatting

When creating numbered or bulleted lists with bold introductory text, apply sentence case to all content:

✅ Correct:

1. **Simple A/B test flag**
2. **User tier segments**
3. **Engagement metrics**

❌ Incorrect:

1. **Simple A/B Test Flag**
2. **User Tier Segments**
3. **Engagement Metrics**

This applies to all list contexts, including:

- Numbered lists with bold descriptions
- Sub-bullet points with bold labels
- Step-by-step procedures with bold headings

### Technical terms and feature descriptions

Technical terms, feature names, and descriptive phrases should follow sentence case rules:

✅ Correct:

- **Email template configuration**
- **Branch step logic**
- **Webhook configuration**
- **Statistical significance**

❌ Incorrect:

- **Email Template Configuration**
- **Branch Step Logic**
- **Webhook Configuration**
- **Statistical Significance**

### Style guide checklist for editors

Before publishing, review content for these common sentence case violations:

- [ ] All headers and subheaders use sentence case
- [ ] Bold list items use sentence case
- [ ] Technical terms in bold use sentence case
- [ ] Template names use sentence case
- [ ] Feature descriptions use sentence case
- [ ] Only proper nouns (brand names, product names) are capitalized

### Common patterns to search for during editing

Use these regex patterns to find potential title case violations:

- `\*\*[A-Z][a-z]+ [A-Z]` - Finds bold text with potential title case
- `#{1,6} [A-Z][a-z]+ [A-Z]` - Finds headers with potential title case
- `\d+\. \*\*[A-Z][a-z]+ [A-Z]` - Finds numbered list items with potential title case

## Case: do not use title case

A title such as "Feed component documentation" should always be in sentence case. Only the first word in the title is capitalized (unless the title includes proper nouns.) Do NOT use title case, example: "Feed Component Documentation".

## Avoid adverbs

We avoid using adverbs in our writing.

They are often unnecessary, and they lead to copy that is trying too hard to convince our audience of something.

Example:

- With adverb: "The delay step is **incredibly** useful for scheduling reminders or other longer lived notifications."
- Without adverb: "The delay step is useful for scheduling reminders or other longer lived notifications."

## Oxford comma

We use the oxford comma.

## No exclamation marks

We don't use exclamation marks in our blog post copy or our documentation. Okay to use them in social posts.

## We don't use "&"

Best to use "and" or if you need shorthand use "+".

## American, not British spelling

We use American English spelling throughout our docs. An example: "cancellation" not "cancelation", and "canceled" not "cancelled". (As you can see, "cancel", an important word in the Knock API, is an especially tricky word to stay consistent on between American and British English.)

## API should always be all caps

API, never api or Api

## Avoid using "guides" for documentation

Since "Guides" is a Knock feature name, we should avoid using the word "guides" when referring to documentation that helps users learn how to do something. Instead, use "docs" or "tutorials".

✅ Correct:

- "Check out our docs on how to set up notifications"
- "Follow this tutorial to implement the feed"

❌ Incorrect:

- "Check out our guides on how to set up notifications"
- "Follow this guide to implement the feed"

## Images

Images should always use Image component, rounded-md, mx-auto, border, border-gray-200.

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

- Always use active voice in your writing. Active voice makes your writing clearer and more direct.

- Avoid using passive voice. Passive voice can make sentences longer and more difficult to understand.

> Example of active voice: "The team completed the project."

> Example of passive voice: "The project was completed by the team."

# Tutorial writing guidelines for /content/tutorials/\*

The following guidelines apply specifically to content in the `/content/tutorials/` directory:

## Always link to Knock docs when possible

Any time you first reference a Knock API, a Knock concept, or any other concept that lives in the Knock documentation (https://docs.knock.app), link to it so the reader can learn more about the concept you're referencing. ALWAYS DOUBLE CHECK YOUR LINKS AND MAKE SURE THEY DO NOT 404.

## Use of notes and callouts

Use the `Callout` component to highlight important notes or in-development features. Clearly label these sections with icons or labels like "🚧 **Note**".

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
