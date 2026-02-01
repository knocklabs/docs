import Markdown from "react-markdown";
import { Heading } from "@telegraph/typography";
import {
  ContentColumn,
  ExampleColumn,
  Section,
} from "@/components/ui/ApiSections";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { SchemaProperties } from "@/components/ui/ApiReference/SchemaProperties";
import { LightweightApiReferenceProvider } from "@/components/ui/ApiReference/ApiReferenceContext";
import { SchemaPageData } from "@/lib/openApiSpec";

interface SchemaPageProps {
  data: SchemaPageData;
  schemaReferences: Record<string, string>;
}

/**
 * Displays a single API schema (object definition) with:
 * - Title and description
 * - Attributes/properties
 * - Example JSON
 */
export function SchemaPage({ data, schemaReferences }: SchemaPageProps) {
  const { schema, schemaName } = data;

  return (
    <LightweightApiReferenceProvider
      schemaReferences={schemaReferences}
      baseUrl=""
    >
      <Section title={schema.title || schemaName}>
        <ContentColumn>
          {schema.description && <Markdown>{schema.description}</Markdown>}

          <Heading
            as="h3"
            size="3"
            weight="medium"
            borderBottom="px"
            borderColor="gray-3"
            pb="2"
            mt="4"
          >
            Attributes
          </Heading>
          <SchemaProperties schema={schema} hideRequired />
        </ContentColumn>
        <ExampleColumn>
          {schema.example && (
            <CodeBlock
              title={schema.title || schemaName}
              language="json"
              languages={["json"]}
            >
              {JSON.stringify(schema.example, null, 2)}
            </CodeBlock>
          )}
        </ExampleColumn>
      </Section>
    </LightweightApiReferenceProvider>
  );
}

export default SchemaPage;
