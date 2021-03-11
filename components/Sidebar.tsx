import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cn from "classnames";

import sidebarContent from "../data/sidebar";

const Sidebar = () => {
  const { asPath, ...rest } = useRouter();

  return (
    <section className="w-60 border-r hidden lg:block">
      <nav className="overflow-y-auto h-full  p-5">
        {sidebarContent.map((section) => {
          return (
            <div key={section.title} className="mb-7">
              {section.title && (
                <span className="uppercase text-xs font-semibold tracking-wider text-gray-800">
                  {section.title}
                </span>
              )}

              <ul className="space-y-2 mt-2">
                {section.pages.map((page) => {
                  return (
                    <li key={page.slug} className="text-gray-500 text-sm">
                      <Link href={section.slug + page.slug}>
                        <a
                          className={cn({
                            "hover:text-gray-900": true,
                            "text-brand font-medium hover:text-brand-dark":
                              asPath === section.slug + page.slug,
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
          );
        })}
      </nav>
    </section>
  );
};

export default Sidebar;
