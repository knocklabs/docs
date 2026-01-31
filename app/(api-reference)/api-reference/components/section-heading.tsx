"use client";

import { useRef } from "react";
import { Heading } from "@telegraph/typography";
import { Box, Stack } from "@telegraph/layout";
import { Icon } from "@telegraph/icon";
import { Hash } from "lucide-react";

interface SectionHeadingProps {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  path?: string;
  children: React.ReactNode;
}

export function SectionHeadingAppRouter({
  tag = "h2",
  path,
  children,
}: SectionHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  const handleClick = () => {
    if (path) {
      const url = new URL(window.location.href);
      url.pathname = path;
      window.history.pushState({}, "", url.toString());

      // Scroll into view
      if (headingRef.current) {
        headingRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const sizeMap = {
    h1: "7",
    h2: "6",
    h3: "5",
    h4: "4",
    h5: "3",
    h6: "2",
  } as const;

  return (
    <Stack direction="row" alignItems="center" gap="2">
      <Heading
        as={tag}
        size={sizeMap[tag]}
        ref={headingRef}
        id={path?.replace(/^\//, "")}
      >
        {children}
      </Heading>
      {path && (
        <Box
          as="button"
          onClick={handleClick}
          className="opacity-0 hover:opacity-100 transition-opacity"
          style={{ cursor: "pointer", background: "none", border: "none" }}
          aria-label="Copy link to section"
        >
          <Icon icon={Hash} size="3" color="gray" aria-hidden />
        </Box>
      )}
    </Stack>
  );
}
