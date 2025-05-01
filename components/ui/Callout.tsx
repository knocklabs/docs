import { Box, Stack } from "@telegraph/layout";
import React from "react";
import { Text } from "@telegraph/typography";
import { TgphComponentProps } from "@telegraph/helpers";

export const Callout = ({
  emoji,
  text,
  title,
  bgColor = "default",
  isCentered = false,
  maxWidth = "100%",
  style,
}: {
  emoji: string;
  title?: string;
  text?: React.ReactNode | React.ReactNode[];
  // Blue should be used for beta warnings
  bgColor?: "default" | "blue" | "yellow" | "accent" | "red";
  isCentered?: boolean;
  maxWidth?: string;
  style?: React.CSSProperties;
}): JSX.Element => {
  const centeredProps: TgphComponentProps<typeof Stack> = isCentered
    ? { mx: "auto", style: { maxWidth: "90%" } }
    : { style: { maxWidth } };

  const bgColorMap: Record<
    typeof bgColor,
    TgphComponentProps<typeof Stack>["backgroundColor"]
  > = {
    default: "gray-1",
    blue: "blue-2",
    yellow: "yellow-2",
    accent: "accent-2",
    red: "red-2",
  };

  const textColorMap: Record<
    typeof bgColor,
    TgphComponentProps<typeof Text>["color"]
  > = {
    default: "black",
    blue: "black",
    yellow: "black",
    accent: "black",
    red: "black",
  };

  return (
    <Stack
      as="aside"
      w="full"
      backgroundColor={bgColorMap[bgColor]}
      borderRadius="4"
      p="4"
      pr="4"
      my="8"
      border="px"
      borderColor="gray-3"
      data-callout
      {...centeredProps}
      style={style}
    >
      <Box>
        <Stack
          alignItems="center"
          justifyContent="center"
          h="8"
          w="8"
          borderRadius="4"
          style={{ flexShrink: 0 }}
          className="md-hidden"
        >
          <Box>
            <Box w="full" h="full">
              {emoji}
            </Box>
          </Box>
        </Stack>
      </Box>
      <Text
        as="span"
        color={textColorMap[bgColor]}
        size="2"
        mb="0"
        leading="3"
        pl="2"
        style={{ marginBottom: "0px" }}
      >
        {title && (
          <Text
            as="span"
            size="2"
            weight="semi-bold"
            style={{ color: "var(--color)" }}
          >
            {title}{" "}
          </Text>
        )}
        {text && text}
      </Text>
    </Stack>
  );
};
