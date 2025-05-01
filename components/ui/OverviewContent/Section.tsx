import { Box, Stack } from "@telegraph/layout";
import { TgphComponentProps } from "@telegraph/helpers";
import { Heading, Text } from "@telegraph/typography";
import { Icon, Lucide } from "@telegraph/icon";
import Link from "next/link";
import { Button } from "@telegraph/button";

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

const SectionHeader = ({
  title,
  href,
  id,
}: {
  title: string;
  href?: string;
  id?: string;
}) => {
  return (
    <Stack justifyContent="space-between" alignItems="center" mb="8">
      <Heading as="h2" size="4" weight="medium" id={id}>
        {title}
      </Heading>
      {href && (
        <Stack
          as={Link}
          href={href}
          alignItems="center"
          style={{ marginRight: "calc(var(--tgph-spacing-3) * -1)" }}
        >
          <Button
            variant="ghost"
            size="1"
            trailingIcon={{ icon: Lucide.ChevronRight, "aria-hidden": true }}
          >
            View all
          </Button>
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
