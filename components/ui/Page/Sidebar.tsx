import { SidebarContent, SidebarSection } from "@/data/types";
import { Box } from "@telegraph/layout";
import { Stack } from "@telegraph/layout";
import { NavItem } from "../NavItem";
import { debounce } from "@/lib/debounce";
import { useRouter } from "next/router";
import {
  CollapsibleNavItem,
  type CollapsibleNavItemProps,
} from "../CollapsibleNavItem";
import { useState, useMemo, useEffect, createContext, useContext } from "react";
import {
  isPathTheSame,
  highlightResource,
  stripPrefix,
  updateNavStyles,
} from "./helpers";
import { Tag } from "@telegraph/tag";
import { ScrollerBottomGradient } from "./ScrollerBottomGradient";
import { usePageContext } from "../Page";
import { TgphComponentProps } from "@telegraph/helpers";

interface SidebarContextType {
  samePageRouting: boolean;
}

export const SidebarContext = createContext<SidebarContextType>({
  samePageRouting: false,
});

export const useSidebar = () => useContext(SidebarContext);

type SidebarSectionOrContent = SidebarSection | SidebarContent;

type SidebarProps = {
  content: SidebarSectionOrContent[];
  children?: React.ReactNode;
} & TgphComponentProps<typeof Stack>;

function getOpenState(
  section: SidebarSectionOrContent,
  slug: string,
  path: string,
) {
  return (section.pages ?? []).some((page) => {
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

type ItemProps = {
  section: SidebarSectionOrContent;
  preSlug?: string;
  depth?: number;
  defaultOpen?: boolean;
};

const ItemWithSubpages = ({
  section,
  preSlug = "",
  depth = 0,
  defaultOpen,
}: ItemProps) => {
  const router = useRouter();
  const basePath = router.asPath.split("/")[1];
  const slug = `${preSlug}${section.slug}`;
  const resourceSection = stripPrefix(slug);
  const pathNoHash = router.asPath.split("#")[0];
  const [initializedOnPath, setInitializedOnPath] = useState(pathNoHash);
  const { samePageRouting } = useSidebar();
  const { isSearchOpen } = usePageContext();

  const [isOpen, setIsOpen] = useState(
    defaultOpen ?? getOpenState(section, slug, pathNoHash),
  );

  // Update isOpen when the path changes
  useEffect(() => {
    // Have to do an initialization check like this so we can control it manually still
    if (pathNoHash !== initializedOnPath) {
      setInitializedOnPath(pathNoHash);
      if (!isOpen) {
        const isDeterminedOpen = getOpenState(section, slug, pathNoHash);
        setIsOpen(defaultOpen ?? isDeterminedOpen);
      }
    }
  }, [section, slug, pathNoHash, isOpen, defaultOpen, initializedOnPath]);

  // Create the debounced function once when component mounts
  // This helps produce a smoother experience when scrolling fast
  const debouncedHighlight = useMemo(
    () =>
      debounce((path: string) => {
        setIsOpen(true);
        // This can get triggered when the page moves, but moving the page can highlight a new
        // item and focus it, which breaks keyboard navigation of search.
        // So when the search is open, we skip the focus.
        if (!isSearchOpen) {
          highlightResource(path);
        }
      }, 300), // The lower the number here, the quicker the highlight, but can get laggy if too low
    [isSearchOpen], // Empty dependency array means this is only created once
  );

  useEffect(() => {
    // Don't need all the logic if its not a same page routing
    if (!samePageRouting) return;

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

    const addListeners = () => {
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
    };

    // Begin observing after a short delay to allow the page to arrive at its initial state
    const readyTimeout = setTimeout(addListeners, 2500);

    // Cleanup observer on unmount
    return () => {
      observer?.disconnect();
      clearTimeout(readyTimeout);
    };
  }, [basePath, resourceSection, debouncedHighlight, samePageRouting]);

  const depthAdjustedCollapsibleNavItemProps: Partial<CollapsibleNavItemProps> =
    depth === 0
      ? {}
      : {
          pl: "1",
          color: "gray",
        };

  return (
    <CollapsibleNavItem
      {...depthAdjustedCollapsibleNavItemProps}
      label={section.title ?? section.slug}
      isBeta={section?.isBeta}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {(section.pages ?? []).map((page, index) => {
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
          <Box key={index + page.slug}>
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

const Item = ({ section, preSlug = "", depth = 0, defaultOpen }: ItemProps) => {
  const router = useRouter();
  const slug = `${preSlug}${section.slug}`;

  if ("pages" in section) {
    return (
      <ItemWithSubpages
        section={section}
        preSlug={preSlug}
        depth={depth}
        defaultOpen={defaultOpen}
      />
    );
  }

  return (
    <NavItem
      href={slug}
      isActive={isPathTheSame(slug, router.asPath)}
      containerProps={{ px: "3" }}
      style={{ color: "var(--tgph-gray-12)" }}
      className="nav-item--top-level"
    >
      {section.title}
      {section.isBeta && (
        <Tag color="blue" ml="2" size="0">
          Beta
        </Tag>
      )}
    </NavItem>
  );
};

const Section = ({ section }: { section: SidebarSectionOrContent }) => {
  return (
    <Stack direction="column" key={section.slug} mb="1" data-sidebar-section>
      <Box>
        <Item section={section} defaultOpen={section?.sidebarMenuDefaultOpen} />
      </Box>
    </Stack>
  );
};

const FullLayout = ({ children, scrollerRef }: SidebarProps) => {
  return (
    <Box h="full" w="full" className="md-hidden">
      <Box
        data-sidebar-wrapper
        as="aside"
        width="64"
        position="fixed"
        bottom="0"
        pr="4"
        pl="3"
        pt="6"
        pb="0"
        style={{
          height: "calc(100vh - var(--header-height))",
          top: "var(--header-height)",
        }}
        h="full"
      >
        <ScrollerBottomGradient
          scrollerRef={scrollerRef}
          managePadding={false}
          gradientProps={{
            px: "4",
            height: "48",
          }}
        />
        {children}
      </Box>
    </Box>
  );
};

const ScrollContainer = ({
  children,
  gradientHeight = "48",
  scrollerRef,
  ...props
}: SidebarProps) => {
  const router = useRouter();
  const basePath = router.asPath.split("#")[0];

  // If we have a tall sidebar, we want to scroll the nav item into view when the page loads
  useEffect(() => {
    updateNavStyles(basePath);
  }, [basePath]);

  return (
    <Stack
      flexDirection="column"
      data-sidebar-content
      h="full"
      tgphRef={scrollerRef}
      pb="12"
      px="0"
      {...props}
      style={{ overflowY: "auto", ...props?.style }}
    >
      {children}
    </Stack>
  );
};

const Sidebar = Object.assign({
  Section,
  FullLayout,
  ScrollContainer,
});

export { Sidebar };
