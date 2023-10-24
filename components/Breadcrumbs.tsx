import React from "react";
import Link from "next/link";

const BreadcrumbItem = ({ title, path }) => (
  <li className="breadcrumb-item">
    <Link
      href={path}
      className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
    >
      {title}
    </Link>
  </li>
);

const Breadcrumbs = ({ section, pages }) => (
  <div className="mb-6">
    <ul className="breadcrumbs">
      <BreadcrumbItem title="Home" path="/" />
      <BreadcrumbItem
        title={section.title}
        path={section.slug + section.pages[0].slug}
      />
      {pages &&
        pages.map((page) =>
          page ? (
            <BreadcrumbItem
              key={page.slug}
              title={page.title}
              path={section.slug + page.slug}
            />
          ) : null,
        )}
    </ul>
  </div>
);

export default Breadcrumbs;
