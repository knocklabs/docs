/**
 * Static section wrapper - Server Component
 *
 * This renders the section structure without client-side state.
 * It's designed to be used in server components.
 */

import { ReactNode } from "react";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";

interface Props {
  title?: string;
  path: string;
  description?: string;
  children?: ReactNode;
}

export function StaticSection({ title, path, description, children }: Props) {
  return (
    <Box
      as="section"
      id={path.replace(/^\//, "").replace(/\//g, "-")}
      py="8"
      borderBottom="px"
      borderColor="gray-3"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Content column */}
        <div className="flex-1 min-w-0">
          {title && (
            <Heading as="h2" size="5" weight="semi-bold" mb="3">
              {title}
            </Heading>
          )}
          {description && (
            <Text as="p" size="2" color="gray" mb="4">
              {description}
            </Text>
          )}
        </div>

        {/* Example column */}
        {children && (
          <div className="flex-1 min-w-0 lg:max-w-md">{children}</div>
        )}
      </div>
    </Box>
  );
}
