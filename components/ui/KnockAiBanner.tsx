import Link from "next/link";
import { Button } from "@telegraph/button";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";

import { AnimatedDotGrid } from "@/components/ui/AnimatedDotGrid";

import "./KnockAiBanner.css";

type KnockAiBannerProps = {
  /**
   * CSS width for the subheading when the banner is wide enough.
   * Defaults to `clamp(40%, 50%, 60%)`. Narrow containers still use full width.
   */
  subheadingWidth?: string;
};

/**
 * Skinny homepage promo for Knock AI. Dot grid shows on the right;
 * a surface-colored gradient keeps copy readable on the left.
 */
export const KnockAiBanner = ({
  subheadingWidth,
}: KnockAiBannerProps = {}) => {
  return (
    <Link
      href="/agents"
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      <Box
        className="knock-ai-banner"
        position="relative"
        overflow="hidden"
        w="full"
        border="px"
        borderColor="gray-4"
        borderRadius="4"
        bg="surface-1"
        style={{
          minHeight: "7.5rem",
          containerType: "inline-size",
          cursor: "pointer",
        }}
      >
        <AnimatedDotGrid />

        {/* Soft on the left (copy), clearer on the right (grid). */}
        <Box
          aria-hidden
          className="knock-ai-banner__fade"
          position="absolute"
          style={{
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <Stack
          position="relative"
          direction="column"
          alignItems="flex-start"
          justifyContent="center"
          gap="3"
          w="full"
          px="5"
          py="4"
          style={{ zIndex: 2, minHeight: "7.5rem" }}
        >
          <Stack direction="column" gap="1" w="full">
            <Heading as="h2" size="3" weight="medium">
              Agent-first setup
            </Heading>
            <Text
              as="p"
              size="1"
              color="gray"
              className="knock-ai-banner__subheading"
              style={
                {
                  margin: 0,
                  ...(subheadingWidth
                    ? {
                        "--knock-ai-banner-subheading-width": subheadingWidth,
                      }
                    : {}),
                } as CSSProperties
              }
            >
              Drive Knock from your coding agent. Build, ship, and optimize
              product, marketing, and transactional messaging in one platform.
            </Text>
          </Stack>
          {/* Visual CTA only — the outer link handles navigation. */}
          <Button
            as="span"
            size="1"
            variant="solid"
            color="accent"
            trailingIcon={{ icon: ArrowRight, "aria-hidden": true }}
          >
            Get started
          </Button>
        </Stack>
      </Box>
    </Link>
  );
};
