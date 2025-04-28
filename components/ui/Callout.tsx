import { Box, Stack } from "@telegraph/layout";
import React from "react";
import { Text } from "@telegraph/typography";
const Callout = ({
  emoji,
  children,
  text,
}: {
  emoji: string;
  children?: React.ReactNode;
  text?: React.ReactNode;
}): JSX.Element => (
  <Stack
    w="full"
    bg="gray-1"
    borderRadius="4"
    p="4"
    pr="3"
    mb="6"
    border="px"
    borderColor="gray-3"
    data-callout
  >
    <Box>
      <Stack
        alignItems="center"
        justifyContent="center"
        h="6"
        w="6"
        borderRadius="4"
        style={{ flexShrink: 0 }}
      >
        <Box style={{ paddingTop: "2px" }}>
          <Box w="full" h="full">
            {emoji}
          </Box>
        </Box>
      </Stack>
    </Box>
    <Stack flexDirection="column" minW="0" ml="2" w="full">
      {text && (
        <Text
          as="span"
          color="gray"
          size="2"
          mb="0"
          leading="3"
          style={{ marginBottom: "0px" }}
        >
          {text}
        </Text>
      )}
      {children}
    </Stack>
  </Stack>
);

export default Callout;
