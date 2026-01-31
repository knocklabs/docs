/**
 * Static method content - Server Component with Client Islands
 *
 * This renders method documentation. Most content is static HTML
 * rendered on the server. Interactive parts use client component islands.
 */

import type { OpenAPIV3 } from "@scalar/openapi-types";
import { Box } from "@telegraph/layout";
import { Heading, Text, Code } from "@telegraph/typography";

// Client component for interactive response expansion
import { ExpandableResponseProperties } from "./expandable-response";

interface Props {
  methodName: string;
  methodType: "get" | "post" | "put" | "delete";
  endpoint: string;
  operation: OpenAPIV3.OperationObject;
  path: string;
  baseUrl: string;
  schemaReferences: Record<string, string>;
}

const METHOD_COLORS: Record<string, string> = {
  get: "text-green-600",
  post: "text-blue-600",
  put: "text-orange-600",
  delete: "text-red-600",
};

export function StaticMethodContent({
  methodName,
  methodType,
  endpoint,
  operation,
  path,
  baseUrl,
  schemaReferences,
}: Props) {
  const parameters = (operation.parameters || []) as OpenAPIV3.ParameterObject[];
  const pathParameters = parameters.filter((p) => p.in === "path");
  const queryParameters = parameters.filter((p) => p.in === "query");

  const requestBody: OpenAPIV3.SchemaObject | undefined =
    operation.requestBody?.content?.["application/json"]?.schema;

  const responseSchemas = Object.values(operation.responses || {})
    .map((r) => r.content?.["application/json"]?.schema)
    .filter((r): r is OpenAPIV3.SchemaObject => !!r)
    .map((schema) => (schema.allOf ? schema.allOf[0] : schema));

  const rateLimit = operation["x-ratelimit-tier"];
  const isBeta = operation["x-beta"];

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
          {/* Title */}
          <Heading as="h2" size="5" weight="semi-bold" mb="3">
            {operation.summary}
          </Heading>

          {/* Description */}
          {operation.description && (
            <Text as="p" size="2" color="gray" mb="4">
              {operation.description}
            </Text>
          )}

          {/* Beta badge */}
          {isBeta && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <Text as="p" size="2" color="blue">
                🚧 This endpoint is currently in beta.
              </Text>
            </div>
          )}

          {/* Endpoint */}
          <Heading as="h3" size="3" weight="medium" mb="2" mt="4">
            Endpoint
          </Heading>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
            <span className={`font-mono font-bold ${METHOD_COLORS[methodType]}`}>
              {methodType.toUpperCase()}
            </span>
            <code className="font-mono text-sm">{endpoint}</code>
          </div>

          {/* Rate limit */}
          {rateLimit && (
            <div className="mt-4">
              <Heading as="h3" size="3" weight="medium" mb="1">
                Rate limit
              </Heading>
              <Text as="p" size="2" color="gray">
                Tier: {rateLimit}
              </Text>
            </div>
          )}

          {/* Path parameters */}
          {pathParameters.length > 0 && (
            <div className="mt-6">
              <Heading as="h3" size="3" weight="medium" mb="2">
                Path parameters
              </Heading>
              <ParameterList parameters={pathParameters} />
            </div>
          )}

          {/* Query parameters */}
          {queryParameters.length > 0 && (
            <div className="mt-6">
              <Heading as="h3" size="3" weight="medium" mb="2">
                Query parameters
              </Heading>
              <ParameterList parameters={queryParameters} />
            </div>
          )}

          {/* Request body */}
          {requestBody && (
            <div className="mt-6">
              <Heading as="h3" size="3" weight="medium" mb="2">
                Request body
              </Heading>
              <SchemaPropertyList
                schema={requestBody}
                schemaReferences={schemaReferences}
              />
            </div>
          )}

          {/* Response */}
          <div className="mt-6">
            <Heading as="h3" size="3" weight="medium" mb="2">
              Returns
            </Heading>
            {responseSchemas.length > 0 ? (
              responseSchemas.map((schema, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {schema.title && (
                      <a
                        href={schemaReferences[schema.title] || "#"}
                        className="font-mono text-sm text-blue-600 hover:underline"
                      >
                        {schema.title}
                      </a>
                    )}
                  </div>
                  {schema.description && (
                    <Text as="p" size="2" color="gray" mb="2">
                      {schema.description}
                    </Text>
                  )}
                  {/* Client component for expandable properties */}
                  {schema.properties && (
                    <ExpandableResponseProperties
                      schema={schema}
                      schemaReferences={schemaReferences}
                    />
                  )}
                </div>
              ))
            ) : (
              <Text as="p" size="2" color="gray">
                No content
              </Text>
            )}
          </div>
        </div>

        {/* Example column */}
        <div className="flex-1 min-w-0 lg:max-w-md">
          {/* Request example */}
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 mb-1">
              {operation.summary} (example)
            </div>
            <pre className="p-4 bg-gray-900 text-gray-100 rounded-md text-sm overflow-x-auto">
              <code>
                {`curl -X ${methodType.toUpperCase()} ${baseUrl}${endpoint} \\
  -H "Authorization: Bearer sk_test_12345" \\
  -H "Content-Type: application/json"`}
                {requestBody?.example &&
                  ` \\
  -d '${JSON.stringify(requestBody.example, null, 2)}'`}
              </code>
            </pre>
          </div>

          {/* Response example */}
          {responseSchemas[0]?.example && (
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">
                Response
              </div>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-md text-sm overflow-x-auto">
                <code>{JSON.stringify(responseSchemas[0].example, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}

/**
 * Static parameter list - renders parameter documentation
 */
function ParameterList({
  parameters,
}: {
  parameters: OpenAPIV3.ParameterObject[];
}) {
  return (
    <div className="divide-y divide-gray-200">
      {parameters.map((param) => (
        <div key={param.name} className="py-3">
          <div className="flex items-center gap-2 mb-1">
            <code className="font-mono text-sm font-medium">{param.name}</code>
            {param.schema?.type && (
              <span className="text-xs text-gray-500">{param.schema.type}</span>
            )}
            {param.required && (
              <span className="text-xs text-red-500 font-medium">required</span>
            )}
          </div>
          {param.description && (
            <Text as="p" size="2" color="gray">
              {param.description}
            </Text>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Static schema property list - renders schema properties
 */
function SchemaPropertyList({
  schema,
  schemaReferences,
}: {
  schema: OpenAPIV3.SchemaObject;
  schemaReferences: Record<string, string>;
}) {
  const properties = schema.properties || {};
  const required = schema.required || [];

  return (
    <div className="divide-y divide-gray-200">
      {Object.entries(properties).map(([name, prop]) => {
        const propSchema = prop as OpenAPIV3.SchemaObject;
        const isRequired = required.includes(name);

        return (
          <div key={name} className="py-3">
            <div className="flex items-center gap-2 mb-1">
              <code className="font-mono text-sm font-medium">{name}</code>
              {propSchema.type && (
                <span className="text-xs text-gray-500">{propSchema.type}</span>
              )}
              {isRequired && (
                <span className="text-xs text-red-500 font-medium">required</span>
              )}
            </div>
            {propSchema.description && (
              <Text as="p" size="2" color="gray">
                {propSchema.description}
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );
}
