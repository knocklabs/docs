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
      className={cn("transition-colors flex items-center", {
        "hover:text-gray-900 dark:hover:text-gray-100": true,
        "text-brand font-medium hover:!text-brand-dark": isSelected,
      })}
    >
      <span>{title}</span>
      {isBeta && (
        <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          Beta
        </span>
      )}
    </Link>
  </li>
);

export default SidebarLink;
