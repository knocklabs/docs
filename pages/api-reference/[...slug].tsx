import { readOpenApiSpec, readStainlessSpec } from "@/lib/openApiSpec";
import { OpenAPIV3 } from "@scalar/openapi-types";
import { SidebarSubsection } from "@/data/types";
import { CONTENT_DIR } from "@/lib/content.server";

import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import { RESOURCE_ORDER, PRE_SIDEBAR_CONTENT } from "./index";
import { getSidebarContent } from "@/components/ui/ApiReference/helpers";
import ApiReference from "@/components/ui/ApiReference/ApiReference";

function ApiReferencePage({ openApiSpec, stainlessSpec, preContentMdx }) {
  return (
    <ApiReference
      openApiSpec={openApiSpec}
      stainlessSpec={stainlessSpec}
      name="API"
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

        // Check if this is a section that might have its own page
        // If it has pages property and it's an array with items, it's a section
        const subSubPages = (subSubPage as SidebarSubsection).pages;
        if (subSubPages && subSubPages.length > 0) {
          // Add a path for the section itself (like /schemas)
          paths.push({
            params: {
              slug: [
                slug,
                subPage.slug.replace("/", ""),
                subSubPage.slug.replace("/", ""),
                "index", // We'll handle this special case in getStaticProps
              ],
            },
          });
        }

        // Add support for a fourth level - for schema objects
        for (const subSubSubPage of (subSubPage as SidebarSubsection).pages ??
          []) {
          paths.push({
            params: {
              slug: [
                slug,
                subPage.slug.replace("/", ""),
                subSubPage.slug.replace("/", ""),
                subSubSubPage.slug.replace("/", ""),
              ],
            },
          });
        }
      }
    }
  }

  return {
    paths,
    fallback: false,
  };
}

// At the top of the file (outside the function)
let cachedOpenApiSpec: any = null;
let cachedStainlessSpec: any = null;
let cachedPreContentMdx: any = null;

export async function getStaticProps() {
  if (!cachedOpenApiSpec) {
    cachedOpenApiSpec = await readOpenApiSpec("api");
  }
  if (!cachedStainlessSpec) {
    cachedStainlessSpec = await readStainlessSpec("api");
  }

  const preContent = fs.readFileSync(
    `${CONTENT_DIR}/__api-reference/content.mdx`,
  );

  if (!cachedPreContentMdx) {
    cachedPreContentMdx = await serialize(preContent, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeMdxCodeProps] as any,
      },
    });
  }

  return {
    props: {
      openApiSpec: cachedOpenApiSpec,
      stainlessSpec: cachedStainlessSpec,
      preContentMdx: cachedPreContentMdx,
    },
  };
}

export default ApiReferencePage;
