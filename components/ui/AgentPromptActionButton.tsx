import React, { useEffect, useState } from "react";
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Popover } from "@telegraph/popover";
import { MenuItem } from "@telegraph/menu";
import { Icon } from "@telegraph/icon";
import { Check, ChevronDown, Copy } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { useIsMounted } from "@/hooks/useIsMounted";
import {
  CODING_TOOL_BY_VALUE,
  CODING_TOOL_OPTIONS,
  CodingToolIcon,
  type CodingToolValue,
} from "@/components/ui/CodingToolIcon";

export const PREFERRED_CODING_TOOL_STORAGE_KEY =
  "@knocklabs/preferred-coding-tool";

const PREFERRED_ACTION_CHANGE_EVENT = "knock:preferred-coding-tool-change";

type AgentPromptAction = "copy" | CodingToolValue;

type AgentPromptActionButtonProps = {
  prompt: string;
};

const MENU_ACTIONS: AgentPromptAction[] = [
  "copy",
  ...CODING_TOOL_OPTIONS.map((option) => option.value),
];

const buildCursorDeeplink = (prompt: string) => {
  const url = new URL("https://cursor.com/link/prompt");
  url.searchParams.set("text", prompt);
  return url.toString();
};

const buildClaudeCodeDeeplink = (prompt: string) => {
  const url = new URL("claude://code/new");
  url.searchParams.set("q", prompt);
  return url.toString();
};

const buildCodexDeeplink = (prompt: string) => {
  const url = new URL("codex://new");
  url.searchParams.set("prompt", prompt);
  return url.toString();
};

const DEEPLINK_BUILDERS: Record<CodingToolValue, (prompt: string) => string> = {
  cursor: buildCursorDeeplink,
  claude: buildClaudeCodeDeeplink,
  codex: buildCodexDeeplink,
};

const isCodingToolValue = (value: unknown): value is CodingToolValue =>
  typeof value === "string" && value in CODING_TOOL_BY_VALUE;

const openDeeplink = (href: string) => {
  const isHttp = href.startsWith("http://") || href.startsWith("https://");

  if (isHttp) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }

  window.location.href = href;
};

const readStoredAction = (): AgentPromptAction => {
  if (typeof window === "undefined") {
    return "copy";
  }

  try {
    const item = window.localStorage.getItem(PREFERRED_CODING_TOOL_STORAGE_KEY);
    if (!item) {
      return "copy";
    }

    const parsed = JSON.parse(item) as unknown;
    if (parsed === "copy" || isCodingToolValue(parsed)) {
      return parsed;
    }
  } catch {
    // Ignore invalid storage values and fall back to copy.
  }

  return "copy";
};

const persistAction = (action: AgentPromptAction) => {
  try {
    window.localStorage.setItem(
      PREFERRED_CODING_TOOL_STORAGE_KEY,
      JSON.stringify(action),
    );
  } catch {
    // Ignore storage write failures.
  }

  // localStorage "storage" events do not fire in the same tab — notify siblings.
  window.dispatchEvent(
    new CustomEvent<AgentPromptAction>(PREFERRED_ACTION_CHANGE_EVENT, {
      detail: action,
    }),
  );
};

const attachedPrimaryStyles: React.CSSProperties = {
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  marginRight: -1,
};

const attachedTriggerStyles: React.CSSProperties = {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
};

export const AgentPromptActionButton = ({
  prompt,
}: AgentPromptActionButtonProps) => {
  const isMounted = useIsMounted();
  const [isOpen, setIsOpen] = useState(false);
  const [preferredTool, setPreferredTool] = useState<AgentPromptAction>("copy");
  const [isCopied, copy] = useClipboard(prompt);

  useEffect(() => {
    setPreferredTool(readStoredAction());

    const syncPreferredTool = (action: AgentPromptAction) => {
      setPreferredTool(action);
    };

    const handlePreferredActionChange = (event: Event) => {
      const detail = (event as CustomEvent<AgentPromptAction>).detail;
      if (detail === "copy" || isCodingToolValue(detail)) {
        syncPreferredTool(detail);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== PREFERRED_CODING_TOOL_STORAGE_KEY) {
        return;
      }
      syncPreferredTool(readStoredAction());
    };

    window.addEventListener(
      PREFERRED_ACTION_CHANGE_EVENT,
      handlePreferredActionChange,
    );
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        PREFERRED_ACTION_CHANGE_EVENT,
        handlePreferredActionChange,
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Keep "copy" until after mount to avoid SSR/client label mismatches.
  const activeAction: AgentPromptAction = !isMounted
    ? "copy"
    : preferredTool === "copy" || isCodingToolValue(preferredTool)
    ? preferredTool
    : "copy";

  const runAction = (action: AgentPromptAction) => {
    if (action === "copy") {
      copy();
      return;
    }

    openDeeplink(DEEPLINK_BUILDERS[action](prompt));
  };

  const handlePrimaryClick = () => {
    runAction(activeAction);
  };

  const handleSelectAction = (action: AgentPromptAction) => {
    setPreferredTool(action);
    persistAction(action);
    runAction(action);
    setIsOpen(false);
  };

  const preferredOption = isCodingToolValue(activeAction)
    ? CODING_TOOL_BY_VALUE[activeAction]
    : null;

  return (
    <Stack direction="row" alignItems="stretch">
      <Button.Root
        type="button"
        variant="solid"
        color="accent"
        size="2"
        onClick={handlePrimaryClick}
        style={attachedPrimaryStyles}
      >
        {preferredOption ? (
          <CodingToolIcon option={preferredOption} appearance="onAccent" />
        ) : (
          <Button.Icon icon={isCopied ? Check : Copy} aria-hidden />
        )}
        <Button.Text size="2">
          {preferredOption
            ? preferredOption.openLabel
            : isCopied
            ? "Copied"
            : "Copy prompt"}
        </Button.Text>
      </Button.Root>

      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <Button.Root
            type="button"
            variant="solid"
            color="accent"
            size="2"
            aria-label="Setup in coding tool"
            style={attachedTriggerStyles}
          >
            <Button.Icon icon={ChevronDown} aria-hidden />
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content sideOffset={4} align="end" py="0" gap="0" minW="56">
          {MENU_ACTIONS.map((action, index) => {
            const isFirst = index === 0;
            const isLast = index === MENU_ACTIONS.length - 1;
            const isActive = activeAction === action;
            const option = isCodingToolValue(action)
              ? CODING_TOOL_BY_VALUE[action]
              : null;

            return (
              <MenuItem
                key={action}
                as="button"
                type="button"
                size="3"
                h="10"
                leadingComponent={
                  option ? (
                    <CodingToolIcon option={option} />
                  ) : (
                    <Stack
                      aria-hidden
                      align="center"
                      justify="center"
                      w="5"
                      h="5"
                      style={{ aspectRatio: "1 / 1", flexShrink: 0 }}
                    >
                      <Icon icon={Copy} aria-hidden size="4" />
                    </Stack>
                  )
                }
                trailingIcon={
                  isActive ? { icon: Check, "aria-hidden": true } : undefined
                }
                textProps={{ size: "3" }}
                onClick={() => handleSelectAction(action)}
                py="4"
                px="4"
                style={{
                  borderRadius: isFirst
                    ? "var(--tgph-radius-2) var(--tgph-radius-2) 0 0"
                    : isLast
                    ? "0 0 var(--tgph-radius-2) var(--tgph-radius-2)"
                    : 0,
                }}
              >
                {option ? option.openLabel : "Copy prompt"}
              </MenuItem>
            );
          })}
        </Popover.Content>
      </Popover.Root>
    </Stack>
  );
};
