"use client";

import { useRef, useState } from "react";
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Icon } from "@telegraph/icon";
import { Check, Link2 } from "lucide-react";

interface ContentActionsProps {
  mdPath?: string;
  showOnMobile?: boolean;
  style?: React.CSSProperties;
}

export function ContentActionsAppRouter({
  mdPath,
  showOnMobile = false,
  style,
}: ContentActionsProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Stack
      direction="row"
      gap="1"
      className={showOnMobile ? "" : "hidden md:flex"}
      style={style}
    >
      <Button.Root
        variant="ghost"
        size="0"
        onClick={handleCopyLink}
        aria-label="Copy link"
      >
        <Icon
          icon={copied ? Check : Link2}
          size="2"
          color={copied ? "green" : "gray"}
          aria-hidden
        />
      </Button.Root>
    </Stack>
  );
}
