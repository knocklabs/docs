import { readOpenApiSpec, readStainlessSpec } from "../../lib/openApiSpec";
import ApiReference from "../../components/ui/ApiReference/ApiReference";
import { getSidebarContent } from "../../components/ui/ApiReference/helpers";
import { OpenAPIV3 } from "@scalar/openapi-types";
import { SidebarSubsection } from "../../data/types";
import { CONTENT_DIR } from "../../lib/content.server";

import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import {
  MAPI_REFERENCE_OVERVIEW_CONTENT,
  RESOURCE_ORDER,
} from "../../data/sidebars/mapiOverviewSidebar";

function ManagementApiReferencePage({
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
      preSidebarContent={MAPI_REFERENCE_OVERVIEW_CONTENT}
    />
  );
}

export async function getStaticPaths() {
  const openApiSpec = await readOpenApiSpec("mapi");
  const stainlessSpec = await readStainlessSpec("mapi");

  const paths: { params: { slug: string[] } }[] = [];
  const pages = getSidebarContent(
    openApiSpec as OpenAPIV3.Document,
    stainlessSpec,
    RESOURCE_ORDER,
    "/mapi-reference",
    MAPI_REFERENCE_OVERVIEW_CONTENT,
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

// At the top of the file (outside the function)
let cachedOpenApiSpecMapi: any = null;
let cachedStainlessSpecMapi: any = null;
let cachedPreContentMdxMapi: any = null;

export async function getStaticProps() {
  if (!cachedOpenApiSpecMapi) {
    cachedOpenApiSpecMapi = await readOpenApiSpec("mapi");
  }
  if (!cachedStainlessSpecMapi) {
    cachedStainlessSpecMapi = await readStainlessSpec("mapi");
  }

  const preContent = fs.readFileSync(
    `${CONTENT_DIR}/__mapi-reference/content.mdx`,
  );

  if (!cachedPreContentMdxMapi) {
    cachedPreContentMdxMapi = await serialize(preContent.toString(), {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeMdxCodeProps],
      },
    });
  }

  return {
    props: {
      openApiSpec: cachedOpenApiSpecMapi,
      stainlessSpec: cachedStainlessSpecMapi,
      preContentMdx: cachedPreContentMdxMapi,
    },
  };
}

export default ManagementApiReferencePage;
