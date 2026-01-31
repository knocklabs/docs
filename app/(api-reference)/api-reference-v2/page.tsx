/**
 * API Reference Overview Page (Server Component)
 *
 * This page loads the OpenAPI spec on the server and renders the full
 * API reference. The spec data never leaves the server - only the
 * rendered HTML is sent to the client.
 *
 * Key differences from Pages Router:
 * - No getStaticProps - data loading happens in the component
 * - Spec is cached via React cache() - deduplicated across renders
 * - Client components are imported for interactive features
 */

import { Suspense } from "react";
import fs from "fs/promises";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

import {
  getOpenApiSpec,
  getStainlessSpec,
  buildSchemaReferences,
} from "../../../lib/openApiSpec.server";
import { CONTENT_DIR } from "../../../lib/content.server";
import {
  RESOURCE_ORDER,
  API_REFERENCE_OVERVIEW_CONTENT,
} from "../../../data/sidebars/apiOverviewSidebar";

import { ApiReferencePageClient } from "./api-reference-client";

// Generate static page at build time
export const dynamic = "force-static";

// Revalidate every hour (optional - for ISR)
export const revalidate = 3600;

export const metadata = {
  title: "API reference | Knock Docs",
  description: "Complete reference documentation for the Knock API.",
};

async function getPreContentMdx() {
  const preContent = await fs.readFile(
    `${CONTENT_DIR}/__api-reference/content.mdx`,
    "utf-8"
  );

  return serialize(preContent, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxCodeProps],
    },
  });
}

export default async function ApiReferencePage() {
  // These calls are cached - subsequent calls return the same promise
  const [openApiSpec, stainlessSpec, preContentMdx, schemaReferences] =
    await Promise.all([
      getOpenApiSpec("api"),
      getStainlessSpec("api"),
      getPreContentMdx(),
      buildSchemaReferences("api", "/api-reference-v2"),
    ]);

  const baseUrl = stainlessSpec.environments.production;

  return (
    <Suspense fallback={<ApiReferenceLoadingSkeleton />}>
      <ApiReferencePageClient
        name="API reference"
        openApiSpec={openApiSpec}
        stainlessSpec={stainlessSpec}
        preContentMdx={preContentMdx}
        resourceOrder={RESOURCE_ORDER}
        preSidebarContent={API_REFERENCE_OVERVIEW_CONTENT}
        baseUrl={baseUrl}
        schemaReferences={schemaReferences}
        basePath="api-reference-v2"
      />
    </Suspense>
  );
}

function ApiReferenceLoadingSkeleton() {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-50 animate-pulse" />
      <div className="flex-1 p-8">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-4 w-96 bg-gray-100 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
