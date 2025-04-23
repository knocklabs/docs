import { Box, Stack } from "@telegraph/layout";
import { Code, Text } from "@telegraph/typography";
import { Tag } from "@telegraph/tag";
import Link from "next/link";

const Endpoints = ({ children, title = "Endpoints" }) => (
  <Box border="px" borderColor="gray-3" borderRadius="2">
    <Box bg="gray-2" p="2">
      <Text as="span" size="2" weight="medium">
        {title}
      </Text>
    </Box>
    <Box py="1" px="4" style={{ overflowX: "auto" }}>
      {children}
    </Box>
  </Box>
);

const EndpointText = ({ method, path }) => (
  <Stack direction="row" align="center">
    <Tag
      color={method === "GET" ? "blue" : method === "POST" ? "green" : method === "PUT" ? "yellow" : method === "DELETE" ? "red" : "purple"}
      mr="1"
    >
      {method}
    </Tag>
    <Code as="span" mr="4" size="1">
      {path}
    </Code>
  </Stack>
);

const Endpoint = ({ method, path, name, withLink = false }) => (
  <Box my="3">
    {withLink && name ? (
      <Link href={`#${name}`} passHref>
        <EndpointText method={method} path={path} />
      </Link>
    ) : (
      <EndpointText method={method} path={path} />
    )}
  </Box>
);

export { Endpoints, Endpoint };
