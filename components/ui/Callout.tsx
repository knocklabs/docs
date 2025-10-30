import { Box, Stack } from "@telegraph/layout";
import React from "react";
import { Text } from "@telegraph/typography";
import { TgphComponentProps } from "@telegraph/helpers";

type CalloutType =
  | "info"
  | "warning"
  | "alert"
  | "enterprise"
  | "beta"
  | "roadmap";

const TYPE_CONFIG: Record<
  CalloutType,
  {
    emoji: string;
    bgColor: "default" | "blue" | "yellow" | "accent" | "red" | "green";
  }
> = {
  info: { emoji: "💡", bgColor: "default" },
  warning: { emoji: "⚠️", bgColor: "yellow" },
  alert: { emoji: "🚨", bgColor: "red" },
  enterprise: { emoji: "🏢", bgColor: "blue" },
  beta: { emoji: "🚧", bgColor: "yellow" },
  roadmap: { emoji: "🛣", bgColor: "default" },
};

export const Callout = ({
  type,
  emoji: customEmoji,
  text,
  title,
  bgColor: customBgColor,
  isCentered = false,
  maxWidth = "100%",
  style,
}: {
  type?: CalloutType;
  emoji?: string;
  title?: string;
  text?: React.ReactNode | React.ReactNode[];
  bgColor?: "default" | "blue" | "yellow" | "accent" | "red" | "green";
  isCentered?: boolean;
  maxWidth?: string;
  style?: React.CSSProperties;
}): JSX.Element => {
  // Determine emoji and bgColor:
  // 1. If type is provided, use type's config
  // 2. If custom emoji/bgColor provided, use those
  // 3. Otherwise, default to "info" type
  const hasCustomProps =
    customEmoji !== undefined || customBgColor !== undefined;
  const effectiveType = type || (hasCustomProps ? undefined : "info");

  const emoji = effectiveType
    ? TYPE_CONFIG[effectiveType].emoji
    : customEmoji || "💡";
  const bgColor = effectiveType
    ? TYPE_CONFIG[effectiveType].bgColor
    : customBgColor || "default";

  // Ensure emoji is always a string
  const emojiString = typeof emoji === "string" ? emoji : String(emoji || "💡");
  const centeredProps: TgphComponentProps<typeof Stack> = isCentered
    ? { mx: "auto", style: { maxWidth: "90%" } }
    : { style: { maxWidth } };

  const bgColorMap: Record<
    "default" | "blue" | "yellow" | "accent" | "red" | "green",
    TgphComponentProps<typeof Stack>["backgroundColor"]
  > = {
    default: "gray-1",
    blue: "blue-2",
    yellow: "yellow-2",
    accent: "accent-2",
    red: "red-2",
    green: "green-2",
  };

  const textColorMap: Record<
    "default" | "blue" | "yellow" | "accent" | "red" | "green",
    TgphComponentProps<typeof Text>["color"]
  > = {
    default: "black",
    blue: "black",
    yellow: "black",
    accent: "black",
    red: "black",
    green: "black",
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
          style={{ flexShrink: 0, marginTop: "1px" }}
          className="md-hidden"
        >
          <Box>
            <Box w="full" h="full">
              {emojiString}
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
        py="1"
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
