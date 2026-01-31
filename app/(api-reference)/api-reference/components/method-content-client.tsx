"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Section, ContentColumn, ExampleColumn } from "./api-sections";
import { RateLimitAppRouter } from "./rate-limit";
import { CodeBlock } from "../../../../components/ui/CodeBlock";

interface MethodContentClientProps {
  methodName: string;
  methodType: string;
  endpoint: string;
  path: string;
  mdPath: string;
  operation: Record<string, unknown>;
  baseUrl: string;
  schemaReferences: Record<string, string>;
}

export function MethodContentClient({
  methodName,
  methodType,
  endpoint,
  path,
  mdPath,
  operation,
  baseUrl,
  schemaReferences,
}: MethodContentClientProps) {
  const [isResponseExpanded, setIsResponseExpanded] = useState(false);

  const parameters = (operation.parameters as any[]) || [];
  const pathParameters = parameters.filter((p) => p.in === "path");
  const queryParameters = parameters.filter((p) => p.in === "query");

  const requestBody = (operation.requestBody as any)?.content?.[
    "application/json"
  ]?.schema;

  const responses = operation.responses as Record<string, any>;
  const responseSchemas = Object.values(responses || {})
    .map((r) => r.content?.["application/json"]?.schema)
    .filter((r) => !!r)
    .map((responseSchema: any) => {
      if (responseSchema?.allOf) {
        return responseSchema.allOf[0];
      }
      return responseSchema;
    });

  const rateLimitRaw = operation["x-ratelimit-tier"] as number | null;
  const rateLimit =
    rateLimitRaw && [1, 2, 3, 4, 5].includes(rateLimitRaw)
      ? (rateLimitRaw as 1 | 2 | 3 | 4 | 5)
      : null;
  const isIdempotent = (operation["x-idempotent"] as boolean) ?? false;
  const isRetentionSubject = (operation["x-retention-policy"] as boolean) ?? false;
  const isBeta = (operation["x-beta"] as boolean) ?? false;

  const snippets = operation["x-stainless-snippets"] as
    | Record<string, string>
    | undefined;

  const curlSnippet = `curl -X ${methodType.toUpperCase()} ${baseUrl}${endpoint} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345"${
    requestBody?.example
      ? ` \\
  -d '${JSON.stringify(requestBody.example)}'`
      : ""
  }`;

  const examples = { curl: curlSnippet, ...(snippets || {}) };

  return (
    <Section
      title={operation.summary as string}
      isIdempotent={isIdempotent}
      isRetentionSubject={isRetentionSubject}
      path={path}
      mdPath={mdPath}
    >
      <ContentColumn>
        <Markdown>{(operation.description as string) ?? ""}</Markdown>

        {isBeta && (
          <div className="my-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              🚧 This endpoint is currently in beta. If you'd like early
              access, or this is blocking your adoption of Knock, please{" "}
              <a
                href="mailto:support@knock.app?subject=Beta%20feature%20request"
                className="text-blue-600 underline"
              >
                get in touch
              </a>
              .
            </p>
          </div>
        )}

        <h3 className="text-lg font-medium mt-6 mb-2 pb-2 border-b border-gray-200">
          Endpoint
        </h3>

        <div className="flex items-center gap-3 py-2">
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded ${getMethodColor(
              methodType,
            )}`}
          >
            {methodType.toUpperCase()}
          </span>
          <code className="text-sm text-gray-700">{endpoint}</code>
        </div>

        {rateLimit && (
          <div className="mb-6 mt-1">
            <h3 className="text-base font-medium mb-1">Rate limit</h3>
            <RateLimitAppRouter tier={rateLimit} />
          </div>
        )}

        {pathParameters.length > 0 && (
          <>
            <h3 className="text-lg font-medium mt-6 mb-2 pb-2 border-b border-gray-200">
              Path parameters
            </h3>
            <ParameterList
              parameters={pathParameters}
              schemaReferences={schemaReferences}
            />
          </>
        )}

        {queryParameters.length > 0 && (
          <>
            <h3 className="text-lg font-medium mt-6 mb-2 pb-2 border-b border-gray-200">
              Query parameters
            </h3>
            <ParameterList
              parameters={queryParameters}
              schemaReferences={schemaReferences}
            />
          </>
        )}

        {requestBody && (
          <>
            <h3 className="text-lg font-medium mt-6 mb-2 pb-2 border-b border-gray-200">
              Request body
            </h3>
            <SchemaProperties
              schema={requestBody}
              schemaReferences={schemaReferences}
            />
          </>
        )}

        <h3 className="text-lg font-medium mt-6 mb-2 pb-2 border-b border-gray-200">
          Returns
        </h3>

        {responseSchemas.length > 0 ? (
          responseSchemas.map((responseSchema: any, index: number) => {
            const schemaRef = schemaReferences[responseSchema.title ?? ""];

            return (
              <div key={index} className="py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  {schemaRef ? (
                    <Link
                      href={schemaRef}
                      className="text-blue-600 hover:text-blue-700 font-mono text-sm"
                    >
                      {responseSchema.title}
                    </Link>
                  ) : (
                    <code className="text-sm">{responseSchema.title}</code>
                  )}
                </div>
                {responseSchema.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {responseSchema.description}
                  </p>
                )}

                {responseSchema.properties && (
                  <>
                    <button
                      onClick={() => setIsResponseExpanded(!isResponseExpanded)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
                      aria-expanded={isResponseExpanded}
                    >
                      {isResponseExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      {isResponseExpanded ? "Hide properties" : "Show properties"}
                    </button>

                    <AnimatePresence initial={false}>
                      {isResponseExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pl-4 border-l-2 border-gray-200">
                            <SchemaProperties
                              schema={responseSchema}
                              schemaReferences={schemaReferences}
                              hideRequired
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-3">
            {Object.entries(responses || {}).map(([statusCode, resp]: any) => (
              <code key={statusCode} className="text-sm font-semibold pl-0">
                {resp.description ? `${statusCode} ${resp.description}` : statusCode}
              </code>
            ))}
          </div>
        )}
      </ContentColumn>

      <ExampleColumn>
        <CodeBlock
          title={`${operation.summary} (example)`}
          language="curl"
          languages={Object.keys(examples)}
        >
          {examples.curl}
        </CodeBlock>
        {responseSchemas.map(
          (responseSchema: any) =>
            responseSchema?.example && (
              <CodeBlock
                key={responseSchema.title}
                title="Response"
                language="json"
                languages={["json"]}
              >
                {JSON.stringify(responseSchema?.example, null, 2)}
              </CodeBlock>
            ),
        )}
      </ExampleColumn>
    </Section>
  );
}

function ParameterList({
  parameters,
  schemaReferences,
}: {
  parameters: any[];
  schemaReferences: Record<string, string>;
}) {
  return (
    <div>
      {parameters.map((param) => {
        const schema = param.schema;
        const typeString = getTypeString(schema);
        const typeRef = schemaReferences[typeString];

        return (
          <div key={param.name} className="py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <code className="text-sm font-semibold">{param.name}</code>
              {typeRef ? (
                <Link
                  href={typeRef}
                  className="text-blue-600 hover:text-blue-700 font-mono text-xs"
                >
                  {typeString}
                </Link>
              ) : (
                <code className="text-xs text-gray-500">{typeString}</code>
              )}
              {param.required && (
                <span className="text-xs text-red-600">required</span>
              )}
            </div>
            {param.description && (
              <p className="text-sm text-gray-600">{param.description}</p>
            )}
            {schema?.enum && (
              <p className="text-xs text-gray-500 mt-1">
                One of: {schema.enum.map((e: string) => `"${e}"`).join(", ")}
              </p>
            )}
            {schema?.default !== undefined && (
              <p className="text-xs text-gray-500 mt-1">
                Default: {JSON.stringify(schema.default)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SchemaProperties({
  schema,
  schemaReferences,
  hideRequired = false,
}: {
  schema: any;
  schemaReferences: Record<string, string>;
  hideRequired?: boolean;
}) {
  if (!schema.properties) return null;

  return (
    <div>
      {Object.entries(schema.properties).map(([propName, propSchema]: any) => {
        const typeString = getTypeString(propSchema);
        const typeRef = schemaReferences[typeString];
        const isRequired =
          !hideRequired && schema.required?.includes(propName);

        return (
          <div key={propName} className="py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <code className="text-sm font-semibold">{propName}</code>
              {typeRef ? (
                <Link
                  href={typeRef}
                  className="text-blue-600 hover:text-blue-700 font-mono text-xs"
                >
                  {typeString}
                </Link>
              ) : (
                <code className="text-xs text-gray-500">{typeString}</code>
              )}
              {isRequired && (
                <span className="text-xs text-red-600">required</span>
              )}
              {propSchema.nullable && (
                <span className="text-xs text-gray-500">nullable</span>
              )}
            </div>
            {propSchema.description && (
              <p className="text-sm text-gray-600">{propSchema.description}</p>
            )}
            {propSchema.enum && (
              <p className="text-xs text-gray-500 mt-1">
                One of: {propSchema.enum.map((e: string) => `"${e}"`).join(", ")}
              </p>
            )}
            {propSchema.default !== undefined && (
              <p className="text-xs text-gray-500 mt-1">
                Default: {JSON.stringify(propSchema.default)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getMethodColor(method: string): string {
  switch (method.toLowerCase()) {
    case "get":
      return "bg-green-100 text-green-800";
    case "post":
      return "bg-blue-100 text-blue-800";
    case "put":
      return "bg-yellow-100 text-yellow-800";
    case "patch":
      return "bg-orange-100 text-orange-800";
    case "delete":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getTypeString(schema: any): string {
  if (!schema) return "unknown";
  if (schema.title) return schema.title;
  if (schema.type === "array" && schema.items) {
    return `${schema.items.title || schema.items.type || "unknown"}[]`;
  }
  return schema.type || "unknown";
}
