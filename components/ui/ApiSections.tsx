import cn from "classnames";
import SectionHeading from "./SectionHeading";
import { Box, Stack } from "@telegraph/layout";

export const Section = ({
  title,
  children,
  headingClassName = "",
  isIdempotent = false,
  isRetentionSubject = false,
  path = undefined,
  wrapperClassName = "",
}: {
  title?: string;
  children: React.ReactNode;
  headingClassName?: string;
  isIdempotent?: boolean;
  isRetentionSubject?: boolean;
  path?: string;
  wrapperClassName?: string;
}) => (
  <Box
    as="section"
    borderBottom="px"
    borderColor="gray-3"
    py="16"
    data-resource-path={path}
  >
    {title && (
      <SectionHeading
        tag="h2"
        className={cn([headingClassName, "mb-6"])}
        path={path}
      >
        {isIdempotent && (
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 border border-transparent font-mono rounded p-1 center mr-3 bg-yellow-100 dark:bg-transparent dark:border-yellow-500">
              <a href="#idempotent-requests">Idempotent</a>
            </span>
          </div>
        )}
        {isRetentionSubject && (
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 border border-transparent font-mono rounded p-1 center mr-3 bg-orange-100 dark:bg-transparent dark:border-orange-600">
              <a
                href="#data-retention"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Retention policy applied
              </a>
            </span>
          </div>
        )}
        {title}
      </SectionHeading>
    )}
    <Stack
      w="full"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        justifyItems: "flex-start",
      }}
      className={wrapperClassName}
    >
      {children}
    </Stack>
  </Box>
);

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
