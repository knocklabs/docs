"use client";

/**
 * Client component for the API reference page.
 *
 * This receives the pre-rendered data from the server component
 * and handles client-side interactivity like navigation and state.
 *
 * IMPORTANT: In a fully optimized implementation, you would NOT pass
 * the full openApiSpec here. Instead, you'd:
 * 1. Render static content in the server component
 * 2. Only pass minimal data needed for client interactivity
 *
 * This example shows a transitional approach that maintains compatibility
 * with existing components while demonstrating the pattern.
 */

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { usePathname } from "next/navigation";
import { OpenAPIV3 } from "@scalar/openapi-types";

import { MDX_COMPONENTS } from "../../../lib/mdxComponents";
import { StainlessConfig } from "../../../lib/openApiSpec";
import { SidebarSection } from "../../../data/types";
import { getSidebarContent } from "../../../components/ui/ApiReference/helpers";
import Meta from "../../../components/Meta";
import { Page as TelegraphPage } from "../../../components/ui/Page";
import { ContentActions } from "../../../components/ui/ContentActions";
import { ApiReferenceProvider } from "./api-reference-context";
import { ApiReferenceSectionClient } from "./api-reference-section-client";

interface Props {
  name: string;
  openApiSpec: OpenAPIV3.Document;
  stainlessSpec: StainlessConfig;
  preContentMdx: MDXRemoteSerializeResult;
  resourceOrder: string[];
  preSidebarContent?: SidebarSection[];
  baseUrl: string;
  schemaReferences: Record<string, string>;
  basePath: string;
}

export function ApiReferencePageClient({
  name,
  openApiSpec,
  stainlessSpec,
  preContentMdx,
  resourceOrder,
  preSidebarContent,
  baseUrl,
  schemaReferences,
  basePath,
}: Props) {
  const pathname = usePathname();

  const sidebarContent = getSidebarContent(
    openApiSpec,
    stainlessSpec,
    resourceOrder,
    basePath,
    preSidebarContent
  );

  return (
    <TelegraphPage.Container>
      <Meta
        title={`${name} | Knock Docs`}
        description={`Complete reference documentation for the Knock ${name}.`}
        canonical={`/${basePath}`}
      />
      <TelegraphPage.Masthead
        mobileSidebar={
          <TelegraphPage.MobileSidebar samePageRouting content={sidebarContent} />
        }
      />
      <ApiReferenceProvider
        openApiSpec={openApiSpec}
        stainlessConfig={stainlessSpec}
        baseUrl={baseUrl}
        schemaReferences={schemaReferences}
      >
        <TelegraphPage.Wrapper>
          <TelegraphPage.FullSidebar content={sidebarContent} samePageRouting />
          <TelegraphPage.Content>
            <TelegraphPage.ContentHeader
              title={name}
              description={`Complete reference documentation for the Knock ${name}.`}
              bottomContent={
                <ContentActions showOnMobile style={{ marginLeft: "-6px" }} />
              }
            />
            <TelegraphPage.ContentBody>
              <MDXRemote {...preContentMdx} components={MDX_COMPONENTS as any} />
              {resourceOrder.map((resourceName) => (
                <ApiReferenceSectionClient
                  key={resourceName}
                  resourceName={resourceName}
                  resource={stainlessSpec.resources[resourceName]}
                  basePath={basePath}
                />
              ))}
            </TelegraphPage.ContentBody>
          </TelegraphPage.Content>
        </TelegraphPage.Wrapper>
      </ApiReferenceProvider>
    </TelegraphPage.Container>
  );
}
