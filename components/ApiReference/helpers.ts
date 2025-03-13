import { OpenAPIV3 } from "@scalar/openapi-types";
import { StainlessConfig, StainlessResource } from "../../lib/openApiSpec";
import JSONPointer from "jsonpointer";
import { SidebarSection, SidebarSubsection } from "../../data/types";

const docsOrdering = [
  "workflows",
  "messages",
  "recipients",
  "users",
  "objects",
  "tenants",
  "schedules",
  "bulk_operations",
  "audiences",
  "providers",
];

function resolveEndpointFromMethod(
  endpointOrMethodConfig: string | { endpoint: string },
) {
  const endpointReference =
    typeof endpointOrMethodConfig === "string"
      ? endpointOrMethodConfig
      : endpointOrMethodConfig.endpoint;

  const [methodType, endpoint] = endpointReference.split(" ");
  return [methodType, endpoint];
}

function getSidebarContent(
  openApiSpec: OpenAPIV3.Document,
  stainlessSpec: StainlessConfig,
): SidebarSection[] {
  return [
    {
      title: "API Reference",
      slug: "/api-reference/overview",
      pages: [
        {
          title: "Overview",
          slug: `/`,
        },
        {
          title: "Client libraries",
          slug: `/client-libraries`,
        },
        {
          title: "API keys",
          slug: `/api-keys`,
        },
        {
          title: "Authentication",
          slug: `/authentication`,
        },
        {
          title: "Rate limits",
          slug: `/rate-limits`,
        },
        {
          title: "Batch rate limits",
          slug: `/batch-rate-limits`,
        },
        {
          title: "Idempotent requests",
          slug: `/idempotent-requests`,
        },
        {
          title: "Data retention",
          slug: `/data-retention`,
        },
        {
          title: "Bulk endpoints",
          slug: `/bulk-endpoints`,
        },
        {
          title: "Trigger data filtering",
          slug: `/trigger-data-filtering`,
        },
        {
          title: "Pagination",
          slug: `/pagination`,
        },
        {
          title: "Errors",
          slug: `/errors`,
        },
        {
          title: "Error codes",
          slug: `/error-codes`,
        },
      ],
    },
  ].concat(
    docsOrdering.map((resourceName) => {
      const resource = stainlessSpec.resources[resourceName];

      return {
        title: resource.name || resourceName,
        slug: `/api-reference/${resourceName}`,
        pages: buildSidebarPages(resource, openApiSpec),
      };
    }),
  );
}

function buildSidebarPages(
  resource: StainlessResource,
  openApiSpec: OpenAPIV3.Document,
) {
  let pages: SidebarSubsection[] = [
    {
      title: "Overview",
      slug: `/`,
    },
  ];

  if (resource.methods) {
    pages.push(
      ...Object.entries(resource.methods).map(([methodName, method]) => {
        const [methodType, endpoint] = resolveEndpointFromMethod(method);
        const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];

        return {
          title: openApiOperation.summary,
          slug: `/${methodName}`,
        };
      }),
    );
  }

  if (resource.models) {
    pages.push({
      title: "Object definitions",
      slug: `/schemas`,
      pages: Object.entries(resource.models).map(([modelName, modelRef]) => {
        const schema: OpenAPIV3.SchemaObject | undefined = JSONPointer.get(
          openApiSpec,
          modelRef.replace("#", ""),
        );

        return {
          title: schema?.title ?? modelName,
          slug: `/${modelName}`,
        };
      }),
    });
  }

  if (resource.subresources) {
    pages.push(
      ...Object.entries(resource.subresources).map(
        ([subresourceName, subresource]) => {
          return {
            title: subresource.name || subresourceName,
            slug: `/${subresourceName}`,
            pages: buildSidebarPages(subresource, openApiSpec),
          };
        },
      ),
    );
  }

  return pages;
}

export {
  getSidebarContent,
  resolveEndpointFromMethod,
  buildSidebarPages,
  docsOrdering,
};
