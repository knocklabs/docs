import { Icon } from "@chakra-ui/react";
import Link from "next/link";
import { IoLogoSlack, IoTerminal } from "react-icons/io5";
import sidebarContent from "../data/sidebar";
import Sidebar from "./Sidebar";

const DocsSidebar = () => (
  <Sidebar content={sidebarContent}>
    <div className="space-y-2">
      <Link href="/reference" passHref>
        <a className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
          <Icon as={IoTerminal} mr={2} />
          API reference
          <span className="ml-auto">&#8594;</span>
        </a>
      </Link>

      <Link
        href="https://join.slack.com/t/knockcustomers/shared_invite/zt-13zos4lkx-FWnqvhJjhlbwlWmKelIj5Q"
        passHref
      >
        <a className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
          <Icon as={IoLogoSlack} mr={2} />
          Join our community
          <span className="ml-auto">&#8594;</span>
        </a>
      </Link>
    </div>
  </Sidebar>
);

export default DocsSidebar;
