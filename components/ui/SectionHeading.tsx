import React, { useEffect, useState, useRef } from "react";
import { Heading } from "@telegraph/typography";
import { TgphComponentProps } from "@telegraph/helpers";
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Tag } from "@telegraph/tag";
import { Stack } from "@telegraph/layout";

type HeadingProps = TgphComponentProps<typeof Heading>;

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
  as: HeadingTag;
  path?: string;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  wrapperProps?: TgphComponentProps<typeof Stack>;
} & Omit<HeadingProps, "as">;

const SectionHeading = ({
  id,
  tag,
  children,
  path,
  tooltipSide = "top",
  wrapperProps,
  ...rest
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const size: HeadingProps["size"] =
    tag === "h1"
      ? "6"
      : tag === "h2"
      ? "6"
      : tag === "h3"
      ? "4"
      : tag === "h4"
      ? "3"
      : tag === "h5"
      ? "3"
      : "3";

  const [showCopied, setShowCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showLink = path || id;

  const onHeadingClick = async () => {
    let url = "";

    // Handle paths for same-page routing
    if (path) {
      url =
        window.location.origin +
        "/" +
        window.location.pathname.split("/")[1] +
        path;
    }

    // Use the ID for regular routes
    if (id) {
      url = window.location.href + "#" + id;
    }

    await navigator.clipboard.writeText(url);
    setShowCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // Remove styling from the cliked heading
      buttonRef.current?.blur();
      setShowCopied(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!showLink) {
    return (
      <Heading size={size} mb="4" {...rest} as={tag}>
        {children}
      </Heading>
    );
  }

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      mt={rest?.mt || 0}
      mb={rest?.mb || 4}
      {...wrapperProps}
    >
      <Button
        variant="ghost"
        onClick={onHeadingClick}
        borderRadius="2"
        px="2"
        style={{
          marginLeft: "-8px",
        }}
        tgphRef={buttonRef}
      >
        <Tooltip label="Copy link to section" side={tooltipSide}>
          <Heading size={size} {...rest} as={tag} id={id} mt="0" mb="0">
            {children}
          </Heading>
        </Tooltip>
      </Button>
      <AnimatePresence>
        {showCopied && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            style={{ display: "inline-block", marginLeft: 8 }}
          >
            <Tag size="1" color="green">
              Copied link to clipboard!
            </Tag>
          </motion.div>
        )}
      </AnimatePresence>
    </Stack>
  );
};

export default SectionHeading;
