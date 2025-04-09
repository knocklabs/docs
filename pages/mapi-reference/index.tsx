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
  "environments",
  "channels",
  "workflows",
  "email_layouts",
  "translations",
  "partials",
  "commits",
  "variables",
  "templates",
  "message_types",
];

export const PRE_SIDEBAR_CONTENT: SidebarSection[] = [
  {
    title: "API Reference",
    slug: `/mapi-reference/overview`,
    pages: [
      {
        title: "Overview",
        slug: `/`,
      },
      {
        title: "Authentication",
        slug: `/authentication`,
      },
      {
        title: "Errors",
        slug: `/errors`,
      },
      {
        title: "Postman",
        slug: `/postman`,
      },
    ],
  },
];

function ManagementApiReferenceNew({
  openApiSpec,
  stainlessSpec,
  preContentMdx,
}) {
  return (
    <ApiReference
      name="Management API"
      openApiSpec={openApiSpec}
      stainlessSpec={stainlessSpec}
      preContent={<MDXRemote {...preContentMdx} components={MDX_COMPONENTS} />}
      resourceOrder={RESOURCE_ORDER}
      preSidebarContent={PRE_SIDEBAR_CONTENT}
    />
  );
}

export async function getStaticProps() {
  const openApiSpec = await readOpenApiSpec("mapi");
  const stainlessSpec = await readStainlessSpec("mapi");

  const preContent = fs.readFileSync(
    `${CONTENT_DIR}/__mapi-reference/content.mdx`,
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

export default ManagementApiReferenceNew;
