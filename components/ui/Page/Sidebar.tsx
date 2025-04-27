import { SidebarSection } from "@/data/types";
import { Box } from "@telegraph/layout";
import { Stack } from "@telegraph/layout";
import { NavItem } from "../NavItem";
import { debounce } from "@/lib/debounce";
import { useRouter } from "next/router";
import {
  CollapsibleNavItem,
  type CollapsibleNavItemProps,
} from "../CollapsibleNavItem";
import { useLayoutEffect, useState, useMemo, useEffect } from "react";
import { isPathTheSame, highlightResource, stripPrefix } from "./helpers";
import { Tag } from "@telegraph/tag";

type SidebarProps = {
  content: SidebarSection[];
  children?: React.ReactNode;
};

function getOpenState(section: SidebarSection, slug: string, path: string) {
  return section.pages.some((page) => {
    if (isPathTheSame(`${slug}${page.slug}`, path)) {
      return true;
    }
    if ("pages" in page) {
      if (page.pages) {
        return page?.pages.some((subPage) =>
          isPathTheSame(`${slug}${page.slug}${subPage.slug}`, path),
        );
      }
    }
    return false;
  });
}

const Item = ({
  section,
  preSlug = "",
  depth = 0,
  defaultOpen,
}: {
  section: SidebarSection;
  preSlug?: string;
  depth?: number;
  defaultOpen?: boolean;
}) => {
  const router = useRouter();
  const basePath = router.asPath.split("/")[1];
  const slug = `${preSlug}${section.slug}`;
  const resourceSection = stripPrefix(slug);

  const [isOpen, setIsOpen] = useState(
    defaultOpen ?? getOpenState(section, slug, router.asPath),
  );

  // Update isOpen when the path changes
  useEffect(() => {
    if (!isOpen) {
      setIsOpen(defaultOpen ?? getOpenState(section, slug, router.asPath));
    }
  }, [section, slug, router.asPath, isOpen, defaultOpen]);

  // Create the debounced function once when component mounts
  // This helps produce a smoother experience when scrolling fast
  const debouncedHighlight = useMemo(
    () =>
      debounce((path: string) => {
        setIsOpen(true);
        highlightResource(path);
      }, 300), // The lower the number here, the quicker the highlight, but can get laggy if too low
    [], // Empty dependency array means this is only created once
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
              debouncedHighlight(`/${basePath}${resourcePath}`);
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
  }, [basePath, resourceSection, debouncedHighlight]);

  const depthAdjustedCollapsibleNavItemProps: Partial<CollapsibleNavItemProps> =
    depth === 0
      ? {
          // Moves it over to align with the Tab text above
          style: {
            marginLeft: "-4px",
          },
        }
      : {
          px: "1",
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
              {page.isBeta && (
                <Tag color="blue" ml="2" size="0">
                  Beta
                </Tag>
              )}
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
        <Item section={section} defaultOpen={section?.sidebarMenuDefaultOpen} />
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
        style={{ minHeight: "90vh" }}
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
