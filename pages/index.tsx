import React from "react";
import { PLATFORM_SIDEBAR } from "../data/sidebars/platformSidebar";
import AiChatButton from "../components/AiChatButton";
import { Page } from "@/components/ui/Page";
import Meta from "@/components/Meta";
import Link from "next/link";
import { Box, Stack } from "@telegraph/layout";
import { Lucide } from "@telegraph/icon";
import { Text } from "@telegraph/typography";
import {
  Tool,
  ContentCard,
  ConceptCard,
  BuildingBlock,
} from "@/components/ui/OverviewContent/Blocks";
import { Section } from "@/components/ui/OverviewContent/Section";

const contentForDiscovery = PLATFORM_SIDEBAR.filter((s) => s.desc);

// Add our integrations content in the 3rd position
contentForDiscovery.splice(2, 0, {
  title: "Integrations",
  desc: "Learn more about the incoming and outgoing integrations for Knock, including supported providers.",
  slug: "/integrations",
  pages: [
    { title: "Overview", slug: "/overview" },
    { title: "Email", slug: "/email/overview" },
    { title: "Push", slug: "/push/overview" },
    { title: "SMS", slug: "/sms/overview" },
    { title: "Chat", slug: "/chat/overview" },
    { title: "In-app", slug: "/in-app/overview" },
    { title: "Webhook", slug: "/webhook/overview" },
    { title: "Sources", slug: "/sources/overview" },
    { title: "Extensions", slug: "/extensions/overview" },
  ],
});

export default function Home() {
  return (
    <Page.Container>
      <Meta
        title={`Documentation | Knock Docs`}
        description="Explore our guides and examples to integrate Knock."
      />
      <Page.Masthead
        title="Documentation"
        description="Knock is infrastructure for sending product and customer messaging. Learn more."
        mobileSidebar={<Page.MobileSidebar content={PLATFORM_SIDEBAR} />}
      />
      <Page.Wrapper>
        <Page.FullSidebar content={PLATFORM_SIDEBAR} />
        <Page.Content>
          <Page.ContentHeader
            title="Documentation"
            description="Knock is infrastructure for sending product and customer messaging."
          >
            <Text
              as={Link}
              href="/getting-started/what-is-knock"
              size="3"
              color="accent"
              weight="medium"
            >
              {" "}
              <Box as="span" style={{ textDecoration: "underline" }}>
                Learn more.
              </Box>
            </Text>
          </Page.ContentHeader>
          <Stack
            direction="row"
            gap="6"
            w="full"
            justifyContent="space-between"
            className="md-one-column"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            <ContentCard
              title="Quick start"
              description="Integrate Knock with your backend web app and send your first notification."
              href="/getting-started/quick-start"
              icon={Lucide.Rabbit}
            />
            <ContentCard
              title="In-app UI"
              description="Ship your first notification feed, banners, modals, or cards using pre-built UI components."
              href="/in-app-ui/overview"
              icon={Lucide.SquareCode}
            />
            <ContentCard
              title="API & SDKs"
              description="Integrate a complete notification engine to your product with a REST&#8209;ful API."
              href="/developer-tools/sdks"
              icon={Lucide.Package}
            />
          </Stack>
          <Section.Container>
            <Section.Header
              title="Learn core concepts"
              href="/concepts/overview"
            />
            <Section.Content
              className="md-one-column"
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
              nudgePadding={2}
              gap="6"
            >
              <ConceptCard
                title="How do I send notifications?"
                description="Learn the basics of grouping together your cross-channel notifications into different workflows."
                href="/send-notifications/triggering-workflows/overview"
                image="/images/overviews/home/small-workflow.png"
              />
              <ConceptCard
                title="How do user preferences work?"
                description="Learn how Knock's preference system enables your users to opt-out of the notifications you send."
                href="/preferences/overview"
                image="/images/overviews/home/preferences.png"
              />
              <ConceptCard
                title="Who can I send notifications to?"
                description="Become familiar with how Knock models recipients as a person or a non-user entity that receives notifications."
                href="/managing-recipients/overview"
                image="/images/overviews/home/receivers.png"
              />
              <ConceptCard
                title="What channels can I send notifications on?"
                description="Learn what a channel is in Knock and how you can use channels to power your cross-channel notifications."
                href="/integrations/overview"
                image="/images/overviews/home/channels.png"
              />
            </Section.Content>
          </Section.Container>
          <Section.Container>
            <Section.Header title="Start building" />
            <Section.Content
              gap="4"
              flexDirection="column"
              className="md-one-column"
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
              nudgePadding={2}
            >
              <BuildingBlock
                title="Design a workflow"
                href="/designing-workflows/overview"
                description="Create a cross-channel notification."
                icon={Lucide.Layers}
              />
              <BuildingBlock
                title="Add users to Knock"
                href="/managing-recipients/identifying-recipients"
                description="Identify recipients to power your notifications."
                icon={Lucide.UsersRound}
              />
              <BuildingBlock
                title="Add an in-app feed"
                href="/in-app-ui/overview"
                description="Build your in-app notifications experience."
                icon={Lucide.BellDot}
              />
              <BuildingBlock
                title="Create a preference center"
                href="/preferences/overview"
                description="Enable your users to opt-out of notifications."
                icon={Lucide.ListTodo}
              />
              <BuildingBlock
                title="Build a Slack integration"
                href="/integrations/chat/slack/overview"
                description="Use Knock to send notifications to Slack."
                icon={Lucide.Slack}
              />
              <BuildingBlock
                title="Power cross-channel alerts"
                href="/integrations/overview"
                description="Create alerting-style workflows in Knock."
                icon={Lucide.BellRing}
              />
              <BuildingBlock
                title="Plan your Knock implementation"
                href="/tutorials/implementation-guide"
                description="Migrate your notification system into Knock."
                icon={Lucide.Sprout}
              />
              <BuildingBlock
                title="Model your data in Knock"
                href="/tutorials/modeling-users-objects-and-tenants"
                description="Map your application's data model into Knock."
                icon={Lucide.DatabaseZap}
              />
            </Section.Content>
          </Section.Container>
          <Section.Container>
            <Section.Header title="Knock AI" />
            <Section.Content
              className="md-one-column"
              gap="4"
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
              nudgePadding={2}
            >
              <ConceptCard
                title="Agent toolkit"
                description="Give your AI agents the ability to send cross-channel messaging and power rich human-in-the-loop flows."
                href="/developer-tools/agent-toolkit/overview"
                image="/images/overviews/home/agent-toolkit.png"
              />
              <ConceptCard
                title="MCP"
                description="Use the Knock MCP server to make Knock accessible to LLMs and AI agents via tool calling."
                href="/developer-tools/mcp-server"
                image="/images/overviews/home/mcp.png"
              />
            </Section.Content>
          </Section.Container>
          <Section.Container>
            <Section.Header title="Developer tools" />
            <Section.Content gap="4" className="md-flex-column">
              <Tool
                icon={Lucide.Terminal}
                title="CLI"
                description="Build, test, and manage your notifications from the terminal."
                href="/developer-tools/knock-cli"
              />
              <Tool
                icon={Lucide.Landmark}
                title="mAPI"
                description="Programmatically interact with Knock dashboard resources."
                href="/developer-tools/management-api"
              />
              <Tool
                icon={"Postman"}
                title="Postman"
                description="Use our Postman collection to get familiar with the Knock API."
                href="/developer-tools/knock-and-postman"
              />
              <Tool
                icon={Lucide.Infinity}
                title="CI/CD"
                description="Add Knock to your deployment pipeline with our CLI."
                href="/developer-tools/integrating-into-cicd"
              />
            </Section.Content>
          </Section.Container>
          {/* Breathing room */}
          <Box mb="32" />
        </Page.Content>
      </Page.Wrapper>
      <AiChatButton />
    </Page.Container>
  );
}
