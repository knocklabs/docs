import { GetStaticPaths, GetStaticProps } from "next";
import {
  getFullResourcePageData,
  getSidebarData,
  FullResourcePageData,
  SidebarData,
} from "@/lib/openApiSpec";
import { ApiReferenceLayout } from "@/components/api-reference";
import { ResourceFullPage } from "@/components/api-reference";
import { API_REFERENCE_OVERVIEW_CONTENT } from "@/data/sidebars/apiOverviewSidebar";

interface ResourcePageProps {
  sidebarData: SidebarData;
  resourceData: FullResourcePageData;
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

  return (
    <ApiReferenceLayout
      sidebarData={sidebarData}
      preSidebarContent={API_REFERENCE_OVERVIEW_CONTENT}
      title={resourceData.resource.name || resourceData.resourceName}
      description={
        resourceData.resource.description ||
        `${
          resourceData.resource.name || resourceData.resourceName
        } API reference`
      }
      currentPath={basePath}
      breadcrumbs={[{ label: "API reference", href: "/api-reference" }]}
    >
      <ResourceFullPage data={resourceData} basePath={basePath} />
    </ApiReferenceLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const sidebarData = await getSidebarData("api");
  const paths = sidebarData.resources.map((resource) => ({
    params: { resource: resource.slug.replace("/api-reference/", "") },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ResourcePageProps> = async ({
  params,
}) => {
  const resourceName = params?.resource as string;

  const [sidebarData, resourceData] = await Promise.all([
    getSidebarData("api"),
    getFullResourcePageData("api", resourceName),
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
