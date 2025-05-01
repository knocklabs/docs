import { useRouter } from "next/router";
import sidebarContent from "../data/sidebar";
import { tutorialsContent, developerToolsContent } from "../data/sidebar";

export function useSidebarContent() {
  const { asPath } = useRouter();
  if (asPath.startsWith("/tutorials")) {
    return tutorialsContent;
  }
  if (asPath.startsWith("/developer-tools")) {
    return developerToolsContent;
  }
  return sidebarContent;
}
