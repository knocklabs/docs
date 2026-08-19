import React from "react";
import { Button } from "@telegraph/button";
import { ArrowUpRight } from "lucide-react";

type ButtonRootProps = React.ComponentProps<typeof Button.Root>;
type ButtonTextProps = React.ComponentProps<typeof Button.Text>;

export interface ClaudeConnectorButtonProps
  extends Omit<
    ButtonRootProps,
    "as" | "href" | "target" | "rel" | "variant" | "children"
  > {
  text?: string;
  textProps?: ButtonTextProps;
}

const CLAUDE_CONNECTOR_URL = "https://claude.ai/directory/connectors/knock";

export const ClaudeConnectorButton = ({
  text = "Add Knock in Claude",
  textProps = {},
  ...rest
}: ClaudeConnectorButtonProps) => {
  return (
    <Button.Root
      as="a"
      href={CLAUDE_CONNECTOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      variant="solid"
      color="accent"
      mt="4"
      trailingIcon={{ icon: ArrowUpRight, "aria-hidden": true }}
      {...rest}
    >
      <Button.Text size="2" {...textProps}>
        {text}
      </Button.Text>
    </Button.Root>
  );
};
