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
    className={cn({
      "text-gray-500 text-sm": true,
      "selected-sidebar-content": isSelected,
    })}
  >
    <Link href={path}>
      <a
        className={cn({
          "hover:text-gray-900": true,
          "text-brand font-medium hover:text-brand-dark": isSelected,
        })}
      >
        {title}
      </a>
    </Link>
  </li>
);

export default SidebarLink;
