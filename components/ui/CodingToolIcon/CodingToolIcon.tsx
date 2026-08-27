import type { CSSProperties } from "react";
import { Box } from "@telegraph/layout";

import type { CodingToolOption } from "./constants";

type CodingToolIconSize = "default" | "large";

// `branded` keeps original mark colors (currentColor follows theme text).
// `onAccent` forces a white mark via CSS for solid accent buttons.
type CodingToolIconAppearance = "branded" | "onAccent";

type CodingToolIconProps = {
  option: CodingToolOption;
  size?: CodingToolIconSize;
  appearance?: CodingToolIconAppearance;
};

const ICON_SIZES = {
  default: "4" as const,
  large: "5" as const,
};

const ON_ACCENT_MARK_STYLE: CSSProperties = {
  // Flatten any brand fill to white without editing the SVG sources.
  filter: "brightness(0) invert(1)",
};

const BRANDED_MARK_STYLE: CSSProperties = {
  // Cursor/Codex use currentColor; Claude keeps its hardcoded orange fill.
  color: "var(--tgph-gray-12)",
  aspectRatio: "1 / 1",
};

// Plain brandmark — no badge. Theme contrast comes from currentColor / brand fill.
export const CodingToolIcon = ({
  option,
  size = "default",
  appearance = "branded",
}: CodingToolIconProps) => {
  const Icon = option.Icon;
  const iconSize = ICON_SIZES[size];

  return (
    <Box
      aria-hidden
      w={iconSize}
      h={iconSize}
      style={
        appearance === "onAccent" ? ON_ACCENT_MARK_STYLE : BRANDED_MARK_STYLE
      }
    >
      <Icon />
    </Box>
  );
};
