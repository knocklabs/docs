import { useState } from "react";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import Markdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";

import { Callout } from "@/components/ui/Callout";
import RateLimit from "@/components/ui/RateLimit";
import { Box, Stack } from "@telegraph/layout";
import { Code, Heading, Text } from "@telegraph/typography";
import { ContentColumn, ExampleColumn, Section } from "@/components/ui/ApiSections";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Endpoint } from "@/components/ui/Endpoints";
import MultiLangExample from "@/components/ui/ApiReference/MultiLangExample";
import OperationParameters from "@/components/ui/ApiReference/OperationParameters/OperationParameters";
import { SchemaProperties } from "@/components/ui/ApiReference/SchemaProperties";
import { PropertyRow } from "@/components/ui/ApiReference/SchemaProperties/PropertyRow";
import {
  augmentSnippetsWithCurlRequest,
  formatResponseStatusCodes,
  resolveResponseSchemas,
} from "@/components/ui/ApiReference/helpers";
import { MethodPageData } from "@/lib/openApiSpec";

interface MethodPageProps {
  data: MethodPageData;
  schemaReferences: Record<string, string>;
}

/**
 * Displays a single API method with all its details:
 * - Description
 * - Endpoint
 * - Rate limits
 * - Path/query parameters
 * - Request body
 * - Response schema
 * - Code examples
 */
export function MethodPage({ data, schemaReferences }: MethodPageProps) {
  const { operation, methodType, endpoint, baseUrl } = data;
  const [isResponseExpanded, setIsResponseExpanded] = useState(false);

  const parameters = operation.parameters || [];

  const pathParameters = parameters.filter(
    (p) => (p as OpenAPIV3.ParameterObject).in === "path",
  ) as OpenAPIV3.ParameterObject[];

  const queryParameters = parameters.filter(
    (p) => (p as OpenAPIV3.ParameterObject).in === "query",
  ) as OpenAPIV3.ParameterObject[];

  const responseSchemas: OpenAPIV3.SchemaObject[] =
    resolveResponseSchemas(operation);

  const requestBody: OpenAPIV3.SchemaObject | undefined = (
    operation.requestBody as OpenAPIV3.RequestBodyObject
  )?.content?.["application/json"]?.schema as OpenAPIV3.SchemaObject | undefined;

  const rateLimitRaw = (operation as Record<string, unknown>)?.["x-ratelimit-tier"] as number | null ?? null;
  const rateLimit = rateLimitRaw as 1 | 2 | 3 | 4 | 5 | null;
  const isIdempotent = (operation as Record<string, unknown>)?.["x-idempotent"] as boolean ?? false;
  const isRetentionSubject = (operation as Record<string, unknown>)?.["x-retention-policy"] as boolean ?? false;
  const isBeta = (operation as Record<string, unknown>)?.["x-beta"] as boolean ?? false;

  return (
    <Section
      title={operation.summary}
      isIdempotent={isIdempotent}
      isRetentionSubject={isRetentionSubject}
    >
      <ContentColumn>
        <Markdown>{operation.description ?? ""}</Markdown>
        {isBeta && (
          <Callout
            emoji="🚧"
            bgColor="blue"
            text={
              <>
                This endpoint is currently in beta. If you&apos;d like early access,
                or this is blocking your adoption of Knock, please{" "}
                <a href="mailto:support@knock.app?subject=Beta%20feature%20request">
                  get in touch
                </a>
                .
              </>
            }
          />
        )}

        <Heading
          as="h3"
          size="3"
          weight="medium"
          borderBottom="px"
          borderColor="gray-3"
          pb="2"
          mt="4"
        >
          Endpoint
        </Heading>

        <Endpoint
          method={methodType.toUpperCase()}
          path={endpoint}
          name={data.methodName}
        />

        {rateLimit && (
          <Box mb="6" mt="1">
            <Heading as="h3" weight="medium" size="3" mb="1">
              Rate limit
            </Heading>
            <RateLimit tier={rateLimit} />
          </Box>
        )}

        {pathParameters.length > 0 && (
          <>
            <Heading
              as="h3"
              size="3"
              weight="medium"
              borderBottom="px"
              borderColor="gray-3"
              pb="2"
              mt="6"
            >
              Path parameters
            </Heading>
            <OperationParameters parameters={pathParameters} />
          </>
        )}

        {queryParameters.length > 0 && (
          <>
            <Heading
              as="h3"
              size="3"
              weight="medium"
              borderBottom="px"
              borderColor="gray-3"
              pb="2"
              mt="6"
            >
              Query parameters
            </Heading>
            <OperationParameters parameters={queryParameters} />
          </>
        )}

        {requestBody && (
          <>
            <Heading
              as="h3"
              size="3"
              weight="medium"
              borderBottom="px"
              borderColor="gray-3"
              pb="2"
              mt="6"
            >
              Request body
            </Heading>
            <SchemaProperties schema={requestBody} />
          </>
        )}

        <Heading
          as="h3"
          size="3"
          weight="medium"
          borderBottom="px"
          borderColor="gray-3"
          pb="2"
          mt="6"
        >
          Returns
        </Heading>

        {responseSchemas.length > 0 &&
          responseSchemas.map((responseSchema) => (
            <PropertyRow.Wrapper key={responseSchema.title}>
              <PropertyRow.Container>
                <PropertyRow.Header>
                  <PropertyRow.Type
                    href={schemaReferences[responseSchema.title ?? ""]}
                  >
                    {responseSchema.title}
                  </PropertyRow.Type>
                </PropertyRow.Header>
                <PropertyRow.Description>
                  {responseSchema.description ?? ""}
                </PropertyRow.Description>

                {responseSchema.properties && (
                  <>
                    <PropertyRow.ExpandableButton
                      isOpen={isResponseExpanded}
                      onClick={() => setIsResponseExpanded(!isResponseExpanded)}
                    >
                      {isResponseExpanded
                        ? "Hide properties"
                        : "Show properties"}
                    </PropertyRow.ExpandableButton>

                    <AnimatePresence initial={false}>
                      <motion.div
                        key="response-properties"
                        initial={false}
                        animate={{
                          height: isResponseExpanded ? "auto" : 0,
                          opacity: isResponseExpanded ? 1 : 0,
                          visibility: isResponseExpanded ? "visible" : "hidden",
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <PropertyRow.ChildProperties>
                          <SchemaProperties
                            schema={responseSchema}
                            hideRequired
                          />
                        </PropertyRow.ChildProperties>
                      </motion.div>
                    </AnimatePresence>
                  </>
                )}
              </PropertyRow.Container>
            </PropertyRow.Wrapper>
          ))}

        {responseSchemas.length === 0 && (
          <Box py="3">
            {formatResponseStatusCodes(operation).map((formattedStatus, index) => (
              <Code
                key={`response-status-${index}`}
                as="span"
                size="1"
                pl="0"
                weight="semi-bold"
              >
                {formattedStatus}
              </Code>
            ))}
          </Box>
        )}
      </ContentColumn>
      <ExampleColumn>
        <MultiLangExample
          title={`${operation.summary} (example)`}
          examples={augmentSnippetsWithCurlRequest(
            (operation as Record<string, unknown>)["x-stainless-snippets"] as Record<string, string> || {},
            {
              baseUrl,
              methodType,
              endpoint,
              body: requestBody?.example as Record<string, unknown> | undefined,
            },
          )}
        />
        {responseSchemas.map(
          (responseSchema) =>
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

export default MethodPage;
