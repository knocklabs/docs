import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { IoChevronDown, IoOpenOutline, IoDocumentText } from "react-icons/io5";
import { SiMarkdown } from "react-icons/si";
import { SidebarPage, SidebarSection } from "../data/types";

interface ContentActionsProps {
  pages: (SidebarPage | SidebarSection)[];
}

const ContentActions: React.FC<ContentActionsProps> = ({ pages }) => {
  // Reconstruct the markdown URL from the pages hierarchy
  const markdownUrl = `/${pages
    .map((page) => page.slug.replace(/^\//, ""))
    .join("/")}.md`;

  const copyAsMarkdown = async () => {
    try {
      const response = await fetch(markdownUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch markdown content");
      }
      const text = await response.text();
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy markdown:", error);
    }
  };

  return (
    <div className="hidden lg:flex justify-end">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-md">
            <IoDocumentText className="text-sm" />
            Copy page
            <IoChevronDown className="text-gray-400 text-xs" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-0.5 w-[260px]"
            sideOffset={4}
            align="start"
          >
            <div className="py-0.5">
              <button
                onClick={copyAsMarkdown}
                className="flex flex-col w-full px-2.5 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <div className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                  <IoDocumentText className="text-sm" />
                  Copy page
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 ml-5">
                  Copy this page as Markdown for LLMs
                </div>
              </button>

              <a
                href={markdownUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col w-full px-2.5 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <div className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                  <SiMarkdown className="text-sm" />
                  View as Markdown
                  <IoOpenOutline className="ml-auto text-sm" />
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 ml-5">
                  View this page as plain text
                </div>
              </a>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default ContentActions;
