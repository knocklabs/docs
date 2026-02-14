import { SidebarPage } from "@/data/types";
import { SidebarSection } from "@/data/types";
import { Icon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { ChevronRight } from "lucide-react";

type BreadcrumbsProps = {
  pages: (SidebarPage | SidebarSection)[];
};

const Breadcrumbs = ({ pages }: BreadcrumbsProps) => {
  if (!pages) return null;

  // Filter out any pages that don't have valid titles or slugs
  const validPages = pages.filter(
    (page) => page && (page.title || (page.slug && page.slug !== "undefined")),
  );

  if (validPages.length === 0) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="1"
      w="full"
      style={{ overflowX: "auto" }}
    >
      {validPages.map((path, index) => (
        <Stack direction="row" alignItems="center" key={index}>
          {path.slug && !path.title ? (
            <Text as="span" size="2" color="gray">
              {path.slug}
            </Text>
          ) : (
            // <Link href={path.slug}>
            <Text
              as="span"
              size="2"
              color="gray"
              style={{
                textWrap: "nowrap",
              }}
            >
              {path.title}
            </Text>
            // </Link>
          )}
          {index !== validPages.length - 1 && (
            <Icon
              icon={ChevronRight}
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
