import { Box, Stack } from "@telegraph/layout";
import { Code, Heading } from "@telegraph/typography";
import { Tag } from "@telegraph/tag";
import Link from "next/link";

const Endpoints = ({ children, title = "Endpoints" }) => (
  <Stack direction="column" gap="3" maxW="full">
    <Heading as="h3" size="2" weight="medium">
      {title}
    </Heading>
    <Stack direction="column" gap="2" style={{ overflowX: "auto" }}>
      {children}
    </Stack>
  </Stack>
);

const EndpointText = ({
  method,
  path,
  id,
}: {
  method: string;
  path: string;
  id?: string;
}) => (
  <Stack direction="row" align="center" id={id}>
    <Tag
      color={
        method === "GET"
          ? "blue"
          : method === "POST"
          ? "green"
          : method === "PUT"
          ? "yellow"
          : method === "DELETE"
          ? "red"
          : "purple"
      }
      mr="1"
    >
      {method}
    </Tag>
    <Code
      display="block"
      as="span"
      size="1"
      overflow="hidden"
      textOverflow="ellipsis"
      mt="1"
    >
      {path}
    </Code>
  </Stack>
);

const Endpoint = ({ method, path, name, withLink = false }) => {
  const id = name && path ? `${name}-${path}` : null;
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (withLink && id) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const offset = 285;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <Box>
      {withLink && id ? (
        <Link href={`#${id}`} passHref onClick={handleClick}>
          <EndpointText method={method} path={path} />
        </Link>
      ) : (
        <EndpointText method={method} path={path} {...(id ? { id } : {})} />
      )}
    </Box>
  );
};

export { Endpoints, Endpoint };
