import { LucideIcon } from "@telegraph/icon";
import { Text } from "@telegraph/typography";
import Link from "next/link";
import {
  highlightResource,
  stripTrailingSlash,
  updateNavStyles,
} from "./Page/helpers";
import { Stack } from "@telegraph/layout";
import { useSidebar } from "./Page/Sidebar";
import { useMobileSidebar } from "./Page/MobileSidebar";

type NavItemProps = {
  href: string;
  isActive: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  samePageRouting?: boolean;
};

const NavItem = ({ href, isActive, icon, children }: NavItemProps) => {
  const { samePageRouting } = useSidebar();
  const { isOpen: isMobileSidebarOpen, closeSidebar: closeMobileSidebar } =
    useMobileSidebar();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (samePageRouting) {
      e.preventDefault();
      highlightResource(href, { moveToItem: true });
    } else {
      updateNavStyles(href);
    }
    if (isMobileSidebarOpen) {
      closeMobileSidebar();
    }
  };

  return (
    <Stack
      as={Link}
      href={stripTrailingSlash(href)}
      onClick={onClick}
      display="inline-flex"
      w="full"
      direction="row"
      align="center"
      gap="2"
      px="1"
      py="1"
      className="nav-item"
      color={isActive ? "default" : "gray"}
      style={{
        textDecoration: "none",
        display: "block",
        textOverflow: "ellipsis",
        overflow: "hidden",
      }}
      borderRadius="2"
      data-active={isActive}
      data-resource-path={stripTrailingSlash(href)}
      icon={icon ? { icon: icon, "aria-hidden": true } : undefined}
    >
      <Text
        as="span"
        weight="medium"
        color={isActive ? "default" : "gray"}
        style={{
          fontSize: "13px",
          // @ts-expect-error textWrap is fine
          textWrap: "nowrap",
          // Easy way to vertically align the text
          verticalAlign: "text-bottom",
        }}
      >
        {children}
      </Text>
    </Stack>
  );
};

export { NavItem };
