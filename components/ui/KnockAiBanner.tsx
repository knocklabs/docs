import Link from "next/link";
import { Button } from "@telegraph/button";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";
import { ArrowRight } from "lucide-react";

import { AnimatedDotGrid } from "@/components/ui/AnimatedDotGrid";

/**
 * Skinny homepage promo for Knock AI. Dot grid shows on the right;
 * a surface-colored gradient keeps copy readable on the left.
 */
export const KnockAiBanner = () => {
  return (
    <Box
      position="relative"
      overflow="hidden"
      w="full"
      border="px"
      borderColor="gray-4"
      borderRadius="4"
      bg="surface-1"
      style={{ minHeight: "7.5rem" }}
    >
      <AnimatedDotGrid maskImage={false} />

      {/* Opaque on the left (copy), transparent on the right (grid). */}
      <Box
        aria-hidden
        position="absolute"
        style={{
          inset: 0,
          background:
            "linear-gradient(to right, var(--tgph-surface-1) 0%, var(--tgph-surface-1) 42%, transparent 78%)",
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
        px="5"
        py="4"
        style={{ zIndex: 2, minHeight: "7.5rem" }}
      >
        <Stack direction="column" gap="1" style={{ maxWidth: "22rem" }}>
          <Heading as="h2" size="3" weight="semi-bold">
            Knock AI
          </Heading>
          <Text as="p" size="1" color="gray" style={{ margin: 0 }}>
            Drive Knock from your coding agent
          </Text>
        </Stack>
        <Button
          as={Link}
          href="/agents"
          size="1"
          variant="solid"
          color="accent"
          trailingIcon={{ icon: ArrowRight, "aria-hidden": true }}
        >
          Get started
        </Button>
      </Stack>
    </Box>
  );
};
