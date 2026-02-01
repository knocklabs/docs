import fs from "fs";
import { GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";

import { getSidebarData, SidebarData } from "@/lib/openApiSpec";
import { CONTENT_DIR } from "@/lib/content.server";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import { ApiReferenceLayout } from "@/components/api-reference";
import { API_REFERENCE_OVERVIEW_CONTENT } from "@/data/sidebars/apiOverviewSidebar";

interface ResourceCardProps {
  title: string;
  href: string;
  methodCount: number;
}

function ResourceCard({ title, href, methodCount }: ResourceCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Box
        p="4"
        borderRadius="2"
        border="px"
        borderColor="gray-3"
        className="hover:bg-gray-2"
        style={{ transition: "background-color 0.15s ease" }}
      >
        <Text as="span" size="3" weight="medium">
          {title}
        </Text>
        <Text as="span" size="1" color="gray" ml="2">
          {methodCount} endpoint{methodCount !== 1 ? "s" : ""}
        </Text>
      </Box>
    </Link>
  );
}

interface ApiReferenceOverviewProps {
  sidebarData: SidebarData;
  overviewContentMdx: MDXRemoteSerializeResult;
}

function ApiReferenceOverview({
  sidebarData,
  overviewContentMdx,
}: ApiReferenceOverviewProps) {
  return (
    <ApiReferenceLayout
      sidebarData={sidebarData}
      preSidebarContent={API_REFERENCE_OVERVIEW_CONTENT}
      title="API reference"
      description="Complete reference documentation for the Knock API."
      currentPath="/api-reference"
    >
      {/* Overview content (auth, errors, pagination, etc.) */}
      <Box className="tgraph-content" mb="8">
        <MDXRemote {...overviewContentMdx} components={MDX_COMPONENTS as any} />
      </Box>

      {/* Resource list */}
      <Box mt="8">
        <Heading as="h2" size="5" weight="medium" mb="4">
          Resources
        </Heading>
        <Stack direction="column" gap="2">
          {sidebarData.resources
            .filter((resource) => resource.title !== "Shared")
            .map((resource) => (
              <ResourceCard
                key={resource.slug}
                title={resource.title}
                href={resource.slug}
                methodCount={
                  resource.pages.filter(
                    (p) =>
                      !p.pages &&
                      p.title !== "Overview" &&
                      !p.slug.includes("/schemas"),
                  ).length
                }
              />
            ))}
        </Stack>
      </Box>
    </ApiReferenceLayout>
  );
}

export const getStaticProps: GetStaticProps<
  ApiReferenceOverviewProps
> = async () => {
  const sidebarData = await getSidebarData("api");

  const overviewContent = fs.readFileSync(
    `${CONTENT_DIR}/__api-reference/content.mdx`,
  );

  const overviewContentMdx = await serialize(overviewContent.toString(), {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxCodeProps],
    },
  });

  return {
    props: {
      sidebarData,
      overviewContentMdx,
    },
    revalidate: 3600, // Revalidate every hour
  };
};

export default ApiReferenceOverview;
