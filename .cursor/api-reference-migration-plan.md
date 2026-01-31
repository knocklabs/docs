# API reference App Router migration plan

This document provides a comprehensive plan for migrating the API reference pages from the Pages Router to the App Router with Server Components. The goal is to eliminate build and runtime issues caused by loading the entire OpenAPI spec into page props.

## Table of contents

1. [Problem statement](#problem-statement)
2. [Solution overview](#solution-overview)
3. [Architecture design](#architecture-design)
4. [Migration phases](#migration-phases)
5. [Detailed implementation tasks](#detailed-implementation-tasks)
6. [Component breakdown](#component-breakdown)
7. [Testing strategy](#testing-strategy)
8. [Rollback plan](#rollback-plan)
9. [Success criteria](#success-criteria)

---

## Problem statement

### Current issues

The current API reference implementation has several architectural problems:

1. **Massive page payload.** The entire dereferenced OpenAPI spec (~600KB for API, ~500KB for MAPI as raw YAML) is passed through `getStaticProps`. After dereferencing and JSON serialization, this can expand to 2-5MB embedded in the HTML.

2. **Build-time memory pressure.** The `@scalar/openapi-parser` dereference operation resolves all `$ref` pointers inline, which can consume significant memory for specs with circular references.

3. **Long hydration times.** React must hydrate the massive props object on page load, blocking interactivity.

4. **Poor Core Web Vitals.** Large HTML payloads negatively impact First Contentful Paint (FCP) and Largest Contentful Paint (LCP).

5. **Single-page architecture limitations.** The current approach uses URL rewrites to serve a single static page for all API reference paths, meaning every path loads the full spec.

### Root cause

The fundamental issue is that `getStaticProps` serializes all returned data into the page HTML. The OpenAPI spec is large, and passing it as props means every page visitor downloads the entire spec even if they only view one endpoint.

---

## Solution overview

### App Router with Server Components

The App Router with React Server Components solves these problems by:

1. **Server-only data.** Server Components can load and process data that never leaves the server. The OpenAPI spec is processed on the server and only the rendered HTML is sent to the client.

2. **React `cache()` for deduplication.** The spec is loaded once per request/build and cached in memory, shared across all components that need it.

3. **Streaming and Suspense.** Individual sections can stream to the client as they're ready, improving Time to First Byte (TTFB).

4. **Client component islands.** Only interactive elements (expandable sections, code example toggles) require client-side JavaScript.

### Expected outcomes

| Metric               | Current   | After migration        |
| -------------------- | --------- | ---------------------- |
| HTML payload size    | 2-5MB     | ~50-100KB              |
| JavaScript hydration | Full spec | Minimal (islands only) |
| Build memory         | High      | Reduced (cached)       |
| Time to Interactive  | Slow      | Fast                   |

---

## Architecture design

### Directory structure

```
app/
├── (api-reference)/                    # Route group (no URL segment)
│   ├── layout.tsx                      # Shared layout with providers
│   ├── providers.tsx                   # Client-side providers
│   │
│   ├── api-reference/                  # /api-reference routes
│   │   ├── page.tsx                    # Overview page (Server Component)
│   │   ├── loading.tsx                 # Loading skeleton
│   │   ├── [resource]/                 # Dynamic resource routes
│   │   │   ├── page.tsx                # Resource overview
│   │   │   ├── [method]/               # Dynamic method routes
│   │   │   │   └── page.tsx            # Method detail page
│   │   │   └── schemas/
│   │   │       └── [schema]/
│   │   │           └── page.tsx        # Schema detail page
│   │   └── components/                 # API reference specific components
│   │       ├── resource-section.tsx    # Server Component
│   │       ├── method-content.tsx      # Server Component
│   │       ├── schema-content.tsx      # Server Component
│   │       ├── endpoint-list.tsx       # Server Component
│   │       ├── parameter-list.tsx      # Server Component
│   │       ├── property-list.tsx       # Server Component
│   │       ├── expandable-properties.tsx  # Client Component (island)
│   │       ├── code-example-tabs.tsx   # Client Component (island)
│   │       └── sidebar-nav.tsx         # Client Component (island)
│   │
│   └── mapi-reference/                 # /mapi-reference routes
│       └── ... (same structure as api-reference)
│
lib/
├── openapi/                            # OpenAPI utilities
│   ├── loader.ts                       # Cached spec loading
│   ├── types.ts                        # TypeScript types
│   ├── helpers.ts                      # Utility functions
│   └── sidebar.ts                      # Sidebar generation
```

### Data flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           BUILD / REQUEST                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐    ┌──────────────────┐                       │
│  │  openapi.yml     │───▶│  loader.ts       │                       │
│  │  stainless.yml   │    │  (React cache)   │                       │
│  └──────────────────┘    └────────┬─────────┘                       │
│                                   │                                  │
│                          Parsed & cached in memory                   │
│                                   │                                  │
│                                   ▼                                  │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Server Components                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │   │
│  │  │ page.tsx    │  │ resource-   │  │ method-     │          │   │
│  │  │ (overview)  │  │ section.tsx │  │ content.tsx │          │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │   │
│  │         │                │                │                   │   │
│  │         │    Extract relevant slice       │                   │   │
│  │         ▼                ▼                ▼                   │   │
│  │  ┌─────────────────────────────────────────────────────┐     │   │
│  │  │              Rendered HTML                           │     │   │
│  │  └─────────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                   │                                  │
└───────────────────────────────────┼──────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Static HTML                               │    │
│  │  (No OpenAPI spec data - just rendered content)             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              +                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Client Component Islands                         │   │
│  │  ┌───────────────────┐  ┌───────────────────┐               │   │
│  │  │ expandable-       │  │ code-example-     │               │   │
│  │  │ properties.tsx    │  │ tabs.tsx          │               │   │
│  │  │ (toggle state)    │  │ (language state)  │               │   │
│  │  └───────────────────┘  └───────────────────┘               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Server vs Client component split

| Component                   | Type   | Reason                             |
| --------------------------- | ------ | ---------------------------------- |
| `page.tsx`                  | Server | Loads spec, renders static content |
| `resource-section.tsx`      | Server | Renders resource overview          |
| `method-content.tsx`        | Server | Renders endpoint documentation     |
| `schema-content.tsx`        | Server | Renders schema/model documentation |
| `parameter-list.tsx`        | Server | Renders parameter tables           |
| `property-list.tsx`         | Server | Renders property tables            |
| `endpoint-list.tsx`         | Server | Renders endpoint summary list      |
| `expandable-properties.tsx` | Client | Toggle expand/collapse state       |
| `code-example-tabs.tsx`     | Client | Language selection state           |
| `sidebar-nav.tsx`           | Client | Active state, scroll tracking      |
| `providers.tsx`             | Client | Analytics, AI chat context         |

---

## Migration phases

### Phase 1: Foundation (estimated: 1-2 days)

Set up the core infrastructure for the App Router migration.

**Deliverables:**

- Cached OpenAPI spec loader
- Shared layout and providers
- Basic routing structure
- Type definitions

### Phase 2: Server components (estimated: 2-3 days)

Create the core Server Components that render API documentation.

**Deliverables:**

- Resource section component
- Method content component
- Schema content component
- Parameter and property list components
- Endpoint list component

### Phase 3: Client component islands (estimated: 1-2 days)

Extract interactive features into minimal Client Components.

**Deliverables:**

- Expandable response properties
- Code example language tabs
- Sidebar navigation with active state

### Phase 4: Page assembly (estimated: 1-2 days)

Wire up the pages and implement static generation.

**Deliverables:**

- Overview page
- Resource pages
- Method pages
- Schema pages
- `generateStaticParams` for all routes

### Phase 5: Polish and parity (estimated: 2-3 days)

Ensure feature parity with the current implementation.

**Deliverables:**

- Mobile sidebar
- Hash navigation
- Scroll behavior
- Breadcrumbs
- Content actions (copy link, ask AI)
- SEO metadata

### Phase 6: Testing and rollout (estimated: 2-3 days)

Comprehensive testing and gradual rollout.

**Deliverables:**

- Visual regression testing
- Performance benchmarking
- Staged rollout via feature flag or redirect
- Monitoring and rollback capability

---

## Detailed implementation tasks

### Phase 1: Foundation

#### Task 1.1: Create cached OpenAPI loader

Create `lib/openapi/loader.ts`:

```typescript
import { cache } from "react";
import { dereference } from "@scalar/openapi-parser";
import { readFile } from "fs/promises";
import { parse } from "yaml";
import safeStringify from "safe-stringify";
import deepmerge from "deepmerge";
import type { OpenAPIV3 } from "@scalar/openapi-types";

type SpecName = "api" | "mapi";

/**
 * Cached loader for the full dereferenced OpenAPI spec.
 * Uses React's cache() to dedupe within a single render pass.
 */
export const getOpenApiSpec = cache(
  async (specName: SpecName): Promise<OpenAPIV3.Document> => {
    const spec = await readFile(`./data/specs/${specName}/openapi.yml`, "utf8");
    const { schema } = await dereference(parse(spec));
    return JSON.parse(safeStringify(schema));
  },
);

/**
 * Cached loader for the Stainless config with customizations.
 */
export const getStainlessSpec = cache(
  async (specName: SpecName): Promise<StainlessConfig> => {
    const [specFile, customizationsFile] = await Promise.all([
      readFile(`./data/specs/${specName}/stainless.yml`, "utf8"),
      readFile(`./data/specs/${specName}/customizations.yml`, "utf8"),
    ]);
    return deepmerge(parse(specFile), parse(customizationsFile));
  },
);
```

**Acceptance criteria:**

- [ ] Specs are loaded once per build/request
- [ ] Subsequent calls return cached data
- [ ] TypeScript types are properly exported

#### Task 1.2: Create type definitions

Create `lib/openapi/types.ts`:

```typescript
import type { OpenAPIV3 } from "@scalar/openapi-types";

export type SpecName = "api" | "mapi";

export type StainlessMethodConfig =
  | string
  | { type: "http"; endpoint: string; positional_params?: string[] };

export interface StainlessResource {
  name?: string;
  description?: string;
  models?: Record<string, string>;
  methods?: Record<string, StainlessMethodConfig>;
  subresources?: Record<string, StainlessResource>;
}

export interface StainlessConfig {
  resources: Record<string, StainlessResource>;
  environments: Record<string, string>;
}

export interface MethodData {
  methodName: string;
  methodType: "get" | "post" | "put" | "delete" | "patch";
  endpoint: string;
  operation: OpenAPIV3.OperationObject;
}

export interface SchemaData {
  modelName: string;
  schema: OpenAPIV3.SchemaObject;
}

export interface ResourceData {
  resourceName: string;
  resource: StainlessResource;
  methods: MethodData[];
  schemas: SchemaData[];
  subresources: ResourceData[];
}
```

**Acceptance criteria:**

- [ ] All types match existing data structures
- [ ] Types are exported for use in components

#### Task 1.3: Create helper functions

Create `lib/openapi/helpers.ts`:

```typescript
import type { OpenAPIV3 } from "@scalar/openapi-types";
import JSONPointer from "jsonpointer";
import type {
  StainlessMethodConfig,
  StainlessResource,
  StainlessConfig,
  MethodData,
  SchemaData,
  SpecName,
} from "./types";
import { getOpenApiSpec, getStainlessSpec } from "./loader";

/**
 * Resolve endpoint from Stainless method config.
 */
export function resolveEndpoint(
  config: StainlessMethodConfig,
): [string, string] {
  const endpoint = typeof config === "string" ? config : config.endpoint;
  const [method, path] = endpoint.split(" ");
  return [method.toLowerCase(), path];
}

/**
 * Get operation from OpenAPI spec for a given endpoint.
 */
export function getOperation(
  spec: OpenAPIV3.Document,
  methodType: string,
  endpoint: string,
): OpenAPIV3.OperationObject | undefined {
  return spec.paths?.[endpoint]?.[methodType];
}

/**
 * Get schema by $ref from OpenAPI spec.
 */
export function getSchemaByRef(
  spec: OpenAPIV3.Document,
  ref: string,
): OpenAPIV3.SchemaObject | undefined {
  return JSONPointer.get(spec, ref.replace("#", ""));
}

/**
 * Build schema references map for cross-linking.
 */
export async function buildSchemaReferences(
  specName: SpecName,
  basePath: string,
): Promise<Record<string, string>> {
  const [spec, stainless] = await Promise.all([
    getOpenApiSpec(specName),
    getStainlessSpec(specName),
  ]);

  const references: Record<string, string> = {};

  function processResource(resource: StainlessResource, path: string) {
    if (resource.models) {
      Object.entries(resource.models).forEach(([modelName, ref]) => {
        const schema = getSchemaByRef(spec, ref);
        const title = schema?.title ?? modelName;
        references[title] = `${path}/schemas/${modelName}`;
        references[`${title}[]`] = `${path}/schemas/${modelName}`;
      });
    }
    if (resource.subresources) {
      Object.entries(resource.subresources).forEach(([name, sub]) => {
        processResource(sub, `${path}/${name}`);
      });
    }
  }

  Object.entries(stainless.resources).forEach(([name, resource]) => {
    processResource(resource, `${basePath}/${name}`);
  });

  return references;
}

/**
 * Get all methods for a resource.
 */
export function getResourceMethods(
  spec: OpenAPIV3.Document,
  resource: StainlessResource,
): MethodData[] {
  if (!resource.methods) return [];

  return Object.entries(resource.methods)
    .map(([methodName, config]) => {
      const [methodType, endpoint] = resolveEndpoint(config);
      const operation = getOperation(spec, methodType, endpoint);
      if (!operation) return null;
      return { methodName, methodType, endpoint, operation } as MethodData;
    })
    .filter((m): m is MethodData => m !== null);
}

/**
 * Get all schemas for a resource.
 */
export function getResourceSchemas(
  spec: OpenAPIV3.Document,
  resource: StainlessResource,
): SchemaData[] {
  if (!resource.models) return [];

  return Object.entries(resource.models)
    .map(([modelName, ref]) => {
      const schema = getSchemaByRef(spec, ref);
      if (!schema) return null;
      return { modelName, schema };
    })
    .filter((s): s is SchemaData => s !== null);
}
```

**Acceptance criteria:**

- [ ] All helper functions are pure and testable
- [ ] Functions work with cached spec data
- [ ] Type safety is maintained

#### Task 1.4: Create shared layout

Create `app/(api-reference)/layout.tsx`:

```typescript
import { Inter } from "next/font/google";
import { Providers } from "./providers";

import "@algolia/autocomplete-theme-classic";
import "../../styles/index.css";
import "../../styles/global.css";
import "../../styles/responsive.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function ApiReferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Acceptance criteria:**

- [ ] Layout loads global styles
- [ ] Font is configured
- [ ] Providers wrap children

#### Task 1.5: Create client providers

Create `app/(api-reference)/providers.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  EventEmitterContext,
  useEventEmitterInstance,
} from "@byteclaw/use-event-emitter";
import { InkeepModalProvider } from "../../components/AiChatButton";
import { AskAiProvider } from "../../components/AskAiContext";
import AskAiSidebar from "../../components/AskAiSidebar";
import * as analytics from "../../lib/analytics";
import { initAttribution } from "../../lib/attribution";
import { setClearbitPath } from "../../lib/clearbit";
import * as gtag from "../../lib/gtag";

export function Providers({ children }: { children: React.ReactNode }) {
  const eventEmitter = useEventEmitterInstance();
  const pathname = usePathname();

  useEffect(() => {
    initAttribution();
  }, []);

  useEffect(() => {
    gtag.pageview(pathname as unknown as URL);
    setClearbitPath(pathname as unknown as URL);
    analytics.page();
    initAttribution();
  }, [pathname]);

  return (
    <AskAiProvider>
      <InkeepModalProvider>
        <main>
          <EventEmitterContext.Provider value={eventEmitter}>
            {children}
          </EventEmitterContext.Provider>
          {analytics.SEGMENT_WRITE_KEY && <analytics.Snippet />}
        </main>
        <AskAiSidebar />
      </InkeepModalProvider>
    </AskAiProvider>
  );
}
```

**Acceptance criteria:**

- [ ] Analytics tracking works on navigation
- [ ] AI chat sidebar is available
- [ ] Event emitter context is provided

---

### Phase 2: Server components

#### Task 2.1: Create resource section component

Create `app/(api-reference)/api-reference/components/resource-section.tsx`:

This is a Server Component that renders a resource overview section.

**Props:**

- `specName: SpecName` - Which spec to use
- `resourceName: string` - Resource identifier
- `basePath: string` - URL base path for links

**Responsibilities:**

- Load resource data from cached spec
- Render resource title and description
- Render endpoint summary list
- Render each method section
- Render each schema section
- Recursively render subresources

**Acceptance criteria:**

- [ ] No `"use client"` directive
- [ ] Uses only server-safe APIs
- [ ] Passes data to child components, not context

#### Task 2.2: Create method content component

Create `app/(api-reference)/api-reference/components/method-content.tsx`:

This is a Server Component that renders a single API method.

**Props:**

- `method: MethodData` - Method information
- `baseUrl: string` - API base URL for examples
- `schemaReferences: Record<string, string>` - Schema link map

**Sections to render:**

1. Title (operation.summary)
2. Description (operation.description)
3. Beta badge if applicable
4. Endpoint display (method + path)
5. Rate limit info if applicable
6. Path parameters table
7. Query parameters table
8. Request body properties
9. Response information with expandable properties (Client Component island)
10. Code examples with language tabs (Client Component island)

**Acceptance criteria:**

- [ ] All static content rendered on server
- [ ] Interactive elements use Client Component islands
- [ ] Proper heading hierarchy (h2, h3)
- [ ] Accessible markup

#### Task 2.3: Create schema content component

Create `app/(api-reference)/api-reference/components/schema-content.tsx`:

This is a Server Component that renders a schema/model definition.

**Props:**

- `schema: SchemaData` - Schema information
- `schemaReferences: Record<string, string>` - Schema link map

**Sections to render:**

1. Title (schema.title)
2. Description
3. Attributes table with all properties
4. Example JSON

**Acceptance criteria:**

- [ ] Properties rendered with type information
- [ ] Required fields marked
- [ ] Enum values displayed
- [ ] Example formatted with syntax highlighting

#### Task 2.4: Create parameter list component

Create `app/(api-reference)/api-reference/components/parameter-list.tsx`:

Server Component for rendering parameter tables.

**Props:**

- `parameters: OpenAPIV3.ParameterObject[]`
- `schemaReferences: Record<string, string>`

**Acceptance criteria:**

- [ ] Name, type, required status shown
- [ ] Description rendered as markdown
- [ ] Default values shown if present
- [ ] Enum values listed

#### Task 2.5: Create property list component

Create `app/(api-reference)/api-reference/components/property-list.tsx`:

Server Component for rendering schema properties.

**Props:**

- `schema: OpenAPIV3.SchemaObject`
- `schemaReferences: Record<string, string>`
- `showRequired?: boolean`

**Acceptance criteria:**

- [ ] Nested properties handled
- [ ] Array types shown correctly
- [ ] References linked to schema pages
- [ ] Nullable indicated

#### Task 2.6: Create endpoint list component

Create `app/(api-reference)/api-reference/components/endpoint-list.tsx`:

Server Component for the endpoint summary in resource overviews.

**Props:**

- `methods: MethodData[]`

**Acceptance criteria:**

- [ ] Method badge with color coding
- [ ] Path displayed in monospace
- [ ] Links to method sections

---

### Phase 3: Client component islands

#### Task 3.1: Create expandable properties component

Create `app/(api-reference)/api-reference/components/expandable-properties.tsx`:

```typescript
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function ExpandableProperties({
  title,
  children,
  defaultExpanded = false,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        {isExpanded ? "Hide properties" : "Show properties"}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pl-4 border-l-2 border-gray-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

**Acceptance criteria:**

- [ ] Smooth expand/collapse animation
- [ ] Accessible button with aria-expanded
- [ ] Children rendered only when expanded (optional optimization)

#### Task 3.2: Create code example tabs component

Create `app/(api-reference)/api-reference/components/code-example-tabs.tsx`:

```typescript
"use client";

import { useState } from "react";

interface Props {
  examples: Record<string, string>;
  title?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  curl: "cURL",
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  ruby: "Ruby",
  go: "Go",
  java: "Java",
  csharp: "C#",
  php: "PHP",
};

export function CodeExampleTabs({ examples, title }: Props) {
  const languages = Object.keys(examples);
  const [activeLanguage, setActiveLanguage] = useState(languages[0]);

  if (languages.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
          {title}
        </div>
      )}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveLanguage(lang)}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              activeLanguage === lang
                ? "bg-white border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {LANGUAGE_LABELS[lang] || lang}
          </button>
        ))}
      </div>
      <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto">
        <code>{examples[activeLanguage]}</code>
      </pre>
    </div>
  );
}
```

**Acceptance criteria:**

- [ ] Language tabs switch content
- [ ] Active tab visually indicated
- [ ] Code syntax highlighted
- [ ] Horizontal scroll for long lines

#### Task 3.3: Create sidebar navigation component

Create `app/(api-reference)/api-reference/components/sidebar-nav.tsx`:

This is a Client Component that handles:

- Active section tracking based on scroll position
- Collapse/expand for nested items
- Hash navigation on click

**Props:**

- `sections: SidebarSection[]` - Sidebar structure
- `basePath: string` - Base URL path

**Acceptance criteria:**

- [ ] Active section highlighted on scroll
- [ ] Nested sections collapsible
- [ ] Smooth scroll to section on click
- [ ] URL hash updated on navigation
- [ ] Works with same-page navigation

---

### Phase 4: Page assembly

#### Task 4.1: Create overview page

Create `app/(api-reference)/api-reference/page.tsx`:

```typescript
import { Suspense } from "react";
import { getOpenApiSpec, getStainlessSpec } from "@/lib/openapi/loader";
import { buildSchemaReferences } from "@/lib/openapi/helpers";
import { RESOURCE_ORDER } from "@/data/sidebars/apiOverviewSidebar";
import { PageShell } from "./components/page-shell";
import { ResourceSection } from "./components/resource-section";
import { PreContent } from "./components/pre-content";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata = {
  title: "API reference | Knock Docs",
  description: "Complete reference documentation for the Knock API.",
};

export default async function ApiReferencePage() {
  const [spec, stainless] = await Promise.all([
    getOpenApiSpec("api"),
    getStainlessSpec("api"),
  ]);

  const schemaReferences = await buildSchemaReferences("api", "/api-reference");
  const baseUrl = stainless.environments.production;

  return (
    <PageShell specName="api" basePath="/api-reference">
      <PreContent specName="api" />

      {RESOURCE_ORDER.map((resourceName) => (
        <Suspense key={resourceName} fallback={<ResourceSectionSkeleton />}>
          <ResourceSection
            specName="api"
            resourceName={resourceName}
            basePath="/api-reference"
            baseUrl={baseUrl}
            schemaReferences={schemaReferences}
          />
        </Suspense>
      ))}
    </PageShell>
  );
}
```

**Acceptance criteria:**

- [ ] Page renders all resources
- [ ] Each resource section can suspend independently
- [ ] Metadata set correctly
- [ ] Static generation enabled

#### Task 4.2: Create resource page with generateStaticParams

Create `app/(api-reference)/api-reference/[resource]/page.tsx`:

```typescript
import { getStainlessSpec } from "@/lib/openapi/loader";
import { RESOURCE_ORDER } from "@/data/sidebars/apiOverviewSidebar";
import { ResourceSection } from "../components/resource-section";

export async function generateStaticParams() {
  return RESOURCE_ORDER.map((resource) => ({ resource }));
}

export async function generateMetadata({ params }) {
  const stainless = await getStainlessSpec("api");
  const resource = stainless.resources[params.resource];

  return {
    title: `${resource?.name || params.resource} | API reference | Knock Docs`,
    description:
      resource?.description || `API reference for ${params.resource}`,
  };
}

export default async function ResourcePage({ params }) {
  // ... render resource overview
}
```

**Acceptance criteria:**

- [ ] All resource paths generated at build
- [ ] Metadata generated per resource
- [ ] 404 for unknown resources

#### Task 4.3: Create method page

Create `app/(api-reference)/api-reference/[resource]/[method]/page.tsx`:

```typescript
export async function generateStaticParams() {
  const stainless = await getStainlessSpec("api");
  const params = [];

  Object.entries(stainless.resources).forEach(([resource, data]) => {
    if (data.methods) {
      Object.keys(data.methods).forEach((method) => {
        params.push({ resource, method });
      });
    }
  });

  return params;
}
```

**Acceptance criteria:**

- [ ] All method paths generated at build
- [ ] Renders single method documentation
- [ ] Links to related schemas work

#### Task 4.4: Create schema page

Create `app/(api-reference)/api-reference/[resource]/schemas/[schema]/page.tsx`:

**Acceptance criteria:**

- [ ] All schema paths generated at build
- [ ] Renders schema with all properties
- [ ] Example JSON displayed

---

### Phase 5: Polish and parity

#### Task 5.1: Implement mobile sidebar

Ensure the mobile sidebar component works with App Router navigation.

**Acceptance criteria:**

- [ ] Opens/closes correctly
- [ ] Navigation works
- [ ] Closes on route change

#### Task 5.2: Implement hash navigation

Ensure clicking sidebar items scrolls to the correct section and updates the URL hash.

**Acceptance criteria:**

- [ ] Smooth scroll to sections
- [ ] URL hash reflects current section
- [ ] Browser back/forward works
- [ ] Direct links to hashes work

#### Task 5.3: Implement scroll tracking

Track scroll position to highlight the active sidebar item.

**Acceptance criteria:**

- [ ] Intersection Observer used for performance
- [ ] Active item updated on scroll
- [ ] Works with nested sections

#### Task 5.4: Implement content actions

Port the "Copy link" and "Ask AI" buttons.

**Acceptance criteria:**

- [ ] Copy link copies correct URL with hash
- [ ] Ask AI opens with current context
- [ ] Buttons positioned correctly

#### Task 5.5: Port breadcrumbs

Ensure breadcrumbs work with App Router.

**Acceptance criteria:**

- [ ] Correct hierarchy shown
- [ ] Links work
- [ ] Updates on navigation

#### Task 5.6: SEO and metadata

Ensure proper SEO for all pages.

**Acceptance criteria:**

- [ ] Unique title per page
- [ ] Description for each page
- [ ] Canonical URLs set
- [ ] Open Graph tags present

---

### Phase 6: Testing and rollout

#### Task 6.1: Visual regression testing

Compare screenshots of old and new implementations.

**Acceptance criteria:**

- [ ] All sections render identically
- [ ] Code blocks styled correctly
- [ ] Tables formatted properly
- [ ] Responsive layouts work

#### Task 6.2: Performance benchmarking

Measure and compare performance metrics.

**Metrics to measure:**

- HTML payload size
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)

**Acceptance criteria:**

- [ ] HTML payload reduced by >90%
- [ ] LCP improved
- [ ] TTI improved

#### Task 6.3: Staged rollout

Roll out to a percentage of traffic first.

**Options:**

1. Feature flag with percentage rollout
2. Subdomain preview (e.g., api-preview.docs.knock.app)
3. URL-based opt-in (e.g., ?new-api-reference=true)

**Acceptance criteria:**

- [ ] Rollout mechanism in place
- [ ] Monitoring dashboards set up
- [ ] Quick rollback capability

#### Task 6.4: Remove old implementation

Once validated, remove the Pages Router implementation.

**Acceptance criteria:**

- [ ] Old pages removed
- [ ] Redirects in place if needed
- [ ] No dead code remaining

---

## Component breakdown

### Existing components to reuse

These components can be reused with minimal changes:

| Component    | Path                           | Changes needed |
| ------------ | ------------------------------ | -------------- |
| `CodeBlock`  | `components/ui/CodeBlock.tsx`  | None           |
| `Callout`    | `components/ui/Callout.tsx`    | None           |
| `RateLimit`  | `components/ui/RateLimit.tsx`  | None           |
| `Endpoints`  | `components/ui/Endpoints.tsx`  | None           |
| `PageHeader` | `components/ui/PageHeader.tsx` | None           |

### Existing components to refactor

These components need Server/Client splitting:

| Component             | Current | After                                  |
| --------------------- | ------- | -------------------------------------- |
| `ApiReferenceSection` | Client  | Server + Client islands                |
| `ApiReferenceMethod`  | Client  | Server + Client islands                |
| `SchemaProperties`    | Client  | Server + Client island for expandable  |
| `MultiLangExample`    | Client  | Client (language state)                |
| `Sidebar`             | Client  | Server for structure, Client for state |

### New components to create

| Component              | Type   | Purpose                      |
| ---------------------- | ------ | ---------------------------- |
| `PageShell`            | Client | Layout with sidebar state    |
| `ResourceSection`      | Server | Resource overview rendering  |
| `MethodContent`        | Server | Method documentation         |
| `SchemaContent`        | Server | Schema documentation         |
| `ExpandableProperties` | Client | Expand/collapse UI           |
| `CodeExampleTabs`      | Client | Language selection           |
| `SidebarNav`           | Client | Navigation with active state |

---

## Testing strategy

### Unit tests

Test helper functions in isolation:

```typescript
// lib/openapi/helpers.test.ts
describe("resolveEndpoint", () => {
  it("parses string endpoint format", () => {
    const result = resolveEndpoint("get /users/{id}");
    expect(result).toEqual(["get", "/users/{id}"]);
  });

  it("parses object endpoint format", () => {
    const result = resolveEndpoint({ endpoint: "post /users" });
    expect(result).toEqual(["post", "/users"]);
  });
});
```

### Integration tests

Test page rendering with mock data:

```typescript
// app/(api-reference)/api-reference/page.test.tsx
describe("ApiReferencePage", () => {
  it("renders all resource sections", async () => {
    const page = await render(<ApiReferencePage />);
    expect(page.getByRole("heading", { name: "Workflows" })).toBeVisible();
    expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  });
});
```

### E2E tests

Test full user flows:

```typescript
// e2e/api-reference.spec.ts
test("navigate to method documentation", async ({ page }) => {
  await page.goto("/api-reference");
  await page.click("text=Trigger workflow");
  await expect(page).toHaveURL(/\/api-reference\/workflows\/trigger/);
  await expect(page.locator("h2")).toContainText("Trigger workflow");
});
```

### Visual regression tests

Use Playwright or Percy for screenshot comparison:

```typescript
test("method documentation visual", async ({ page }) => {
  await page.goto("/api-reference/users/get");
  await expect(page).toHaveScreenshot("users-get-method.png");
});
```

---

## Rollback plan

### Immediate rollback

If critical issues are discovered after rollout:

1. Revert the `next.config.js` routing changes
2. The old Pages Router implementation continues to work
3. App Router pages become inaccessible but don't break the site

### Gradual rollback

If issues are discovered during staged rollout:

1. Reduce rollout percentage to 0%
2. Investigate issues
3. Fix and re-deploy
4. Gradually increase rollout percentage

### Data rollback

No data migration is involved, so no data rollback is needed.

---

## Success criteria

### Performance

- [ ] HTML payload size < 100KB (down from 2-5MB)
- [ ] LCP < 2.5s (Good threshold)
- [ ] TTI < 3.8s (Good threshold)
- [ ] TBT < 200ms (Good threshold)

### Functionality

- [ ] All API endpoints documented
- [ ] All schemas documented
- [ ] Code examples work in all languages
- [ ] Search/navigation works
- [ ] Mobile responsive

### Developer experience

- [ ] Build time not increased significantly
- [ ] Local development hot reload works
- [ ] Type safety maintained
- [ ] Code is well-documented

### SEO

- [ ] All pages indexed by search engines
- [ ] Unique titles and descriptions
- [ ] No duplicate content issues

---

## Appendix: Decision log

### Why App Router over other solutions?

| Alternative          | Pros                           | Cons                        | Decision     |
| -------------------- | ------------------------------ | --------------------------- | ------------ |
| Pre-split JSON files | Minimal changes                | Still requires client fetch | Rejected     |
| API routes for data  | Keeps Pages Router             | Adds complexity, latency    | Rejected     |
| App Router           | Best performance, future-proof | Migration effort            | **Selected** |

### Why not split the spec files?

With Server Components, the spec stays on the server. Splitting would add complexity without significant benefit for specs of this size (~1MB total).

### Why client component islands?

Some features require client-side state:

- Expand/collapse toggle
- Language selection for code examples
- Scroll position tracking

Rather than making entire sections client components, we extract only the interactive parts as islands within server-rendered content.

---

## Appendix: Reference links

- [Next.js App Router documentation](https://nextjs.org/docs/app)
- [React Server Components RFC](https://github.com/reactjs/rfcs/pull/188)
- [Streaming SSR with Suspense](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React cache() function](https://react.dev/reference/react/cache)
