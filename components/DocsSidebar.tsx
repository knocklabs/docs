import { Icon } from "@chakra-ui/react";
import Link from "next/link";
import { IoTerminal } from "react-icons/io5";
import sidebarContent from "../data/sidebar";
import Sidebar from "./Sidebar";

const DocsSidebar = () => (
  <Sidebar content={sidebarContent}>
    <Link href="/reference" passHref>
      <a className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
        <Icon as={IoTerminal} mr={2} />
        API reference &#8594;
      </a>
    </Link>
  </Sidebar>
);

export default DocsSidebar;
