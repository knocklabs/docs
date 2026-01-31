import { Suspense } from "react";
import { getStainlessSpec } from "../../../../lib/openapi/loader";
import { buildSchemaReferences, getSidebarContent } from "../../../../lib/openapi/helpers";
import { RESOURCE_ORDER, API_REFERENCE_OVERVIEW_CONTENT } from "../../../../data/sidebars/apiOverviewSidebar";
import { PageShell, ResourceSection, PreContent, ResourceSectionSkeleton } from "../components";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "API reference | Knock Docs",
    description: "Complete reference documentation for the Knock API.",
    alternates: {
      canonical: "/api-reference",
    },
  };
}

// Generate all possible static paths
export async function generateStaticParams() {
  const stainless = await getStainlessSpec("api");
  const paths: { slug: string[] }[] = [];

  // Root path (no slug)
  paths.push({ slug: [] });

  // Overview paths
  API_REFERENCE_OVERVIEW_CONTENT.forEach((section) => {
    if (section.pages) {
      section.pages.forEach((page) => {
        const slug = page.slug.replace(/^\//, "").split("/").filter(Boolean);
        if (slug.length > 0) {
          paths.push({ slug: ["overview", ...slug] });
        }
      });
    }
  });
  paths.push({ slug: ["overview"] });

  // Resource paths
  function addResourcePaths(
    resourceName: string,
    resource: (typeof stainless.resources)[string],
    basePath: string[] = [],
  ) {
    const resourcePath = [...basePath, resourceName];
    paths.push({ slug: resourcePath });

    // Method paths
    if (resource.methods) {
      Object.keys(resource.methods).forEach((methodName) => {
        paths.push({ slug: [...resourcePath, methodName] });
      });
    }

    // Schema paths
    if (resource.models) {
      paths.push({ slug: [...resourcePath, "schemas"] });
      Object.keys(resource.models).forEach((modelName) => {
        paths.push({ slug: [...resourcePath, "schemas", modelName] });
      });
    }

    // Subresource paths
    if (resource.subresources) {
      Object.entries(resource.subresources).forEach(([subName, subResource]) => {
        addResourcePaths(subName, subResource, resourcePath);
      });
    }
  }

  RESOURCE_ORDER.forEach((resourceName) => {
    const resource = stainless.resources[resourceName];
    if (resource) {
      addResourcePaths(resourceName, resource);
    }
  });

  return paths;
}

export default async function ApiReferencePage() {
  const stainless = await getStainlessSpec("api");
  const schemaReferences = await buildSchemaReferences("api", "/api-reference");
  const baseUrl = stainless.environments.production;

  // Transform sidebar content for compatibility
  const sidebarContent = await getSidebarContent(
    "api",
    RESOURCE_ORDER,
    "/api-reference",
    API_REFERENCE_OVERVIEW_CONTENT.map((section) => ({
      ...section,
      title: section.title || "",
    })),
  );

  // Transform to SidebarSection format
  const transformedSidebar = sidebarContent.map((section) => ({
    title: section.title,
    slug: section.slug,
    pages: section.pages || [],
    sidebarMenuDefaultOpen:
      API_REFERENCE_OVERVIEW_CONTENT.find((s) => s.slug === section.slug)
        ?.sidebarMenuDefaultOpen ?? false,
  }));

  return (
    <PageShell
      sidebarContent={transformedSidebar}
      title="API reference"
      description="Complete reference documentation for the Knock API."
    >
      <Suspense fallback={<ResourceSectionSkeleton />}>
        <PreContent specName="api" />
      </Suspense>

      {RESOURCE_ORDER.map((resourceName) => (
        <Suspense key={resourceName} fallback={<ResourceSectionSkeleton />}>
          <ResourceSection
            specName="api"
            resourceName={resourceName}
            basePath="/api-reference"
            baseUrl={baseUrl}
            schemaReferences={schemaReferences}
          />
        </Suspense>
      ))}
    </PageShell>
  );
}
