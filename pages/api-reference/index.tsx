import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

import { readOpenApiSpec, readStainlessSpec } from "../../lib/openApiSpec";
import ApiReference from "../../components/ApiReference/ApiReference";
import { CONTENT_DIR } from "../../lib/content.server";
import { MDX_COMPONENTS } from "../[...slug]";
import { SidebarSection } from "../../data/types";

export const RESOURCE_ORDER = [
  "workflows",
  "messages",
  "recipients",
  "users",
  "objects",
  "tenants",
  "schedules",
  "bulk_operations",
  "audiences",
  "providers",
];

export const PRE_SIDEBAR_CONTENT: SidebarSection[] = [
  {
    title: "API Reference",
    slug: `/api-reference/overview`,
    pages: [
      {
        title: "Overview",
        slug: `/`,
      },
      {
        title: "Client libraries",
        slug: `/client-libraries`,
      },
      {
        title: "API keys",
        slug: `/api-keys`,
      },
      {
        title: "Authentication",
        slug: `/authentication`,
      },
      {
        title: "Rate limits",
        slug: `/rate-limits`,
      },
      {
        title: "Batch rate limits",
        slug: `/batch-rate-limits`,
      },
      {
        title: "Idempotent requests",
        slug: `/idempotent-requests`,
      },
      {
        title: "Data retention",
        slug: `/data-retention`,
      },
      {
        title: "Bulk endpoints",
        slug: `/bulk-endpoints`,
      },
      {
        title: "Trigger data filtering",
        slug: `/trigger-data-filtering`,
      },
      {
        title: "Pagination",
        slug: `/pagination`,
      },
      {
        title: "Errors",
        slug: `/errors`,
      },
      {
        title: "Error codes",
        slug: `/error-codes`,
      },
    ],
  },
];

function ApiReferenceNew({ openApiSpec, stainlessSpec, preContentMdx }) {
  return (
    <ApiReference
      name="API"
      openApiSpec={openApiSpec}
      stainlessSpec={stainlessSpec}
      preContent={<MDXRemote {...preContentMdx} components={MDX_COMPONENTS} />}
      resourceOrder={RESOURCE_ORDER}
      preSidebarContent={PRE_SIDEBAR_CONTENT}
    />
  );
}

export async function getStaticProps() {
  const openApiSpec = await readOpenApiSpec("api");
  const stainlessSpec = await readStainlessSpec("api");

  const preContent = fs.readFileSync(
    `${CONTENT_DIR}/__api-reference/content.mdx`,
  );

  const preContentMdx = await serialize(preContent, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxCodeProps] as any,
    },
  });

  return { props: { openApiSpec, stainlessSpec, preContentMdx } };
}

export default ApiReferenceNew;
