// TODO: Remove these types and just use the `SidebarContent` instead as it's recursive
export type SidebarPage = {
  slug: string;
  title: string;
  path?: string;
  isBeta?: boolean;
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
  isBeta?: boolean;
  pages:
    | SidebarPage[]
    | SidebarSubsection[]
    | Array<SidebarPage | SidebarSubsection>;
  sidebarMenuDefaultOpen?: boolean;
};

export type SidebarContent = {
  title: string;
  slug: string;
  isBeta?: boolean;
  pages?: SidebarContent[];
  sidebarMenuDefaultOpen?: boolean;
  parentSection?: SidebarContent;
};
