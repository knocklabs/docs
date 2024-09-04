---
title: Partials
description: Learn how to create reusable pieces of content using partials.
tags:
  ["partials", "templates", "custom blocks", "message templates", "workflows"]
section: Designing workflows
---

Partials are reusable pieces of content you can use across any of your channel templates. HTML partials can be enabled as "blocks" for use in Knock’s drag-and-drop email editor.

In this page, we'll walk through how to create partials and use them in your templates using Knock's code editor or visual editor.

## Managing partials

### Creating and editing partials

To get started, navigate to the "Partials" page under the "Developers" section of the main sidebar where you can create a new partial.

When creating or editing partials, you can use the following properties:

| Property      | Description                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------- |
| `Name`        | A name for your partial.                                                                        |
| `Key`         | A unique key for your partial.                                                                  |
| `Type`        | The type of content you want to create. This can be HTML, markdown, plaintext, or JSON.         |
| `Description` | An optional description of your partial.                                                        |
| `Is block`    | Whether or not to enable this partial as a block within the visual editor (HTML partials only). |
| `Icon name`   | An icon to display for this partial within the visual editor.                                   |

Partials are environment-specific and follow the same version control model as the rest of Knock.

### Editing partial content

After creating a partial, you can edit its content in the code editor.

You can include Liquid variables in your content which will be scoped to your partial. When using the partial in a template, you can pass in values for these variables. To include a variable in your partial, use the following syntax: `{{ variable_name }}`.

<Callout
  emoji="🚨"
  text={
    <>
      <strong>Note:</strong> Partials must be committed before they can be used
      by templates in a given environment. Templates will always use the
      published version of a partial.
      <br />
      <br />
      If you're using a partial in a template that is not yet committed or has unpublished
      changes, you will not see your latest changes.
    </>
  }
/>

#### Editing HTML partials

HTML partials display a preview alongside the editor. Open the preview by clicking the "Preview" button or using the `Cmd + ]` keyboard shortcut on Mac, or `Ctrl + ]` on Windows.

- Select an [email layout](/integrations/email/layouts) to preview the partial within.
- Use the `<style>` tag to add CSS to your partial, which will be inlined when rendering your email messages.
- Edit the placeholder variable values in the preview sidebar. These values are just for the preview and will not be used in your final messages. The preview text will also appear alongside the variable name in the code editor typeahead information.

### Archiving partials

Partials can be archived from the "Partials" page or the partial's details page.

<Callout
  emoji="🚨"
  text={
    <>
      <strong>Note:</strong> If an archived partial is used in a template, it
      will continue to render until the workflow containing that template is
      published again.
      <br />
      <br />
      After the workflow has been published, the partial will not render in your
      messages.
    </>
  }
/>

## Using partials in templates

Partials can be used in templates with the code editor or visual editor.

You can also include partials in other partials. Knock will render partials recursively up to a maximum depth of 5.

### In the code editor

Use partials by using the render tag with the following syntax: `{% render 'partial_key' %}`. You can also use the partial button in the toolbar to insert a partial.

Pass variables in to your partial using the following syntax: `{% render 'partial_key', variable_name: 'value' %}`. You can pass in plain text values or Liquid expressions like `{% render 'partial_key', variable_name: data.variable_name %}`.

The Knock render tag does not support the `for` and `with` modifiers.

To replicate the `for` modifier, use the Liquid `for` block.

```liquid title="Partials in a loop"
{% for item in data.items %}
  {% render 'partial_key', variable_name: item.value %}
{% endfor %}
```

To replicate the `with` modifier, use the `{% assign %}` tag to re-assign a variable.

```liquid title="Alternative to the 'with' modifier"
{% assign item = data.item %}
{% render 'partial_key', variable_name: item.value %}
```

### In the visual editor

HTML partials can be used in the visual editor if they are enabled as blocks. Add a partial to your template by dragging it from the "Custom blocks" section of the sidebar into the template.

Click a custom block to open the inspect panel to edit variable values. You can enter a plain text value or a Liquid expression like `{{ data.variable_name }}`.

## Frequently asked questions

<AccordionGroup>
  <Accordion title="Why can't I see my partial in the editor or preview?">
    To use a partial in the visual editor, it must be an HTML partial and enabled as a block.

    Partials must be committed before they can be used
    by templates in a given environment. Templates will always use the
    published version of a partial.

    If you're using a partial in a template that is not yet committed or has unpublished
    changes, you will not see your latest changes.

  </Accordion>
</AccordionGroup>
