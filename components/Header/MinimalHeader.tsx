import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import Autocomplete from "../Autocomplete";
import ApiSdkMenu from "../ApiSdkMenu";
import HelpMenu from "../HelpMenu";
import { IoClose, IoMenu, IoMoon, IoSunny } from "react-icons/io5";

type Props = {
  pageType: string;
  toggleSidebar?: () => void;
  sidebarShown?: boolean;
};

const MinimalHeader = ({ pageType, toggleSidebar, sidebarShown }: Props) => {
  const { theme, setTheme } = useTheme();

  // Fix hydration error by hiding theme button during ssr
  // See this next-themes issue for more info: https://github.com/pacocoursey/next-themes/issues/169
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header
      className="border-b dark:border-b-gray-800 px-5 h-16 dark:bg-transparent bg-gray-50 flex items-center"
      id="top-header"
    >
      <div className="mr-4">
        <Link href="/" className="flex justify-center items-center">
          <svg
            width="130"
            height="51"
            viewBox="0 0 130 51"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-white w-16 lg:w-20"
          >
            <path
              d="M3.30376 43.5897V7.83875H10.572V28.3407H10.7753L18.7552 18.2937H26.8875L18.0436 28.6977L27.5483 43.5897H19.4668L13.7741 33.7467L10.572 37.3677V43.5897H3.30376ZM29.1164 43.5897V18.2937H35.2157L35.7239 21.5067H35.9272C37.0115 20.4867 38.1975 19.6027 39.4851 18.8547C40.7727 18.0727 42.2806 17.6817 44.0087 17.6817C46.7534 17.6817 48.7356 18.5827 49.9555 20.3847C51.2092 22.1867 51.8361 24.6857 51.8361 27.8817V43.5897H44.3645V28.8507C44.3645 27.0147 44.1104 25.7567 43.6021 25.0767C43.1277 24.3967 42.3484 24.0567 41.2641 24.0567C40.3153 24.0567 39.5021 24.2777 38.8244 24.7197C38.1467 25.1277 37.4012 25.7227 36.588 26.5047V43.5897H29.1164ZM66.996 44.2017C65.4034 44.2017 63.8617 43.9127 62.3708 43.3347C60.8798 42.7227 59.5583 41.8557 58.4063 40.7337C57.2881 39.6117 56.3901 38.2347 55.7124 36.6027C55.0347 34.9367 54.6959 33.0497 54.6959 30.9417C54.6959 28.8337 55.0347 26.9637 55.7124 25.3317C56.3901 23.6657 57.2881 22.2717 58.4063 21.1497C59.5583 20.0277 60.8798 19.1777 62.3708 18.5997C63.8617 17.9877 65.4034 17.6817 66.996 17.6817C68.5886 17.6817 70.1134 17.9877 71.5705 18.5997C73.0614 19.1777 74.3659 20.0277 75.4841 21.1497C76.6362 22.2717 77.5511 23.6657 78.2288 25.3317C78.9065 26.9637 79.2453 28.8337 79.2453 30.9417C79.2453 33.0497 78.9065 34.9367 78.2288 36.6027C77.5511 38.2347 76.6362 39.6117 75.4841 40.7337C74.3659 41.8557 73.0614 42.7227 71.5705 43.3347C70.1134 43.9127 68.5886 44.2017 66.996 44.2017ZM66.996 38.1327C68.5208 38.1327 69.6729 37.4867 70.4523 36.1947C71.2316 34.9027 71.6213 33.1517 71.6213 30.9417C71.6213 28.7317 71.2316 26.9807 70.4523 25.6887C69.6729 24.3967 68.5208 23.7507 66.996 23.7507C65.4373 23.7507 64.2683 24.3967 63.489 25.6887C62.7435 26.9807 62.3708 28.7317 62.3708 30.9417C62.3708 33.1517 62.7435 34.9027 63.489 36.1947C64.2683 37.4867 65.4373 38.1327 66.996 38.1327ZM93.3086 44.2017C91.5466 44.2017 89.9032 43.9127 88.3784 43.3347C86.8874 42.7227 85.5829 41.8557 84.4647 40.7337C83.3465 39.6117 82.4655 38.2347 81.8217 36.6027C81.1779 34.9367 80.856 33.0497 80.856 30.9417C80.856 28.8337 81.2117 26.9637 81.9233 25.3317C82.6349 23.6657 83.5837 22.2717 84.7696 21.1497C85.9895 20.0277 87.3957 19.1777 88.9883 18.5997C90.5809 17.9877 92.2412 17.6817 93.9693 17.6817C95.528 17.6817 96.9004 17.9367 98.0863 18.4467C99.3062 18.9567 100.39 19.6027 101.339 20.3847L97.8322 25.2297C96.6462 24.2437 95.5111 23.7507 94.4268 23.7507C92.597 23.7507 91.1569 24.3967 90.1065 25.6887C89.0561 26.9807 88.5308 28.7317 88.5308 30.9417C88.5308 33.1517 89.0561 34.9027 90.1065 36.1947C91.1908 37.4867 92.5462 38.1327 94.1726 38.1327C94.9859 38.1327 95.7652 37.9627 96.5107 37.6227C97.29 37.2487 98.0186 36.8067 98.6963 36.2967L101.644 41.1927C100.39 42.2807 99.0351 43.0627 97.5781 43.5387C96.121 43.9807 94.6979 44.2017 93.3086 44.2017ZM104.023 43.5897V7.83875H111.291V28.3407H111.495L119.474 18.2937H127.606L118.763 28.6977L128.268 43.5897H120.185L114.493 33.7467L111.291 37.3677V43.5897H104.023Z"
              fill="currentColor"
            />
            <path
              d="M124.027 15.5834C127.326 15.5834 130 12.8999 130 9.58978C130 6.27961 127.326 3.59619 124.027 3.59619C120.728 3.59619 118.053 6.27961 118.053 9.58978C118.053 12.8999 120.728 15.5834 124.027 15.5834Z"
              fill="#E95744"
            />
          </svg>
          <span className="text-gray-500 dark:text-gray-300 ml-1 lg:text-lg mt-1 lg:mt-2">
            {pageType}
          </span>
        </Link>
      </div>

      <Autocomplete />

      <div className="ml-auto flex items-center space-x-2 md:space-x-4">
        {mounted ? (
          <button
            type="button"
            className="p-2 text-gray-500 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" && <IoMoon />}
            {theme === "light" && <IoSunny />}
          </button>
        ) : null}

        <ApiSdkMenu />

        <div className="hidden md:block">
          <HelpMenu />
        </div>

        <Link
          href="https://dashboard.knock.app"
          className="font-medium text-[14px] leading-[21px] text-gray-500 dark:text-white hidden lg:block"
        >
          Dashboard &rarr;
        </Link>

        <button
          type="button"
          className="block md:hidden p-2 !-mr-2 text-gray-500 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors text-[20px]"
          onClick={toggleSidebar}
        >
          {!sidebarShown ? <IoMenu /> : <IoClose />}
        </button>
      </div>
    </header>
  );
};

export default MinimalHeader;
