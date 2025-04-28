import React from "react";
import { Box, Stack } from "@telegraph/layout";
import { Text, Heading } from "@telegraph/typography";

const Steps = ({ titleSize = "p", children }) => (
  <Box role="list" ml="4" mt="10" mb="6">
    {React.Children.map(children, (child, i) =>
      React.cloneElement(child, { titleSize, stepNumber: i + 1 }),
    )}
  </Box>
);

function TitleTag({ size, title }) {
  const id = title.toLowerCase().replaceAll(" ", "-");

  switch (size) {
    case "p": {
      return (
        <Text as="p" id={id} color="default" weight="semi-bold" size="2" mb="2">
          {title}
        </Text>
      );
    }
    case "h2": {
      return (
        <Heading as="h2" id={id} color="default" weight="semi-bold" size="3" mb="2">
          {title}
        </Heading>
      );
    }
    case "h3": {
      return (
        <Heading as="h3" id={id} color="default" weight="semi-bold" size="3" mb="2">
          {title}
        </Heading>
      );
    }
    default:
      return null;
  }
}

const Step = ({ titleSize = "p", title, children, stepNumber }) => (
  <Stack position="relative" alignItems="flex-start" pb="4" role="listitem">
    <Box position="absolute" style={{ height: "calc(100% - 2.75rem)", top: "2.75rem" }} w="px" bg="gray-3" />
    <Box py="2" position="absolute" style={{ marginLeft: "-14px" }}>
      <Stack weight="semi-bold" alignItems="center" justifyContent="center" w="8" h="8" borderRadius="4" style={{ flexShrink: 0 }} bg="gray-2" size="2">
        {stepNumber}
      </Stack>
    </Box>
    <Box width="full" overflow="hidden" pl="12" pr="1" pt="2" pb="8">
      <TitleTag size={titleSize} title={title} />
      <Box>{children}</Box>
    </Box>
  </Stack>
);

export { Steps, Step };
