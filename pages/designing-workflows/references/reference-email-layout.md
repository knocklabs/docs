---
title: "Reference: email layout"
description: A reference guide to help you work with email layouts in Knock.
tags: ["templates", "layouts", "styles", "design system"]
section: Send notifications
---

This is a reference guide of special Knock variables and generated CSS styles that are used in email layouts.

## Special Knock variables

There are a few special variables used in email layouts to populate and assemble the final email notification template.

| Variable       | Description                                                                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`      | A notification template defined in an email channel step will be inserted into this variable. **This is a required variable, and must be present somewhere in every layout.** |
| `footer_links` | A list of footer links, as configured in the layout editor, will be injected into this variable.                                                                              |

## Generated CSS styles

When you use the [visual template editor](/send-notifications/designing-workflows#visual-editing-with-drag-and-drop-components) to build your email notification template, we auto-generate and include the following CSS styles in the email layout. They provide base styles for certain components, which you can override or extend as needed.

```css Base component styles
/* Button components */
.block-row.block-row--button_set-v1 .block-button {
  display: inline-block;
  box-sizing: border-box;
  text-decoration: none;
  -webkit-text-size-adjust: none;
}
.block-row.block-row--button_set-v1 .block-button.block-button--outline {
  border-style: solid;
}
.block-row.block-row--button_set-v1 .block-button.block-button--sm {
  font-size: 14px;
  line-height: 20px;
  min-width: 32px;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 8px;
  padding-right: 8px;
}

/* Divider component */
.block-row.block-row--divider-v1 .block-divider {
  border-bottom: 1px solid #dddee1;
}

/* Markdown components */
.block-row.block-row--markdown-v1 .block-markdown > :first-child {
  margin-top: 0;
}
.block-row.block-row--markdown-v1 .block-markdown > :last-child {
  margin-bottom: 0;
}
```
