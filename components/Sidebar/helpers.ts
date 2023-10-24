import { NextRouter } from "next/router";
import { SidebarPage } from "../../data/types";

export const isHighlighted = (
  path: string,
  pagePath: string,
  router: NextRouter,
) => {
  const pathname = router.asPath;
  return pagePath === "/" ? pathname === path : pathname === path + pagePath;
};

export const pagePath = (parentPath: string, page: SidebarPage) =>
  page.path ?? parentPath + page.slug;
