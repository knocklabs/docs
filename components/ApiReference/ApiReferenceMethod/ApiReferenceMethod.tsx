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

type Props = {
  methodName: string;
  methodType: "get" | "post" | "put" | "delete";
  endpoint: string;
};

function ApiReferenceMethod({ methodName, methodType, endpoint }: Props) {
  const { openApiSpec, baseUrl } = useApiReference();
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
    <Section title={method.summary} slug={method.summary}>
      <ContentColumn>
        <Markdown>{method.description ?? ""}</Markdown>

        <h3 className="!text-sm font-medium">Endpoint</h3>

        <Endpoint
          method={methodType.toUpperCase()}
          path={endpoint}
          name={methodName}
        />

        {pathParameters.length > 0 && (
          <>
            <h3 className="!text-base font-medium">Path parameters</h3>
            <OperationParameters parameters={pathParameters} />
          </>
        )}

        {queryParameters.length > 0 && (
          <>
            <h3 className="!text-base font-medium">Query parameters</h3>
            <OperationParameters parameters={queryParameters} />
          </>
        )}

        {requestBody && (
          <>
            <h3 className="!text-base font-medium">Request body</h3>
            <SchemaProperties schema={requestBody} />
          </>
        )}

        <h3 className="!text-base font-medium">Returns</h3>

        {responseSchema && (
          <PropertyRow.Wrapper>
            <PropertyRow.Container>
              <PropertyRow.Header>
                <PropertyRow.Type>{responseSchema.title}</PropertyRow.Type>
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

                  {isResponseExpanded && (
                    <PropertyRow.ChildProperties>
                      <SchemaProperties schema={responseSchema} hideRequired />
                    </PropertyRow.ChildProperties>
                  )}
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
