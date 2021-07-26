export interface FrontMatter {
  title: string;
  id: string;
  wordCount: number;
  showNav?: boolean;
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
