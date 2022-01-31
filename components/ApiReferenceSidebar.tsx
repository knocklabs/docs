import Link from "next/link";

import sidebarContent from "../data/apiReferenceSidebar";
import Sidebar from "./Sidebar";

const ApiReferenceSidebar = () => (
  <Sidebar content={sidebarContent}>
    <Link href="/" passHref>
      <a className="text-sm block font-medium text-gray-500 hover:text-gray-900">
        &#8592; Back to docs
      </a>
    </Link>
  </Sidebar>
);

export default ApiReferenceSidebar;
