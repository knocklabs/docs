import { Box, Stack } from "@telegraph/layout";
import { TgphComponentProps } from "@telegraph/helpers";
import { Heading, Text } from "@telegraph/typography";
import { Icon, Lucide } from "@telegraph/icon";
import Link from "next/link";

type SectionContentProps = { nudgePadding?: number } & TgphComponentProps<
  typeof Stack
>;

// nudgePadding is useful for aligning content that might have padding for hover states
const SectionContent = ({
  children,
  nudgePadding,
  ...props
}: SectionContentProps) => {
  const alignment = nudgePadding
    ? {
        width: `calc(100% + var(--tgph-spacing-${nudgePadding * 2}))`,
        marginLeft: `calc(var(--tgph-spacing-${nudgePadding}) * -1 + 1px)`,
        ...props.style,
      }
    : props.style;
  return (
    <Stack mt="8" gap="12" {...props} style={alignment}>
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

const SectionContainer = ({
  children,
  ...props
}: TgphComponentProps<typeof Box>) => {
  return (
    <Box mt="16" {...props}>
      {children}
    </Box>
  );
};

export const Section = {
  Content: SectionContent,
  Header: SectionHeader,
  Container: SectionContainer,
};
