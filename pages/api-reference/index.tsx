import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

import { readOpenApiSpec, readStainlessSpec } from "../../lib/openApiSpec";
import ApiReference from "../../components/ApiReference/ApiReference";
import { CONTENT_DIR } from "../../lib/content.server";
import { MDX_COMPONENTS } from "../[...slug]";

function ApiReferenceNew({ openApiSpec, stainlessSpec, preContentMdx }) {
  return (
    <ApiReference
      openApiSpec={openApiSpec}
      stainlessSpec={stainlessSpec}
      preContent={<MDXRemote {...preContentMdx} components={MDX_COMPONENTS} />}
    />
  );
}

export async function getStaticProps() {
  const openApiSpec = await readOpenApiSpec();
  const stainlessSpec = await readStainlessSpec();

  const preContent = fs.readFileSync(
    `${CONTENT_DIR}/__api-reference/content.mdx`,
  );

  const preContentMdx = await serialize(preContent, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxCodeProps] as any,
    },
  });

  return { props: { openApiSpec, stainlessSpec, preContentMdx } };
}

export default ApiReferenceNew;
