import React from "react";
import { ApiReferenceProvider } from "@/components/ui/ApiReference/ApiReferenceContext";
import { ApiReferenceSection } from "@/components/ui/ApiReference";
import { FullResourcePageData } from "@/lib/openApiSpec";
import { useInitialScrollState } from "@/components/ui/Page/helpers";

interface ResourceFullPageProps {
  data: FullResourcePageData;
  basePath: string;
}

/**
 * Renders a full resource page with all methods, schemas, and subresources.
 * This component wraps the existing ApiReferenceSection with the proper context.
 */
export function ResourceFullPage({ data, basePath }: ResourceFullPageProps) {
  // Handle scroll to hash on initial load
  useInitialScrollState();

  return (
    <ApiReferenceProvider
      openApiSpec={data.openApiSpec}
      stainlessConfig={data.stainlessConfig}
    >
      <ApiReferenceSection
        resourceName={data.resourceName}
        resource={data.resource}
        path={`/${data.resourceName}`}
      />
    </ApiReferenceProvider>
  );
}
