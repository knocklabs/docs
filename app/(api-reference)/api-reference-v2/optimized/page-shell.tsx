"use client";

/**
 * Page shell component that provides the layout structure.
 *
 * This is a client component because it uses hooks for sidebar state,
 * but it receives minimal data - just what's needed for the sidebar.
 */

import { ReactNode } from "react";
import { StainlessConfig } from "../../../../lib/openApiSpec";
import { SidebarSection } from "../../../../data/types";
import { Page as TelegraphPage } from "../../../../components/ui/Page";
import { ContentActions } from "../../../../components/ui/ContentActions";
import Meta from "../../../../components/Meta";

interface Props {
  children: ReactNode;
  name: string;
  basePath: string;
  stainlessSpec: StainlessConfig;
  preSidebarContent?: SidebarSection[];
  resourceOrder: string[];
}

/**
 * Build sidebar content from stainless spec.
 * This is a simplified version that doesn't need the full OpenAPI spec.
 */
function buildSimpleSidebarContent(
  stainlessSpec: StainlessConfig,
  resourceOrder: string[],
  basePath: string,
  preSidebarContent?: SidebarSection[]
): SidebarSection[] {
  const resourceSections = resourceOrder.map((resourceName) => {
    const resource = stainlessSpec.resources[resourceName];

    const pages: Array<{ title: string; slug: string; pages?: Array<{ title: string; slug: string }> }> = [
      { title: "Overview", slug: "/" },
    ];

    // Add methods
    if (resource.methods) {
      Object.entries(resource.methods).forEach(([methodName]) => {
        pages.push({
          title: methodName,
          slug: `/${methodName}`,
        });
      });
    }

    // Add subresources
    if (resource.subresources) {
      Object.entries(resource.subresources).forEach(
        ([subresourceName, subresource]) => {
          const subPages: Array<{ title: string; slug: string }> = [
            { title: "Overview", slug: "/" },
          ];

          if (subresource.methods) {
            Object.keys(subresource.methods).forEach((methodName) => {
              subPages.push({
                title: methodName,
                slug: `/${methodName}`,
              });
            });
          }

          pages.push({
            title: subresource.name || subresourceName,
            slug: `/${subresourceName}`,
            pages: subPages,
          });
        }
      );
    }

    // Add models/schemas
    if (resource.models) {
      pages.push({
        title: "Object definitions",
        slug: "/schemas",
        pages: Object.keys(resource.models).map((modelName) => ({
          title: modelName,
          slug: `/${modelName}`,
        })),
      });
    }

    return {
      title: resource.name || resourceName,
      slug: `/${basePath}/${resourceName}`,
      pages,
    };
  });

  return (preSidebarContent || []).concat(resourceSections);
}

export function PageShell({
  children,
  name,
  basePath,
  stainlessSpec,
  preSidebarContent,
  resourceOrder,
}: Props) {
  const sidebarContent = buildSimpleSidebarContent(
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
      <TelegraphPage.Wrapper>
        <TelegraphPage.FullSidebar content={sidebarContent} samePageRouting />
        <TelegraphPage.Content fullWidth>
          <TelegraphPage.ContentHeader
            title={name}
            description={`Complete reference documentation for the Knock ${name}.`}
            bottomContent={
              <ContentActions showOnMobile style={{ marginLeft: "-6px" }} />
            }
          />
          <TelegraphPage.ContentBody>{children}</TelegraphPage.ContentBody>
        </TelegraphPage.Content>
      </TelegraphPage.Wrapper>
    </TelegraphPage.Container>
  );
}
