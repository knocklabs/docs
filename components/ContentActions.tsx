import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { IoChevronDown, IoOpenOutline, IoDocumentText } from "react-icons/io5";
import { SiMarkdown } from "react-icons/si";

interface ContentActionsProps {
  sourcePath: string;
}

const ContentActions: React.FC<ContentActionsProps> = ({ sourcePath }) => {
  // Convert the source path to the public markdown URL
  const markdownUrl = `/${sourcePath
    .replace(/^content\//, "")
    .replace(/\.(mdx?)$/, ".md")}`;

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
    <div className="flex justify-end">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-md">
            <IoDocumentText />
            Copy page
            <IoChevronDown className="text-gray-400" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 w-[280px]"
            sideOffset={5}
            align="start"
          >
            <div className="py-1">
              <button
                onClick={copyAsMarkdown}
                className="flex flex-col w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                  <IoDocumentText />
                  Copy page
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-6">
                  Copy this page as Markdown for LLMs
                </div>
              </button>

              <a
                href={markdownUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                  <SiMarkdown />
                  View as Markdown
                  <IoOpenOutline className="ml-auto" />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-6">
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
