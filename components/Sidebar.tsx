import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { SidebarSection } from "../data/types";
import SidebarSectionList from "./Sidebar/SidebarSectionList";
import classNames from "classnames";

type Props = {
  content: SidebarSection[];
  isVisible?: boolean;
};

const Sidebar: React.FC<Props> = ({ content, children, isVisible = false }) => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      document.querySelector(".selected-sidebar-content")?.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
    }, 50);
  }, []);

  return (
    <section
      className={classNames(
        "w-full h-full md:h-auto md:w-72 border-r dark:border-r-gray-800 bg-white dark:bg-gray-900 z-10 absolute md:relative",
        !isVisible && "hidden md:block",
      )}
    >
      <nav className="overflow-y-auto h-full pl-5 pr-4 py-5">
        {children && <div className="mb-4">{children}</div>}

        {content.map((section) => (
          <div key={section.title} className="mb-7">
            {section.title && (
              <span className="uppercase text-xs font-semibold tracking-wider text-gray-800 dark:text-gray-500">
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
