import React from "react";
import { Button } from "@telegraph/button";
import { Box } from "@telegraph/layout";
import { ArrowUpRight } from "lucide-react";
import { Icons } from "./Icons";

type ButtonRootProps = React.ComponentProps<typeof Button.Root>;
type ButtonTextProps = React.ComponentProps<typeof Button.Text>;

export interface ContentButtonProps
  extends Omit<ButtonRootProps, "as" | "children"> {
  text: string;
  icon?: string;
  textProps?: ButtonTextProps;
}

function resolveIcon(icon?: string) {
  if (!icon) {
    return null;
  }

  const resolved = Icons[icon.toLowerCase() as keyof typeof Icons];

  if (!resolved) {
    throw new Error(
      `Icon ${icon} not found, please add it to the Icons object in the Icons.tsx file`,
    );
  }

  return resolved;
}

export const ContentButton = ({
  text,
  icon,
  textProps = {},
  variant = "outline",
  color = "accent",
  mt = "4",
  ...rest
}: ContentButtonProps) => {
  const IconComponent = resolveIcon(icon);

  return (
    <Button.Root as="a" variant={variant} color={color} mt={mt} {...rest}>
      {IconComponent && (
        <Box w="4" h="4" aria-hidden style={{ display: "flex", flexShrink: 0 }}>
          <IconComponent />
        </Box>
      )}
      <Button.Text size="2" {...textProps}>
        {text}
      </Button.Text>
      <Button.Icon icon={ArrowUpRight} aria-hidden />
    </Button.Root>
  );
};
