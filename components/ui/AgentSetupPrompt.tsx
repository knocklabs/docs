import React from "react";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { AgentPromptActionButton } from "@/components/ui/AgentPromptActionButton";

export const KNOCK_SETUP_SKILL_URL =
  "https://knock.app/.well-known/agent-skills/knock-setup/SKILL.md";

export const KNOCK_IN_APP_UI_SKILL_URL =
  "https://knock.app/.well-known/agent-skills/knock-in-app-ui/SKILL.md";

export const KNOCK_SETUP_PROMPT = `Setup Knock using ${KNOCK_SETUP_SKILL_URL}`;

/** Combined setup + in-app UI prompt for React / Next.js quick starts. */
export const KNOCK_IN_APP_SETUP_PROMPT = `Setup Knock in two steps:
1. Setup Knock using ${KNOCK_SETUP_SKILL_URL}
2. Add Knock in-app UI using ${KNOCK_IN_APP_UI_SKILL_URL}`;

const AGENT_OUTCOMES = [
  "Connect Knock MCP and skills to your IDE",
  "Discover and build notification workflows",
  "Wire triggers into your application",
] as const;

const IN_APP_AGENT_OUTCOMES = [
  ...AGENT_OUTCOMES,
  "Setup in-app notifications",
] as const;

type AgentSetupPromptProps = {
  prompt?: string;
  inApp?: boolean;
};

export const AgentSetupPrompt = ({
  prompt,
  inApp = false,
}: AgentSetupPromptProps) => {
  const outcomes = inApp ? IN_APP_AGENT_OUTCOMES : AGENT_OUTCOMES;
  const resolvedPrompt =
    prompt ?? (inApp ? KNOCK_IN_APP_SETUP_PROMPT : KNOCK_SETUP_PROMPT);

  return (
    <Box mt="2" rounded="3" border="px" borderColor="gray-4" bg="gray-2" p="5">
      <Stack direction="column" gap="5">
        <Stack direction="column" gap="0">
          <Text as="p" size="5" weight="medium" mb="2">
            Stand up your messaging infrastructure in minutes.
          </Text>
          <Stack
            as="ul"
            direction="column"
            gap="2"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            {outcomes.map((outcome) => (
              <Stack
                as="li"
                key={outcome}
                direction="row"
                alignItems="flex-start"
                gap="2"
              >
                <Text as="span" size="2" color="accent" aria-hidden>
                  →
                </Text>
                <Text as="span" size="2" color="gray">
                  {outcome}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <AgentPromptActionButton prompt={resolvedPrompt} />
      </Stack>
    </Box>
  );
};
