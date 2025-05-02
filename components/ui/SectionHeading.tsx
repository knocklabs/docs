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

type Props = React.HTMLProps<HTMLHeadingElement> & {
  tag: HeadingTag;
  path?: string;
};

const SectionHeading = ({
  id,
  tag,
  children,
  className,
  path,
  ...rest
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const size: HeadingProps["size"] =
    tag === "h1"
      ? "6"
      : tag === "h2"
      ? "6"
      : tag === "h3"
      ? "5"
      : tag === "h4"
      ? "4"
      : tag === "h5"
      ? "4"
      : ("4" as const);

  const [showCopied, setShowCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onHeadingClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const url =
      window.location.origin +
      "/" +
      window.location.pathname.split("/")[1] +
      path;
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

  return (
    <Stack flexDirection="row" alignItems="center" mb="4">
      <Button
        variant="ghost"
        // @ts-expect-error shut it
        size={size}
        onClick={onHeadingClick}
        borderRadius="2"
        px="2"
        style={{
          marginLeft: "-8px",
        }}
        tgphRef={buttonRef}
      >
        <Tooltip label="Copy link to section" side="top">
          {/* @ts-expect-error shut it */}
          <Heading as={tag} size={size} {...rest} id={id}>
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
