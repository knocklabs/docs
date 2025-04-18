import { readOpenApiSpec, readStainlessSpec } from "../../lib/openApiSpec";
import ApiReference from "../../components/ApiReference/ApiReference";
import { getSidebarContent } from "../../components/ApiReference/helpers";
import { OpenAPIV3 } from "@scalar/openapi-types";
import { SidebarSubsection } from "../../data/types";
import { CONTENT_DIR } from "../../lib/content.server";

import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import { MDX_COMPONENTS } from "../[...slug]";
import { RESOURCE_ORDER, PRE_SIDEBAR_CONTENT } from "./index";

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

export async function getStaticPaths() {
  const openApiSpec = await readOpenApiSpec("api");
  const stainlessSpec = await readStainlessSpec("api");

  const paths: { params: { slug: string[] } }[] = [];
  const pages = getSidebarContent(
    openApiSpec as OpenAPIV3.Document,
    stainlessSpec,
    RESOURCE_ORDER,
    "/api-reference",
    PRE_SIDEBAR_CONTENT,
  );

  for (const page of pages) {
    const slug = page.slug.split("/").pop() as string;
    paths.push({ params: { slug: [slug] } });

    for (const subPage of page.pages) {
      paths.push({
        params: { slug: [slug, subPage.slug.replace("/", "")] },
      });

      for (const subSubPage of (subPage as SidebarSubsection).pages ?? []) {
        paths.push({
          params: {
            slug: [
              slug,
              subPage.slug.replace("/", ""),
              subSubPage.slug.replace("/", ""),
            ],
          },
        });
      }
    }
  }

  return {
    paths,
    fallback: false,
  };
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
