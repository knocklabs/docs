import React from "react";
import Link from "next/link";
import { SidebarPage, SidebarSection } from "../data/types";

interface BreadcrumbItemProps {
  title: string;
  path: string;
}

const BreadcrumbItem = ({ title, path }: BreadcrumbItemProps) => (
  <li className="breadcrumb-item">
    <Link
      href={path}
      className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
    >
      {title}
    </Link>
  </li>
);

interface BreadcrumbsProps {
  pages: (SidebarPage | SidebarSection)[];
}

const Breadcrumbs = ({ pages }: BreadcrumbsProps) => (
  <div className="mb-6">
    <ul className="breadcrumbs">
      <BreadcrumbItem title="Home" path="/" />
      {pages.map((page) => (
        <BreadcrumbItem
          key={page.slug}
          title={page.title ?? ""}
          path={"path" in page && page.path ? page.path : page.slug}
        />
      ))}
    </ul>
  </div>
);

export default Breadcrumbs;
