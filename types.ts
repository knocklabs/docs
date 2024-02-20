export interface FrontMatter {
  id: string;
  title: string;
  description: string;
  tags: string[];
  section: string;
  showNav?: boolean;
  layout?: "docs" | "api" | "mapi" | "integrations" | "cli";
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
