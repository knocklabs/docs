import { GetStaticPaths, GetStaticProps } from "next";
import {
  getSplitResourceData,
  getSidebarData,
  SplitResourceData,
  SidebarData,
  getAllApiReferencePaths,
} from "@/lib/openApiSpec";
import { ApiReferenceLayout } from "@/components/api-reference";
import { ResourceFullPage } from "@/components/api-reference";
import { API_REFERENCE_OVERVIEW_CONTENT } from "@/data/sidebars/apiOverviewSidebar";

interface ResourcePageProps {
  sidebarData: SidebarData;
  resourceData: SplitResourceData;
}

export default function ResourcePage({
  sidebarData,
  resourceData,
}: ResourcePageProps) {
  // Guard against undefined resourceData during client-side transitions
  if (!resourceData) {
    return null;
  }

  const basePath = `/api-reference/${resourceData.resourceName}`;
  const title = resourceData.resource.name || resourceData.resourceName;
  const description = `Complete reference documentation for the ${title} resource.`;

  return (
    <ApiReferenceLayout
      sidebarData={sidebarData}
      preSidebarContent={API_REFERENCE_OVERVIEW_CONTENT}
      title={`${
        resourceData.resource.name || resourceData.resourceName
      } API reference`}
      description={description}
      currentPath={basePath}
      breadcrumbs={[{ label: "API reference", href: "/api-reference" }]}
    >
      <ResourceFullPage data={resourceData} basePath={basePath} />
    </ApiReferenceLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate all paths including deep links (methods, schemas, subresources)
  // This ensures client-side navigation works properly since each path
  // is an actual page with its own JSON data file.
  const allPaths = await getAllApiReferencePaths("api");

  const paths = allPaths.map((p) => ({
    params: {
      resource: p.params.resource,
      // slug is optional - undefined for resource root, array for deep paths
      slug: p.params.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ResourcePageProps> = async ({
  params,
}) => {
  // Extract resource name - the first segment determines which data to load
  const resourceName = Array.isArray(params?.resource)
    ? params.resource[0]
    : params?.resource;

  if (!resourceName) {
    return { notFound: true };
  }

  // All deep paths (methods, schemas, subresources) render the same resource page
  // The page handles scrolling to the correct section based on the URL
  const [sidebarData, resourceData] = await Promise.all([
    getSidebarData("api"),
    getSplitResourceData("api", resourceName),
  ]);

  if (!resourceData) {
    return { notFound: true };
  }

  return {
    props: {
      sidebarData,
      resourceData,
    },
    revalidate: 3600, // Revalidate every hour
  };
};
