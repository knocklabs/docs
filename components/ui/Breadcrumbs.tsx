import { SidebarPage } from "@/data/types";
import { SidebarSection } from "@/data/types";
import { Icon } from "@telegraph/icon";
import { Lucide } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import Link from "next/link";

type BreadcrumbsProps = {
  pages: (SidebarPage | SidebarSection)[];
};

const Breadcrumbs = ({ pages }: BreadcrumbsProps) => {
  if (!pages) return null;
  return (
    <Stack direction="row" alignItems="center" gap="1" mb="4">
      {pages.map((path, index) => (
        <Stack direction="row" alignItems="center" key={index}>
          {path.slug && !path.title ? (
            <Text as="span" size="2" color="gray">
              {path.slug}
            </Text>
          ) : (
            <Link href={path.slug}>
              <Text as="span" size="2" color="gray">
                {path.title}
              </Text>
            </Link>
          )}
          {index !== pages.length - 1 && (
            <Icon
              icon={Lucide.ChevronRight}
              aria-hidden
              size="1"
              color="gray"
              ml="1"
            />
          )}
        </Stack>
      ))}
    </Stack>
  );
};

export { Breadcrumbs };
