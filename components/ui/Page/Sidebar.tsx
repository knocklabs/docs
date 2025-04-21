import { SidebarSection } from "@/data/types";
import { Box } from "@telegraph/layout";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { NavItem } from "../NavItem";
import { useRouter } from "next/router";
import { CollapsibleNavItem } from "../CollapsibleNavItem";

type SidebarProps = {
  content: SidebarSection[];
  children?: React.ReactNode;
};

const Section = ({ section }: { section: SidebarSection }) => {
  const router = useRouter();

  // Check if any child page is active
  const hasActiveChild = section.pages.some(
    (page) => router.asPath === `${section.slug}${page.slug}`,
  );

  return (
    <Stack direction="column" key={section.slug} mb="1">
      <Box>
        <CollapsibleNavItem
          label={section.title ?? section.slug}
          defaultOpen={hasActiveChild}
        >
          {section.pages.map((page) => (
            <NavItem
              key={page.slug}
              href={`${section.slug}${page.slug}`}
              isActive={router.asPath === `${section.slug}${page.slug}`}
            >
              {page.title}
            </NavItem>
          ))}
        </CollapsibleNavItem>
      </Box>
    </Stack>
  );
};

const Wrapper = ({ children }: SidebarProps) => {
  return (
    <Box as="aside" width="60" position="fixed" bottom="0" top="24">
      <Stack
        direction="column"
        gap="1"
        h="full"
        pt="2"
        pb="4"
        px="4"
        style={{ overflowY: "auto" }}
      >
        {children}
      </Stack>
    </Box>
  );
};

const Sidebar = Object.assign({
  Section,
  Wrapper,
});

export { Sidebar };
