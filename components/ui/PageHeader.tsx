import { Button } from "@telegraph/button";
import { Box, Stack } from "@telegraph/layout";
import { Tabs } from "@telegraph/tabs";
import { Text } from "@telegraph/typography";
import Link from "next/link";
import { useRouter } from "next/router";
import Autocomplete from "@/components/ui/Autocomplete";
import AskAiButton from "@/components/ui/AskAiButton";
import { KnockWordmark } from "@/components/ui/KnockWordmark";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

type PageHeaderProps = {
  mobileSidebar?: React.ReactNode;
  skipHighlight?: boolean;
};

const TAB_ROUTES: Array<{ prefix: string; tab: string }> = [
  { prefix: "/in-app-ui", tab: "in-app-ui" },
  { prefix: "/developer-tools", tab: "developer-tools" },
  { prefix: "/api-reference", tab: "api-reference" },
  { prefix: "/mapi-reference", tab: "mapi-reference" },
  { prefix: "/cli", tab: "cli-reference" },
  { prefix: "/tutorials", tab: "tutorials" },
  { prefix: "/integrations", tab: "integrations" },
];

function selectedTab(pathname: string): string {
  const match = TAB_ROUTES.find((route) => pathname.startsWith(route.prefix));
  return match?.tab ?? "platform";
}

const PageHeader = ({ skipHighlight, mobileSidebar }: PageHeaderProps) => {
  const { asPath } = useRouter();

  return (
    <Box
      data-header
      direction="column"
      bg="surface-1"
      borderBottomWidth="px"
      borderColor="gray-4"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Box>
        <Stack
          w="full"
          p="4"
          alignItems="center"
          justifyContent="space-between"
          gap="1"
          style={{ position: "relative" }}
        >
          {/* Left section: Logo + Search (mobile only) */}
          <Stack direction="row" alignItems="flex-end" style={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="flex-end" pb="1">
              <Box as={Link} href="/" display="block" ml="2" mr="2">
                <KnockWordmark width={67} />
              </Box>
              <Text as="span" style={{ lineHeight: "1", marginBottom: "2px" }}>
                Docs
              </Text>
            </Stack>
            <Box ml="6" className="md-visible">
              <Autocomplete />
            </Box>
          </Stack>
          {/* Center section: Search + Ask AI (desktop only, centered) */}
          <Stack
            className="md-hidden"
            direction="row"
            alignItems="center"
            gap="1"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
            }}
            // Style the search + ask ai button to be a box with a border
            p="1"
            border="px"
            borderColor="gray-6"
            borderRadius="4"
          >
            <Autocomplete />
            <AskAiButton />
          </Stack>
          {/* Right section: Nav buttons (desktop only) */}
          <Stack
            marginLeft="auto"
            gap="2"
            className="md-hidden"
            direction="row"
            alignItems="center"
            style={{ flexShrink: 0 }}
          >
            <ThemeSwitcher />
            <Button
              as={Link}
              href="mailto:support@knock.app?subject=Support%20request"
              size="1"
              variant="ghost"
              color="gray"
            >
              Contact support
            </Button>
            <Button
              as={Link}
              href="https://dashboard.knock.app/login"
              size="1"
              variant="outline"
            >
              Log in
            </Button>
            <Button
              as={Link}
              href="https://dashboard.knock.app/signup"
              size="1"
              variant="solid"
              color="accent"
            >
              Get started
            </Button>
          </Stack>
          <Box className="md-visible" mr="2">
            <ThemeSwitcher />
          </Box>
          {mobileSidebar}
        </Stack>
        <Tabs
          value={skipHighlight ? "" : selectedTab(asPath)}
          className="main-header-tabs"
          style={{ overflowX: "auto" }}
        >
          <Tabs.List mb="0" px="4">
            <Tabs.Tab
              value="platform"
              as={Link}
              href="/getting-started/what-is-knock"
            >
              Platform
            </Tabs.Tab>
            <Tabs.Tab
              value="integrations"
              as={Link}
              href="/integrations/overview"
            >
              Integrations
            </Tabs.Tab>
            <Tabs.Tab value="in-app-ui" as={Link} href="/in-app-ui/overview">
              In-app UI
            </Tabs.Tab>
            <Tabs.Tab
              value="api-reference"
              as="a"
              href="/api-reference/overview"
            >
              API reference
            </Tabs.Tab>
            <Tabs.Tab value="cli-reference" as="a" href="/cli/overview">
              CLI reference
            </Tabs.Tab>
            <Tabs.Tab
              value="mapi-reference"
              as="a"
              href="/mapi-reference/overview"
            >
              Management API
            </Tabs.Tab>
            <Tabs.Tab
              value="developer-tools"
              as={Link}
              href="/developer-tools/overview"
            >
              Developer tools
            </Tabs.Tab>
            <Tabs.Tab value="tutorials" as={Link} href="/tutorials/overview">
              Tutorials
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Box>
    </Box>
  );
};

export { PageHeader };
