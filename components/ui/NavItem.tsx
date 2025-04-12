import { Icon, LucideIcon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import Link from "next/link";

type NavItemProps = {
  href: string;
  isActive: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
};

const NavItem = ({ href, isActive, icon, children }: NavItemProps) => {
  return (
    <Stack
      as={Link}
      href={href}
      direction="row"
      align="center"
      gap="2"
      px="3"
      py="1"
      className="nav-item"
      color="gray"
      style={{ textDecoration: "none", display: "block" }}
      borderRadius="2"
      data-active={isActive}
    >
      {icon && <Icon icon={icon} aria-hidden />}
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
