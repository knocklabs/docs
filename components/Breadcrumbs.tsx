import React from "react";
import Link from "next/link";

const BreadcrumbItem = ({ title, path }) => (
  <li className="breadcrumb-item">
    <Link href={path}>
      <a className="text-gray-500 hover:text-gray-900">{title}</a>
    </Link>
  </li>
);

const Breadcrumbs = ({ section, page }) => {
  return (
    <div className="mb-6">
      <ul className="breadcrumbs">
        <BreadcrumbItem title="Home" path="/" />
        <BreadcrumbItem
          title={section.title}
          path={section.slug + section.pages[0].slug}
        />
        <BreadcrumbItem title={page.title} path={section.slug + page.slug} />
      </ul>
    </div>
  );
};

export default Breadcrumbs;
