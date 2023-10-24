import fs from "fs";
import { join, sep } from "path";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";

import { CodeBlock } from "../components/CodeBlock";
import Layout from "../layouts/mdxLayout";
import { getAllFilesInDir, CONTENT_DIR, makeIdFromPath } from "../lib/content";
import Callout from "../components/Callout";
import MultiLangCodeBlock from "../components/MultiLangCodeBlock";
import remarkSlug from "remark-slug";
import SectionHeading from "../components/SectionHeading";
import eventPayload from "../data/code/sources/eventPayload";
import LocaleTable from "../components/LocaleTable";
import { Attributes, Attribute } from "../components/Attributes";
import Table from "../components/Table";
import DataSyncTable from "../components/DataSyncTable";
import CopyableText from "../components/CopyableText";
import { Endpoints, Endpoint } from "../components/Endpoints";
import dashboardJson from "../content/integrations/extensions/datadog_dashboard.json";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

import {
  Section,
  ContentColumn,
  ErrorExample,
  ExampleColumn,
} from "../components/ApiSections";
import RateLimit from "../components/RateLimit";

const components = {
  pre: CodeBlock,
  h2: (props) => <SectionHeading tag="h2" {...props} />,
  h3: (props) => <SectionHeading tag="h3" {...props} />,
  h4: (props) => <SectionHeading tag="h4" {...props} />,
  Callout,
  Image,
  MultiLangCodeBlock,
  LocaleTable,
  Attributes,
  Attribute,
  Table,
  DataSyncTable,
  CopyableText,
  RateLimit,
  Section,
  ContentColumn,
  ErrorExample,
  ExampleColumn,
  Endpoints,
  Endpoint,
};

/**
 * TODO: Update Algolia index creation
 * TODO: Fix hydration errors (IOSunny/Moon, and autocomplete components)
 * TODO: Fix up eslint rules
 */

export default function TestPage({ source }) {
  return (
    <div className="wrapper">
      <Layout frontMatter={source.frontmatter}>
        <MDXRemote
          {...source}
          components={components}
          scope={{
            dashboardJson,
            eventPayload,
          }}
        />
      </Layout>
    </div>
  );
}

// Get the props for a single path
export async function getStaticProps({ params: { slug } }) {
  // Read the source content file, checking for .mdx and .md files
  const possibleExtensions = [".mdx", ".md"];
  let source;
  for (const ext of possibleExtensions) {
    const path = join(
      CONTENT_DIR,
      ...slug.slice(0, slug.length - 1),
      `${slug[slug.length - 1]}${ext}`,
    );
    if (fs.existsSync(path)) {
      source = fs.readFileSync(path);
      break;
    }
  }

  if (!source) {
    throw new Error("Unable to read page content.");
  }

  // Serialize file contents into mdx, and parse frontmatter
  const mdxSource = await serialize(source, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkSlug, remarkGfm],
      rehypePlugins: [rehypeAutolinkHeadings],
    },
  });

  // Extend frontmatter with id and reading count
  mdxSource.frontmatter.id = makeIdFromPath(slug.join(sep)); // TODO: Do we need this??

  return { props: { source: mdxSource } };
}

// Get the list of pages
export const getStaticPaths = async () => {
  // Get all file paths from the content directory
  const filePaths = getAllFilesInDir(CONTENT_DIR);

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
