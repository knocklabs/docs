import { type ReactElement, type ReactNode } from "react";
import { Box, Stack } from "@telegraph/layout";
import { MenuItem } from "@telegraph/menu";
import Link from "next/link";
import { Text } from "@telegraph/typography";

type Props = {
  emoji?: string;
  title: string;
  children?: ReactNode;
  linkUrl: string;
  footer?: ReactElement;
  isExternal?: boolean;
};

type CardGroupProps = {
  children: ReactNode;
  cols?: number;
};

const CardGroup = ({ children, cols = 2 }: CardGroupProps) => (
  <Stack
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(1fr, ${cols})`,
    }}
    gap="2"
  >
    {children}
  </Stack>
);

const Card = ({
  emoji,
  title,
  children,
  footer,
  linkUrl,
  isExternal = false,
}: Props) => (
  <Stack h="full" rounded="2" border="px" borderColor="gray-4">
    <MenuItem
      h="full"
      w="full"
      as={Link}
      target={isExternal ? "_blank" : undefined}
      href={linkUrl}
      title={title}
      style={{ textDecoration: "none" }}
      p="3"
      minH="20"
    >
      <Box w="full">
        {emoji && <Box mb="1">{emoji}</Box>}

        <Box mb="1">
          <Text as="span" color="accent" size="2" weight="semi-bold">
            {title}
          </Text>
        </Box>

        {children && (
          <Text as="div" size="2">
            {children}
          </Text>
        )}

        {footer && <Stack alignItems="center">{footer}</Stack>}
      </Box>
    </MenuItem>
  </Stack>
);

export { Card, CardGroup };
