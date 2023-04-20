import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { IoChevronDown, IoOpenOutline } from "react-icons/io5";
import Link from "next/dist/client/link";
import { useRouter } from "next/router";

const PageLinks = {
  "API reference": "/reference",
  "CLI reference": "/cli",
  "Integration guides": "/integrations/overview",
  "In-app guide (JS)": "/in-app-ui/overview",
};

const SdkLinks = {
  "Node JS": "https://github.com/knocklabs/knock-node",
  Python: "https://github.com/knocklabs/knock-python",
  Ruby: "https://github.com/knocklabs/knock-ruby",
  Go: "https://github.com/knocklabs/knock-go",
  PHP: "https://github.com/knocklabs/knock-php",
  Java: "https://github.com/knocklabs/knock-java",
  "C# (dotnet)": "https://github.com/knocklabs/knock-dotnet",
  Elixir: "https://github.com/knocklabs/knock-elixir",
};

const ApiSdkMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>("APIs & SDKs");
  const { asPath } = useRouter();

  useEffect(() => {
    const matchingPage = Object.keys(PageLinks).find((linkName) =>
      asPath.startsWith(PageLinks[linkName]),
    );

    setCurrentPage(matchingPage ?? "APIs & SDKs");
  }, [asPath]);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-full items-center font-medium text-[14px] leading-[21px] text-gray-500 dark:text-white"
        >
          <span className="mr-1">{currentPage}</span>
          <IoChevronDown />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="center"
          sideOffset={8}
          className=" w-[160px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm"
        >
          <div className="flex flex-col border-b-gray-300 dark:border-b-gray-700 border-b py-1">
            {Object.keys(PageLinks).map((linkName) =>
              currentPage !== linkName ? (
                <Link href={PageLinks[linkName]} passHref>
                  <a
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 text-[14px] text-gray-700 dark:text-white"
                  >
                    {linkName}
                  </a>
                </Link>
              ) : null,
            )}
          </div>
          <div className="flex flex-col py-1">
            {Object.keys(SdkLinks).map((sdkName) => (
              <Link href={SdkLinks[sdkName]} passHref>
                <a className="hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center px-2 py-1 text-[14px] text-gray-700 dark:text-white">
                  <span className="mr-1">{sdkName}</span>
                  <IoOpenOutline />
                </a>
              </Link>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ApiSdkMenu;
