import type { OpenAPIV3 } from "@scalar/openapi-types";
import Link from "next/link";
import { Box, Stack } from "@telegraph/layout";
import { Text, Code } from "@telegraph/typography";

interface OperationParametersServerProps {
  parameters: OpenAPIV3.ParameterObject[];
  schemaReferences: Record<string, string>;
}

export function OperationParametersServer({
  parameters,
  schemaReferences,
}: OperationParametersServerProps) {
  return (
    <Box>
      {parameters.map((parameter) => {
        const schema = parameter.schema as OpenAPIV3.SchemaObject | undefined;
        const typeString = getTypeString(schema);
        const typeRef = schemaReferences[typeString];

        return (
          <Box
            key={parameter.name}
            py="3"
            borderBottom="px"
            borderColor="gray-3"
          >
            <Stack
              direction="row"
              alignItems="center"
              gap="2"
              mb="1"
              flexWrap="wrap"
            >
              <Code as="span" size="1" weight="semi-bold">
                {parameter.name}
              </Code>
              {typeRef ? (
                <Link
                  href={typeRef}
                  className="text-blue-600 hover:text-blue-700 font-mono text-xs"
                >
                  {typeString}
                </Link>
              ) : (
                <Code as="span" size="0" color="gray">
                  {typeString}
                </Code>
              )}
              {parameter.required && (
                <Text as="span" size="0" color="red">
                  required
                </Text>
              )}
            </Stack>
            {parameter.description && (
              <Text as="p" size="2" color="gray">
                {parameter.description}
              </Text>
            )}
            {schema?.enum && (
              <Text as="p" size="1" color="gray" mt="1">
                One of: {schema.enum.map((e) => `"${e}"`).join(", ")}
              </Text>
            )}
            {schema?.default !== undefined && (
              <Text as="p" size="1" color="gray" mt="1">
                Default: {JSON.stringify(schema.default)}
              </Text>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

function getTypeString(schema?: OpenAPIV3.SchemaObject): string {
  if (!schema) return "unknown";
  if (schema.title) return schema.title;
  if (schema.type === "array" && schema.items) {
    const items = schema.items as OpenAPIV3.SchemaObject;
    return `${items.title || items.type || "unknown"}[]`;
  }
  return schema.type || "unknown";
}
