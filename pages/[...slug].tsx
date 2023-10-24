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

const components = {
  pre: CodeBlock,
  Callout,
  Image,
  MultiLangCodeBlock,
};

/**
 * TODO: Handle markdown files
 * TODO: Fix Prev Next links
 * TODO: Get correct layouts
 * TODO: Fix up eslint rules
 * TODO: Make sure all components are imported correctly
 * TODO: Remove imports from MDX files
 * TODO: Get hot reloading working by watching content dir
 */

export default function TestPage({ source }) {
  return (
    <div className="wrapper">
      <Layout frontMatter={source.frontmatter}>
        <MDXRemote {...source} components={components} />
      </Layout>
    </div>
  );
}

// Get the props for a single path
export async function getStaticProps({ params: { slug } }) {
  console.log("🔹 Get static props");

  // Read the source content file
  const source = fs.readFileSync(
    join(
      CONTENT_DIR,
      ...slug.slice(0, slug.length - 1),
      `${slug[slug.length - 1]}.mdx`,
    ),
    "utf-8",
  );

  // Serialize file contents into mdx, and parse frontmatter
  const mdxSource = await serialize(source, { parseFrontmatter: true });
  console.log(mdxSource);
  // Extend frontmatter with id and reading count
  mdxSource.frontmatter.id = makeIdFromPath(slug.join(sep));
  mdxSource.frontmatter.wordCount = source.split(/\s+/g).length;

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

    // TODO: Handle index files??

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
