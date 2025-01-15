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
      className={cn("transition-colors flex items-center group", {
        "hover:text-gray-900 dark:hover:text-gray-100": true,
        "text-brand font-medium hover:!text-brand-dark": isSelected,
      })}
    >
      <span className="truncate max-w-[160px]">{title}</span>
      {isBeta && (
        <span className="beta-tag ml-2 px-1.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-800 rounded-full group-hover:hidden">
          Beta
        </span>
      )}
    </Link>
  </li>
);

export default SidebarLink;
