# API reference migration plan: Multi-page with ISR

This document outlines the plan for migrating the API reference from a single large page to multiple smaller pages using Incremental Static Regeneration (ISR).

## Table of contents

1. [Problem statement](#problem-statement)
2. [Solution overview](#solution-overview)
3. [Page structure options](#page-structure-options)
4. [Recommended architecture](#recommended-architecture)
5. [Implementation plan](#implementation-plan)
6. [Data loading strategy](#data-loading-strategy)
7. [Navigation and UX](#navigation-and-ux)
8. [Migration steps](#migration-steps)
9. [Testing and rollout](#testing-and-rollout)

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

Split the API reference into multiple smaller static pages, each containing only the data needed for that specific resource. Use ISR to keep pages fresh without full rebuilds.

### Key benefits

| Aspect         | Current                | After migration              |
| -------------- | ---------------------- | ---------------------------- |
| HTML per page  | 2-5MB (full spec)      | 50-150KB (single resource)   |
| Build strategy | Single page, full spec | Multiple pages, partial spec |
| Updates        | Full rebuild           | ISR per page                 |
| Hydration      | Full spec              | Resource data only           |

---

## Page structure options

### Option A: One page per resource

Each resource (users, workflows, etc.) gets its own page containing the resource overview, all methods, and all schemas.

```
pages/api-reference/
├── index.tsx                    # Overview + intro content
├── [resource].tsx               # Dynamic route for each resource
```

**Pros:**

- Simple routing (12 resource pages + overview)
- Each page is self-contained
- Maintains scroll experience within a resource
- Easier to implement

**Cons:**

- Resource pages can still be moderately large (100-300KB for resources with many methods)
- All methods load even if user only wants one

### Option B: One page per method

Every method gets its own dedicated page.

```
pages/api-reference/
├── index.tsx                    # Overview
├── [resource]/
│   ├── index.tsx                # Resource overview
│   ├── [method].tsx             # Individual method
│   └── schemas/
│       └── [schema].tsx         # Individual schema
```

**Pros:**

- Smallest possible pages (~20-50KB each)
- Maximum granularity for caching
- Fast navigation to specific endpoints

**Cons:**

- Many more pages to generate (100+ pages)
- Loses the scroll-through experience
- More complex navigation
- Users need more clicks to browse

### Option C: Hybrid - Resource pages with linked schemas

Resource pages contain the overview and all methods. Schemas are separate pages linked from method responses.

```
pages/api-reference/
├── index.tsx                    # Overview
├── [resource]/
│   ├── index.tsx                # Resource overview + all methods
│   └── schemas/
│       └── [schema].tsx         # Individual schema
```

**Pros:**

- Balanced page sizes
- Methods stay together (common browsing pattern)
- Schemas separately addressable

**Cons:**

- More complex than Option A
- Schema pages add navigation complexity

---

## Recommended architecture

**Option A: One page per resource** is recommended for the initial migration.

### Rationale

1. **Simplest implementation.** Fewest routing changes, minimal new pages.
2. **Good payload reduction.** 2-5MB → 50-150KB per page (90%+ reduction).
3. **Preserves scroll experience.** Users can scroll through all methods in a resource.
4. **Easy to enhance later.** Can split further into per-method pages if needed.

### Page structure

```
pages/
├── api-reference/
│   ├── index.tsx                # Overview page (intro, auth, errors, etc.)
│   └── [resource].tsx           # Resource page (overview + methods + schemas)
│
├── mapi-reference/
│   ├── index.tsx                # Management API overview
│   └── [resource].tsx           # Management API resources
```

### URL structure

| URL                        | Content                                         |
| -------------------------- | ----------------------------------------------- |
| `/api-reference`           | Overview, authentication, errors, etc.          |
| `/api-reference/users`     | Users resource with all methods and schemas     |
| `/api-reference/workflows` | Workflows resource with all methods and schemas |
| `/api-reference/messages`  | Messages resource with all methods and schemas  |
| ...                        | ...                                             |

### Handling subresources

Resources with subresources (like `users` with `feeds`, `guides`) will include the subresource content on the parent resource page:

```
/api-reference/users
├── Users overview
├── Users methods (get, list, update, delete, merge, etc.)
├── Users > Feeds methods
├── Users > Guides methods
└── Users schemas
```

This keeps related content together and avoids deep nesting.

---

## Implementation plan

### Phase 1: Data loading refactor

Create utilities to load partial spec data for a single resource.

#### Task 1.1: Create resource-specific loader

```typescript
// lib/openApiSpec.ts - add new functions

/**
 * Load only the data needed for a specific resource page.
 * This avoids loading the full spec into page props.
 */
export async function getResourcePageData(
  specName: "api" | "mapi",
  resourceName: string,
): Promise<ResourcePageData> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    readOpenApiSpec(specName),
    readStainlessSpec(specName),
  ]);

  const resource = stainlessSpec.resources[resourceName];
  if (!resource) {
    return null;
  }

  // Extract only the paths/schemas needed for this resource
  const methods = extractMethodsForResource(openApiSpec, resource);
  const schemas = extractSchemasForResource(openApiSpec, resource);
  const subresources = extractSubresources(openApiSpec, resource);

  return {
    resourceName,
    resource,
    methods,
    schemas,
    subresources,
    baseUrl: stainlessSpec.environments.production,
  };
}

/**
 * Extract only the OpenAPI operations needed for a resource's methods.
 */
function extractMethodsForResource(
  spec: OpenAPIV3.Document,
  resource: StainlessResource,
): MethodData[] {
  if (!resource.methods) return [];

  return Object.entries(resource.methods).map(([methodName, config]) => {
    const [methodType, endpoint] = resolveEndpoint(config);
    const operation = spec.paths?.[endpoint]?.[methodType];

    return {
      methodName,
      methodType,
      endpoint,
      operation,
    };
  });
}

/**
 * Extract only the schemas referenced by a resource.
 */
function extractSchemasForResource(
  spec: OpenAPIV3.Document,
  resource: StainlessResource,
): SchemaData[] {
  if (!resource.models) return [];

  return Object.entries(resource.models).map(([modelName, ref]) => {
    const schema = JSONPointer.get(spec, ref.replace("#", ""));
    return { modelName, schema };
  });
}
```

#### Task 1.2: Create sidebar data loader

```typescript
/**
 * Load just the sidebar structure without full spec data.
 * Used for navigation on all pages.
 */
export async function getSidebarData(
  specName: "api" | "mapi",
): Promise<SidebarData> {
  const stainlessSpec = await readStainlessSpec(specName);

  return {
    resources: Object.entries(stainlessSpec.resources).map(
      ([name, resource]) => ({
        name,
        title: resource.name || name,
        methodCount: Object.keys(resource.methods || {}).length,
        hasSubresources: !!resource.subresources,
      }),
    ),
  };
}
```

### Phase 2: Create new pages

#### Task 2.1: Create overview page

```typescript
// pages/api-reference/index.tsx

import { GetStaticProps } from "next";
import { getSidebarData } from "@/lib/openApiSpec";
import { serialize } from "next-mdx-remote/serialize";
import fs from "fs";

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

  const overviewMdx = fs.readFileSync(
    `${CONTENT_DIR}/__api-reference/content.mdx`,
    "utf-8",
  );
  const overviewContent = await serialize(overviewMdx, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxCodeProps],
    },
  });

  return {
    props: {
      sidebarData,
      overviewContent,
    },
    revalidate: 3600, // ISR: revalidate every hour
  };
};
```

#### Task 2.2: Create dynamic resource page

```typescript
// pages/api-reference/[resource].tsx

import { GetStaticPaths, GetStaticProps } from "next";
import {
  getResourcePageData,
  getSidebarData,
  getResourceOrder,
} from "@/lib/openApiSpec";

export default function ResourcePage({
  sidebarData,
  resourceData,
  schemaReferences,
}) {
  const { resourceName, resource, methods, schemas, subresources, baseUrl } =
    resourceData;

  return (
    <ApiReferenceLayout
      sidebarData={sidebarData}
      currentResource={resourceName}
    >
      {/* Resource Overview */}
      <ResourceOverview resource={resource} methods={methods} />

      {/* Methods */}
      {methods.map((method) => (
        <MethodSection
          key={method.methodName}
          method={method}
          baseUrl={baseUrl}
          schemaReferences={schemaReferences}
        />
      ))}

      {/* Subresources */}
      {subresources.map((subresource) => (
        <SubresourceSection
          key={subresource.name}
          subresource={subresource}
          baseUrl={baseUrl}
          schemaReferences={schemaReferences}
        />
      ))}

      {/* Schemas */}
      {schemas.length > 0 && (
        <SchemasSection schemas={schemas} schemaReferences={schemaReferences} />
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
    fallback: false, // 404 for unknown resources
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const resourceName = params.resource as string;

  const [sidebarData, resourceData] = await Promise.all([
    getSidebarData("api"),
    getResourcePageData("api", resourceName),
  ]);

  if (!resourceData) {
    return { notFound: true };
  }

  // Build schema references for this resource (for linking)
  const schemaReferences = buildSchemaReferencesForResource(
    resourceData,
    `/api-reference/${resourceName}`,
  );

  return {
    props: {
      sidebarData,
      resourceData,
      schemaReferences,
    },
    revalidate: 3600, // ISR: revalidate every hour
  };
};
```

### Phase 3: Create shared layout

#### Task 3.1: Create ApiReferenceLayout component

```typescript
// components/ApiReferenceLayout.tsx

interface Props {
  children: React.ReactNode;
  sidebarData: SidebarData;
  currentResource?: string;
}

export function ApiReferenceLayout({
  children,
  sidebarData,
  currentResource,
}: Props) {
  return (
    <Page.Container>
      <Meta
        title={
          currentResource
            ? `${currentResource} | API reference`
            : "API reference"
        }
        description="Complete reference documentation for the Knock API."
      />
      <Page.Masthead
        mobileSidebar={
          <Page.MobileSidebar
            content={buildSidebarContent(sidebarData, currentResource)}
          />
        }
      />
      <Page.Wrapper>
        <Page.FullSidebar
          content={buildSidebarContent(sidebarData, currentResource)}
        />
        <Page.Content>
          <Page.ContentBody>{children}</Page.ContentBody>
        </Page.Content>
      </Page.Wrapper>
    </Page.Container>
  );
}

function buildSidebarContent(
  sidebarData: SidebarData,
  currentResource?: string,
): SidebarSection[] {
  return [
    // Overview section
    {
      title: "API reference",
      slug: "/api-reference",
      pages: [
        { slug: "/", title: "Overview" },
        { slug: "/authentication", title: "Authentication" },
        { slug: "/errors", title: "Errors" },
        // ... other overview pages
      ],
    },
    // Resource sections
    ...sidebarData.resources.map((resource) => ({
      title: resource.title,
      slug: `/api-reference/${resource.name}`,
      isActive: resource.name === currentResource,
      pages: [], // Methods shown on the resource page, not in sidebar
    })),
  ];
}
```

### Phase 4: Component refactoring

#### Task 4.1: Refactor ResourceSection

Update to work with pre-extracted data instead of pulling from context.

```typescript
// components/ResourceOverview.tsx

interface Props {
  resource: StainlessResource;
  methods: MethodData[];
}

export function ResourceOverview({ resource, methods }: Props) {
  return (
    <Section title={resource.name} id={resource.name}>
      <ContentColumn>
        {resource.description && <Markdown>{resource.description}</Markdown>}
      </ContentColumn>
      <ExampleColumn>
        <Endpoints>
          {methods.map((method) => (
            <Endpoint
              key={method.methodName}
              method={method.methodType.toUpperCase()}
              path={method.endpoint}
              name={method.methodName}
              href={`#${method.methodName}`}
            />
          ))}
        </Endpoints>
      </ExampleColumn>
    </Section>
  );
}
```

#### Task 4.2: Refactor MethodSection

```typescript
// components/MethodSection.tsx

interface Props {
  method: MethodData;
  baseUrl: string;
  schemaReferences: Record<string, string>;
}

export function MethodSection({ method, baseUrl, schemaReferences }: Props) {
  const { methodName, methodType, endpoint, operation } = method;

  if (!operation) return null;

  // Component now receives data directly instead of from context
  return (
    <Section title={operation.summary} id={methodName}>
      {/* ... existing method content ... */}
    </Section>
  );
}
```

---

## Data loading strategy

### What changes

| Aspect            | Current                       | After migration                   |
| ----------------- | ----------------------------- | --------------------------------- |
| Spec loading      | Full spec in `getStaticProps` | Partial extraction per resource   |
| Context           | Full spec in React context    | No context needed (data in props) |
| Schema references | Built from full spec          | Built per-resource                |
| Sidebar           | Built from full spec          | Separate lightweight loader       |

### ISR configuration

```typescript
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // ... load data ...

  return {
    props: {
      /* ... */
    },
    revalidate: 3600, // Revalidate every hour
  };
};
```

**Why 1 hour?**

- API specs don't change frequently
- Allows updates without full redeploy
- Can be adjusted based on update frequency

**Alternative: On-demand revalidation**

```typescript
// pages/api/revalidate.ts
export default async function handler(req, res) {
  const { secret, path } = req.query;

  if (secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: "Invalid secret" });
  }

  await res.revalidate(path);
  return res.json({ revalidated: true });
}
```

Call this endpoint when specs are updated to immediately refresh pages.

---

## Navigation and UX

### Sidebar behavior

- **Overview pages** listed at top (Authentication, Errors, etc.)
- **Resources** listed below, each links to `/api-reference/[resource]`
- **Active resource** highlighted in sidebar
- **Methods** accessible via in-page anchor links, not sidebar expansion

### In-page navigation

Each resource page has:

1. **Resource overview** with endpoint list
2. **Method sections** with anchor IDs (`#trigger`, `#cancel`, etc.)
3. **Schema sections** at the bottom
4. **On-this-page navigation** (optional) for jumping between methods

### Cross-resource linking

Schema references that link to other resources:

```typescript
// Current: /api-reference/users/schemas/User
// After: /api-reference/users#user-schema

// Or if schemas are very large, separate pages:
// /api-reference/users/schemas/user
```

### URL compatibility

Add redirects for old hash-based URLs:

```javascript
// next.config.js
async redirects() {
  return [
    // Old: /api-reference#users-get
    // New: /api-reference/users#get
    // Handle via client-side detection if hash-based
  ];
}
```

---

## Migration steps

### Step 1: Create data loading utilities

1. Add `getResourcePageData()` function
2. Add `getSidebarData()` function
3. Add `getResourceOrder()` function
4. Test extraction with one resource

### Step 2: Create new page structure

1. Create `pages/api-reference/index.tsx` (overview)
2. Create `pages/api-reference/[resource].tsx` (dynamic resource)
3. Create `ApiReferenceLayout` component
4. Test with one resource

### Step 3: Refactor components

1. Update `ResourceOverview` to accept props
2. Update `MethodSection` to accept props
3. Update `SchemaSection` to accept props
4. Remove `ApiReferenceContext` dependency

### Step 4: Remove URL rewrites

Update `next.config.js`:

```javascript
// Remove these rewrites:
// {
//   source: "/api-reference/:path+",
//   destination: "/api-reference",
// },
```

### Step 5: Add redirects

```javascript
// Add redirects for backwards compatibility
{
  source: "/api-reference/overview",
  destination: "/api-reference",
  permanent: true,
},
{
  source: "/api-reference/overview/:path",
  destination: "/api-reference#:path",
  permanent: true,
},
```

### Step 6: Repeat for MAPI

Apply the same changes to `/mapi-reference`.

### Step 7: Remove old implementation

1. Delete old single-page implementation
2. Remove unused context
3. Clean up old components

---

## Testing and rollout

### Testing checklist

- [ ] All resources render correctly
- [ ] All methods display with correct data
- [ ] All schemas display with correct data
- [ ] Sidebar navigation works
- [ ] In-page anchor links work
- [ ] Mobile sidebar works
- [ ] ISR revalidation works
- [ ] Page sizes are reduced (measure with DevTools)
- [ ] Hydration is faster (measure with Lighthouse)

### Performance validation

Measure before and after:

| Metric                 | Target                   |
| ---------------------- | ------------------------ |
| HTML size              | <150KB per resource page |
| LCP                    | <2.5s                    |
| TTI                    | <3.8s                    |
| Lighthouse Performance | >90                      |

### Rollout strategy

1. **Deploy to preview** - Test on Vercel preview deployment
2. **Internal testing** - Team reviews all resource pages
3. **Gradual rollout** - Use feature flag or A/B test if needed
4. **Full rollout** - Remove old implementation
5. **Monitor** - Watch for 404s, performance issues

---

## Appendix: File changes summary

### New files

| File                                  | Purpose         |
| ------------------------------------- | --------------- |
| `pages/api-reference/index.tsx`       | Overview page   |
| `pages/api-reference/[resource].tsx`  | Resource pages  |
| `pages/mapi-reference/index.tsx`      | MAPI overview   |
| `pages/mapi-reference/[resource].tsx` | MAPI resources  |
| `components/ApiReferenceLayout.tsx`   | Shared layout   |
| `components/ResourceOverview.tsx`     | Resource header |
| `components/MethodSection.tsx`        | Method display  |
| `components/SchemasSection.tsx`       | Schema display  |

### Modified files

| File                                  | Changes                        |
| ------------------------------------- | ------------------------------ |
| `lib/openApiSpec.ts`                  | Add partial loading functions  |
| `next.config.js`                      | Remove rewrites, add redirects |
| `data/sidebars/apiOverviewSidebar.ts` | May need updates               |

### Deleted files

| File                                                 | Reason                    |
| ---------------------------------------------------- | ------------------------- |
| `components/ui/ApiReference/ApiReferenceContext.tsx` | No longer needed          |
| Old single-page components                           | Replaced by new structure |

---

## Appendix: Example page data size

Estimated sizes for resource pages (JSON props):

| Resource        | Methods | Schemas | Estimated size |
| --------------- | ------- | ------- | -------------- |
| users           | 15      | 5       | ~80KB          |
| workflows       | 5       | 8       | ~60KB          |
| messages        | 8       | 6       | ~70KB          |
| objects         | 12      | 4       | ~65KB          |
| tenants         | 4       | 2       | ~30KB          |
| schedules       | 6       | 3       | ~40KB          |
| channels        | 3       | 2       | ~25KB          |
| audiences       | 4       | 3       | ~35KB          |
| bulk_operations | 3       | 2       | ~25KB          |
| providers       | 2       | 1       | ~20KB          |
| recipients      | 2       | 4       | ~30KB          |
| $shared         | 0       | 2       | ~15KB          |

**Total pages:** 12 resource pages + 2 overview pages = 14 pages

**Compare to current:** 1 page with 2-5MB payload
