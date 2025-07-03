import React from "react";
import { Button } from "@telegraph/button";
import { useClipboard } from "@/hooks/useClipboard";
import { Check, Copy } from "lucide-react";

export const CopyableText = ({ content, label }) => {
  const [isCopied, copy] = useClipboard(content);

  return (
    <Button
      mb="3"
      variant="outline"
      color="accent"
      onClick={copy}
      icon={{
        icon: isCopied ? Check : Copy,
        "aria-hidden": true,
      }}
      size="2"
    >
      {label}
    </Button>
  );
};
