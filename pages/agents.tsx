import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { PLATFORM_SIDEBAR } from "@/data/sidebars/platformSidebar";
import {
  AgentPromptActionButton,
  openCodingToolDeeplink,
} from "@/components/ui/AgentPromptActionButton";
import { AnimatedDotGrid } from "@/components/ui/AnimatedDotGrid";
import { MarketingFooter } from "@/components/ui/MarketingFooter";
import { KNOCK_SETUP_PROMPT } from "@/components/ui/AgentSetupPrompt";
import {
  CODING_TOOL_OPTIONS,
  CodingToolIcon,
} from "@/components/ui/CodingToolIcon";
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
  const [isCopied, copy] = useClipboard(prompt, { successDuration: 1600 });

  return (
    <Button.Root
      variant="solid"
      color="accent"
      size="2"
      px="3"
      rounded="full"
      onClick={copy}
      className="copy-cta"
      data-copied={isCopied}
    >
      {/* Both glyphs and both labels stay mounted and stacked, so the button
       * never reflows and each pair can cross-fade instead of cutting. */}
      <span className="copy-cta__stack" aria-hidden="true">
        <span className="copy-cta__glyph">
          <Button.Icon icon={Copy} aria-hidden />
        </span>
        <span className="copy-cta__glyph">
          <Button.Icon icon={Check} aria-hidden />
        </span>
      </span>
      <Button.Text>
        <span className="copy-cta__stack" aria-hidden="true">
          <span className="copy-cta__label">{label}</span>
          <span className="copy-cta__label">Copied to clipboard</span>
        </span>
      </Button.Text>
      {/* The visible labels are decorative once they cross-fade — both stay in
       * the tree, so the announcement lives in its own live region. */}
      <span className="sr-only" aria-live="polite">
        {isCopied ? "Prompt copied to clipboard" : ""}
      </span>
    </Button.Root>
  );
};

/** One bordered control: an "Open in" label, then a segment per coding tool
 * that deeplinks into that tool with the setup prompt already loaded. */
const CodingToolLaunchBar = ({ prompt }: { prompt: string }) => (
  <Stack direction="row" justifyContent="center">
    <Stack alignItems="center" px="3">
      <Text as="span" size="2" color="gray" style={{ whiteSpace: "nowrap" }}>
        Open in
      </Text>
    </Stack>

    <Stack
      direction="row"
      alignItems="stretch"
      bg="surface-1"
      // Clip so the end segments' hover fill follows the container radius.
      style={{ overflow: "hidden" }}
    >
      {CODING_TOOL_OPTIONS.map((option) => (
        <Button
          as="button"
          type="button"
          variant="ghost"
          key={option.value}
          aria-label={option.openLabel}
          title={option.openLabel}
          alignItems="center"
          justifyContent="center"
          px="3"
          py="2"
          rounded="full"
          onClick={() => openCodingToolDeeplink(option.value, prompt)}
        >
          <CodingToolIcon option={option} />
        </Button>
      ))}
    </Stack>
  </Stack>
);

export default function AgentsPage({ skills }: AgentsPageProps) {
  const askAiContext = useContext(AskAiContext);
  const isOpen = askAiContext?.isOpen ?? false;
  const sidebarWidth = askAiContext?.sidebarWidth ?? 340;
  const isResizing = askAiContext?.isResizing ?? false;

  // One t=0 for the whole hero. The dot grid announces its first drawn
  // frame; the timer is the floor, so a slow or failed canvas can't hold
  // the copy hostage. Whichever lands first opens the gate.
  const [isHeroReady, setIsHeroReady] = useState(false);
  const openHeroGate = useCallback(() => setIsHeroReady(true), []);

  useEffect(() => {
    const timer = window.setTimeout(openHeroGate, 300);
    return () => window.clearTimeout(timer);
  }, [openHeroGate]);

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
          <AnimatedDotGrid onReady={openHeroGate} />

          {/* Nothing opens the gate without JS, so release it up front. */}
          <noscript>
            <style>{`.hero-stage .hero-rise, .hero-stage .hero-veil { animation-play-state: running; }`}</style>
          </noscript>

          <Stack
            position="relative"
            direction="column"
            alignItems="center"
            justifyContent="center"
            gap="6"
            w="full"
            h="full"
            px="6"
            className="hero-stage"
            data-hero-ready={isHeroReady ? "true" : "false"}
            style={{ minHeight: "min(52vh, 420px)" }}
          >
            <Stack
              position="relative"
              direction="column"
              alignItems="center"
              gap="3"
              w="full"
              style={{ maxWidth: "52rem" }}
            >
              {/* Surface veil so the grid softens under the hero copy */}
              <Box
                aria-hidden
                position="absolute"
                className="hero-veil"
                style={{
                  // Overflow sides/top for a soft edge; keep bottom flush so the
                  // CTA below stays clear of the veil.
                  inset: "-1.5rem -2rem 0",
                  background:
                    "radial-gradient(ellipse 58% 85% at 50% 42%, color-mix(in srgb, var(--tgph-surface-1) 88%, transparent) 0%, color-mix(in srgb, var(--tgph-surface-1) 65%, transparent) 48%, transparent 75%)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <Heading
                as="h1"
                size="9"
                align="center"
                className="hero-rise"
                style={
                  {
                    position: "relative",
                    zIndex: 1,
                    "--hero-rise-delay": "80ms",
                  } as React.CSSProperties
                }
              >
                Agent-first customer messaging
              </Heading>
              <Text
                as="p"
                size="3"
                color="gray"
                align="center"
                className="hero-rise"
                style={
                  {
                    margin: 0,
                    maxWidth: "36rem",
                    position: "relative",
                    zIndex: 1,
                    "--hero-rise-delay": "240ms",
                  } as React.CSSProperties
                }
              >
                Drive Knock from your coding agent. Build, ship, and optimize
                product, marketing, and transactional messaging in one platform.
              </Text>
            </Stack>
            <Stack direction="column" alignItems="center" gap="4">
              <Box
                className="hero-rise"
                style={{ "--hero-rise-delay": "400ms" } as React.CSSProperties}
              >
                <CopyPromptButton
                  prompt={KNOCK_SETUP_PROMPT}
                  label="Get started with a prompt"
                />
              </Box>
              <Box
                w="full"
                className="hero-rise"
                style={{ "--hero-rise-delay": "520ms" } as React.CSSProperties}
              >
                <CodingToolLaunchBar prompt={KNOCK_SETUP_PROMPT} />
              </Box>
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
