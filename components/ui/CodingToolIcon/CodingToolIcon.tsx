import type { CSSProperties } from "react";
import { Box, Stack } from "@telegraph/layout";

import type { CodingToolOption } from "./constants";

type CodingToolIconSize = "default" | "large";

// `branded` keeps original mark colors + optional badge.
// `onAccent` skips the badge and forces a white mark via CSS (SVGs unchanged).
type CodingToolIconAppearance = "branded" | "onAccent";

type CodingToolIconProps = {
  option: CodingToolOption;
  size?: CodingToolIconSize;
  appearance?: CodingToolIconAppearance;
};

const ICON_SIZES = {
  default: {
    plain: "4" as const,
    badge: "5" as const,
    mark: "3" as const,
  },
  large: {
    plain: "5" as const,
    badge: "6" as const,
    mark: "4" as const,
  },
};

const ON_ACCENT_MARK_STYLE: CSSProperties = {
  // Flatten any brand fill to white without editing the SVG sources.
  filter: "brightness(0) invert(1)",
};

// Brandmark for options that ship an icon; Cursor/Codex wrap the mark in a
// colored badge so it stays readable on dark/light surfaces.
export const CodingToolIcon = ({
  option,
  size = "default",
  appearance = "branded",
}: CodingToolIconProps) => {
  const Icon = option.Icon;
  const iconBadge = "iconBadge" in option ? option.iconBadge : undefined;
  const sizes = ICON_SIZES[size];

  if (appearance === "onAccent") {
    return (
      <Box
        aria-hidden
        w={sizes.plain}
        h={sizes.plain}
        style={ON_ACCENT_MARK_STYLE}
      >
        <Icon />
      </Box>
    );
  }

  // Always reserve a square slot so badged and plain marks align in menus.
  return (
    <Stack
      align="center"
      justify="center"
      rounded="1"
      w={sizes.badge}
      h={sizes.badge}
      style={{
        backgroundColor: iconBadge?.backgroundColor,
        aspectRatio: "1 / 1",
        flexShrink: 0,
      }}
    >
      <Box
        aria-hidden
        w={iconBadge ? sizes.mark : sizes.plain}
        h={iconBadge ? sizes.mark : sizes.plain}
        style={{ aspectRatio: "1 / 1" }}
      >
        <Icon />
      </Box>
    </Stack>
  );
};
