import SectionHeading from "@/components/ui/SectionHeading";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { highlightResource } from "./Page/helpers";
import Link from "next/link";

export const Section = ({
  title,
  children,
  isIdempotent = false,
  isRetentionSubject = false,
  path = undefined,
}: {
  title?: string;
  children: React.ReactNode;
  isIdempotent?: boolean;
  isRetentionSubject?: boolean;
  path?: string;
}) => {
  const onRetentionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    highlightResource(`/api-reference/overview/data-retention`, {
      moveToItem: true,
    });
  };

  const onIdempotentClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    highlightResource(`/api-reference/overview/idempotent-requests`, {
      moveToItem: true,
    });
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
                  onClick={onIdempotentClick}
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
                  onClick={onRetentionClick}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Retention policy applied
                </Link>
              </Text>
            </Box>
          )}
          <SectionHeading tag="h2" path={path} mb="6">
            {title}
          </SectionHeading>
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

export const ContentColumn = ({ children }) => (
  <Stack pr="3" w="full">
    <Box w="full">{children}</Box>
  </Stack>
);

export const ExampleColumn = ({ children }) => (
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

// Unused?
export const ErrorExample = ({ title, description }) => (
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
