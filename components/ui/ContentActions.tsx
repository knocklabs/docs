import React, { useState } from "react";
import { Popover } from "@telegraph/popover";
import { Box } from "@telegraph/layout";
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";
import { MenuItem } from "@telegraph/menu";
import Link from "next/link";
import { useRouter } from "next/router";
import { TgphComponentProps } from "@telegraph/helpers";

interface ContentActionsProps extends TgphComponentProps<typeof Box> {
  showOnMobile?: boolean;
  mdPath?: string; // Optional custom markdown path
}

export const ContentActions: React.FC<ContentActionsProps> = ({
  showOnMobile = false,
  mdPath: customMdPath,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();
  const pathname = router.asPath;
  const basePath = pathname.split("?")[0].split("#")[0].substring(1);

  // Use custom path if provided, otherwise use URL-based path
  const mdPath = customMdPath || `/${basePath}.md`;

  const copyAsMarkdown = async () => {
    try {
      const response = await fetch(mdPath);
      if (!response.ok) {
        throw new Error("Failed to fetch markdown content");
      }
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy markdown:", error);
    }
  };

  return (
    <Box className={showOnMobile ? "" : "md-hidden"} {...props}>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <Button
            icon={{ icon: Lucide.Copy, "aria-hidden": true }}
            variant="ghost"
            size="1"
            color="gray"
            onClick={() => setIsOpen(true)}
          >
            Copy for LLM
          </Button>
        </Popover.Trigger>
        <Popover.Content sideOffset={4} align="start" py="0" gap="0">
          <MenuItem
            as="button"
            onClick={copyAsMarkdown}
            disabled={isCopied}
            icon={{
              icon: isCopied ? Lucide.Check : Lucide.Copy,
              "aria-hidden": true,
            }}
            py="4"
            style={{
              borderRadius: "var(--tgph-radius-2) var(--tgph-radius-2) 0 0",
            }}
          >
            {isCopied ? "Copied!" : "Copy as Markdown"}
          </MenuItem>
          <MenuItem
            as={Link}
            icon={{
              icon: Lucide.SquareArrowOutUpRight,
              "aria-hidden": true,
            }}
            href={mdPath}
            target="_blank"
            rel="noopener noreferrer"
            py="4"
            style={{
              borderRadius: "0 0 var(--tgph-radius-2) var(--tgph-radius-2)",
            }}
          >
            View as Markdown
          </MenuItem>
        </Popover.Content>
      </Popover.Root>
    </Box>
  );
};
