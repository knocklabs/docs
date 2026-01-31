"use client";

import { useRef, useState, createContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, ChevronRight, X } from "lucide-react";
import { ContentActionsAppRouter } from "./content-actions";

interface SidebarPage {
  slug: string;
  title: string;
  pages?: SidebarPage[];
}

interface SidebarSection {
  title: string;
  slug: string;
  pages: SidebarPage[];
  sidebarMenuDefaultOpen?: boolean;
}

interface PageShellProps {
  children: React.ReactNode;
  sidebarContent: SidebarSection[];
  title: string;
  description: string;
}

// Simple sidebar context for same-page routing
const SidebarContext = createContext<{ samePageRouting: boolean }>({
  samePageRouting: true,
});

export function PageShell({
  children,
  sidebarContent,
  title,
  description,
}: PageShellProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="font-semibold text-lg">
              Knock Docs
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Navigation</span>
              <button
                className="p-1"
                onClick={() => setIsMobileSidebarOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4">
              <SidebarContext.Provider value={{ samePageRouting: true }}>
                {sidebarContent.map((section) => (
                  <SidebarSectionComponent
                    key={section.slug}
                    section={section}
                  />
                ))}
              </SidebarContext.Provider>
            </nav>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="layout-grid" style={{ width: "100%" }}>
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block fixed left-0 top-14 bottom-0 w-64 border-r border-gray-200 overflow-y-auto">
          <nav className="p-4" ref={scrollerRef}>
            <SidebarContext.Provider value={{ samePageRouting: true }}>
              {sidebarContent.map((section) => (
                <SidebarSectionComponent key={section.slug} section={section} />
              ))}
            </SidebarContext.Provider>
          </nav>
        </aside>

        {/* Content Area */}
        <div
          className="lg:ml-64 flex w-full"
          style={{
            minWidth: 0,
            maxWidth: "800px",
            marginLeft:
              "clamp(16px, calc((100vw - 256px - 800px) * 0.25 + 256px), 456px)",
          }}
        >
          <div
            className="flex-1 min-w-0 space-y-8 px-6 py-9"
            style={{ minWidth: "min(600px, 100%)" }}
            data-content
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-gray-600">{description}</p>
              <div className="mt-4" style={{ marginLeft: "-6px" }}>
                <ContentActionsAppRouter showOnMobile />
              </div>
            </div>
            <div className="mb-6 tgraph-content" data-content-body>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Section Component
function SidebarSectionComponent({ section }: { section: SidebarSection }) {
  const [isOpen, setIsOpen] = useState(section.sidebarMenuDefaultOpen ?? false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-sm py-2 hover:text-blue-600"
      >
        <span>{section.title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="ml-2 border-l border-gray-200 pl-3">
          {section.pages.map((page) => (
            <SidebarItem key={page.slug} item={page} basePath={section.slug} />
          ))}
        </div>
      )}
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({
  item,
  basePath,
}: {
  item: SidebarPage;
  basePath: string;
}) {
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.pages && item.pages.length > 0;
  const fullPath = `${basePath}${item.slug}`;
  const isActive = pathname.includes(fullPath.replace(/\/$/, ""));

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      // Navigate to the section
      const element = document.querySelector(
        `[data-resource-path="${item.slug.replace(/^\//, "")}"]`,
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState({}, "", fullPath);
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex items-center justify-between w-full text-left text-sm py-1.5 hover:text-blue-600 ${
          isActive ? "text-blue-600 font-medium" : "text-gray-700"
        }`}
      >
        <span>{item.title}</span>
        {hasChildren &&
          (isOpen ? (
            <ChevronDown className="w-3 h-3 text-gray-400" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-400" />
          ))}
      </button>
      {hasChildren && isOpen && (
        <div className="ml-2 border-l border-gray-200 pl-3">
          {item.pages?.map((subItem) => (
            <SidebarItem
              key={subItem.slug}
              item={subItem}
              basePath={fullPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
