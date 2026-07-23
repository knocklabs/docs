import { ClaudeBrandmark, CodexBrandmark, CursorBrandmark } from "./brandmarks";

export const CODING_TOOL_OPTIONS = [
  {
    value: "cursor",
    label: "Cursor",
    openLabel: "Setup in Cursor",
    Icon: CursorBrandmark,
    // Black square badge with a white Cursor mark.
    iconBadge: {
      backgroundColor: "#000000",
    },
  },
  {
    value: "claude",
    label: "Claude Code",
    openLabel: "Setup in Claude Code",
    Icon: ClaudeBrandmark,
  },
  {
    value: "codex",
    label: "Codex",
    openLabel: "Setup in Codex",
    Icon: CodexBrandmark,
    // White rounded square badge with a black Codex mark.
    iconBadge: {
      backgroundColor: "#FFFFFF",
    },
  },
] as const;

export type CodingToolValue = (typeof CODING_TOOL_OPTIONS)[number]["value"];

export type CodingToolOption = (typeof CODING_TOOL_OPTIONS)[number];

export const CODING_TOOL_BY_VALUE: Record<CodingToolValue, CodingToolOption> =
  Object.fromEntries(
    CODING_TOOL_OPTIONS.map((option) => [option.value, option]),
  ) as Record<CodingToolValue, CodingToolOption>;
