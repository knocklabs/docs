export type SidebarPage = {
  slug: string;
  title: string;
};

export type SidebarSection = {
  title: string | null;
  slug: string;
  desc?: string;
  pages: SidebarPage[];
};
