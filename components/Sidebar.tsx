import React, { useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { SidebarSection } from "../data/types";
import SidebarSectionList from "./Sidebar/SidebarSectionList";

type Props = {
  content: SidebarSection[];
};

const Sidebar: React.FC<Props> = ({ content, children }) => {
  const router = useRouter();

  useLayoutEffect(() => {
    // Need a slight delay here to ensure the element is always selected and visible
    // before we scroll it into view.
    setTimeout(() => {
      document
        .getElementsByClassName("selected-sidebar-content")[0]
        ?.parentElement?.parentElement?.scrollIntoView();
    }, 5);
  }, []);

  return (
    <section className="w-64 border-r hidden lg:block">
      <nav className="overflow-y-auto h-full p-5">
        {children && <div className="mb-4">{children}</div>}

        {content.map((section) => (
          <div key={section.title} className="mb-7">
            {section.title && (
              <span className="uppercase text-xs font-semibold tracking-wider text-gray-800">
                {section.title}
              </span>
            )}

            <SidebarSectionList section={section} router={router} />
          </div>
        ))}
      </nav>
    </section>
  );
};

export default Sidebar;
