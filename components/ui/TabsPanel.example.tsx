import { useState } from "react";
import { Tabs } from "@telegraph/tabs";
import { TabsPanel } from "./TabsPanel";

// Example usage of TabsPanel with background rendering
export const TabsPanelExample = () => {
  const [currentTab, setCurrentTab] = useState("tab1");

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <Tabs.List>
        <Tabs.Tab value="tab1">Regular Tab</Tabs.Tab>
        <Tabs.Tab value="tab2">Background Tab</Tabs.Tab>
        <Tabs.Tab value="tab3">Another Background Tab</Tabs.Tab>
      </Tabs.List>

      {/* Regular tab - content only renders when active */}
      <TabsPanel value="tab1" currentTab={currentTab}>
        <div style={{ padding: '16px' }}>
          <h3>Regular Tab Content</h3>
          <p>This content only renders when the tab is active.</p>
          <p>Current time: {new Date().toLocaleTimeString()}</p>
        </div>
      </TabsPanel>

      {/* Background rendered tab - content always renders */}
      <TabsPanel 
        value="tab2" 
        currentTab={currentTab}
        renderInBackground={true}
      >
        <div style={{ padding: '16px' }}>
          <h3>Background Rendered Tab</h3>
          <p>This content renders even when the tab is not active.</p>
          <p>Useful for maintaining state, timers, or ongoing operations.</p>
          <p>Current time: {new Date().toLocaleTimeString()}</p>
        </div>
      </TabsPanel>

      {/* Another background rendered tab */}
      <TabsPanel 
        value="tab3" 
        currentTab={currentTab}
        renderInBackground={true}
      >
        <div style={{ padding: '16px' }}>
          <h3>Another Background Tab</h3>
          <p>This also renders in the background.</p>
          <p>Switch between tabs to see the difference in behavior.</p>
        </div>
      </TabsPanel>
    </Tabs>
  );
};

// Example replacing the hacky implementation
export const ReplacingHackyImplementation = () => {
  const [currentTab, setCurrentTab] = useState("resource-activity");
  const RESOURCE_ACTIVITY_TAB_VALUE = "resource-activity";

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <Tabs.List>
        <Tabs.Tab value="resource-activity">Resource Activity</Tabs.Tab>
        <Tabs.Tab value="other-tab">Other Tab</Tabs.Tab>
      </Tabs.List>

      {/* Before: The hacky way */}
      {/* 
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
        <ResourceActivityContent />
      </Tabs.Panel>
      */}

      {/* After: Using TabsPanel */}
      <TabsPanel
        value={RESOURCE_ACTIVITY_TAB_VALUE}
        currentTab={currentTab}
        renderInBackground={true}
      >
        <div style={{ padding: '16px' }}>
          <h3>Resource Activity</h3>
          <p>This content now renders cleanly in the background.</p>
          <p>No more hacky CSS styles needed!</p>
        </div>
      </TabsPanel>

      <TabsPanel value="other-tab" currentTab={currentTab}>
        <div style={{ padding: '16px' }}>
          <h3>Other Content</h3>
          <p>Regular tab content.</p>
        </div>
      </TabsPanel>
    </Tabs>
  );
};