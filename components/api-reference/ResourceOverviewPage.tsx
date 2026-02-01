import Link from "next/link";
import Markdown from "react-markdown";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";
import {
  ResourceOverviewData,
  SchemaSummary,
  SubresourceSummary,
} from "@/lib/openApiSpec";
import { EndpointList } from "./EndpointList";

interface SubresourceListProps {
  subresources: SubresourceSummary[];
  basePath: string;
}

/**
 * Displays a list of subresources with links to their pages.
 */
function SubresourceList({ subresources, basePath }: SubresourceListProps) {
  if (subresources.length === 0) {
    return null;
  }

  return (
    <Box mt="8">
      <Heading as="h3" size="4" weight="medium" mb="4">
        Subresources
      </Heading>
      <Stack direction="column" gap="2">
        {subresources.map((sub) => (
          <Link
            key={sub.name}
            href={`${basePath}/${sub.name}`}
            style={{ textDecoration: "none" }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              py="3"
              px="4"
              borderRadius="2"
              border="px"
              borderColor="gray-3"
              className="hover:bg-gray-2"
              style={{ transition: "background-color 0.15s ease" }}
            >
              <Text as="span" size="2" weight="medium">
                {sub.title}
              </Text>
              <Text as="span" size="1" color="gray">
                {sub.methodCount} endpoint{sub.methodCount !== 1 ? "s" : ""}
              </Text>
            </Stack>
          </Link>
        ))}
      </Stack>
    </Box>
  );
}

interface SchemaListProps {
  schemas: SchemaSummary[];
  basePath: string;
}

/**
 * Displays a list of schemas (object definitions) with links to their pages.
 */
function SchemaList({ schemas, basePath }: SchemaListProps) {
  if (schemas.length === 0) {
    return null;
  }

  return (
    <Box mt="8">
      <Heading as="h3" size="4" weight="medium" mb="4">
        Object definitions
      </Heading>
      <Stack direction="row" gap="2" flexWrap="wrap">
        {schemas.map((schema) => (
          <Link
            key={schema.schemaName}
            href={`${basePath}/schemas/${schema.schemaName}`}
            style={{ textDecoration: "none" }}
          >
            <Box
              py="2"
              px="3"
              borderRadius="2"
              border="px"
              borderColor="gray-3"
              className="hover:bg-gray-2"
              style={{ transition: "background-color 0.15s ease" }}
            >
              <Text as="span" size="2" weight="medium">
                {schema.title}
              </Text>
            </Box>
          </Link>
        ))}
      </Stack>
    </Box>
  );
}

interface ResourceOverviewPageProps {
  data: ResourceOverviewData;
  basePath: string;
}

/**
 * Displays the overview for a resource including:
 * - Description
 * - List of endpoints
 * - List of subresources
 * - List of object definitions
 */
export function ResourceOverviewPage({
  data,
  basePath,
}: ResourceOverviewPageProps) {
  const { resource, methods, schemas, subresources } = data;

  return (
    <Box>
      {resource.description && (
        <Box mb="6" className="tgraph-content">
          <Markdown>{resource.description}</Markdown>
        </Box>
      )}

      {methods.length > 0 && (
        <Box mt="6">
          <Heading as="h3" size="4" weight="medium" mb="4">
            Endpoints
          </Heading>
          <EndpointList methods={methods} basePath={basePath} />
        </Box>
      )}

      <SubresourceList subresources={subresources} basePath={basePath} />

      <SchemaList schemas={schemas} basePath={basePath} />
    </Box>
  );
}

export { SubresourceList, SchemaList };
export default ResourceOverviewPage;
