import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@telegraph/button";
import { TgphComponentProps } from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";

import { AnimatedDotGrid } from "@/components/ui/AnimatedDotGrid";
import * as posthog from "@/lib/posthog";

import "./KnockAiBanner.css";

type KnockAiBannerProps = {
  subheadingProps?: Omit<
    TgphComponentProps<typeof Text<"p">>,
    "as" | "children"
  >;
};

/**
 * Skinny homepage promo for Knock AI. Dot grid shows on the right;
 * a surface-colored gradient keeps copy readable on the left.
 */
export const KnockAiBanner = ({ subheadingProps }: KnockAiBannerProps = {}) => {
  const router = useRouter();
  const {
    style: subheadingStyle,
    className: subheadingClassName,
    ...restSubheadingProps
  } = subheadingProps ?? {};
  const { width: subheadingWidth, ...restSubheadingStyle } = (subheadingStyle ??
    {}) as CSSProperties;

  return (
    <Link
      href="/agents"
      onClick={() => {
        posthog.track("knock-ai-banner-clicked-client", {
          path: router.asPath,
        });
      }}
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
          style={{ zIndex: 2 }}
        >
          <Stack direction="column" gap="1" w="full">
            <Heading as="h2" size="3" weight="medium">
              Agent-first setup
            </Heading>
            <Text
              as="p"
              size="1"
              color="gray"
              {...restSubheadingProps}
              className={["knock-ai-banner__subheading", subheadingClassName]
                .filter(Boolean)
                .join(" ")}
              style={
                {
                  margin: 0,
                  ...restSubheadingStyle,
                  ...(subheadingWidth != null
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
