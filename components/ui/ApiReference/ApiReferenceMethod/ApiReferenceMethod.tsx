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
import { augmentSnippetsWithCurlRequest } from "../helpers";
import { Heading } from "@telegraph/typography";
import { AnimatePresence, motion } from "framer-motion";

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
  const response = responses[Object.keys(responses)[0]];

  const pathParameters = parameters.filter(
    (p) => p.in === "path",
  ) as OpenAPIV3.ParameterObject[];
  const queryParameters = parameters.filter(
    (p) => p.in === "query",
  ) as OpenAPIV3.ParameterObject[];

  const responseSchema: OpenAPIV3.SchemaObject | undefined =
    response?.content?.["application/json"]?.schema;
  const requestBody: OpenAPIV3.SchemaObject | undefined =
    method.requestBody?.content?.["application/json"]?.schema;

  return (
    <Section title={method.summary} path={path}>
      <ContentColumn>
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

        {responseSchema && (
          <PropertyRow.Wrapper>
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
        )}
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
        {responseSchema?.example && (
          <CodeBlock title="Response" language="json" languages={["json"]}>
            {JSON.stringify(responseSchema?.example, null, 2)}
          </CodeBlock>
        )}
      </ExampleColumn>
    </Section>
  );
}

export default ApiReferenceMethod;
