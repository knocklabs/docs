import Link from "next/link";

import sidebarContent from "../data/integrationsSidebar";
import Sidebar from "./Sidebar";

const IntegrationsSidebar = (props) => (
  <Sidebar content={sidebarContent} {...props}>
    <Link
      href="/"
      passHref
      className="text-sm block font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
    >
      &#8592; Back to docs
    </Link>
  </Sidebar>
);

export default IntegrationsSidebar;
