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
  "channels",
  "users",
  "objects",
  "tenants",
  "recipients",
  "schedules",
  "audiences",
  "bulk_operations",
  "providers",
  "$shared",
];

export const PRE_SIDEBAR_CONTENT: SidebarSection[] = [
  {
    title: "API Reference",
    slug: `/api-reference/overview`,
    pages: [
      { slug: "/", title: "Overview" },
      { slug: "/client-libraries", title: "Client libraries" },
      { slug: "/api-keys", title: "API keys" },
      { slug: "/authentication", title: "Authentication" },
      { slug: "/rate-limits", title: "Rate limits" },
      { slug: "/batch-rate-limits", title: "Batch rate limits" },
      { slug: "/idempotent-requests", title: "Idempotent requests" },
      { slug: "/data-retention", title: "Data retention" },
      { slug: "/bulk-endpoints", title: "Bulk endpoints" },
      { slug: "/trigger-data-filtering", title: "Trigger data filtering" },
      { slug: "/pagination", title: "Pagination" },
      { slug: "/errors", title: "Errors" },
      { slug: "/error-codes", title: "Common error codes" },
    ],
  },
];

function ApiReferencePage({ openApiSpec, stainlessSpec, preContentMdx }) {
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

export default ApiReferencePage;
