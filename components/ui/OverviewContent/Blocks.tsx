import { MenuItem } from "@telegraph/menu";
import Link from "next/link";
import { Heading, Text } from "@telegraph/typography";
import { Stack, Box } from "@telegraph/layout";
import { Icon, type LucideIcon } from "@telegraph/icon";
import { Icons } from "../Icons";
import React from "react";
import Image from "next/image";
import { TgphComponentProps } from "@telegraph/helpers";

type IconComponent = () => JSX.Element;
type IconType = keyof typeof Icons | LucideIcon | IconComponent;

function getIcon(icon?: IconType): IconComponent | React.ReactNode {
  if (typeof icon === "function") {
    return icon as IconComponent;
  }

  if (typeof icon === "string") {
    // Lowercase the string in case it comes in as
    // the wrong format from an MDX file as these
    // can't be properly type checked.
    const lowercasedIcon = icon.toLowerCase();
    if (Icons[lowercasedIcon as keyof typeof Icons]) {
      return Icons[lowercasedIcon as keyof typeof Icons] as () => JSX.Element;
    }

    // We throw an error here so that a build can't complete if there is an icon that
    // is not found in the Icons object.
    throw new Error(
      `Icon ${icon} not found, please add it to the Icons object in the Icons.tsx file`,
    );
  }

  return icon as React.ReactNode;
}

export const Tool = ({
  icon,
  title,
  description,
  href,
}: {
  icon: IconType;
  title: string;
  description: string;
  href: string;
}) => {
  const _icon = getIcon(icon);
  return (
    <MenuItem
      as={Link}
      href={href}
      h="full"
      w="full"
      p="2"
      style={{ minWidth: "0" }}
    >
      <Stack
        w="full"
        h="full"
        flexDirection="column"
        gap="2"
        justifyContent="center"
        alignItems="center"
      >
        {typeof _icon === "function" ? (
          <Box w="8" h="8" bg="black" color="white" p="2" borderRadius="2">
            {_icon()}
          </Box>
        ) : (
          <Icon
            icon={_icon as LucideIcon}
            aria-hidden={true}
            w="8"
            h="8"
            bg="black"
            color="white"
            p="2"
            borderRadius="2"
          />
        )}
        <Box mt="2">
          <Heading as="h4" size="2" weight="medium" mb="1" align="center">
            {title}
          </Heading>
          <Text
            as="p"
            size="1"
            color="gray"
            align="center"
            // @ts-expect-error shut up
            style={{ textWrap: "auto" }}
          >
            {description}
          </Text>
        </Box>
      </Stack>
    </MenuItem>
  );
};

export const ContentCard = ({
  title,
  description,
  href,
  icon,
  style,
  newTab,
}: {
  title: string;
  description: string;
  href: string;
  icon: IconType;
  style?: React.CSSProperties;
  newTab?: boolean;
}) => {
  const _icon = getIcon(icon);
  return (
    <Box borderRadius="2" style={style} shadow="1" data-content-card>
      <Stack
        as={Link}
        href={href}
        target={newTab ? "_blank" : undefined}
        w="full"
        h="full"
        flexDirection="column"
        gap="2"
        border="px"
        borderColor="gray-2"
        borderRadius="2"
        p="3"
        data-content-card-inner
      >
        {typeof _icon === "function" ? (
          <Box w="10" h="10" bg="gray-2" p="2" borderRadius="2">
            {_icon()}
          </Box>
        ) : (
          <Icon
            icon={_icon as LucideIcon}
            aria-hidden={true}
            w="10"
            h="10"
            bg="gray-2"
            p="2"
            borderRadius="2"
          />
        )}
        <Heading as="span" size="3" weight="medium" mb="0">
          {title}
        </Heading>
        <Text as="span" size="1" color="gray">
          {description}
        </Text>
      </Stack>
    </Box>
  );
};

export const ConceptCard = ({
  title,
  description,
  href,
  image,
}: {
  title: string;
  description: string;
  href: string;
  image: string;
}) => {
  return (
    <MenuItem
      as={Link}
      href={href}
      h="full"
      w="full"
      p="2"
      borderRadius="4"
      style={{ minWidth: "0", overflow: "hidden" }}
    >
      <Stack flexDirection="column" w="full">
        <Image
          src={image}
          alt={title}
          width={2200}
          height={2200}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            maxHeight: "var(--tgph-spacing-52)",
            borderRadius: "var(--tgph-rounded-2)",
          }}
        />
        <Box mt="4">
          <Heading as="h4" size="2" weight="medium" mb="1">
            {title}
          </Heading>
          <Text
            as="p"
            size="1"
            color="gray"
            // @ts-expect-error shut up
            style={{ textWrap: "auto" }}
          >
            {description}
          </Text>
        </Box>
      </Stack>
    </MenuItem>
  );
};

export const BuildingBlock = ({
  title,
  description,
  icon,
  href = "#",
}: {
  title: string;
  description: string;
  icon: IconType;
  href: string;
}) => {
  const _icon = getIcon(icon);
  return (
    <MenuItem
      as={Link}
      href={href}
      h="full"
      w="full"
      p="2"
      style={{ minWidth: "0" }}
    >
      <Stack w="full" h="full">
        <Icon
          icon={_icon as LucideIcon}
          aria-hidden={true}
          w="10"
          h="10"
          bg="gray-2"
          p="2"
          borderRadius="2"
          mr="4"
          style={{ flexShrink: 0 }}
        />
        <Box h="full">
          <Heading as="h4" size="2" weight="medium" mb="1">
            {title}
          </Heading>
          <Text as="p" size="1" color="gray" style={{ marginBottom: "0" }}>
            {description}
          </Text>
        </Box>
      </Stack>
    </MenuItem>
  );
};

type ResponsiveThreeColumnProps = TgphComponentProps<typeof Stack>;

export const ResponsiveThreeColumn = ({
  children,
  ...props
}: ResponsiveThreeColumnProps) => {
  return (
    <Stack
      direction="row"
      gap="6"
      w="full"
      justifyContent="space-between"
      className="md-one-column"
      {...props}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        ...props.style,
      }}
    >
      {children}
    </Stack>
  );
};

type ResponsiveTwoColumnProps = TgphComponentProps<typeof Stack>;

export const ResponsiveTwoColumn = ({
  children,
  ...props
}: ResponsiveTwoColumnProps) => {
  return (
    <Stack
      direction="row"
      gap="6"
      w="full"
      justifyContent="space-between"
      className="md-one-column"
      {...props}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        ...props.style,
      }}
    >
      {children}
    </Stack>
  );
};
