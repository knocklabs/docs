import React from "react";
import { NextRouter } from "next/router";
import {
  SidebarSection,
  SidebarPage,
  SidebarSubsection,
} from "../../data/types";
import SidebarSubsectionList from "./SidebarSubsection";
import SidebarLink from "./SidebarLink";
import { isHighlighted, pagePath } from "./helpers";

type Props = {
  section: SidebarSection;
  router: NextRouter;
};

const SidebarSectionList: React.FC<Props> = ({ section, router }) => (
  <ul className="space-y-2 mt-2">
    {section.pages.map((pageOrSection: SidebarPage | SidebarSubsection) => {
      if ("pages" in pageOrSection) {
        // Render the accordion because this is a subsection which contains another list of pages
        return (
          <SidebarSubsectionList
            section={pageOrSection}
            router={router}
            path={section.slug}
          />
        );
      }

      // Render a list of subpages for this section
      const page = pageOrSection as SidebarPage;
      const path = pagePath(section.slug, page);
      const isSelected = isHighlighted(section.slug, page.slug, router);

      return (
        <SidebarLink title={page.title} path={path} isSelected={isSelected} />
      );
    })}
  </ul>
);

export default SidebarSectionList;
