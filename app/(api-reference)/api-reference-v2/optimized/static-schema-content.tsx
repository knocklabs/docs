/**
 * Static schema content - Server Component
 *
 * Renders schema/model documentation entirely on the server.
 */

import type { OpenAPIV3 } from "@scalar/openapi-types";
import { Box } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";

interface Props {
  modelName: string;
  schema: OpenAPIV3.SchemaObject;
  path: string;
  schemaReferences: Record<string, string>;
}

export function StaticSchemaContent({
  modelName,
  schema,
  path,
  schemaReferences,
}: Props) {
  const properties = schema.properties || {};
  const required = schema.required || [];

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
          <Heading as="h2" size="5" weight="semi-bold" mb="3">
            {schema.title || modelName}
          </Heading>

          {schema.description && (
            <Text as="p" size="2" color="gray" mb="4">
              {schema.description}
            </Text>
          )}

          <Heading as="h3" size="3" weight="medium" mb="2" mt="4">
            Attributes
          </Heading>

          <div className="divide-y divide-gray-200">
            {Object.entries(properties).map(([name, prop]) => {
              const propSchema = prop as OpenAPIV3.SchemaObject;
              const isRequired = required.includes(name);

              // Get type display string
              let typeDisplay = propSchema.type || "any";
              if (propSchema.type === "array" && propSchema.items) {
                const itemType = (propSchema.items as OpenAPIV3.SchemaObject).type || "any";
                typeDisplay = `${itemType}[]`;
              }
              if (propSchema.enum) {
                typeDisplay = "enum";
              }

              return (
                <div key={name} className="py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-mono text-sm font-medium">{name}</code>
                    <span className="text-xs text-gray-500">{typeDisplay}</span>
                    {isRequired && (
                      <span className="text-xs text-red-500 font-medium">
                        required
                      </span>
                    )}
                    {propSchema.nullable && (
                      <span className="text-xs text-gray-400">nullable</span>
                    )}
                  </div>
                  {propSchema.description && (
                    <Text as="p" size="2" color="gray">
                      {propSchema.description}
                    </Text>
                  )}
                  {propSchema.enum && (
                    <div className="mt-1">
                      <Text as="p" size="1" color="gray">
                        Values:{" "}
                        {propSchema.enum.map((v) => (
                          <code
                            key={String(v)}
                            className="mx-1 px-1 py-0.5 bg-gray-100 rounded text-xs"
                          >
                            {String(v)}
                          </code>
                        ))}
                      </Text>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Example column */}
        <div className="flex-1 min-w-0 lg:max-w-md">
          {schema.example && (
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">
                {schema.title || modelName}
              </div>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-md text-sm overflow-x-auto">
                <code>{JSON.stringify(schema.example, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}
