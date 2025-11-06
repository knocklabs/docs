---
description: Rules for validating Callout component usage and type selection
globs:
  - content/**/*.mdx
alwaysApply: true
---

## Callout type validation

When reviewing documentation, validate that Callout components use the appropriate type based on their content. The available types are: `info`, `warning`, `alert`, `enterprise`, `beta`, and `roadmap`.

### Callout type definitions

#### Info (`type="info"`)

Use for nice-to-know information that helps users get more value out of a feature. This is for helpful tips, additional context, or supplementary information that enhances understanding.

**Indicators:**

- Words like: "tip", "learn more", "you can also", "additionally"
- Helpful context that doesn't warn about problems
- Information about optional features or enhancements
- Links to related documentation

**Note:** Keywords are hints, not definitive rules. Focus on whether the content provides helpful information without warning about problems. For example, "Note: This feature also supports X" would be `info` because it's helpful context, not a warning.

**Example appropriate usage:**

- Explaining an optional feature enhancement
- Providing additional context about how something works
- Linking to related documentation

#### Warning (`type="warning"`)

Use when incorrect usage may cause unintended side effects or errors. These situations usually won't break things completely but have the potential to generate non-urgent support tickets. If users don't pay attention, bad things may happen.

**Indicators:**

- Words like: "be careful", "important", "may cause", "could result in", "potential issues"
- Mentions of incorrect usage leading to problems
- Warnings about side effects or unintended behavior
- Non-destructive but problematic outcomes
- Situations where errors can be handled by the calling app

**Note:** Keywords are hints, not definitive rules. Focus on whether the content warns about potential problems or side effects. For example, "Note: Incorrect usage may cause errors" would be `warning` because it warns about problems, even though it uses the word "note".

**Example appropriate usage:**

- Warning about incorrect usage that may cause errors
- Noting potential side effects of a feature
- Explaining limitations that could cause issues if not understood
- API calls that can return error codes the app can handle

#### Alert (`type="alert"`)

Use for destructive operations where data can't be recovered, actions that can't be undone, or anywhere there's a security implication. This is for serious consequences that require immediate attention.

**Indicators:**

- Words like: "destructive", "cannot be undone", "permanent", "irreversible", "security", "delete", "remove permanently", "cannot recover"
- Actions that permanently delete or modify data
- Security-related warnings
- Operations that cannot be reversed
- Critical errors that cannot be handled gracefully

**Example appropriate usage:**

- Deleting data that cannot be recovered
- Security vulnerabilities or implications
- Permanent configuration changes
- Actions that cannot be undone

#### Enterprise (`type="enterprise"`)

Use for features or information specific to enterprise plans or enterprise customers.

**Indicators:**

- Mentions of "enterprise", "enterprise plan", "enterprise feature"
- Features restricted to enterprise accounts
- Enterprise-specific functionality

#### Beta (`type="beta"`)

Use for features that are in beta or experimental state.

**Indicators:**

- Mentions of "beta", "experimental", "preview", "early access"
- Features that may change
- New features not yet generally available

#### Roadmap (`type="roadmap"`)

Use for information about planned features or future roadmap items.

**Indicators:**

- Mentions of "coming soon", "planned", "roadmap", "future"
- Features that are not yet available
- Upcoming changes or improvements

### Validation rules

**Important:** When validating Callout types, focus on the semantic meaning and intent of the content, not just keyword matching. The same word can appear in different contexts—what matters is whether the message describes problems (warning/alert) or helpful information (info).

#### Rule 1: Check for incorrect type usage

When reviewing a Callout, analyze the content to determine if the type matches the severity and nature of the message:

1. **Alert used for non-destructive warnings:**

   - If a Callout uses `type="alert"` but describes non-destructive issues, errors that can be handled, or warnings about side effects, suggest changing to `type="warning"`.
   - Example: "This API call may return an error code" → should be `warning`, not `alert`

2. **Warning used for destructive operations:**

   - If a Callout uses `type="warning"` but describes destructive operations, permanent deletions, or security implications, suggest changing to `type="alert"`.
   - Example: "This action permanently deletes all data and cannot be undone" → should be `alert`, not `warning`

3. **Info used for warnings:**

   - If a Callout uses `type="info"` but warns about potential problems, errors, or side effects, suggest changing to `type="warning"`.
   - Example: "Incorrect usage may cause errors" → should be `warning`, not `info`

4. **Warning/Alert used for helpful tips:**
   - If a Callout uses `type="warning"` or `type="alert"` but only provides helpful information without warning about problems, suggest changing to `type="info"`.
   - Example: "You can also use this feature to enhance your workflow" → should be `info`, not `warning`

#### Rule 2: Check for freeform callouts that should use standard types

When a Callout uses custom `emoji` or `bgColor` props instead of a `type`, check if the content matches one of the standard types:

1. **Freeform callout with warning content:**

   - If a Callout has custom emoji/bgColor but warns about problems, errors, or side effects, suggest using `type="warning"` or `type="alert"` instead.
   - Look for warning language even if no type is specified

2. **Freeform callout with info content:**

   - If a Callout has custom emoji/bgColor but only provides helpful information, suggest using `type="info"` instead.

3. **Freeform callout matching standard types:**
   - If the emoji or content matches a standard type (e.g., 🚧 for beta, 🏢 for enterprise), suggest using the appropriate `type` prop instead.

### Review checklist

When reviewing Callout usage, check:

1. ✅ Does the type match the severity of the message?
2. ✅ Is this a destructive operation that should be `alert`?
3. ✅ Is this a warning about potential issues that should be `warning`?
4. ✅ Is this just helpful information that should be `info`?
5. ✅ Are freeform callouts (custom emoji/bgColor) using a standard type when appropriate?
6. ✅ Does the content match the type's definition?

### Examples of incorrect usage

❌ **Incorrect:** Using `type="alert"` for a non-destructive warning

```mdx
<Callout
  type="alert"
  text="This API may return an error code that your app can handle."
/>
```

✅ **Correct:** Should use `type="warning"`

```mdx
<Callout
  type="warning"
  text="This API may return an error code that your app can handle."
/>
```

❌ **Incorrect:** Using `type="warning"` for a destructive operation

```mdx
<Callout
  type="warning"
  text="This action permanently deletes all user data and cannot be undone."
/>
```

✅ **Correct:** Should use `type="alert"`

```mdx
<Callout
  type="alert"
  text="This action permanently deletes all user data and cannot be undone."
/>
```

❌ **Incorrect:** Using `type="info"` for a warning

```mdx
<Callout
  type="info"
  text="Incorrect usage may cause unintended side effects."
/>
```

✅ **Correct:** Should use `type="warning"`

```mdx
<Callout
  type="warning"
  text="Incorrect usage may cause unintended side effects."
/>
```

❌ **Incorrect:** Using freeform callout when standard type fits

```mdx
<Callout
  emoji="⚠️"
  bgColor="yellow"
  text="Be careful: this may cause errors."
/>
```

✅ **Correct:** Should use `type="warning"`

```mdx
<Callout type="warning" text="Be careful: this may cause errors." />
```

### When to flag

Flag a Callout for review when:

1. The type doesn't match the severity indicated by the content
2. A freeform callout (custom emoji/bgColor) could use a standard type
3. Destructive/security content uses `warning` instead of `alert`
4. Non-destructive warnings use `alert` instead of `warning`
5. Helpful tips use `warning` or `alert` instead of `info`

### Suggested review message format

When flagging incorrect Callout usage, use this format:

> **Callout type mismatch:** This Callout uses `type="[current]"` but the content suggests it should be `type="[suggested]"` because [reason]. Consider updating the type to better match the severity and nature of the message.
