import { SidebarSection } from "@/data/types";
import { Box } from "@telegraph/layout";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { NavItem } from "../NavItem";
import { useRouter } from "next/router";

type SidebarProps = {
  content: SidebarSection[];
  children?: React.ReactNode;
};

const Section = ({ section }: { section: SidebarSection }) => {
  const router = useRouter();

  return (
    <Stack direction="column" key={section.slug} mb="1">
      <Box px="3" py="1">
        <Text as="span" weight="medium" size="2">
          {section.title}
        </Text>
      </Box>
      {section.pages.map((page) => (
        <NavItem
          href={`${section.slug}${page.slug}`}
          isActive={router.asPath === `${section.slug}${page.slug}`}
        >
          {page.title}
        </NavItem>
      ))}
    </Stack>
  );
};
const Wrapper = ({ children }: SidebarProps) => {
  return (
    <Box as="aside" width="60" position="fixed" bottom="0" top="24">
      <Stack
        direction="column"
        gap="2"
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
