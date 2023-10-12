import * as Popover from "@radix-ui/react-popover";
import Link from "next/dist/client/link";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import SupportModal from "./SupportModal";

const HelpMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contactSalesPath = "https://knock.app/contact-sales";

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
            <Link href={contactSalesPath}>
              {/* eslint-disable */}
              <a
                target="_blank"
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 text-[14px] text-gray-700 dark:text-white"
              >
                Contact sales
              </a>
              {/* eslint-enable */}
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default HelpMenu;
