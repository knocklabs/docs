import { useRouter } from "next/router";
import { PLATFORM_SIDEBAR } from "@/data/sidebars/platformSidebar";
import { TUTORIALS_SIDEBAR } from "@/data/sidebars/tutorialsSidebar";
import { DEVELOPER_TOOLS_SIDEBAR } from "@/data/sidebars/developerToolsSidebar";

export function useSidebarContent() {
  const { asPath } = useRouter();
  if (asPath.startsWith("/tutorials")) {
    return TUTORIALS_SIDEBAR;
  }
  if (asPath.startsWith("/developer-tools")) {
    return DEVELOPER_TOOLS_SIDEBAR;
  }
  return PLATFORM_SIDEBAR;
}
