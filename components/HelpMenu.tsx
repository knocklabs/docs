import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import SupportModal from "./SupportModal";

const HelpMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-full items-center font-medium text-[14px] leading-[21px] text-gray-500 dark:text-white"
        >
          <span className="mr-1">Help</span>
          <IoChevronDown />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="center"
          sideOffset={8}
          className="w-[160px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm"
        >
          <div className="flex flex-col border-b-gray-300 dark:border-b-gray-700 border-b py-1">
            <SupportModal />
            <a
              href="https://knock.app/contact-sales"
              target="_blank"
              className="hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 text-[14px] text-gray-700 dark:text-white"
              rel="noreferrer"
            >
              Contact sales
            </a>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default HelpMenu;
