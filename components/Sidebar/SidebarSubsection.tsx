import cn from "classnames";
import { NextRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoChevronUp } from "react-icons/io5";
import { SidebarSubsection } from "../../data/types";
import { isHighlighted, pagePath } from "./helpers";
import SidebarLink from "./SidebarLink";

type Props = {
  section: SidebarSubsection;
  router: NextRouter;
  path: string;
};

const SidebarSubsectionList: React.FC<Props> = ({
  section,
  router,
  path: parentPath,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const sectionPath = parentPath + section.slug;

  // Determines whether a page under this section is selected
  const isSubPageSelected = useMemo(
    () => router.asPath.startsWith(sectionPath),
    [router.asPath, sectionPath],
  );

  useEffect(() => setIsOpen(isSubPageSelected), []);

  const toggleSection = useCallback(() => {
    setIsOpen(!isOpen);
    setTimeout(() => {
      ref.current?.scrollIntoView();
    }, 5);
  }, [isOpen, ref.current]);

  return (
    <li ref={ref} className="-ml-[16px] scroll-mt-2">
      <button
        type="button"
        className="flex items-center text-gray-500 dark:text-gray-300 text-sm w-full"
        onClick={toggleSection}
      >
        <IoChevronUp
          className={cn("text-gray-300 dark:text-gray-600", {
            "-rotate-180": isOpen,
            "rotate-90": !isOpen,
          })}
        />
        <span className="text-sm ml-0.5">{section.title}</span>
      </button>

      <div
        className={cn("pl-3 ml-[12px]", {
          block: isOpen,
          hidden: !isOpen,
        })}
      >
        <ul className="space-y-2 mt-2">
          {(section.pages || []).map((page, idx) => {
            const fullPath = pagePath(sectionPath, page);
            const isSelected = isHighlighted(sectionPath, page.slug, router);

            return (
              <SidebarLink
                key={idx}
                title={page.title}
                path={fullPath}
                isSelected={isSelected}
              />
            );
          })}
        </ul>
      </div>
    </li>
  );
};

export default SidebarSubsectionList;
