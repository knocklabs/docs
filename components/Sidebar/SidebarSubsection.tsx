import { Icon } from "@chakra-ui/react";
import { NextRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoChevronDown } from "react-icons/io5";
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
  const ref = useRef<HTMLDivElement>(null);
  const sectionPath = parentPath + section.slug;

  // Determines whether a page under this section is selected
  const isSubPageSelected = useMemo(
    () => router.asPath.startsWith(sectionPath),
    [router.asPath, sectionPath],
  );

  useEffect(() => setIsOpen(isSubPageSelected), []);

  const toggleSection = useCallback(() => {
    ref.current?.scrollIntoView();
    setIsOpen(!isOpen);
  }, [isOpen, ref]);

  return (
    <div ref={ref}>
      <button
        type="button"
        className="flex items-center text-gray-500 text-sm"
        onClick={toggleSection}
      >
        <Icon
          as={IoChevronDown}
          transform={!isOpen ? "rotate(270deg)" : undefined}
        />
        <span className="text-gray-500 text-sm ml-0.5">{section.title}</span>
      </button>

      <ul className={`ml-4 space-y-2 mt-2 ${isOpen ? "block" : "hidden"}`}>
        {(section.pages || []).map((page) => {
          const fullPath = pagePath(sectionPath, page);
          const isSelected = isHighlighted(sectionPath, page.slug, router);

          return (
            <SidebarLink
              title={page.title}
              path={fullPath}
              isSelected={isSelected}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarSubsectionList;
