import { GetStaticPaths, GetStaticProps } from "next";
import {
  getFullResourcePageData,
  getSidebarData,
  FullResourcePageData,
  SidebarData,
} from "@/lib/openApiSpec";
import { ApiReferenceLayout } from "@/components/api-reference";
import { ResourceFullPage } from "@/components/api-reference";
import { MAPI_REFERENCE_OVERVIEW_CONTENT } from "@/data/sidebars/mapiOverviewSidebar";

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
    // [cjb] This is an insane hack but I'm not sure what else to do
    window.location.reload();
    return null;
  }

  const basePath = `/mapi-reference/${resourceData.resourceName}`;
  const title = resourceData.resource.name || resourceData.resourceName;
  const description = `Complete reference documentation for the ${title} resource.`;

  return (
    <ApiReferenceLayout
      sidebarData={sidebarData}
      preSidebarContent={MAPI_REFERENCE_OVERVIEW_CONTENT}
      title={`${
        resourceData.resource.name || resourceData.resourceName
      } Management API reference`}
      description={description}
      currentPath={basePath}
      breadcrumbs={[
        { label: "Management API reference", href: "/mapi-reference" },
      ]}
    >
      <ResourceFullPage data={resourceData} basePath={basePath} />
    </ApiReferenceLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const sidebarData = await getSidebarData("mapi");
  const paths = sidebarData.resources.map((resource) => ({
    params: { resource: resource.slug.replace("/mapi-reference/", "") },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ResourcePageProps> = async ({
  params,
}) => {
  const resourceName = Array.isArray(params?.resource)
    ? params.resource[0]
    : params?.resource;

  if (!resourceName) {
    return { notFound: true };
  }

  const [sidebarData, resourceData] = await Promise.all([
    getSidebarData("mapi"),
    getFullResourcePageData("mapi", resourceName),
  ]);

  if (!resourceData) {
    return { notFound: true };
  }

  const serializableData = JSON.parse(JSON.stringify(resourceData));

  return {
    props: {
      sidebarData,
      resourceData: serializableData,
    },
    revalidate: 3600, // Revalidate every hour
  };
};
