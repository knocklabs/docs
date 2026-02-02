import SectionHeading from "@/components/ui/SectionHeading";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { highlightResource } from "./Page/helpers";
import Link from "next/link";
import { ContentActions } from "./ContentActions";
import { Tag } from "@telegraph/tag";

export const Section = ({
  title,
  description,
  children,
  isIdempotent = false,
  isRetentionSubject = false,
  path = undefined,
  mdPath,
  slug: _slug, // Explicitly destructure to prevent passing to DOM
  direction: _direction, // Some sections pass this, prevent passing to DOM
}: {
  title?: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  isIdempotent?: boolean;
  isRetentionSubject?: boolean;
  path?: string;
  mdPath?: string;
  slug?: string;
  direction?: string;
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
      <Stack direction="row" alignItems="center" gap="2" mb="2">
        {isIdempotent && (
          <Tag size="0" color="blue">
            <Link
              href="/api-reference/overview/idempotent-requests"
              onClick={onIdempotentClick}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Idempotent
            </Link>
          </Tag>
        )}
        {isRetentionSubject && (
          <Tag size="0" color="yellow">
            <Link
              href="/api-reference/overview/data-retention"
              onClick={onRetentionClick}
            >
              Retention policy applied
            </Link>
          </Tag>
        )}
      </Stack>
      <Stack direction="row" alignItems="flex-start" mb="6">
        <Stack direction="column" gap="2">
          <SectionHeading tag="h2" path={path}>
            {title}
          </SectionHeading>
          {description && <Box maxW="160">{description}</Box>}
        </Stack>
        {mdPath && <Box ml="auto">{<ContentActions mdPath={mdPath} />}</Box>}
      </Stack>
      <Stack
        w="full"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 420px) 1fr",
          justifyItems: "flex-start",
        }}
        gap="6"
        className="md-one-column"
        overflow="hidden"
      >
        {children}
      </Stack>
    </Box>
  );
};

export const ContentColumn = ({ children }) => (
  <Stack pr="3" w="full" direction="column">
    {children}
  </Stack>
);

export const ExampleColumn = ({ children }) => (
  <Box position="relative" minW="0" w="full" data-example-column>
    <Stack
      pl="5"
      flexDirection="column"
      flexWrap="wrap"
      w="full"
      gap="5"
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
