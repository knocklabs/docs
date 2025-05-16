export interface FrontMatter {
  id: string;
  title: string;
  description: string;
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
  // Currently, we sort "page" values higher than "api-reference" values when querying "pages" index
  // We can refine this even further if we want to
  contentType: "document" | "api-reference";
  // Helps us delineate between the two types of search items
  index: "pages" | "endpoints";
};

export type EndpointSearchItem = DocsSearchItem & {
  method: string;
  endpoint: string;
  // Will always be contentType: "api-reference"
  contentType: "api-reference";
};
