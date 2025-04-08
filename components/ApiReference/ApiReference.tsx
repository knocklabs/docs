"use client";

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
import { getSidebarContent } from "./helpers";
import { SidebarSection } from "../../data/types";

type Props = {
  name: string;
  openApiSpec: OpenAPIV3.Document;
  stainlessSpec: StainlessConfig;
  preContent?: React.ReactNode;
  preSidebarContent?: SidebarSection[];
  resourceOrder: string[];
};

function onElementClick(e: Event) {
  e.preventDefault();
  e.stopPropagation();
}

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

  useEffect(() => {
    const path = router.asPath;

    const resourcePath = path.replace(`/${basePath}`, "");
    const element = document.querySelector(
      `[data-resource-path="${resourcePath}"]`,
    );

    element?.scrollIntoView();
  }, [router.asPath, basePath]);

  useLayoutEffect(() => {
    document
      .querySelector(".sidebar a")
      ?.addEventListener("click", onElementClick);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const resourcePath =
              entry.target.getAttribute("data-resource-path");

            const lastActiveElements =
              document.querySelectorAll(".sidebar .active");

            const newActiveElement = document.querySelector(
              `.sidebar a[href*='/${basePath}${resourcePath}']`,
            )?.parentElement;

            if (lastActiveElements.length > 0) {
              lastActiveElements.forEach((element) => {
                element.parentElement?.parentElement?.classList.remove(
                  "sidebar-subsection--active",
                );

                element.classList.remove("active");
              });
            }

            if (newActiveElement) {
              newActiveElement.parentElement?.parentElement?.classList.add(
                "sidebar-subsection--active",
              );

              newActiveElement.classList.add("active");
              newActiveElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }

            if (resourcePath) {
              window.history.replaceState(
                null,
                "",
                `/${basePath}${resourcePath}`,
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
  }, [basePath]);

  return (
    <ApiReferenceProvider
      openApiSpec={openApiSpec}
      stainlessConfig={stainlessSpec}
    >
      <div className="wrapper">
        <Page
          header={<MinimalHeader pageType="API" />}
          sidebar={
            <Sidebar
              content={getSidebarContent(
                openApiSpec,
                stainlessSpec,
                resourceOrder,
                basePath,
                preSidebarContent,
              )}
            >
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
            title: `Knock ${name} Reference | Knock`,
            description: `Complete reference documentation for the Knock ${name}.`,
          }}
        >
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
        </Page>
      </div>
    </ApiReferenceProvider>
  );
}

export default ApiReference;
