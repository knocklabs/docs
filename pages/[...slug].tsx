import fs from "fs";
import { join, sep } from "path";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";
import type { Pluggable } from "unified";

import MDXLayout from "../layouts/MDXLayout";
import {
  getAllFilesInDir,
  CONTENT_DIR,
  DOCS_FILE_EXTENSIONS,
  makeIdFromPath,
  generateAlgoliaIndex,
} from "../lib/content.server";
import eventPayload from "../data/code/sources/eventPayload";
import datadogDashboardJson from "../content/integrations/extensions/datadog_dashboard.json";
import newRelicDashboardJson from "../content/integrations/extensions/new_relic_dashboard.json";
import AiChatButton from "../components/AiChatButton";

import { FrontMatter } from "../types";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import { getAllTypedocs } from "@/lib/typedoc";
import { TypedocsProvider } from "@/components/Typedoc/Provider";
import { Typedoc } from "@/components/Typedoc";

export default function ContentPage({ source, sourcePath, typedocs }) {
  return (
    <TypedocsProvider typedocs={typedocs}>
      <div className="wrapper">
        <MDXLayout frontMatter={source.frontmatter} sourcePath={sourcePath}>
          <MDXRemote
            {...source}
            components={{ ...MDX_COMPONENTS, Typedoc }}
            scope={{
              datadogDashboardJson,
              newRelicDashboardJson,
              eventPayload,
            }}
          />
          <AiChatButton />
        </MDXLayout>
      </div>
    </TypedocsProvider>
  );
}

// Get the props for a single path
export async function getStaticProps({ params: { slug } }) {
  // Read the source content file, checking for .mdx and .md files
  let source;
  let sourcePath;
  for (const ext of DOCS_FILE_EXTENSIONS) {
    sourcePath = join(
      CONTENT_DIR,
      ...slug.slice(0, slug.length - 1),
      `${slug[slug.length - 1]}${ext}`,
    );
    if (fs.existsSync(sourcePath)) {
      source = fs.readFileSync(sourcePath);
      break;
    }
  }

  // These are not content pages, should not render here
  // the __mapi-reference or __api-reference sections of content
  // also skips indexing in algolia search
  const isApiPage =
    sourcePath.includes("content/__mapi-reference") ||
    sourcePath.includes("content/__api-reference");
  if (isApiPage) {
    return {
      notFound: true,
    };
  }

  if (!source) {
    throw new Error("Unable to read page content.");
  }

  const typedocs = await getAllTypedocs();

  // Serialize file contents into mdx, and parse frontmatter
  const mdxSource = await serialize<{}, FrontMatter>(source.toString(), {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeMdxCodeProps, rehypeAutolinkHeadings],
    },
  });

  // Extend frontmatter
  mdxSource.frontmatter.id = makeIdFromPath(slug.join(sep));

  // Index page in algolia
  await generateAlgoliaIndex(mdxSource.frontmatter);

  return { props: { source: mdxSource, sourcePath, typedocs } };
}

// Get the list of pages
export const getStaticPaths = async () => {
  // Get all .md and .mdx file paths from the content directory
  const filePaths = getAllFilesInDir(CONTENT_DIR, [], DOCS_FILE_EXTENSIONS);

  // Format the slug to generate the correct path
  const paths = filePaths.map((path) => {
    const slug = path
      .replace(CONTENT_DIR, "")
      .replace(/\.mdx?$/, "")
      .split(sep);

    return {
      params: {
        slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};
