import React, { type ReactNode } from "react";
import { Tabs } from "@telegraph/tabs";
import { Box } from "@telegraph/layout";
import { AgentSetupPrompt } from "@/components/ui/AgentSetupPrompt";

type AgentFirstSetupProps = {
  children: ReactNode;
  /** Use the combined Knock setup + in-app UI skill prompt. */
  inApp?: boolean;
};

export const AgentFirstSetup = ({
  children,
  inApp = false,
}: AgentFirstSetupProps) => {
  return (
    <Tabs defaultValue="agent" mt="4">
      <Tabs.List borderBottom="px">
        <Tabs.Tab value="agent">Agent</Tabs.Tab>
        <Tabs.Tab value="manual">Manual</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="agent">
        <Box mt="4">
          <AgentSetupPrompt inApp={inApp} />
        </Box>
      </Tabs.Panel>
      <Tabs.Panel value="manual">
        <Box mt="4">{children}</Box>
      </Tabs.Panel>
    </Tabs>
  );
};
