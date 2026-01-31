/**
 * OPTIMIZED API Reference Page (Full Server Component Approach)
 *
 * This demonstrates the ideal end-state where the OpenAPI spec
 * stays entirely on the server. The spec is processed during
 * rendering and only the final HTML is sent to the client.
 *
 * Benefits:
 * - Zero JS payload for static content
 * - Spec never serialized to client
 * - Can use streaming for faster TTFB
 * - Memory-efficient for large specs
 *
 * Trade-offs:
 * - Interactive features need careful client/server splitting
 * - More granular component architecture required
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
  resolveEndpointFromMethod,
} from "../../../../lib/openApiSpec.server";
import { CONTENT_DIR } from "../../../../lib/content.server";
import {
  RESOURCE_ORDER,
  API_REFERENCE_OVERVIEW_CONTENT,
} from "../../../../data/sidebars/apiOverviewSidebar";

import { PageShell } from "./page-shell";
import { ResourceSection } from "./resource-section";
import { PreContent } from "./pre-content";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata = {
  title: "API reference (Optimized) | Knock Docs",
  description: "Complete reference documentation for the Knock API.",
};

export default async function OptimizedApiReferencePage() {
  // Load specs on server - these never leave the server
  const [openApiSpec, stainlessSpec] = await Promise.all([
    getOpenApiSpec("api"),
    getStainlessSpec("api"),
  ]);

  const baseUrl = stainlessSpec.environments.production;
  const schemaReferences = await buildSchemaReferences(
    "api",
    "/api-reference-v2/optimized"
  );

  // Load pre-content MDX
  const preContent = await fs.readFile(
    `${CONTENT_DIR}/__api-reference/content.mdx`,
    "utf-8"
  );
  const preContentMdx = await serialize(preContent, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxCodeProps],
    },
  });

  return (
    <PageShell
      name="API reference"
      basePath="api-reference-v2/optimized"
      stainlessSpec={stainlessSpec}
      preSidebarContent={API_REFERENCE_OVERVIEW_CONTENT}
      resourceOrder={RESOURCE_ORDER}
    >
      {/* Pre-content is client component for MDX interactivity */}
      <PreContent mdx={preContentMdx} />

      {/* Each resource section streams independently */}
      {RESOURCE_ORDER.map((resourceName) => (
        <Suspense
          key={resourceName}
          fallback={<ResourceSectionSkeleton name={resourceName} />}
        >
          <ResourceSection
            resourceName={resourceName}
            resource={stainlessSpec.resources[resourceName]}
            openApiSpec={openApiSpec}
            baseUrl={baseUrl}
            schemaReferences={schemaReferences}
            basePath="api-reference-v2/optimized"
          />
        </Suspense>
      ))}
    </PageShell>
  );
}

function ResourceSectionSkeleton({ name }: { name: string }) {
  return (
    <div className="py-8 border-b border-gray-200">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="h-4 w-96 bg-gray-100 rounded animate-pulse" />
    </div>
  );
}
