import type { OpenAPIV3 } from "@scalar/openapi-types";
import Markdown from "react-markdown";
import { Box } from "@telegraph/layout";
import { Code, Heading } from "@telegraph/typography";
import { Callout } from "../../../../components/ui/Callout";
import { ContentColumn, ExampleColumn, Section } from "./api-sections";
import { RateLimitAppRouter } from "./rate-limit";
import { CodeBlock } from "../../../../components/ui/CodeBlock";
import { Endpoint } from "../../../../components/ui/Endpoints";
import { getOpenApiSpec } from "../../../../lib/openapi/loader";
import {
  getOperation,
  augmentSnippetsWithCurlRequest,
  formatResponseStatusCodes,
  resolveResponseSchemas,
} from "../../../../lib/openapi/helpers";
import type { SpecName } from "../../../../lib/openapi/types";
import { OperationParametersServer } from "./operation-parameters-server";
import { SchemaPropertiesServer } from "./schema-properties-server";
import { ExpandableResponse } from "./expandable-response";
import { MultiLangExampleServer } from "./multi-lang-example-server";

interface MethodContentProps {
  specName: SpecName;
  methodName: string;
  methodType: "get" | "post" | "put" | "delete";
  endpoint: string;
  path: string;
  mdPath: string;
  baseUrl: string;
  schemaReferences: Record<string, string>;
}

export async function MethodContent({
  specName,
  methodName,
  methodType,
  endpoint,
  path,
  mdPath,
  baseUrl,
  schemaReferences,
}: MethodContentProps) {
  const openApiSpec = await getOpenApiSpec(specName);
  const method = getOperation(openApiSpec, methodType, endpoint);

  if (!method) {
    return null;
  }

  const parameters = (method.parameters || []) as OpenAPIV3.ParameterObject[];
  const pathParameters = parameters.filter((p) => p.in === "path");
  const queryParameters = parameters.filter((p) => p.in === "query");

  const responseSchemas = resolveResponseSchemas(method);
  const requestBody = (
    method.requestBody as OpenAPIV3.RequestBodyObject | undefined
  )?.content?.["application/json"]?.schema as
    | OpenAPIV3.SchemaObject
    | undefined;

  const rateLimitRaw = (method as Record<string, unknown>)?.[
    "x-ratelimit-tier"
  ] as number | null;
  const rateLimit =
    rateLimitRaw && [1, 2, 3, 4, 5].includes(rateLimitRaw)
      ? (rateLimitRaw as 1 | 2 | 3 | 4 | 5)
      : null;
  const isIdempotent =
    ((method as Record<string, unknown>)?.["x-idempotent"] as boolean) ?? false;
  const isRetentionSubject =
    ((method as Record<string, unknown>)?.["x-retention-policy"] as boolean) ??
    false;
  const isBeta =
    ((method as Record<string, unknown>)?.["x-beta"] as boolean) ?? false;

  const snippets = (method as Record<string, unknown>)?.[
    "x-stainless-snippets"
  ] as Record<string, string> | undefined;

  return (
    <Section
      title={method.summary}
      isIdempotent={isIdempotent}
      isRetentionSubject={isRetentionSubject}
      path={path}
      mdPath={mdPath}
    >
      <ContentColumn>
        <Markdown>{method.description ?? ""}</Markdown>
        {isBeta && (
          <Callout
            emoji="🚧"
            bgColor="blue"
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
          name={methodName}
        />

        {rateLimit && (
          <Box mb="6" mt="1">
            <Heading as="h3" weight="medium" size="3" mb="1">
              Rate limit
            </Heading>
            <RateLimitAppRouter tier={rateLimit} />
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
            <OperationParametersServer
              parameters={pathParameters}
              schemaReferences={schemaReferences}
            />
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
            <OperationParametersServer
              parameters={queryParameters}
              schemaReferences={schemaReferences}
            />
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
            <SchemaPropertiesServer
              schema={requestBody}
              schemaReferences={schemaReferences}
            />
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
            <ExpandableResponse
              key={responseSchema.title}
              responseSchema={responseSchema}
              schemaReferences={schemaReferences}
            />
          ))}

        {responseSchemas.length === 0 && (
          <Box py="3">
            {formatResponseStatusCodes(method).map((formattedStatus, index) => (
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
        <MultiLangExampleServer
          title={`${method.summary} (example)`}
          examples={augmentSnippetsWithCurlRequest(snippets, {
            baseUrl,
            methodType,
            endpoint,
            body: requestBody?.example,
          })}
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
