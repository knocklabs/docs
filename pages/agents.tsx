import React, { useContext, useState } from "react";
import type { GetStaticProps } from "next";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import {
  Plug,
  Terminal,
  Sparkles,
  BookUp,
  Check,
  Copy,
  Workflow,
  LayoutDashboard,
} from "lucide-react";

import Meta from "@/components/Meta";
import { Page } from "@/components/ui/Page";
import { AskAiContext } from "@/components/AskAiContext";
import { useTheme } from "@/components/theme/ThemeProvider";
import { PLATFORM_SIDEBAR } from "@/data/sidebars/platformSidebar";
import {
  AgentPromptActionButton,
  openCodingToolDeeplink,
} from "@/components/ui/AgentPromptActionButton";
import { AnimatedDotGrid } from "@/components/ui/AnimatedDotGrid";
import { MarketingFooter } from "@/components/ui/MarketingFooter";
import { KNOCK_SETUP_PROMPT } from "@/components/ui/AgentSetupPrompt";
import { CODING_TOOL_OPTIONS } from "@/components/ui/CodingToolIcon";
import { ContentCard } from "@/components/ui/OverviewContent/Blocks";
import { Section } from "@/components/ui/OverviewContent/Section";
import { useClipboard } from "@/hooks/useClipboard";
import {
  buildSkillPrompt,
  fetchAgentSkills,
  type AgentSkill,
} from "@/lib/agentSkills";

type AgentsPageProps = {
  skills: AgentSkill[];
};

const CopyPromptButton = ({
  prompt,
  label = "Copy prompt",
}: {
  prompt: string;
  label?: string;
}) => {
  const [isCopied, copy] = useClipboard(prompt);

  return (
    <Button
      variant="solid"
      color="accent"
      size="2"
      onClick={copy}
      icon={{
        icon: isCopied ? Check : Copy,
        "aria-hidden": true,
      }}
      style={{ minWidth: "12.5rem", justifyContent: "center" }}
    >
      {isCopied ? "Copied" : label}
    </Button>
  );
};

const CodingToolWordmarks = ({ prompt }: { prompt: string }) => {
  const { appearance } = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);
  const isDark = appearance === "dark";

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap="8"
      mt="3"
    >
      {CODING_TOOL_OPTIONS.map((option) => {
        const Icon = option.Icon;
        const isHovered = hovered === option.value;

        return (
          <Stack
            key={option.value}
            as="button"
            type="button"
            aria-label={option.openLabel}
            direction="row"
            alignItems="center"
            bg="transparent"
            p="0"
            onClick={() => openCodingToolDeeplink(option.value, prompt)}
            onMouseEnter={() => setHovered(option.value)}
            onMouseLeave={() => setHovered(null)}
            style={{
              border: "none",
              cursor: "pointer",
              // Brand SVGs → monochrome; invert on dark surfaces.
              filter: isDark ? "brightness(0) invert(1)" : "brightness(0)",
              opacity: isHovered ? 0.75 : 0.45,
              transition: "opacity 0.15s ease",
            }}
          >
            <Box
              aria-hidden
              w="6"
              h="6"
              style={{ aspectRatio: "1 / 1", flexShrink: 0 }}
            >
              <Icon />
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default function AgentsPage({ skills }: AgentsPageProps) {
  const askAiContext = useContext(AskAiContext);
  const isOpen = askAiContext?.isOpen ?? false;
  const sidebarWidth = askAiContext?.sidebarWidth ?? 340;
  const isResizing = askAiContext?.isResizing ?? false;

  return (
    <Page.Container>
      <Meta
        title="Agents | Knock Docs"
        description="Set up Knock with your coding agent. Install skills, connect the MCP server, and build notification workflows."
      />
      <Page.Masthead
        skipHighlight
        mobileSidebar={<Page.MobileSidebar content={PLATFORM_SIDEBAR} />}
      />

      <Box
        w="full"
        bg="surface-1"
        style={{
          paddingRight: isOpen ? `${sidebarWidth}px` : "0",
          transition: isResizing ? "none" : "padding-right 0.2s ease-in-out",
        }}
      >
        <Box
          as="section"
          w="full"
          position="relative"
          overflow="hidden"
          style={{ minHeight: "min(52vh, 420px)" }}
        >
          <AnimatedDotGrid />

          <Stack
            position="relative"
            direction="column"
            alignItems="center"
            justifyContent="center"
            gap="6"
            w="full"
            h="full"
            px="6"
            style={{ minHeight: "min(52vh, 420px)" }}
          >
            <Stack direction="column" alignItems="center" gap="3" w="full">
              <Heading as="h1" size="9" align="center">
                Agent-first growth
              </Heading>
              <Text
                as="p"
                size="3"
                color="gray"
                align="center"
                style={{ margin: 0, maxWidth: "36rem" }}
              >
                Drive Knock from your coding agent. Build and manage product,
                marketing, and transactional messaging in one platform.
              </Text>
            </Stack>
            <Stack direction="column" alignItems="center" gap="4">
              <CopyPromptButton
                prompt={KNOCK_SETUP_PROMPT}
                label="Setup with one prompt"
              />
              <CodingToolWordmarks prompt={KNOCK_SETUP_PROMPT} />
            </Stack>
          </Stack>
        </Box>

        <Box mx="auto" px="6" pb="9" w="full" style={{ maxWidth: "1080px" }}>
          <Section.Container style={{ marginTop: 0 }}>
            <Section.Header title="Skills" href="/ai/skills" id="skills" />
            <Section.Content
              className="md-one-column"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
              nudgePadding={2}
              gap="4"
            >
              {skills.map((skill) => (
                <Stack
                  key={skill.name}
                  direction="column"
                  justifyContent="space-between"
                  gap="4"
                  p="4"
                  border="px"
                  borderColor="gray-4"
                  rounded="3"
                  h="full"
                >
                  <Box style={{ minWidth: 0 }}>
                    <Heading as="h3" size="3" weight="medium" mb="1">
                      {skill.title}
                    </Heading>
                    <Text as="p" size="2" color="gray" style={{ margin: 0 }}>
                      {skill.description}
                    </Text>
                  </Box>
                  <Box style={{ alignSelf: "flex-end" }}>
                    <AgentPromptActionButton
                      prompt={buildSkillPrompt(skill)}
                      variant="outline"
                      size="1"
                      hideLabel
                    />
                  </Box>
                </Stack>
              ))}
            </Section.Content>
          </Section.Container>

          <Section.Container>
            <Section.Header title="Related" href="/ai/overview" />
            <Section.Content
              className="md-one-column"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
              nudgePadding={2}
              gap="6"
            >
              <ContentCard
                title="AI overview"
                description="Use AI in the dashboard, inside workflows, in your IDE, and in external clients."
                href="/ai/overview"
                icon={LayoutDashboard}
              />
              <ContentCard
                title="Agent"
                description="A conversational assistant in the Knock dashboard for building and inspecting your messaging."
                href="/ai/agent"
                icon={Sparkles}
              />
              <ContentCard
                title="Agent workflow function"
                description="A workflow step that runs a prompt on an AI model to enrich, classify, or summarize data."
                href="/ai/agent-function"
                icon={Workflow}
              />
              <ContentCard
                title="CLI"
                description="The local-first surface AI coding agents use to manage Knock resources from your codebase."
                href="/ai/cli"
                icon={Terminal}
              />
              <ContentCard
                title="MCP server"
                description="A remote MCP server that exposes Knock as tools to external clients and your own apps."
                href="/ai/mcp-server"
                icon={Plug}
              />
              <ContentCard
                title="Skills"
                description="Packaged procedural knowledge that complements the CLI, the MCP server, and the dashboard agent."
                href="/ai/skills"
                icon={BookUp}
              />
            </Section.Content>
          </Section.Container>
        </Box>

        <MarketingFooter />
      </Box>
    </Page.Container>
  );
}

export const getStaticProps: GetStaticProps<AgentsPageProps> = async () => {
  const skills = await fetchAgentSkills();

  return {
    props: { skills },
    revalidate: 60 * 60,
  };
};
