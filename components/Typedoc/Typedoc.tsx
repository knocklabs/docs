import { MDXRemote } from "next-mdx-remote";
import { useTypedoc } from "./Provider";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";

const Typedoc = ({ file }: { file: string }) => {
  const typedoc = useTypedoc(file);

  if (!typedoc) {
    throw new Error(`Typedoc file ${file} not found`);
  }

  return (
    <MDXRemote {...typedoc.mdxSource} components={MDX_COMPONENTS as any} />
  );
};

export default Typedoc;
