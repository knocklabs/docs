import type { OpenAPIV3 } from "@scalar/openapi-types";
import Link from "next/link";
import { Box, Stack } from "@telegraph/layout";
import { Text, Code } from "@telegraph/typography";

interface SchemaPropertiesServerProps {
  schema: OpenAPIV3.SchemaObject;
  schemaReferences: Record<string, string>;
  hideRequired?: boolean;
}

export function SchemaPropertiesServer({
  schema,
  schemaReferences,
  hideRequired = false,
}: SchemaPropertiesServerProps) {
  const unionSchema = schema.oneOf || schema.anyOf || schema.allOf;
  const onlyUnion =
    unionSchema && !schema.properties && !schema.additionalProperties;

  return (
    <Box>
      {Object.entries(schema.properties || {}).map(
        ([propertyName, property]) => (
          <SchemaPropertyServer
            key={propertyName}
            name={propertyName}
            schema={{
              ...(property as OpenAPIV3.SchemaObject),
              required: !hideRequired
                ? (property as OpenAPIV3.SchemaObject).required ||
                  schema.required?.includes(propertyName)
                : false,
            }}
            schemaReferences={schemaReferences}
          />
        ),
      )}
      {schema.additionalProperties && (
        <SchemaPropertyServer
          name="*"
          schema={{
            type: "object",
            description: "Any additional custom properties.",
            additionalProperties: schema.additionalProperties,
          }}
          schemaReferences={schemaReferences}
        />
      )}

      {onlyUnion && (
        <SchemaPropertyServer
          name={schema.title}
          schema={schema}
          schemaReferences={schemaReferences}
        />
      )}
    </Box>
  );
}

interface SchemaPropertyServerProps {
  name?: string;
  schema: OpenAPIV3.SchemaObject & { required?: boolean | string[] };
  schemaReferences: Record<string, string>;
}

function SchemaPropertyServer({
  name,
  schema,
  schemaReferences,
}: SchemaPropertyServerProps) {
  const typeString = getTypeString(schema);
  const typeRef = schemaReferences[typeString];
  const isRequired =
    schema.required === true ||
    (Array.isArray(schema.required) && name && schema.required.includes(name));
  const isNullable = schema.nullable;

  // Handle union types (oneOf, anyOf, allOf)
  const unionSchema = schema.oneOf || schema.anyOf || schema.allOf;

  return (
    <Box py="3" borderBottom="px" borderColor="gray-3">
      <Stack direction="row" alignItems="center" gap="2" mb="1" flexWrap="wrap">
        {name && (
          <Code as="span" size="1" weight="semi-bold">
            {name}
          </Code>
        )}
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
        {isRequired && (
          <Text as="span" size="0" color="red">
            required
          </Text>
        )}
        {isNullable && (
          <Text as="span" size="0" color="gray">
            nullable
          </Text>
        )}
      </Stack>
      {schema.description && (
        <Text as="p" size="2" color="gray">
          {schema.description}
        </Text>
      )}
      {schema.enum && (
        <Text as="p" size="1" color="gray" mt="1">
          One of: {schema.enum.map((e) => `"${e}"`).join(", ")}
        </Text>
      )}
      {schema.default !== undefined && (
        <Text as="p" size="1" color="gray" mt="1">
          Default: {JSON.stringify(schema.default)}
        </Text>
      )}

      {/* Handle nested properties */}
      {schema.properties && (
        <Box mt="2" pl="4" borderLeft="2" borderColor="gray-3">
          <SchemaPropertiesServer
            schema={schema}
            schemaReferences={schemaReferences}
          />
        </Box>
      )}

      {/* Handle array items with properties */}
      {schema.type === "array" &&
        schema.items &&
        (schema.items as OpenAPIV3.SchemaObject).properties && (
          <Box mt="2" pl="4" borderLeft="2" borderColor="gray-3">
            <SchemaPropertiesServer
              schema={schema.items as OpenAPIV3.SchemaObject}
              schemaReferences={schemaReferences}
            />
          </Box>
        )}

      {/* Handle union types */}
      {unionSchema && (
        <Box mt="2">
          <Text as="p" size="1" color="gray" mb="2">
            {schema.oneOf
              ? "One of:"
              : schema.anyOf
                ? "Any of:"
                : "All of:"}
          </Text>
          <Stack direction="column" gap="2" pl="4" borderLeft="2" borderColor="gray-3">
            {unionSchema.map((unionItem, index) => {
              const item = unionItem as OpenAPIV3.SchemaObject;
              const itemTypeString = getTypeString(item);
              const itemTypeRef = schemaReferences[itemTypeString];

              return (
                <Box key={index} py="2">
                  {itemTypeRef ? (
                    <Link
                      href={itemTypeRef}
                      className="text-blue-600 hover:text-blue-700 font-mono text-sm"
                    >
                      {itemTypeString}
                    </Link>
                  ) : (
                    <Code as="span" size="1">
                      {itemTypeString}
                    </Code>
                  )}
                  {item.description && (
                    <Text as="p" size="2" color="gray" mt="1">
                      {item.description}
                    </Text>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

function getTypeString(schema: OpenAPIV3.SchemaObject): string {
  if (schema.title) return schema.title;
  if (schema.type === "array" && schema.items) {
    const items = schema.items as OpenAPIV3.SchemaObject;
    return `${items.title || items.type || "unknown"}[]`;
  }
  if (schema.oneOf) return "oneOf";
  if (schema.anyOf) return "anyOf";
  if (schema.allOf) return "allOf";
  return schema.type || "unknown";
}
