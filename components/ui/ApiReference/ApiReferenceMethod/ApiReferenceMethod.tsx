import type { OpenAPIV3 } from "@scalar/openapi-types";
import { useState } from "react";
import Markdown from "react-markdown";

import { Callout } from "@/components/ui/Callout";
import RateLimit from "@/components/ui/RateLimit";
import { Box, Stack } from "@telegraph/layout";
import { Code, Heading } from "@telegraph/typography";
import { AnimatePresence, motion } from "framer-motion";
import { ContentColumn, ExampleColumn, Section } from "../../ApiSections";
import { CodeBlock } from "../../CodeBlock";
import { Endpoint } from "../../Endpoints";
import { useApiReference } from "../ApiReferenceContext";
import MultiLangExample from "../MultiLangExample";
import OperationParameters from "../OperationParameters/OperationParameters";
import { SchemaProperties } from "../SchemaProperties";
import { PropertyRow } from "../SchemaProperties/PropertyRow";
import {
  augmentSnippetsWithCurlRequest,
  formatResponseStatusCodes,
  resolveResponseSchemas,
} from "../helpers";

type Props = {
  methodName: string;
  methodType: "get" | "post" | "put" | "delete";
  endpoint: string;
  path?: string;
  mdPath?: string;
};

function ApiReferenceMethod({
  methodName,
  methodType,
  endpoint,
  path,
  mdPath,
}: Props) {
  const { openApiSpec, baseUrl, schemaReferences } = useApiReference();
  const [isResponseExpanded, setIsResponseExpanded] = useState(false);
  const method = openApiSpec.paths?.[endpoint]?.[methodType];

  if (!method) {
    return null;
  }

  const parameters = method.parameters || [];

  const pathParameters = parameters.filter(
    (p) => p.in === "path",
  ) as OpenAPIV3.ParameterObject[];
  const queryParameters = parameters.filter(
    (p) => p.in === "query",
  ) as OpenAPIV3.ParameterObject[];

  const responseSchemas: OpenAPIV3.SchemaObject[] =
    resolveResponseSchemas(method);

  const requestBody: OpenAPIV3.SchemaObject | undefined =
    method.requestBody?.content?.["application/json"]?.schema;

  const rateLimit = method?.["x-ratelimit-tier"] ?? null;
  const isIdempotent = method?.["x-idempotent"] ?? false;
  const isRetentionSubject = method?.["x-retention-policy"] ?? false;
  const isBeta = method?.["x-beta"] ?? false;

  return (
    <Section
      title={method.summary}
      description={
        <>
          <Markdown>{method.description ?? ""}</Markdown>
          {isBeta && (
            <Callout
              emoji="🚧"
              bgColor="blue"
              text={
                <>
                  This endpoint is currently in beta. If you'd like early
                  access, or this is blocking your adoption of Knock, please{" "}
                  <a href="mailto:support@knock.app?subject=Beta%20feature%20request">
                    get in touch
                  </a>
                  .
                </>
              }
            />
          )}
        </>
      }
      isIdempotent={isIdempotent}
      isRetentionSubject={isRetentionSubject}
      path={path}
      mdPath={mdPath}
    >
      <ContentColumn>
        <Stack direction="column" gap="6">
          <Stack direction="column" gap="2">
            <Heading as="h3" size="2" weight="medium">
              Endpoint
            </Heading>
            <Stack direction="row" gap="1">
              <Endpoint
                method={methodType.toUpperCase()}
                path={endpoint}
                name={methodName}
              />

              {rateLimit && (
                <Box ml="auto">
                  <RateLimit tier={rateLimit} />
                </Box>
              )}
            </Stack>
          </Stack>

          {pathParameters.length > 0 && (
            <Stack direction="column" gap="1">
              <Heading as="h3" size="2" weight="medium">
                Path parameters
              </Heading>
              <OperationParameters parameters={pathParameters} />
            </Stack>
          )}

          {queryParameters.length > 0 && (
            <Stack direction="column" gap="1">
              <Heading as="h3" size="2" weight="medium">
                Query parameters
              </Heading>
              <OperationParameters parameters={queryParameters} />
            </Stack>
          )}

          {requestBody && (
            <Stack direction="column" gap="1">
              <Heading as="h3" size="2" weight="medium">
                Request body
              </Heading>
              <SchemaProperties schema={requestBody} />
            </Stack>
          )}

          <Stack direction="column" gap="1">
            <Heading as="h3" size="2" weight="medium">
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
                          onClick={() =>
                            setIsResponseExpanded(!isResponseExpanded)
                          }
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
                              visibility: isResponseExpanded
                                ? "visible"
                                : "hidden",
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
              <Box>
                {formatResponseStatusCodes(method).map(
                  (formattedStatus, index) => (
                    <Code
                      key={`response-status-${index}`}
                      as="span"
                      size="1"
                      pl="0"
                      weight="semi-bold"
                    >
                      {formattedStatus}
                    </Code>
                  ),
                )}
              </Box>
            )}
          </Stack>
        </Stack>
      </ContentColumn>
      <ExampleColumn>
        <MultiLangExample
          title={`${method.summary} (example)`}
          examples={augmentSnippetsWithCurlRequest(
            method["x-stainless-snippets"],
            {
              baseUrl,
              methodType,
              endpoint,
              body: requestBody?.example,
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

export default ApiReferenceMethod;
