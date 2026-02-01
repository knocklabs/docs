"use client";

import { Box, Stack } from "@telegraph/layout";
import { Text, Heading } from "@telegraph/typography";
import Link from "next/link";
import { SectionHeadingAppRouter } from "./section-heading";
import { ContentActionsAppRouter } from "./content-actions";

export const Section = ({
  title,
  children,
  isIdempotent = false,
  isRetentionSubject = false,
  path,
  mdPath,
}: {
  title?: string;
  children: React.ReactNode;
  isIdempotent?: boolean;
  isRetentionSubject?: boolean;
  path?: string;
  mdPath?: string;
}) => {
  const handleRetentionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector(
      '[data-resource-path="/overview/data-retention"]',
    );
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/api-reference/overview/data-retention";
    }
  };

  const handleIdempotentClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector(
      '[data-resource-path="/overview/idempotent-requests"]',
    );
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/api-reference/overview/idempotent-requests";
    }
  };

  return (
    <Box
      as="section"
      borderBottom="px"
      borderColor="gray-3"
      py="16"
      data-resource-path={path}
    >
      {title && (
        <>
          {isIdempotent && (
            <Box mb="2">
              <Text
                as="span"
                size="0"
                bg="yellow-3"
                py="1"
                px="3"
                color="black"
                borderRadius="2"
              >
                <Link
                  href="/api-reference/overview/idempotent-requests"
                  onClick={handleIdempotentClick}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Idempotent
                </Link>
              </Text>
            </Box>
          )}
          {isRetentionSubject && (
            <Box mb="2">
              <Text
                as="span"
                size="0"
                bg="yellow-3"
                py="1"
                px="3"
                color="black"
                borderRadius="2"
              >
                <Link
                  href="/api-reference/overview/data-retention"
                  onClick={handleRetentionClick}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Retention policy applied
                </Link>
              </Text>
            </Box>
          )}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb="6"
          >
            <SectionHeadingAppRouter tag="h2" path={path}>
              {title}
            </SectionHeadingAppRouter>
            {mdPath && <ContentActionsAppRouter mdPath={mdPath} />}
          </Stack>
        </>
      )}
      <Stack
        w="full"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          justifyItems: "flex-start",
        }}
        className="md-one-column"
        overflow="hidden"
      >
        {children}
      </Stack>
    </Box>
  );
};

export const ContentColumn = ({ children }: { children: React.ReactNode }) => (
  <Stack pr="3" w="full">
    <Box w="full">{children}</Box>
  </Stack>
);

export const ExampleColumn = ({ children }: { children: React.ReactNode }) => (
  <Box position="relative" minW="0" w="full" data-example-column>
    <Stack
      mt="5"
      pl="5"
      flexDirection="column"
      flexWrap="wrap"
      w="full"
      gap="5"
      position="sticky"
      style={{ top: "100px" }}
      className="md-no-left-padding"
    >
      {children}
    </Stack>
  </Box>
);

export const ErrorExample = ({
  title,
  description,
}: {
  title: string;
  description: React.ReactNode;
}) => (
  <div
    data-error-example
    className="flex-col pt-6 mt-6 border-gray-200 border-t dark:border-gray-700"
  >
    <span className="bg-code-background dark:bg-gray-800 text-code rounded text-sm font-normal py-0.75 px-1.5 font-mono inline-block">
      {title}
    </span>
    <span className="block pt-0 mt-1 text-gray-800 dark:text-gray-200 text-sm">
      {description}
    </span>
  </div>
);
