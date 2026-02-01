import Link from "next/link";
import { Box, Stack } from "@telegraph/layout";
import { Text, Code } from "@telegraph/typography";
import { MethodSummary } from "@/lib/openApiSpec";

/**
 * Badge component for HTTP method type
 */
function MethodBadge({ method }: { method: string }) {
  const methodUpper = method.toUpperCase();

  const colorMap: Record<string, string> = {
    GET: "green",
    POST: "blue",
    PUT: "amber",
    PATCH: "amber",
    DELETE: "red",
  };

  const color = colorMap[methodUpper] || "gray";

  return (
    <Text
      as="span"
      size="0"
      weight="semi-bold"
      py="1"
      px="2"
      borderRadius="1"
      style={{
        fontFamily: "monospace",
        backgroundColor: `var(--color-${color}-3)`,
        color: `var(--color-${color}-11)`,
        minWidth: "52px",
        textAlign: "center",
        display: "inline-block",
      }}
    >
      {methodUpper}
    </Text>
  );
}

interface EndpointListProps {
  methods: MethodSummary[];
  basePath: string;
}

/**
 * Displays a list of API endpoints with their HTTP methods and summaries.
 * Links to individual method pages.
 */
export function EndpointList({ methods, basePath }: EndpointListProps) {
  if (methods.length === 0) {
    return null;
  }

  return (
    <Box as="div" borderRadius="2" overflow="hidden">
      {methods.map((method, index) => (
        <Link
          key={method.methodName}
          href={`${basePath}/${method.methodName}`}
          style={{ textDecoration: "none" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap="4"
            py="3"
            px="4"
            borderBottom={index < methods.length - 1 ? "px" : undefined}
            borderColor="gray-3"
            style={{
              transition: "background-color 0.15s ease",
            }}
            className="hover:bg-gray-2"
          >
            <MethodBadge method={method.methodType} />
            <Stack direction="column" gap="1" flex="1" minW="0">
              <Code as="span" size="1" color="gray" weight="medium">
                {method.endpoint}
              </Code>
              <Text as="span" size="2" color="gray">
                {method.summary}
              </Text>
            </Stack>
          </Stack>
        </Link>
      ))}
    </Box>
  );
}

export { MethodBadge };
export default EndpointList;
