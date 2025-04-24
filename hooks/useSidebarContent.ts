import { useRouter } from "next/router";
import sidebarContent from "../data/sidebar";
import {
  guidesContent,
  developerToolsContent,
  inAppUiContent,
} from "../data/sidebar";

export function useSidebarContent() {
  const { asPath } = useRouter();
  if (asPath.startsWith("/guides")) {
    return guidesContent;
  }
  if (asPath.startsWith("/developer-tools")) {
    return developerToolsContent;
  }
  if (asPath.startsWith("/in-app-ui")) {
    return inAppUiContent;
  }
  return sidebarContent;
}
