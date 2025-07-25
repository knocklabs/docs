import Link from "next/link";
import { Box, Stack } from "@telegraph/layout";
import { Code, Text } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { ArrowRight } from "lucide-react";
import { highlightResource } from "@/components/ui/Page/helpers";

const Header = ({ children }) => (
  <Stack data-property-row-header alignItems="baseline" gap="1" mb="1">
    {children}
  </Stack>
);

const Wrapper = ({ children }) => (
  <Box data-property-row-wrapper>{children}</Box>
);

const Container = ({ children }) => {
  return (
    <Box
      py="3"
      borderBottom="px"
      borderColor="gray-3"
      data-property-row-container
    >
      {children}
    </Box>
  );
};

const Name = ({ children }) => (
  <Code as="span" size="1" pl="0" weight="semi-bold">
    {children}
  </Code>
);

const Types = ({ children }) => (
  <Stack
    data-property-row-types
    direction="row"
    alignItems="center"
    gap="1"
    style={{ overflowX: "hidden" }}
  >
    {children}
  </Stack>
);

const Type = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) => {
  if (href) {
    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      highlightResource(href, { moveToItem: true });
    };
    return (
      <Text as={Link} href={href} onClick={onClick}>
        <Code
          as="span"
          size="0"
          bg="gray-2"
          px="1"
          borderRadius="2"
          color="accent"
          weight="regular"
          border="px"
          borderColor="gray-5"
        >
          {children}
        </Code>
      </Text>
    );
  }

  return (
    <Code
      as="span"
      size="0"
      bg="gray-2"
      px="1"
      borderRadius="2"
      color="black"
      weight="regular"
      border="px"
      borderColor="gray-5"
    >
      {children}
    </Code>
  );
};

const Description = ({ children }) => (
  <Text
    data-property-row-description
    as="span"
    size="1"
    color="gray"
    weight="regular"
  >
    {children}
  </Text>
);

const Required = () => (
  <Code
    as="span"
    ml="1"
    size="0"
    color="red"
    px="1"
    borderRadius="2"
    weight="regular"
    bg="transparent"
  >
    Required
  </Code>
);

const ExpandableButton = ({ children, isOpen, onClick }) => (
  <Button
    onClick={onClick}
    variant="ghost"
    size="0"
    color="gray"
    weight="light"
    px="1"
    mt="2"
    style={{
      marginLeft: "calc(var(--tgph-spacing-1) * -1)",
    }}
    icon={{
      icon: ArrowRight,
      "aria-hidden": true,
      style: {
        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
      },
    }}
  >
    {children}
  </Button>
);

const ChildProperties = ({ children }) => (
  <Box pl="2" mt="2">
    {children}
  </Box>
);

const PropertyTag = ({ children }) => (
  <Code
    as="span"
    size="0"
    bg="gray-1"
    px="1"
    borderRadius="2"
    weight="regular"
    border="px"
    borderColor="gray-3"
  >
    {children}
  </Code>
);

const PropertyRow = Object.assign({
  Wrapper,
  Container,
  Header,
  Name,
  Types,
  Type,
  Required,
  Description,
  ExpandableButton,
  ChildProperties,
  PropertyTag,
});

export { PropertyRow };
