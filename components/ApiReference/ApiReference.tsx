import Link from "next/link";
import { ApiReferenceProvider } from "../../components/ApiReference/ApiReferenceContext";
import { ApiReferenceSection } from "../../components/ApiReference";
import MinimalHeader from "../../components/Header/MinimalHeader";
import Sidebar from "../../components/Sidebar";
import { Page } from "../../layouts/Page";
import { useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { StainlessConfig } from "../../lib/openApiSpec";
import { OpenAPIV3 } from "@scalar/openapi-types";
import { docsOrdering, getSidebarContent } from "./helpers";

type Props = {
  openApiSpec: OpenAPIV3.Document;
  stainlessSpec: StainlessConfig;
  preContent?: React.ReactNode;
};

function ApiReference({ openApiSpec, stainlessSpec, preContent }: Props) {
  const router = useRouter();

  useEffect(() => {
    const path = router.asPath;

    const resourcePath = path.replace("/api-reference", "");
    const element = document.querySelector(
      `[data-resource-path="${resourcePath}"]`,
    );

    if (element) {
      setTimeout(() => {
        element.scrollIntoView();
      }, 200);
    }
  }, [router.asPath]);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const resourcePath =
              entry.target.getAttribute("data-resource-path");
            if (resourcePath) {
              window.history.replaceState(
                null,
                "",
                `/api-reference${resourcePath}`,
              );
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-64px 0px -80% 0px",
      },
    );

    // Observe all elements with data-resource-path
    document.querySelectorAll("[data-resource-path]").forEach((element) => {
      observer.observe(element);
    });

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  return (
    <ApiReferenceProvider
      openApiSpec={openApiSpec}
      stainlessConfig={stainlessSpec}
    >
      <div className="wrapper">
        <Page
          header={<MinimalHeader pageType="API" />}
          sidebar={
            <Sidebar content={getSidebarContent(openApiSpec, stainlessSpec)}>
              <Link
                href="/"
                passHref
                className="text-sm block font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                &#8592; Back to docs
              </Link>
            </Sidebar>
          }
          metaProps={{
            title: `Knock API Reference | Knock`,
            description: "Complete reference documentation for the Knock API.",
          }}
        >
          <div className="w-full max-w-5xl lg:flex mx-auto relative">
            <div className="w-full flex-auto">
              <div className="docs-content api-docs-content">
                {preContent}
                {docsOrdering.map((resourceName) => (
                  <ApiReferenceSection
                    key={resourceName}
                    resourceName={resourceName}
                    resource={stainlessSpec.resources[resourceName]}
                  />
                ))}
              </div>
            </div>
          </div>
        </Page>
      </div>
    </ApiReferenceProvider>
  );
}

export default ApiReference;
