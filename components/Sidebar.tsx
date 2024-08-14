import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { SidebarSection } from "../data/types";
import SidebarSectionList from "./Sidebar/SidebarSectionList";
import classNames from "classnames";
import { IoChevronUp } from "react-icons/io5";
import cn from "classnames";

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
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  // const sectionPath = parentPath + section.slug;

  // // Determines whether a page under this section is selected
  // const isSubPageSelected = useMemo(
  //   () => router.asPath.startsWith(sectionPath),
  //   [router.asPath, sectionPath],
  // );

  // useEffect(() => setIsOpen(isSubPageSelected), []);

  const toggleSection = useCallback(() => {
    setIsOpen(!isOpen);
    setTimeout(() => {
      ref.current?.scrollIntoView();
    }, 5);
  }, [isOpen, ref.current]);

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
          <>
            <button
              type="button"
              className="flex items-center text-gray-500 dark:text-gray-300 w-full my-2"
              onClick={toggleSection}
            >
              <IoChevronUp
                className={cn("text-gray-300 dark:text-gray-600", {
                  "-rotate-180": isOpen,
                  "rotate-90": !isOpen,
                })}
              />
              <div key={section.title}>
                {section.title && (
                  <span className="uppercase text-xs font-semibold tracking-wider text-gray-800 dark:text-gray-500 ml-0.5">
                    {section.title}
                  </span>
                )}
              </div>
            </button>

            <div
              className={cn("pl-3 ml-[12px]", {
                block: isOpen,
                hidden: !isOpen,
              })}
            >
              <SidebarSectionList section={section} router={router} />
            </div>
          </>
        ))}
      </nav>
    </section>
  );
};

export default Sidebar;
