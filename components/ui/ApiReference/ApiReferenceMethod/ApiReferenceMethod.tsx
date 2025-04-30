import type { OpenAPIV3 } from "@scalar/openapi-types";
import { useState } from "react";
import Markdown from "react-markdown";

import { Endpoint } from "../../Endpoints";
import { ContentColumn, ExampleColumn, Section } from "../../ApiSections";
import { CodeBlock } from "../../CodeBlock";
import { useApiReference } from "../ApiReferenceContext";
import { SchemaProperties } from "../SchemaProperties";
import OperationParameters from "../OperationParameters/OperationParameters";
import { PropertyRow } from "../SchemaProperties/PropertyRow";
import MultiLangExample from "../MultiLangExample";
import {
  augmentSnippetsWithCurlRequest,
  resolveResponseSchemas,
} from "../helpers";
import { Heading } from "@telegraph/typography";
import { AnimatePresence, motion } from "framer-motion";
import RateLimit from "@/components/ui/RateLimit";
import Callout from "@/components/ui/Callout";
import { Box } from "@telegraph/layout";

type Props = {
  methodName: string;
  methodType: "get" | "post" | "put" | "delete";
  endpoint: string;
  path?: string;
};

function ApiReferenceMethod({ methodName, methodType, endpoint, path }: Props) {
  const { openApiSpec, baseUrl, schemaReferences } = useApiReference();
  const [isResponseExpanded, setIsResponseExpanded] = useState(false);
  const method = openApiSpec.paths?.[endpoint]?.[methodType];

  if (!method) {
    return null;
  }

  const parameters = method.parameters || [];
  const responses = method.responses || {};

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
      isIdempotent={isIdempotent}
      isRetentionSubject={isRetentionSubject}
      path={path}
    >
      <ContentColumn>
        {isBeta && (
          <Callout
            emoji="🚧"
            text={
              <>
                This endpoint is currently in beta. If you'd like early access,
                or this is blocking your adoption of Knock, please{" "}
                <a href="mailto:support@knock.app?subject=Beta%20feature%20request">
                  get in touch
                </a>
                .
              </>
            }
          />
        )}
        <Markdown>{method.description ?? ""}</Markdown>

        <Heading
          as="h3"
          size="3"
          weight="medium"
          borderBottom="px"
          borderColor="gray-3"
          pb="2"
        >
          Endpoint
        </Heading>

        <Endpoint
          method={methodType.toUpperCase()}
          path={endpoint}
          name={methodName}
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
        >
          Returns
        </Heading>

        {responseSchemas.map((responseSchema) => (
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
                <Markdown>{responseSchema.description ?? ""}</Markdown>
              </PropertyRow.Description>

              {responseSchema.properties && (
                <>
                  <PropertyRow.ExpandableButton
                    isOpen={isResponseExpanded}
                    onClick={() => setIsResponseExpanded(!isResponseExpanded)}
                  >
                    {isResponseExpanded ? "Hide properties" : "Show properties"}
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
