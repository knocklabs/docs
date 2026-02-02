import { SplitApiReferenceProvider } from "@/components/ui/ApiReference/ApiReferenceContext";
import { ApiReferenceSection } from "@/components/ui/ApiReference";
import { SplitResourceData } from "@/lib/openApiSpec";
import { useInitialScrollState } from "@/components/ui/Page/helpers";

interface ResourceFullPageProps {
  data: SplitResourceData;
  basePath: string;
}

/**
 * Renders a full resource page with all methods, schemas, and subresources.
 * Uses split resource data for optimal page size.
 */
export function ResourceFullPage({ data, basePath }: ResourceFullPageProps) {
  // Handle scroll to hash on initial load
  useInitialScrollState();

  return (
    <SplitApiReferenceProvider data={data}>
      <ApiReferenceSection
        resourceName={data.resourceName}
        resource={data.resource}
        path={`/${data.resourceName}`}
      />
    </SplitApiReferenceProvider>
  );
}
