import { SidebarSection } from "@/data/types";
import { Box } from "@telegraph/layout";
import { Stack } from "@telegraph/layout";
import { NavItem } from "../NavItem";
import { useRouter } from "next/router";
import {
  CollapsibleNavItem,
  type CollapsibleNavItemProps,
} from "../CollapsibleNavItem";
import { useLayoutEffect, useState } from "react";
import { isPathTheSame, highlightResource, stripPrefix } from "./helpers";

type SidebarProps = {
  content: SidebarSection[];
  children?: React.ReactNode;
};

const Item = ({
  section,
  preSlug = "",
  depth = 0,
}: {
  section: SidebarSection;
  preSlug?: string;
  depth?: number;
}) => {
  const router = useRouter();
  const basePath = router.asPath.split("/")[1];
  const slug = `${preSlug}${section.slug}`;
  const resourceSection = stripPrefix(slug);

  const [isOpen, setIsOpen] = useState(
    // Determines which menus should be open on initial load
    section.pages.some((page) => {
      if (isPathTheSame(`${slug}${page.slug}`, router.asPath)) {
        return true;
      }
      if ("pages" in page) {
        if (page.pages) {
          return page?.pages.some((subPage) =>
            isPathTheSame(`${slug}${page.slug}${subPage.slug}`, router.asPath),
          );
        }
      }
      return false;
    }),
  );

  useLayoutEffect(() => {
    let observer: IntersectionObserver | null = null;

    function getObserver() {
      return new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const resourcePath =
              entry.target.getAttribute("data-resource-path")!;
            if (entry.isIntersecting) {
              setIsOpen(true);
              highlightResource(`/${basePath}${resourcePath}`);
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: "0px 0px 0px 0px",
        },
      );
    }

    // Begin observing after a short delay to allow the page to arrive at its initial state
    const readyTimeout = setTimeout(() => {
      observer = getObserver();

      // Wait for initial scroll before observing
      let initialScrollY: number | null = null;

      // Add a scroll buffer to only start observing after the user scrolls through the page a bit
      const scrollBuffer = () => {
        if (initialScrollY === null) {
          initialScrollY = window.scrollY;
        }
        const scrollDelta = Math.abs(window.scrollY - initialScrollY);
        // Only start observing after a certain scroll delta
        if (scrollDelta < 500) return;

        observer = getObserver();

        document
          .querySelectorAll(`[data-resource-path^="${resourceSection}"]`)
          .forEach((element) => {
            observer?.observe(element);
          });
        window.removeEventListener("scroll", scrollBuffer);
      };
      window.addEventListener("scroll", scrollBuffer);
    }, 2500);

    // Cleanup observer on unmount
    return () => {
      observer?.disconnect();
      clearTimeout(readyTimeout);
    };
  }, [basePath, resourceSection]);

  const depthAdjustedCollapsibleNavItemProps: Partial<CollapsibleNavItemProps> =
    depth === 0
      ? {
          // Moves it over to align with the Tab text above
          style: {
            marginLeft: "-4px",
          },
        }
      : {
          color: "gray",
        };

  return (
    <CollapsibleNavItem
      {...depthAdjustedCollapsibleNavItemProps}
      label={section.title ?? section.slug}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {section.pages.map((page, index) => {
        if (page?.pages?.length > 0) {
          return (
            <Item
              key={index + page.slug}
              section={page}
              preSlug={slug}
              depth={depth + 1}
            />
          );
        }

        const href = `${slug}${page.slug}`;
        const isActive = isPathTheSame(href, router.asPath);

        return (
          <Box
            // Tuck in the nested menus a little more
            ml={depth > 0 ? "2" : "0"}
            key={index + page.slug}
          >
            <NavItem href={href} isActive={isActive}>
              {page.title}
            </NavItem>
          </Box>
        );
      })}
    </CollapsibleNavItem>
  );
};

const Section = ({ section }: { section: SidebarSection }) => {
  return (
    <Stack direction="column" key={section.slug} mb="1" data-sidebar-section>
      <Box>
        <Item section={section} />
      </Box>
    </Stack>
  );
};

const Wrapper = ({ children }: SidebarProps) => {
  return (
    <Box>
      <Box
        data-sidebar-wrapper
        as="aside"
        width="64"
        position="fixed"
        bottom="0"
        top="24"
      >
        <Stack
          direction="column"
          gap="1"
          h="full"
          pt="2"
          pb="4"
          px="4"
          style={{ overflowY: "auto" }}
        >
          {children}
        </Stack>
      </Box>
    </Box>
  );
};

const Sidebar = Object.assign({
  Section,
  Wrapper,
});

export { Sidebar };
