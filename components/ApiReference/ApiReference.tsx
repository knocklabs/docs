"use client";

import { ApiReferenceProvider } from "../../components/ApiReference/ApiReferenceContext";
import { ApiReferenceSection } from "../../components/ApiReference";
import { Page as TelegraphPage } from "../../components/ui/Page";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { StainlessConfig } from "../../lib/openApiSpec";
import { OpenAPIV3 } from "@scalar/openapi-types";
import { getSidebarContent } from "./helpers";
import { SidebarSection } from "../../data/types";
import Meta from "../Meta";
import { useInitialScrollState } from "../ui/Page/helpers";

type Props = {
  name: string;
  openApiSpec: OpenAPIV3.Document;
  stainlessSpec: StainlessConfig;
  preContent?: React.ReactNode;
  preSidebarContent?: SidebarSection[];
  resourceOrder: string[];
};

function ApiReference({
  name,
  openApiSpec,
  stainlessSpec,
  preContent,
  preSidebarContent,
  resourceOrder = [],
}: Props) {
  const router = useRouter();
  const basePath = router.pathname.split("/")[1];
  useInitialScrollState();

  return (
    <TelegraphPage.Container>
      <Meta
        title={`${name} | Knock Docs`}
        description={`Complete reference documentation for the Knock ${name}.`}
      />
      <TelegraphPage.Masthead title={name} />
      <ApiReferenceProvider
        openApiSpec={openApiSpec}
        stainlessConfig={stainlessSpec}
      >
        <TelegraphPage.Wrapper>
          <TelegraphPage.Sidebar
            content={getSidebarContent(
              openApiSpec,
              stainlessSpec,
              resourceOrder,
              basePath,
              preSidebarContent,
            )}
            samePageRouting
          />
          <TelegraphPage.Content maxWidth="1440px">
            <TelegraphPage.ContentHeader
              title={name}
              description={`Complete reference documentation for the Knock ${name}.`}
            />
            <TelegraphPage.ContentBody>
              <div className="w-full max-w-5xl lg:flex mx-auto relative">
                <div className="w-full flex-auto">
                  <div className="docs-content api-docs-content">
                    {preContent}
                    {resourceOrder.map((resourceName) => (
                      <ApiReferenceSection
                        key={resourceName}
                        resourceName={resourceName}
                        resource={stainlessSpec.resources[resourceName]}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TelegraphPage.ContentBody>
          </TelegraphPage.Content>
        </TelegraphPage.Wrapper>
      </ApiReferenceProvider>
    </TelegraphPage.Container>
  );
}

export default ApiReference;
