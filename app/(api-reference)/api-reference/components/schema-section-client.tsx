"use client";

import Markdown from "react-markdown";
import Link from "next/link";
import { Section, ContentColumn, ExampleColumn } from "./api-sections";
import { CodeBlock } from "../../../../components/ui/CodeBlock";

interface SchemaSectionClientProps {
  modelName: string;
  path: string;
  mdPath: string;
  schema: Record<string, unknown>;
  schemaReferences: Record<string, string>;
}

export function SchemaSectionClient({
  modelName,
  path,
  mdPath,
  schema,
  schemaReferences,
}: SchemaSectionClientProps) {
  const title = (schema.title as string) || modelName;
  const description = schema.description as string | undefined;
  const properties = schema.properties as Record<string, any> | undefined;
  const required = schema.required as string[] | undefined;
  const example = schema.example;

  return (
    <Section title={title} path={path} mdPath={mdPath}>
      <ContentColumn>
        {description && <Markdown>{description}</Markdown>}

        <h3 className="text-lg font-medium mt-4 mb-2 pb-2 border-b border-gray-200">
          Attributes
        </h3>

        {properties && (
          <div>
            {Object.entries(properties).map(([propName, propSchema]) => {
              const typeString = getTypeString(propSchema);
              const typeRef = schemaReferences[typeString];
              const isRequired = required?.includes(propName);

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
                      <code className="text-xs text-gray-500">
                        {typeString}
                      </code>
                    )}
                    {isRequired && (
                      <span className="text-xs text-red-600">required</span>
                    )}
                    {propSchema.nullable && (
                      <span className="text-xs text-gray-500">nullable</span>
                    )}
                  </div>
                  {propSchema.description && (
                    <p className="text-sm text-gray-600">
                      {propSchema.description}
                    </p>
                  )}
                  {propSchema.enum && (
                    <p className="text-xs text-gray-500 mt-1">
                      One of:{" "}
                      {propSchema.enum.map((e: string) => `"${e}"`).join(", ")}
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
        )}
      </ContentColumn>
      <ExampleColumn>
        {example !== undefined && example !== null ? (
          <CodeBlock title={title} language="json" languages={["json"]}>
            {JSON.stringify(example, null, 2)}
          </CodeBlock>
        ) : (
          <div className="text-sm text-gray-500">No example available</div>
        )}
      </ExampleColumn>
    </Section>
  );
}

function getTypeString(schema: any): string {
  if (!schema) return "unknown";
  if (schema.title) return schema.title;
  if (schema.type === "array" && schema.items) {
    return `${schema.items.title || schema.items.type || "unknown"}[]`;
  }
  return schema.type || "unknown";
}
