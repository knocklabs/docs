export type SidebarPage = {
  slug: string;
  title: string;
  path?: string;
  pages?: SidebarPage[];
};

export type SidebarSubsection = {
  slug: string;
  title: string;
  pages?: SidebarPage[];
};

export type SidebarSection = {
  title: string | null;
  slug: string;
  desc?: string;
  pages: SidebarPage[] | SidebarSubsection[];
};
