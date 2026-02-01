# API reference migration plan: Multi-page with ISR

This document outlines the plan for migrating the API reference from a single large page to multiple smaller pages using Incremental Static Regeneration (ISR). Each method and schema gets its own URL path for clean, shareable links.

## Table of contents

1. [Problem statement](#problem-statement)
2. [Solution overview](#solution-overview)
3. [Recommended architecture](#recommended-architecture)
4. [Implementation plan](#implementation-plan)
5. [Data loading strategy](#data-loading-strategy)
6. [Navigation and UX](#navigation-and-ux)
7. [Migration steps](#migration-steps)
8. [Testing and rollout](#testing-and-rollout)

---

## Problem statement

### Current issues

1. **Massive page payload.** The entire dereferenced OpenAPI spec (~2-5MB) is embedded in the HTML via `getStaticProps`.

2. **Slow hydration.** React must hydrate the full spec on page load, blocking interactivity.

3. **Build memory pressure.** Dereferencing large specs with circular references consumes significant memory.

4. **Single page for all content.** URL rewrites serve the same static HTML for all `/api-reference/*` paths.

### Constraints

- **Telegraph components do not support RSC.** App Router with Server Components would require rewriting the styling layer.
- **Must work with Pages Router.** The solution must be compatible with the current Next.js Pages Router architecture.

---

## Solution overview

Split the API reference into individual pages for each resource, method, and schema. Use clean URL paths (`/api-reference/users/get`) instead of hash fragments. Use ISR to keep pages fresh without full rebuilds.

### Key benefits

| Aspect         | Current                   | After migration              |
| -------------- | ------------------------- | ---------------------------- |
| HTML per page  | 2-5MB (full spec)         | 20-50KB (single method)      |
| URL structure  | Hash-based (`#users-get`) | Path-based (`/users/get`)    |
| Build strategy | Single page, full spec    | Multiple pages, partial spec |
| Updates        | Full rebuild              | ISR per page                 |
| Hydration      | Full spec                 | Single method data only      |

---

## Recommended architecture

### Page structure

```
pages/api-reference/
├── index.tsx                           # Overview (intro, auth, errors)
├── [resource]/
│   ├── index.tsx                       # Resource overview + endpoint list
│   ├── [method].tsx                    # Individual method page
│   └── schemas/
│       └── [schema].tsx                # Individual schema page
```

### URL structure

| URL                                 | Content                                            |
| ----------------------------------- | -------------------------------------------------- |
| `/api-reference`                    | Overview, authentication, errors, pagination, etc. |
| `/api-reference/users`              | Users resource overview with endpoint list         |
| `/api-reference/users/get`          | Get user method documentation                      |
| `/api-reference/users/list`         | List users method documentation                    |
| `/api-reference/users/update`       | Update user method documentation                   |
| `/api-reference/users/schemas/user` | User schema definition                             |
| `/api-reference/workflows`          | Workflows resource overview                        |
| `/api-reference/workflows/trigger`  | Trigger workflow method                            |
| ...                                 | ...                                                |

### Handling subresources

Subresources use nested paths. The `[method].tsx` catch-all handles the nesting:

| URL                                       | Content                  |
| ----------------------------------------- | ------------------------ |
| `/api-reference/users/feeds/list_items`   | List feed items method   |
| `/api-reference/users/guides/get_channel` | Get guide channel method |

To handle this, use a catch-all route:

```
pages/api-reference/
├── index.tsx
├── [resource]/
│   ├── index.tsx
│   ├── [...slug].tsx                   # Catches /method, /subresource/method, /schemas/name
```

### Estimated page counts

| Type               | Count    | Example                             |
| ------------------ | -------- | ----------------------------------- |
| Overview           | 1        | `/api-reference`                    |
| Resource overviews | 12       | `/api-reference/users`              |
| Method pages       | ~80      | `/api-reference/users/get`          |
| Schema pages       | ~40      | `/api-reference/users/schemas/user` |
| **Total**          | **~133** |                                     |

### Page size estimates

| Page type         | Estimated size |
| ----------------- | -------------- |
| Overview          | ~30KB          |
| Resource overview | ~15KB          |
| Method page       | ~20-40KB       |
| Schema page       | ~10-20KB       |

**Compare to current:** Single page with 2-5MB payload

---

## Implementation plan

### Phase 1: Data loading refactor

Create utilities to load data for individual pages.

#### Task 1.1: Create method-specific loader

```typescript
// lib/openApiSpec.ts - add new functions

/**
 * Load data for a single method page.
 */
export async function getMethodPageData(
  specName: "api" | "mapi",
  resourceName: string,
  methodName: string,
): Promise<MethodPageData | null> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    readOpenApiSpec(specName),
    readStainlessSpec(specName),
  ]);

  const resource = stainlessSpec.resources[resourceName];
  if (!resource?.methods?.[methodName]) {
    return null;
  }

  const methodConfig = resource.methods[methodName];
  const [methodType, endpoint] = resolveEndpoint(methodConfig);
  const operation = openApiSpec.paths?.[endpoint]?.[methodType];

  if (!operation) {
    return null;
  }

  return {
    resourceName,
    resourceTitle: resource.name || resourceName,
    methodName,
    methodType,
    endpoint,
    operation,
    baseUrl: stainlessSpec.environments.production,
  };
}

/**
 * Load data for a single schema page.
 */
export async function getSchemaPageData(
  specName: "api" | "mapi",
  resourceName: string,
  schemaName: string,
): Promise<SchemaPageData | null> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    readOpenApiSpec(specName),
    readStainlessSpec(specName),
  ]);

  const resource = stainlessSpec.resources[resourceName];
  if (!resource?.models?.[schemaName]) {
    return null;
  }

  const schemaRef = resource.models[schemaName];
  const schema = JSONPointer.get(openApiSpec, schemaRef.replace("#", ""));

  if (!schema) {
    return null;
  }

  return {
    resourceName,
    resourceTitle: resource.name || resourceName,
    schemaName,
    schema,
  };
}

/**
 * Load data for a resource overview page.
 */
export async function getResourceOverviewData(
  specName: "api" | "mapi",
  resourceName: string,
): Promise<ResourceOverviewData | null> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    readOpenApiSpec(specName),
    readStainlessSpec(specName),
  ]);

  const resource = stainlessSpec.resources[resourceName];
  if (!resource) {
    return null;
  }

  // Build list of methods with just summary info (not full operation)
  const methods = Object.entries(resource.methods || {}).map(
    ([methodName, config]) => {
      const [methodType, endpoint] = resolveEndpoint(config);
      const operation = openApiSpec.paths?.[endpoint]?.[methodType];
      return {
        methodName,
        methodType,
        endpoint,
        summary: operation?.summary || methodName,
      };
    },
  );

  // Build list of schemas with just name/title
  const schemas = Object.entries(resource.models || {}).map(
    ([schemaName, ref]) => {
      const schema = JSONPointer.get(openApiSpec, ref.replace("#", ""));
      return {
        schemaName,
        title: schema?.title || schemaName,
      };
    },
  );

  // Build subresource info
  const subresources = Object.entries(resource.subresources || {}).map(
    ([subName, subResource]) => ({
      name: subName,
      title: subResource.name || subName,
      methodCount: Object.keys(subResource.methods || {}).length,
    }),
  );

  return {
    resourceName,
    resource: {
      name: resource.name,
      description: resource.description,
    },
    methods,
    schemas,
    subresources,
  };
}
```

#### Task 1.2: Create path generation utilities

```typescript
/**
 * Generate all static paths for API reference pages.
 */
export async function getAllApiReferencePaths(
  specName: "api" | "mapi",
): Promise<Array<{ params: { resource: string; slug?: string[] } }>> {
  const stainlessSpec = await readStainlessSpec(specName);
  const paths: Array<{ params: { resource: string; slug?: string[] } }> = [];

  function processResource(
    resource: StainlessResource,
    resourceName: string,
    parentSlug: string[] = [],
  ) {
    // Resource overview (no slug)
    if (parentSlug.length === 0) {
      paths.push({ params: { resource: resourceName } });
    }

    // Method pages
    if (resource.methods) {
      Object.keys(resource.methods).forEach((methodName) => {
        paths.push({
          params: {
            resource: resourceName,
            slug: [...parentSlug, methodName],
          },
        });
      });
    }

    // Schema pages
    if (resource.models) {
      Object.keys(resource.models).forEach((schemaName) => {
        paths.push({
          params: {
            resource: resourceName,
            slug: [...parentSlug, "schemas", schemaName],
          },
        });
      });
    }

    // Subresources (recursive)
    if (resource.subresources) {
      Object.entries(resource.subresources).forEach(
        ([subName, subResource]) => {
          // Subresource overview
          paths.push({
            params: {
              resource: resourceName,
              slug: [...parentSlug, subName],
            },
          });

          // Subresource methods and schemas
          processResource(subResource, resourceName, [...parentSlug, subName]);
        },
      );
    }
  }

  Object.entries(stainlessSpec.resources).forEach(
    ([resourceName, resource]) => {
      processResource(resource, resourceName);
    },
  );

  return paths;
}
```

#### Task 1.3: Create sidebar data loader

```typescript
/**
 * Load sidebar structure for navigation.
 * Includes links to all resources, methods, and schemas.
 */
export async function getSidebarData(
  specName: "api" | "mapi",
): Promise<SidebarData> {
  const stainlessSpec = await readStainlessSpec(specName);
  const basePath = specName === "api" ? "/api-reference" : "/mapi-reference";

  function buildResourceSidebar(
    resource: StainlessResource,
    resourceName: string,
    pathPrefix: string,
  ): SidebarSection {
    const pages: SidebarPage[] = [];

    // Methods
    if (resource.methods) {
      Object.keys(resource.methods).forEach((methodName) => {
        pages.push({
          slug: `${pathPrefix}/${methodName}`,
          title: methodName,
        });
      });
    }

    // Subresources
    if (resource.subresources) {
      Object.entries(resource.subresources).forEach(
        ([subName, subResource]) => {
          pages.push({
            slug: `${pathPrefix}/${subName}`,
            title: subResource.name || subName,
            pages: Object.keys(subResource.methods || {}).map((methodName) => ({
              slug: `${pathPrefix}/${subName}/${methodName}`,
              title: methodName,
            })),
          });
        },
      );
    }

    // Schemas
    if (resource.models && Object.keys(resource.models).length > 0) {
      pages.push({
        slug: `${pathPrefix}/schemas`,
        title: "Schemas",
        pages: Object.keys(resource.models).map((schemaName) => ({
          slug: `${pathPrefix}/schemas/${schemaName}`,
          title: schemaName,
        })),
      });
    }

    return {
      title: resource.name || resourceName,
      slug: pathPrefix,
      pages,
    };
  }

  const resources = Object.entries(stainlessSpec.resources).map(
    ([resourceName, resource]) =>
      buildResourceSidebar(
        resource,
        resourceName,
        `${basePath}/${resourceName}`,
      ),
  );

  return { resources };
}
```

### Phase 2: Create page files

#### Task 2.1: Create overview page

```typescript
// pages/api-reference/index.tsx

import { GetStaticProps } from "next";
import { getSidebarData } from "@/lib/openApiSpec";

export default function ApiReferenceOverview({ sidebarData, overviewContent }) {
  return (
    <ApiReferenceLayout sidebarData={sidebarData}>
      <PageHeader
        title="API reference"
        description="Complete reference documentation for the Knock API."
      />
      <MDXRemote {...overviewContent} components={MDX_COMPONENTS} />
      <ResourceList resources={sidebarData.resources} />
    </ApiReferenceLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const sidebarData = await getSidebarData("api");
  const overviewContent = await loadOverviewMdx();

  return {
    props: { sidebarData, overviewContent },
    revalidate: 3600,
  };
};
```

#### Task 2.2: Create resource overview page

```typescript
// pages/api-reference/[resource]/index.tsx

import { GetStaticPaths, GetStaticProps } from "next";
import {
  getResourceOverviewData,
  getSidebarData,
  getResourceOrder,
} from "@/lib/openApiSpec";

export default function ResourceOverviewPage({ sidebarData, resourceData }) {
  return (
    <ApiReferenceLayout
      sidebarData={sidebarData}
      currentPath={`/api-reference/${resourceData.resourceName}`}
    >
      <PageHeader
        title={resourceData.resource.name}
        description={resourceData.resource.description}
      />

      {/* Endpoint list */}
      <EndpointList
        methods={resourceData.methods}
        basePath={`/api-reference/${resourceData.resourceName}`}
      />

      {/* Subresources */}
      {resourceData.subresources.length > 0 && (
        <SubresourceList
          subresources={resourceData.subresources}
          basePath={`/api-reference/${resourceData.resourceName}`}
        />
      )}

      {/* Schemas */}
      {resourceData.schemas.length > 0 && (
        <SchemaList
          schemas={resourceData.schemas}
          basePath={`/api-reference/${resourceData.resourceName}`}
        />
      )}
    </ApiReferenceLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const resourceOrder = await getResourceOrder("api");
  return {
    paths: resourceOrder.map((resource) => ({
      params: { resource },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const resourceName = params.resource as string;
  const [sidebarData, resourceData] = await Promise.all([
    getSidebarData("api"),
    getResourceOverviewData("api", resourceName),
  ]);

  if (!resourceData) {
    return { notFound: true };
  }

  return {
    props: { sidebarData, resourceData },
    revalidate: 3600,
  };
};
```

#### Task 2.3: Create catch-all page for methods and schemas

```typescript
// pages/api-reference/[resource]/[...slug].tsx

import { GetStaticPaths, GetStaticProps } from "next";
import {
  getAllApiReferencePaths,
  getMethodPageData,
  getSchemaPageData,
  getSidebarData,
} from "@/lib/openApiSpec";

type PageType = "method" | "schema" | "subresource";

export default function ApiReferenceDynamicPage({
  pageType,
  sidebarData,
  data,
  schemaReferences,
}) {
  if (pageType === "schema") {
    return (
      <ApiReferenceLayout sidebarData={sidebarData}>
        <SchemaPage data={data} schemaReferences={schemaReferences} />
      </ApiReferenceLayout>
    );
  }

  // Method page (default)
  return (
    <ApiReferenceLayout sidebarData={sidebarData}>
      <MethodPage data={data} schemaReferences={schemaReferences} />
    </ApiReferenceLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllApiReferencePaths("api");
  // Filter to only paths with slug (not resource overview)
  const slugPaths = paths.filter((p) => p.params.slug);
  return { paths: slugPaths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const resourceName = params.resource as string;
  const slug = params.slug as string[];

  const sidebarData = await getSidebarData("api");

  // Determine page type from slug
  // /users/schemas/user -> schema page
  // /users/get -> method page
  // /users/feeds/list_items -> subresource method page

  if (slug.includes("schemas")) {
    const schemaIndex = slug.indexOf("schemas");
    const schemaName = slug[schemaIndex + 1];

    const data = await getSchemaPageData("api", resourceName, schemaName);
    if (!data) return { notFound: true };

    const schemaReferences = await buildSchemaReferences("api");

    return {
      props: {
        pageType: "schema",
        sidebarData,
        data,
        schemaReferences,
      },
      revalidate: 3600,
    };
  }

  // Method page (possibly in subresource)
  const methodName = slug[slug.length - 1];
  const subresourcePath = slug.slice(0, -1);

  const data = await getMethodPageData(
    "api",
    resourceName,
    methodName,
    subresourcePath,
  );

  if (!data) return { notFound: true };

  const schemaReferences = await buildSchemaReferences("api");

  return {
    props: {
      pageType: "method",
      sidebarData,
      data,
      schemaReferences,
    },
    revalidate: 3600,
  };
};
```

### Phase 3: Create page components

#### Task 3.1: Create MethodPage component

```typescript
// components/api-reference/MethodPage.tsx

interface Props {
  data: MethodPageData;
  schemaReferences: Record<string, string>;
}

export function MethodPage({ data, schemaReferences }: Props) {
  const { operation, methodType, endpoint, baseUrl } = data;

  return (
    <>
      <PageHeader
        title={operation.summary}
        breadcrumbs={[
          { label: "API reference", href: "/api-reference" },
          {
            label: data.resourceTitle,
            href: `/api-reference/${data.resourceName}`,
          },
        ]}
      />

      <MethodContent
        operation={operation}
        methodType={methodType}
        endpoint={endpoint}
        baseUrl={baseUrl}
        schemaReferences={schemaReferences}
      />
    </>
  );
}
```

#### Task 3.2: Create SchemaPage component

```typescript
// components/api-reference/SchemaPage.tsx

interface Props {
  data: SchemaPageData;
  schemaReferences: Record<string, string>;
}

export function SchemaPage({ data, schemaReferences }: Props) {
  const { schema, schemaName } = data;

  return (
    <>
      <PageHeader
        title={schema.title || schemaName}
        breadcrumbs={[
          { label: "API reference", href: "/api-reference" },
          {
            label: data.resourceTitle,
            href: `/api-reference/${data.resourceName}`,
          },
          {
            label: "Schemas",
            href: `/api-reference/${data.resourceName}/schemas`,
          },
        ]}
      />

      <SchemaContent schema={schema} schemaReferences={schemaReferences} />
    </>
  );
}
```

#### Task 3.3: Create EndpointList component

```typescript
// components/api-reference/EndpointList.tsx

interface Props {
  methods: Array<{
    methodName: string;
    methodType: string;
    endpoint: string;
    summary: string;
  }>;
  basePath: string;
}

export function EndpointList({ methods, basePath }: Props) {
  return (
    <div className="divide-y divide-gray-200">
      {methods.map((method) => (
        <Link
          key={method.methodName}
          href={`${basePath}/${method.methodName}`}
          className="flex items-center gap-4 py-4 hover:bg-gray-50"
        >
          <MethodBadge method={method.methodType} />
          <div>
            <code className="text-sm font-mono">{method.endpoint}</code>
            <p className="text-sm text-gray-600">{method.summary}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

---

## Data loading strategy

### What changes

| Aspect            | Current                       | After migration                   |
| ----------------- | ----------------------------- | --------------------------------- |
| Spec loading      | Full spec in `getStaticProps` | Load only needed operation/schema |
| Context           | Full spec in React context    | No context needed (data in props) |
| Schema references | Built from full spec          | Built once, shared across pages   |
| Sidebar           | Built from full spec          | Separate lightweight loader       |

### ISR configuration

```typescript
export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      /* ... */
    },
    revalidate: 3600, // Revalidate every hour
  };
};
```

**On-demand revalidation (optional)**

```typescript
// pages/api/revalidate.ts
export default async function handler(req, res) {
  const { secret, paths } = req.body;

  if (secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: "Invalid secret" });
  }

  // Revalidate specific paths
  await Promise.all(paths.map((path) => res.revalidate(path)));

  return res.json({ revalidated: true });
}
```

---

## Navigation and UX

### Sidebar behavior

- **Overview section** at top with general topics
- **Resources** listed as collapsible sections
- **Methods** listed under each resource
- **Schemas** grouped under "Schemas" subsection
- **Current page** highlighted in sidebar

### Breadcrumb navigation

Every page shows breadcrumbs:

```
API reference > Users > Get user
API reference > Users > Schemas > User
API reference > Workflows > Trigger workflow
```

### Previous/Next navigation

Add footer navigation to move between methods:

```typescript
// In MethodPage component
<PageFooter
  previous={{ title: "List users", href: "/api-reference/users/list" }}
  next={{ title: "Update user", href: "/api-reference/users/update" }}
/>
```

### Cross-resource linking

Schema references link to schema pages:

```typescript
// In MethodContent, when showing return type
<Link href={schemaReferences["User"]}>User</Link>
// Links to /api-reference/users/schemas/user
```

---

## Migration steps

### Step 1: Create data loading utilities

1. Add `getMethodPageData()` function
2. Add `getSchemaPageData()` function
3. Add `getResourceOverviewData()` function
4. Add `getAllApiReferencePaths()` function
5. Add `getSidebarData()` function
6. Test with one resource

### Step 2: Create new page files

1. Create `pages/api-reference/index.tsx`
2. Create `pages/api-reference/[resource]/index.tsx`
3. Create `pages/api-reference/[resource]/[...slug].tsx`
4. Create page components (MethodPage, SchemaPage, etc.)
5. Test all paths generate correctly

### Step 3: Create shared components

1. Create `ApiReferenceLayout` component
2. Create `EndpointList` component
3. Create `MethodContent` component (refactor from existing)
4. Create `SchemaContent` component (refactor from existing)
5. Create breadcrumb navigation

### Step 4: Update next.config.js

```javascript
// Remove old rewrites
// {
//   source: "/api-reference/:path+",
//   destination: "/api-reference",
// },

// Add redirects for old URLs if needed
async redirects() {
  return [
    // If you had hash-based URLs that were indexed
  ];
}
```

### Step 5: Repeat for MAPI

Apply the same structure to `/mapi-reference`.

### Step 6: Remove old implementation

1. Delete `pages/api-reference/index.tsx` (old single page)
2. Remove `ApiReferenceContext`
3. Clean up unused components

---

## Testing and rollout

### Testing checklist

- [ ] All resource overview pages render
- [ ] All method pages render with correct data
- [ ] All schema pages render with correct data
- [ ] Sidebar navigation highlights current page
- [ ] Breadcrumbs work correctly
- [ ] Cross-resource schema links work
- [ ] Mobile sidebar works
- [ ] ISR revalidation works
- [ ] 404 pages for invalid paths
- [ ] Page sizes are small (check with DevTools)

### Performance validation

| Metric                    | Target |
| ------------------------- | ------ |
| HTML size per method page | <50KB  |
| HTML size per schema page | <25KB  |
| LCP                       | <2.5s  |
| TTI                       | <3.8s  |
| Lighthouse Performance    | >90    |

### Rollout strategy

1. **Deploy to preview** - Test on Vercel preview
2. **Verify all pages** - Script to check all generated paths
3. **Compare with current** - Ensure no missing content
4. **Deploy to production** - Remove old implementation
5. **Monitor** - Watch for 404s, broken links

---

## Appendix: File structure summary

### New files

```
pages/api-reference/
├── index.tsx                        # Overview page
├── [resource]/
│   ├── index.tsx                    # Resource overview
│   └── [...slug].tsx                # Methods and schemas

components/api-reference/
├── ApiReferenceLayout.tsx           # Shared layout
├── MethodPage.tsx                   # Method page component
├── SchemaPage.tsx                   # Schema page component
├── MethodContent.tsx                # Method documentation
├── SchemaContent.tsx                # Schema documentation
├── EndpointList.tsx                 # List of endpoints
├── SchemaList.tsx                   # List of schemas
├── SubresourceList.tsx              # List of subresources
└── MethodBadge.tsx                  # GET/POST/etc badge

lib/
├── openApiSpec.ts                   # Add new loader functions
```

### Estimated page counts

| Spec      | Resources | Methods | Schemas | Total pages |
| --------- | --------- | ------- | ------- | ----------- |
| API       | 12        | ~80     | ~40     | ~133        |
| MAPI      | ~10       | ~60     | ~30     | ~100        |
| **Total** |           |         |         | **~233**    |

Build time should remain reasonable since each page loads minimal data.
