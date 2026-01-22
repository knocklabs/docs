export interface FrontMatter {
  id: string;
  title: string;
  metaTitle?: string;
  description: string;
  metaDescription?: string;
  tags: string[];
  section: string;
  showNav?: boolean;
  layout?: "docs" | "api" | "mapi" | "integrations" | "cli" | "sdks";
}

export type ISidebarContent = ISidebarSection[];

export interface IPage {
  title: string;
  slug: string;
  category?: string;
  tags?: string[];
}

export interface ISidebarSection {
  title?: string;
  pages: IPage[];
}

declare global {
  interface Window {
    clearbit: {
      push: (args: any[]) => void;
    };
  }
}

export type DocsSearchItem = {
  objectID: string;
  path: string;
  title: string;
  section: string;
  tags: string[];
  // Whether the item is a static page or part of an endpoint resource
  // This field is used for sorting the results in the autocomplete
  // Currently, we sort "document" values higher than "api-reference" values when querying "pages" index
  // We can refine this even further if we want to
  contentType: "document" | "api-reference";
  // Helps us delineate between the two types of search items
  index: "pages" | "endpoints";
};

// Enhanced search item type for improved Algolia indexing
// This extends the basic DocsSearchItem with content and heading information
export type EnhancedDocsSearchItem = {
  objectID: string; // Unique ID (page-path or page-path#heading-slug)
  path: string; // URL path (with optional anchor)
  title: string; // Page title OR heading title
  pageTitle: string; // Always the parent page title
  description?: string; // From frontmatter (page-level only)
  content: string; // Text content (truncated ~300-500 words)
  section: string; // Top-level section (Concepts, Getting Started, etc.)
  tags: string[]; // Tags from frontmatter
  headingLevel: number; // 0 for page, 2 for H2, 3 for H3
  contentType: "document" | "api-reference";
  index: "pages" | "endpoints";
  // Ranking fields
  isPageLevel: boolean; // True if this is a page-level record (not a heading)
};

export type EndpointSearchItem = DocsSearchItem & {
  method: string;
  endpoint: string;
  // Will always be contentType: "api-reference"
  contentType: "api-reference";
};
