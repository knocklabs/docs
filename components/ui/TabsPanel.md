# TabsPanel Component

A custom wrapper around the `@telegraph/tabs` Tabs.Panel component that adds background rendering functionality.

## Features

- **Background Rendering**: When `renderInBackground={true}`, content continues to render even when the tab is not active
- **Seamless API**: Maintains the same API as the original Tabs.Panel component
- **Performance Control**: Choose when to use background rendering vs standard behavior

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The value that associates this panel with a tab |
| `children` | `React.ReactNode` | - | The content to render inside the panel |
| `renderInBackground` | `boolean` | `false` | Whether to render content even when tab is inactive |
| `currentTab` | `string` | - | The currently active tab value (required when using `renderInBackground`) |
| `className` | `string` | - | CSS class name for the panel |
| `style` | `React.CSSProperties` | - | Inline styles for the panel |

## Usage

### Basic Usage (Standard Behavior)

```tsx
import { useState } from "react";
import { Tabs } from "@telegraph/tabs";
import { TabsPanel } from "./components/ui/TabsPanel";

function MyTabs() {
  const [currentTab, setCurrentTab] = useState("tab1");

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <Tabs.List>
        <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
      </Tabs.List>

      <TabsPanel value="tab1" currentTab={currentTab}>
        <div>Content for Tab 1</div>
      </TabsPanel>

      <TabsPanel value="tab2" currentTab={currentTab}>
        <div>Content for Tab 2</div>
      </TabsPanel>
    </Tabs>
  );
}
```

### Background Rendering

```tsx
import { useState } from "react";
import { Tabs } from "@telegraph/tabs";
import { TabsPanel } from "./components/ui/TabsPanel";

function MyTabsWithBackgroundRendering() {
  const [currentTab, setCurrentTab] = useState("tab1");

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <Tabs.List>
        <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
      </Tabs.List>

      <TabsPanel 
        value="tab1" 
        currentTab={currentTab}
        renderInBackground={true}
      >
        <div>This content continues to render even when tab is inactive</div>
      </TabsPanel>

      <TabsPanel 
        value="tab2" 
        currentTab={currentTab}
        renderInBackground={true}
      >
        <div>This content also renders in the background</div>
      </TabsPanel>
    </Tabs>
  );
}
```

### Replacing the Hacky Implementation

**Before (the hacky way):**
```tsx
<Tabs.Panel
  value={RESOURCE_ACTIVITY_TAB_VALUE}
  forceMount
  style={{
    visibility: currentTab === RESOURCE_ACTIVITY_TAB_VALUE ? 'visible' : 'hidden',
    overflow: currentTab === RESOURCE_ACTIVITY_TAB_VALUE ? 'visible' : 'hidden',
    height: currentTab === RESOURCE_ACTIVITY_TAB_VALUE ? 'auto' : '0',
  }}
  aria-hidden={currentTab !== RESOURCE_ACTIVITY_TAB_VALUE}
>
  {/* content */}
</Tabs.Panel>
```

**After (using TabsPanel):**
```tsx
<TabsPanel
  value={RESOURCE_ACTIVITY_TAB_VALUE}
  currentTab={currentTab}
  renderInBackground={true}
>
  {/* content */}
</TabsPanel>
```

## When to Use Background Rendering

**Use `renderInBackground={true}` when:**
- You need to maintain component state when switching tabs
- Components perform background operations (timers, websockets, etc.)
- You want to avoid re-rendering expensive components
- Content needs to stay "warm" for performance reasons

**Use standard behavior (default) when:**
- Content is static or cheap to re-render
- Memory usage is a concern
- You want traditional tab behavior

## Implementation Details

When `renderInBackground` is enabled, the component:
1. Sets `forceMount={true}` on the underlying Tabs.Panel
2. Uses CSS to hide/show content based on active state:
   - `visibility: hidden/visible`
   - `height: 0/auto`  
   - `overflow: hidden/visible`
3. Sets appropriate `aria-hidden` for accessibility

This approach ensures the DOM remains rendered while making inactive content invisible and inaccessible to screen readers.

## TypeScript Support

The component includes full TypeScript support with proper prop types and IntelliSense.