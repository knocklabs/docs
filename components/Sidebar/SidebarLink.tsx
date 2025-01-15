import React from "react";
import Link from "next/link";
import cn from "classnames";

type Props = {
  title: string;
  path: string;
  isSelected: boolean;
  isBeta?: boolean;
};

const SidebarLink: React.FC<Props> = ({ title, path, isSelected, isBeta }) => (
  <li
    key={path}
    className={cn("text-gray-500 dark:text-gray-200 text-sm", {
      "selected-sidebar-content": isSelected,
    })}
  >
    <Link
      href={path}
      scroll={false}
      passHref
      className={cn("transition-colors flex items-center group relative", {
        "hover:text-gray-900 dark:hover:text-gray-100": true,
        "text-brand font-medium hover:!text-brand-dark": isSelected,
      })}
    >
      <div className="flex items-center group/item w-full">
        <div className="relative truncate group-hover/item:overflow-visible whitespace-nowrap pr-14 transition-all duration-200">
          <span className="relative inline-block group-hover/item:bg-white dark:group-hover/item:bg-gray-900 group-hover/item:shadow-sm dark:group-hover/item:shadow-gray-800 group-hover/item:px-2 group-hover/item:py-0.5 group-hover/item:rounded-sm">
            {title}
          </span>
          {isBeta && (
            <span className="beta-tag ml-2 px-1.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-800 rounded-full absolute right-0 top-1/2 -translate-y-1/2 opacity-100 group-hover/item:opacity-0 transition-opacity duration-200 pointer-events-none">
              Beta
            </span>
          )}
        </div>
      </div>
    </Link>
  </li>
);

export default SidebarLink;
