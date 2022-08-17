import React from "react";
import Link from "next/link";
import cn from "classnames";

type Props = {
  title: string;
  path: string;
  isSelected: boolean;
};

const SidebarLink: React.FC<Props> = ({ title, path, isSelected }) => (
  <li
    key={path}
    className={cn("text-gray-500 dark:text-gray-200 text-sm", {
      "selected-sidebar-content": isSelected,
    })}
  >
    <Link href={path}>
      <a
        className={cn("transition-colors", {
          "hover:text-gray-900 dark:hover:text-gray-100": true,
          "text-brand font-medium hover:!text-brand-dark": isSelected,
        })}
      >
        {title}
      </a>
    </Link>
  </li>
);

export default SidebarLink;
