import React from "react";
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";
import { useClipboard } from "@/hooks/useClipboard";

export const CopyableText = ({ content, label }) => {
  const [isCopied, copy] = useClipboard(content);

  return (
    <Button
      mb="3"
      variant="outline"
      color="accent"
      onClick={copy}
      icon={{
        icon: isCopied ? Lucide.Check : Lucide.Copy,
        "aria-hidden": true,
      }}
      size="2"
    >
      {label}
    </Button>
  );
};
