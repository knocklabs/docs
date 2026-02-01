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
import { TgphComponentProps } from "@telegraph/helpers";

type NavItemProps = {
  href: string;
  isActive: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  samePageRouting?: boolean;
  containerProps?: TgphComponentProps<typeof Stack>;
  className?: string;
} & Omit<TgphComponentProps<typeof Text<"span">>, "as">;

const NavItem = ({
  href,
  isActive,
  icon,
  children,
  containerProps = {},
  className,
  ...textProps
}: NavItemProps) => {
  const { samePageRouting, currentResourcePath } = useSidebar();
  const { isOpen: isMobileSidebarOpen, closeSidebar: closeMobileSidebar } =
    useMobileSidebar();

  // Determine if this link should use same-page routing (scroll to element)
  // If currentResourcePath is set, only use same-page routing for links that:
  // 1. Exactly match currentResourcePath (e.g., /api-reference/users)
  // 2. OR are sub-paths of currentResourcePath (e.g., /api-reference/users/get)
  // This prevents /api-reference matching /api-reference/overview/... or /api-reference/users
  const isWithinCurrentResource = currentResourcePath
    ? href === currentResourcePath ||
      href.startsWith(currentResourcePath + "/")
    : false;

  const shouldUseSamePageRouting = samePageRouting && isWithinCurrentResource;

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldUseSamePageRouting) {
      e.preventDefault();
      highlightResource(href, { moveToItem: true });
    } else {
      updateNavStyles(href);
    }
    if (isMobileSidebarOpen) {
      closeMobileSidebar();
    }
  };

  // Next.js is really annoying if you have prefetch={true} so let's just NOT
  const prefetchProps = shouldUseSamePageRouting ? { prefetch: false } : {};

  const textPropsWithoutStyle = { ...textProps };
  delete textPropsWithoutStyle.style;

  return (
    <Stack
      as={Link}
      {...prefetchProps}
      href={stripTrailingSlash(href)}
      onClick={onClick}
      display="inline-flex"
      w="full"
      direction="row"
      align="center"
      gap="2"
      px="1"
      py="1"
      className={`nav-item ${className ?? ""}`}
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
      {...containerProps}
    >
      <Text
        as="span"
        weight="medium"
        style={
          {
            fontSize: "13px",
            textWrap: "nowrap",
            // Easy way to vertically align the text
            verticalAlign: "text-bottom",
            "--color": isActive ? "var(--tgph-gray-12)" : "var(--tgph-gray-11)",
            ...(textProps.style || {}),
          } as React.CSSProperties
        }
        {...textPropsWithoutStyle}
      >
        {children}
      </Text>
    </Stack>
  );
};

export { NavItem };
