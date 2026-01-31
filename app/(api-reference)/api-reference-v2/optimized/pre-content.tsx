"use client";

/**
 * Client component for rendering MDX pre-content.
 * MDX requires client-side rendering for interactive components.
 */

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDX_COMPONENTS } from "../../../../lib/mdxComponents";

interface Props {
  mdx: MDXRemoteSerializeResult;
}

export function PreContent({ mdx }: Props) {
  return <MDXRemote {...mdx} components={MDX_COMPONENTS as any} />;
}
