import { readFile } from "fs/promises";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import { CONTENT_DIR } from "../../../../lib/content.server";
import { Section, ContentColumn, ExampleColumn } from "../../../../components/ui/ApiSections";
import { CodeBlock } from "../../../../components/ui/CodeBlock";
import { Callout } from "../../../../components/ui/Callout";
import { Endpoints, Endpoint } from "../../../../components/ui/Endpoints";
import { Table } from "../../../../components/ui/Table";
import RateLimit from "../../../../components/ui/RateLimit";
import { Attributes, Attribute } from "../../../../components/ui/Attributes";
import { ErrorExample } from "../../../../components/ui/ApiSections";
import MultiLangCodeBlock from "../../../../components/ui/MultiLangCodeBlock";
import type { SpecName } from "../../../../lib/openapi/types";

const MDX_COMPONENTS = {
  Section,
  ContentColumn,
  ExampleColumn,
  CodeBlock,
  Callout,
  Endpoints,
  Endpoint,
  Table,
  RateLimit,
  Attributes,
  Attribute,
  ErrorExample,
  MultiLangCodeBlock,
};

interface PreContentProps {
  specName: SpecName;
}

export async function PreContent({ specName }: PreContentProps) {
  const contentPath =
    specName === "api"
      ? `${CONTENT_DIR}/__api-reference/content.mdx`
      : `${CONTENT_DIR}/__mapi-reference/content.mdx`;

  const content = await readFile(contentPath, "utf8");

  return (
    <MDXRemote
      source={content}
      components={MDX_COMPONENTS}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeMdxCodeProps as any],
        },
      }}
    />
  );
}
