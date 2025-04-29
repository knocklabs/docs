import { Stack } from "@telegraph/layout";
import { TgphComponentProps } from "@telegraph/helpers";
import { Heading, Text } from "@telegraph/typography";
import { Icon, Lucide } from "@telegraph/icon";
import Link from "next/link";

type SectionContentProps = TgphComponentProps<typeof Stack>;

const SectionContent = ({ children, ...props }: SectionContentProps) => {
  return (
    <Stack
      mt="8"
      gap="12"
      {...props}
      style={{
        width: "calc(100% + var(--tgph-spacing-4))",
        // yeah
        marginLeft: "calc(var(--tgph-spacing-2) * -1 + 1px)",
        ...props.style,
      }}
    >
      {children}
    </Stack>
  );
};

const SectionHeader = ({ title, href }: { title: string; href?: string }) => {
  return (
    <Stack justifyContent="space-between" alignItems="center" mb="8">
      <Heading as="h2" size="4" weight="medium">
        {title}
      </Heading>
      {href && (
        <Stack as={Link} href={href} alignItems="center">
          <Text as="span" size="1">
            View all
          </Text>
          <Icon
            icon={Lucide.ChevronRight}
            aria-hidden={true}
            w="3"
            h="3"
            color="gray"
            ml="1"
          />
        </Stack>
      )}
    </Stack>
  );
};

export const Section = {
  Content: SectionContent,
  Header: SectionHeader,
};
