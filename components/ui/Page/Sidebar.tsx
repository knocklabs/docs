import { SidebarContent, SidebarSection } from "@/data/types";
import { debounce } from "@/lib/debounce";
import { TgphComponentProps } from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import {
  CollapsibleNavItem,
  type CollapsibleNavItemProps,
} from "../CollapsibleNavItem";
import { NavItem } from "../NavItem";
import { usePageContext } from "../Page";
import {
  highlightResource,
  isPathTheSame,
  stripPrefix,
  updateNavStyles,
  useHighlightedPath,
  useIsPageReady,
} from "./helpers";
import { ScrollerBottomGradient } from "./ScrollerBottomGradient";

interface SidebarContextType {
  samePageRouting: boolean;
  // For per-resource pages, this is the base path of the current resource
  // e.g., "/api-reference/users" - used to determine if a link is on the same page
  currentResourcePath?: string;
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
  pages: SidebarSectionOrContent[],
  slug: string,
  path: string,
) {
  return pages.some((page) => {
    if (isPathTheSame(`${slug}${page.slug}`, path)) {
      return true;
    }
    if ("pages" in page) {
      return getOpenState(page.pages ?? [], `${slug}${page.slug}`, path);
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
  const pathNoHash = router.asPath.split("#")[0];
  // Extract basePath from path without hash to avoid "api-reference#section" issues
  const basePath = pathNoHash.split("/")[1];
  const slug = `${preSlug}${section.slug}`;
  const resourceSection = stripPrefix(slug);
  const [initializedOnPath, setInitializedOnPath] = useState(pathNoHash);
  const { samePageRouting } = useSidebar();
  const { isSearchOpen } = usePageContext();
  const isPageReady = useIsPageReady();
  // Get the highlighted path from external store (for same-page routing)
  const highlightedPath = useHighlightedPath();
  // Use highlighted path if available (scroll-based), otherwise fall back to router path
  const activePath =
    samePageRouting && highlightedPath ? highlightedPath : pathNoHash;

  const [isOpen, setIsOpen] = useState(
    defaultOpen ?? getOpenState(section.pages ?? [], slug, pathNoHash),
  );

  // Update isOpen when the path changes
  useEffect(() => {
    // Have to do an initialization check like this so we can control it manually still
    if (pathNoHash !== initializedOnPath) {
      setInitializedOnPath(pathNoHash);
      if (!isOpen) {
        const isDeterminedOpen = getOpenState(
          section.pages ?? [],
          slug,
          pathNoHash,
        );
        setIsOpen(defaultOpen ?? isDeterminedOpen);
      }
    }
  }, [section, slug, pathNoHash, isOpen, defaultOpen, initializedOnPath]);

  // Create the debounced function once when component mounts
  // This helps produce a smoother experience when scrolling fast
  const debouncedHighlight = debounce((path: string) => {
    // Open the collapsible nav item
    setIsOpen(true);
    // This can get triggered when the page moves, but moving the page can highlight a new
    // item and focus it, which breaks keyboard navigation of search.
    // So when the search is open, we skip the focus.
    if (!isSearchOpen) {
      highlightResource(path);
    }
  }, 300); // The lower the number here, the quicker the highlight, but can get laggy if too low

  useEffect(() => {
    // Don't need all the logic if its not a same page routing
    if (!samePageRouting) return;
    if (!isPageReady) return;

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
          // Use a small threshold so we detect as soon as a section enters the zone
          threshold: 0.25,
          // Shrink detection to top ~50% of viewport using negative bottom margin
          // This prevents sections below the current reading position from being detected
          rootMargin: "0px 0px -50% 0px",
        },
      );
    }

    const observer: IntersectionObserver | null = getObserver();
    document
      .querySelectorAll(`section[data-resource-path^="${resourceSection}"]`)
      .forEach((element) => {
        observer?.observe(element);
      });

    // Cleanup observer on unmount
    return () => {
      observer?.disconnect();
    };
  }, [
    basePath,
    resourceSection,
    debouncedHighlight,
    samePageRouting,
    isPageReady,
  ]);

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
        const isActive = isPathTheSame(href, activePath);

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
  const { samePageRouting } = useSidebar();
  const highlightedPath = useHighlightedPath();
  const pathNoHash = router.asPath.split("#")[0];
  const activePath =
    samePageRouting && highlightedPath ? highlightedPath : pathNoHash;
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
      isActive={isPathTheSame(slug, activePath)}
      containerProps={{ px: "3" }}
      // @ts-expect-error --color is a valid CSS variable
      style={{ "--color": "var(--tgph-gray-12)" }}
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
        pr="3"
        pl="3"
        pt="3"
        pb="3"
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
