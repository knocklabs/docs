import fs from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { Box } from "@telegraph/layout";

import { getSidebarData, SidebarData } from "@/lib/openApiSpec";
import { CONTENT_DIR } from "@/lib/content.server";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import { ApiReferenceLayout } from "@/components/api-reference";
import { MAPI_REFERENCE_OVERVIEW_CONTENT } from "@/data/sidebars/mapiOverviewSidebar";

interface MapiReferenceOverviewProps {
  sidebarData: SidebarData;
  overviewContentMdx: MDXRemoteSerializeResult;
}

function MapiReferenceOverview({
  sidebarData,
  overviewContentMdx,
}: MapiReferenceOverviewProps) {
  return (
    <ApiReferenceLayout
      sidebarData={sidebarData}
      preSidebarContent={MAPI_REFERENCE_OVERVIEW_CONTENT}
      title="Management API reference"
      description="Complete reference documentation for the Knock Management API."
      currentPath="/mapi-reference/overview"
    >
      <Box className="tgraph-content">
        <MDXRemote {...overviewContentMdx} components={MDX_COMPONENTS as any} />
      </Box>
    </ApiReferenceLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths for all overview sections from the sidebar config
  const overviewPages = MAPI_REFERENCE_OVERVIEW_CONTENT[0]?.pages || [];

  const paths = [
    // Base overview path (no section)
    { params: { section: [] } },
    // All section paths
    ...overviewPages.map((page) => ({
      params: {
        section: page.slug === "/" ? [] : [page.slug.replace(/^\//, "")],
      },
    })),
  ];

  // Remove duplicates (the "/" slug creates a duplicate of the base path)
  const uniquePaths = paths.filter(
    (path, index, self) =>
      index ===
      self.findIndex(
        (p) =>
          JSON.stringify(p.params.section) ===
          JSON.stringify(path.params.section),
      ),
  );

  return {
    paths: uniquePaths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  MapiReferenceOverviewProps
> = async () => {
  const sidebarData = await getSidebarData("mapi");

  const overviewContent = fs.readFileSync(
    `${CONTENT_DIR}/__mapi-reference/content.mdx`,
  );

  const overviewContentMdx = await serialize(overviewContent.toString(), {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxCodeProps],
    },
    blockJS: false,
    blockDangerousJS: true,
  });

  return {
    props: {
      sidebarData,
      overviewContentMdx,
    },
    revalidate: 3600, // Revalidate every hour
  };
};

export default MapiReferenceOverview;
