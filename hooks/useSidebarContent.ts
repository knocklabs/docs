import { useRouter } from "next/router";
import sidebarContent from "../data/sidebar";
import { guidesContent, developerToolsContent } from "../data/sidebar";

export function useSidebarContent() {
  const { asPath } = useRouter();
  if (asPath.startsWith("/guides")) {
    return guidesContent;
  }
  if (asPath.startsWith("/developer-tools")) {
    return developerToolsContent;
  }
  return sidebarContent;
}
