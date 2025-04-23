import { LucideIcon } from "@telegraph/icon";
import { Text } from "@telegraph/typography";
import Link from "next/link";
import { highlightResource, stripTrailingSlash, updateNavStyles } from "./Page/helpers";
import { Stack } from "@telegraph/layout";
import { useSidebar } from "./Page";

type NavItemProps = {
  href: string;
  isActive: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  samePageRouting?: boolean;
};

const NavItem = ({ href, isActive, icon, children }: NavItemProps) => {
  const { samePageRouting } = useSidebar();
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (samePageRouting) {
      e.preventDefault();
      highlightResource(href, { moveToItem: true });
    } else {
      updateNavStyles(href);
    }
  };

  return (
    <Stack
      as={Link}
      href={stripTrailingSlash(href)}
      onClick={onClick}
      direction="row"
      align="center"
      gap="2"
      px="3"
      py="1"
      className="nav-item"
      color={isActive ? "default" : "gray"}
      style={{ textDecoration: "none", display: "block" }}
      borderRadius="2"
      data-active={isActive}
      data-resource-path={stripTrailingSlash(href)}
      icon={icon ? { icon: icon, "aria-hidden": true } : undefined}
    >
      <Text
        as="span"
        size="2"
        weight="medium"
        color={isActive ? "default" : "gray"}
      >
        {children}
      </Text>
    </Stack>
  );
};

export { NavItem };
