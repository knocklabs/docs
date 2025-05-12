import React, { useEffect, useState, useRef } from "react";
import { Heading } from "@telegraph/typography";
import { TgphComponentProps } from "@telegraph/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { Tag } from "@telegraph/tag";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

type HeadingProps = TgphComponentProps<typeof Heading>;

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
  tag: HeadingTag;
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

  const onHeadingClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
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
      url = window.location.origin + window.location.pathname + "#" + id;
    }

    await navigator.clipboard.writeText(url);
    window.history.pushState({}, "", url);
    setShowCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
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
      position="relative"
      data-section-heading
      onClick={onHeadingClick}
      {...wrapperProps}
      style={{
        cursor: showLink ? "pointer" : "default",
        ...wrapperProps?.style,
      }}
    >
      <Heading
        size={size}
        {...rest}
        as={tag}
        id={id}
        mt="0"
        mb="0"
        position="relative"
      >
        {children}
      </Heading>
      {showLink && (
        <Text
          data-section-heading-hash
          as="span"
          position="absolute"
          top="0"
          h="full"
          size={size}
          color="gray"
          className="sm-hidden"
          style={{
            color: "var(--tgph-gray-9)",
            left: "calc(var(--tgph-spacing-8) * -1)",
          }}
        >
          #
        </Text>
      )}
      <AnimatePresence>
        {showCopied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: -24 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            style={{
              display: "inline-block",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <Tag size="1" color="green">
              Copied!
            </Tag>
          </motion.div>
        )}
      </AnimatePresence>
    </Stack>
  );
};

export default SectionHeading;
