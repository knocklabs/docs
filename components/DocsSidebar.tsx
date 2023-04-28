import Link from "next/link";
import { IoSwapHorizontal, IoLogoSlack, IoTerminal } from "react-icons/io5";
import sidebarContent from "../data/sidebar";
import Sidebar from "./Sidebar";

const DocsSidebar = () => (
  <Sidebar content={sidebarContent}>
    <div className="space-y-2">
      {/* <Link href="/reference" passHref>
        <a className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-200">
          <IoTerminal className="mr-2" />
          API reference
          <span className="ml-auto">&#8594;</span>
        </a>
      </Link>

      <Link href="/integrations/overview" passHref>
        <a className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-200">
          <IoSwapHorizontal className="mr-2" />
          Integration guides
          <span className="ml-auto">&#8594;</span>
        </a>
      </Link> */}

      <Link href="https://knock.app/join-slack" passHref>
        <a className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-200">
          <IoLogoSlack className="mr-2" />
          Join our community
          <span className="ml-auto">&#8594;</span>
        </a>
      </Link>
    </div>
  </Sidebar>
);

export default DocsSidebar;
