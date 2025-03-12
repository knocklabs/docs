import { readOpenApiSpec, readStainlessSpec } from "../../lib/openApiSpec";
import ApiReference from "../../components/ApiReference/ApiReference";
import { getSidebarContent } from "../../components/ApiReference/helpers";
import { OpenAPIV3 } from "@scalar/openapi-types";

function ApiReferenceNew({ openApiSpec, stainlessSpec }) {
  return (
    <ApiReference openApiSpec={openApiSpec} stainlessSpec={stainlessSpec} />
  );
}

export async function getStaticPaths() {
  const openApiSpec = await readOpenApiSpec();
  const stainlessSpec = await readStainlessSpec();

  const paths: { params: { slug: string[] } }[] = [];
  const pages = getSidebarContent(
    openApiSpec as OpenAPIV3.Document,
    stainlessSpec,
  );

  for (const page of pages) {
    const slug = page.slug.split("/").pop() as string;
    paths.push({ params: { slug: [slug] } });

    for (const subPage of page.pages) {
      paths.push({
        params: { slug: [slug, subPage.slug.replace("/", "")] },
      });

      for (const subSubPage of subPage.pages ?? []) {
        paths.push({
          params: {
            slug: [
              slug,
              subPage.slug.replace("/", ""),
              subSubPage.slug.replace("/", ""),
            ],
          },
        });
      }
    }
  }
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps() {
  const openApiSpec = await readOpenApiSpec();
  const stainlessSpec = await readStainlessSpec();

  return { props: { openApiSpec, stainlessSpec } };
}

export default ApiReferenceNew;
