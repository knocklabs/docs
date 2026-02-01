import { GetStaticPaths, GetStaticProps } from "next";
import {
  getAllApiReferencePaths,
  getMethodPageData,
  getSchemaPageData,
  getResourceOverviewData,
  getSidebarData,
  buildSchemaReferences,
  MethodPageData,
  SchemaPageData,
  ResourceOverviewData,
  SidebarData,
} from "@/lib/openApiSpec";
import { ApiReferenceLayout } from "@/components/api-reference";
import { MethodPage } from "@/components/api-reference";
import { SchemaPage } from "@/components/api-reference";
import { ResourceOverviewPage } from "@/components/api-reference";
import { API_REFERENCE_OVERVIEW_CONTENT } from "@/data/sidebars/apiOverviewSidebar";

type PageType = "method" | "schema" | "subresource";

interface MethodPageProps {
  pageType: "method";
  sidebarData: SidebarData;
  data: MethodPageData;
  schemaReferences: Record<string, string>;
}

interface SchemaPageProps {
  pageType: "schema";
  sidebarData: SidebarData;
  data: SchemaPageData;
  schemaReferences: Record<string, string>;
}

interface SubresourcePageProps {
  pageType: "subresource";
  sidebarData: SidebarData;
  data: ResourceOverviewData;
  schemaReferences: Record<string, string>;
  basePath: string;
}

type PageProps = MethodPageProps | SchemaPageProps | SubresourcePageProps;

export default function ApiReferenceDynamicPage(props: PageProps) {
  const { pageType, sidebarData, data, schemaReferences } = props;

  if (pageType === "schema") {
    const schemaData = data as SchemaPageData;
    return (
      <ApiReferenceLayout
        sidebarData={sidebarData}
        preSidebarContent={API_REFERENCE_OVERVIEW_CONTENT}
        title={schemaData.schema.title || schemaData.schemaName}
        description={schemaData.schema.description || `${schemaData.schemaName} schema reference`}
        currentPath={`/api-reference/${schemaData.resourceName}/schemas/${schemaData.schemaName}`}
        breadcrumbs={[
          { label: "API reference", href: "/api-reference" },
          { label: schemaData.resourceTitle, href: `/api-reference/${schemaData.resourceName}` },
          { label: "Object definitions", href: `/api-reference/${schemaData.resourceName}` },
        ]}
      >
        <SchemaPage data={schemaData} schemaReferences={schemaReferences} />
      </ApiReferenceLayout>
    );
  }

  if (pageType === "subresource") {
    const subresourceData = data as ResourceOverviewData;
    const basePath = (props as SubresourcePageProps).basePath;
    return (
      <ApiReferenceLayout
        sidebarData={sidebarData}
        preSidebarContent={API_REFERENCE_OVERVIEW_CONTENT}
        title={subresourceData.resource.name || subresourceData.resourceName}
        description={subresourceData.resource.description || `${subresourceData.resource.name} API reference`}
        currentPath={basePath}
        breadcrumbs={[
          { label: "API reference", href: "/api-reference" },
          { label: subresourceData.resourceName, href: `/api-reference/${subresourceData.resourceName}` },
        ]}
      >
        <ResourceOverviewPage data={subresourceData} basePath={basePath} />
      </ApiReferenceLayout>
    );
  }

  // Method page (default)
  const methodData = data as MethodPageData;
  const subresourceBreadcrumbs = methodData.subresourcePath
    ? methodData.subresourcePath.map((sub, index) => ({
        label: sub,
        href: `/api-reference/${methodData.resourceName}/${methodData.subresourcePath?.slice(0, index + 1).join("/")}`,
      }))
    : [];

  return (
    <ApiReferenceLayout
      sidebarData={sidebarData}
      preSidebarContent={API_REFERENCE_OVERVIEW_CONTENT}
      title={methodData.operation.summary || methodData.methodName}
      description={methodData.operation.description || `${methodData.methodName} API reference`}
      currentPath={`/api-reference/${methodData.resourceName}${methodData.subresourcePath ? "/" + methodData.subresourcePath.join("/") : ""}/${methodData.methodName}`}
      breadcrumbs={[
        { label: "API reference", href: "/api-reference" },
        { label: methodData.resourceTitle, href: `/api-reference/${methodData.resourceName}` },
        ...subresourceBreadcrumbs,
      ]}
    >
      <MethodPage data={methodData} schemaReferences={schemaReferences} />
    </ApiReferenceLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allPaths = await getAllApiReferencePaths("api");

  // Filter to only paths with slug (not resource overview which has no slug)
  const slugPaths = allPaths
    .filter((p) => p.params.slug && p.params.slug.length > 0)
    .map((p) => ({
      params: {
        resource: p.params.resource,
        slug: p.params.slug as string[],
      },
    }));

  return {
    paths: slugPaths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const resourceName = params?.resource as string;
  const slug = params?.slug as string[];

  const [sidebarData, schemaReferences] = await Promise.all([
    getSidebarData("api"),
    buildSchemaReferences("api"),
  ]);

  // Determine page type from slug
  // /users/schemas/user -> schema page
  // /users/get -> method page
  // /users/feeds -> subresource overview
  // /users/feeds/list_items -> subresource method page

  const schemaIndex = slug.indexOf("schemas");

  if (schemaIndex !== -1 && schemaIndex === slug.length - 2) {
    // Schema page: [..., "schemas", schemaName]
    const schemaName = slug[schemaIndex + 1];
    const subresourcePath = slug.slice(0, schemaIndex);

    const data = await getSchemaPageData(
      "api",
      resourceName,
      schemaName,
      subresourcePath,
    );

    if (!data) {
      return { notFound: true };
    }

    return {
      props: {
        pageType: "schema" as const,
        sidebarData,
        data,
        schemaReferences,
      },
      revalidate: 3600,
    };
  }

  // Check if this is a subresource overview (has subresource path but no method)
  // This requires checking if the last segment is a subresource name
  const potentialSubresourcePath = slug;
  const subresourceOverview = await getResourceOverviewData(
    "api",
    resourceName,
    potentialSubresourcePath,
  );

  if (subresourceOverview && subresourceOverview.methods.length > 0) {
    // This is a subresource overview page
    return {
      props: {
        pageType: "subresource" as const,
        sidebarData,
        data: subresourceOverview,
        schemaReferences,
        basePath: `/api-reference/${resourceName}/${slug.join("/")}`,
      },
      revalidate: 3600,
    };
  }

  // Method page (possibly in subresource)
  const methodName = slug[slug.length - 1];
  const subresourcePath = slug.slice(0, -1);

  const data = await getMethodPageData(
    "api",
    resourceName,
    methodName,
    subresourcePath,
  );

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      pageType: "method" as const,
      sidebarData,
      data,
      schemaReferences,
    },
    revalidate: 3600,
  };
};
