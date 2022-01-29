import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cn from "classnames";
import { SidebarSection, SidebarPage } from "../data/types";

type Props = {
  content: SidebarSection[];
};

const Sidebar: React.FC<Props> = ({ content, children }) => {
  const router = useRouter();

  const isHighlighted = (section: SidebarSection, page: SidebarPage) => {
    const pathname = page.slug.startsWith("#")
      ? router.asPath
      : router.pathname;

    return pathname === section.slug + page.slug;
  };

  return (
    <section className="w-64 border-r hidden lg:block">
      <nav className="overflow-y-auto h-full p-5">
        {children && <div className="mb-4">{children}</div>}

        {content.map((section) => (
          <div key={section.title} className="mb-7">
            {section.title && (
              <span className="uppercase text-xs font-semibold tracking-wider text-gray-800">
                {section.title}
              </span>
            )}

            <ul className="space-y-2 mt-2">
              {section.pages.map((page) => {
                const isSelected = isHighlighted(section, page);

                return (
                  <li
                    key={page.slug}
                    className={cn({
                      "text-gray-500 text-sm": true,
                      "selected-sidebar-content": isSelected,
                    })}
                  >
                    <Link
                      href={
                        page.slug === "/security"
                          ? page.slug
                          : section.slug + page.slug
                      }
                    >
                      <a
                        className={cn({
                          "hover:text-gray-900": true,
                          "text-brand font-medium hover:text-brand-dark":
                            isSelected,
                        })}
                      >
                        {page.title}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </section>
  );
};

export default Sidebar;
