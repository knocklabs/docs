import { useRouter } from "next/router";
import { PLATFORM_SIDEBAR } from "@/data/sidebars/platformSidebar";
import {
  TUTORIALS_SIDEBAR,
  parentSection as TUTORIALS_SECTION,
} from "@/data/sidebars/tutorialsSidebar";
import {
  DEVELOPER_TOOLS_SIDEBAR_CONTENT,
  parentSection as DEVELOPER_TOOLS_SECTION,
} from "@/data/sidebars/developerToolsSidebar";
import { SidebarContent, SidebarSection } from "@/data/types";

export function useSidebarContent(): {
  content: SidebarSection[] | SidebarContent[];
  parentSection: SidebarContent | undefined;
} {
  const { asPath } = useRouter();

  if (asPath.startsWith("/tutorials")) {
    return { content: TUTORIALS_SIDEBAR, parentSection: TUTORIALS_SECTION };
  }

  if (asPath.startsWith("/developer-tools")) {
    return {
      content: DEVELOPER_TOOLS_SIDEBAR_CONTENT,
      parentSection: DEVELOPER_TOOLS_SECTION,
    };
  }

  return {
    content: PLATFORM_SIDEBAR,
    parentSection: {
      slug: "/platform",
      title: "Platform",
    },
  };
}
