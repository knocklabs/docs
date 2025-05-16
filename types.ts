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
  // Whether the item is a static page or an endpoint resource
  // We index the endpoints as pages too, but we want to weight them lower than the rest
  contentType: "page" | "api-reference";
  index: "pages" | "endpoints";
};

export type EndpointSearchItem = DocsSearchItem & {
  method: string;
  endpoint: string;
  // Will always be contentType: "endpoint"
  contentType: "api-reference";
};
