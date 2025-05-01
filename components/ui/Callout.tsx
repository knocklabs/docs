import { Box, Stack } from "@telegraph/layout";
import React from "react";
import { Text } from "@telegraph/typography";
import { TgphComponentProps } from "@telegraph/helpers";
import { useAppearance } from "@telegraph/appearance";

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
  const { appearance } = useAppearance();

  const centeredProps: TgphComponentProps<typeof Stack> = isCentered
    ? { mx: "auto", style: { maxWidth: "90%" } }
    : { style: { maxWidth } };

  const bgColorMap: Record<
    typeof bgColor,
    TgphComponentProps<typeof Stack>["backgroundColor"]
  > = {
    default: appearance === "light" ? "gray-1" : "gray-3",
    blue: appearance === "light" ? "blue-2" : "blue-3",
    yellow: appearance === "light" ? "yellow-2" : "yellow-4",
    accent: appearance === "light" ? "accent-2" : "accent-3",
    red: appearance === "light" ? "red-2" : "red-3",
  };

  const textColorMap: Record<
    typeof bgColor,
    TgphComponentProps<typeof Text>["color"]
  > = {
    default: "default",
    blue: "default",
    yellow: "default",
    accent: appearance === "light" ? "default" : "gray",
    red: "default",
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
