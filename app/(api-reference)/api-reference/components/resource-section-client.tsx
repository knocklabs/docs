"use client";

import React from "react";
import Markdown from "react-markdown";
import { Section, ContentColumn, ExampleColumn } from "./api-sections";
import { MethodContentClient } from "./method-content-client";
import { SchemaSectionClient } from "./schema-section-client";

interface EndpointData {
  methodName: string;
  methodType: string;
  endpoint: string;
}

interface MethodData {
  methodName: string;
  methodType: string;
  endpoint: string;
  path: string;
  mdPath: string;
  operation: Record<string, unknown>;
}

interface SchemaData {
  modelName: string;
  path: string;
  mdPath: string;
  schema: Record<string, unknown>;
}

interface SubresourceData {
  name: string;
  description?: string;
  path: string;
  mdPath: string;
  endpoints: EndpointData[];
  methods: MethodData[];
  schemas: SchemaData[];
}

interface ResourceSectionClientProps {
  name: string;
  description?: string;
  path: string;
  mdPath: string;
  endpoints: EndpointData[];
  methods: MethodData[];
  schemas: SchemaData[];
  subresources: SubresourceData[];
  baseUrl: string;
  schemaReferences: Record<string, string>;
}

export function ResourceSectionClient({
  name,
  description,
  path,
  mdPath,
  endpoints,
  methods,
  schemas,
  subresources,
  baseUrl,
  schemaReferences,
}: ResourceSectionClientProps) {
  return (
    <>
      <div data-resource-path={path}>
        <Section title={name} path={path} mdPath={mdPath}>
          <ContentColumn>
            {description && <Markdown>{description}</Markdown>}
          </ContentColumn>
          <ExampleColumn>
            {endpoints.length > 0 && (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-200">
                  Endpoints
                </div>
                <div className="divide-y divide-gray-100">
                  {endpoints.map(({ methodName, methodType, endpoint }) => (
                    <div
                      key={`${methodName}-${endpoint}`}
                      className="px-4 py-2 flex items-center gap-3"
                    >
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${getMethodColor(
                          methodType,
                        )}`}
                      >
                        {methodType.toUpperCase()}
                      </span>
                      <code className="text-sm text-gray-700">{endpoint}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ExampleColumn>
        </Section>
      </div>

      {methods.map((method) => (
        <div key={`${method.methodName}-${method.endpoint}`} data-resource-path={method.path}>
          <MethodContentClient
            {...method}
            baseUrl={baseUrl}
            schemaReferences={schemaReferences}
          />
        </div>
      ))}

      {subresources.map((subresource) => (
        <React.Fragment key={subresource.path}>
          <div data-resource-path={subresource.path}>
            <Section
              title={subresource.name}
              path={subresource.path}
              mdPath={subresource.mdPath}
            >
              <ContentColumn>
                {subresource.description && (
                  <Markdown>{subresource.description}</Markdown>
                )}
              </ContentColumn>
              <ExampleColumn>
                {subresource.endpoints.length > 0 && (
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-200">
                      Endpoints
                    </div>
                    <div className="divide-y divide-gray-100">
                      {subresource.endpoints.map(
                        ({ methodName, methodType, endpoint }) => (
                          <div
                            key={`${methodName}-${endpoint}`}
                            className="px-4 py-2 flex items-center gap-3"
                          >
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded ${getMethodColor(
                                methodType,
                              )}`}
                            >
                              {methodType.toUpperCase()}
                            </span>
                            <code className="text-sm text-gray-700">
                              {endpoint}
                            </code>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </ExampleColumn>
            </Section>
          </div>

          {subresource.methods.map((method) => (
            <div
              key={`${method.methodName}-${method.endpoint}`}
              data-resource-path={method.path}
            >
              <MethodContentClient
                {...method}
                baseUrl={baseUrl}
                schemaReferences={schemaReferences}
              />
            </div>
          ))}

          {subresource.schemas.map((schema) => (
            <div key={schema.modelName} data-resource-path={schema.path}>
              <SchemaSectionClient
                {...schema}
                schemaReferences={schemaReferences}
              />
            </div>
          ))}
        </React.Fragment>
      ))}

      {schemas.map((schema) => (
        <div key={schema.modelName} data-resource-path={schema.path}>
          <SchemaSectionClient
            {...schema}
            schemaReferences={schemaReferences}
          />
        </div>
      ))}
    </>
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
