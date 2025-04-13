import React, { useEffect, useState } from "react";
import Link from "next/link";
import cn from "classnames";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";
import { Icon, Lucide } from "@telegraph/icon";

export interface Props {
  title: string;
  sourcePath: string;
}

interface Header {
  level: number;
  title: string;
  id: string;
  subHeaders: Header[];
}

const nodeNameToLevel = { H1: 1, H2: 2, H3: 3, H4: 4 };

const nodeToHeader = (node: HTMLHeadingElement): Header => {
  return {
    level: nodeNameToLevel[node.nodeName],
    title: node.innerText,
    id: node.id,
    subHeaders: [],
  };
};

const buildHeaderTreeRec = (
  nodes: HTMLHeadingElement[],
  elm: Header,
  level: number,
): Header[] => {
  const headers: Header[] = [];
  while (nodes.length > 0) {
    const h = nodeToHeader(nodes[0]);

    if (h.level === level) {
      headers.push(h);
      nodes.shift();
      elm = h;
    } else if (h.level > level) {
      elm.subHeaders = buildHeaderTreeRec(nodes, elm, h.level);
    } else {
      break;
    }
  }

  return headers;
};

const buildHeaderTree = (nodes: HTMLHeadingElement[]): Header[] => {
  if (nodes.length === 0) {
    return [];
  }

  const n = nodes[0];
  const h = nodeToHeader(n);

  return buildHeaderTreeRec(nodes, h, h.level);
};

const HeaderList: React.FC<{ headers: Header[]; nesting: number }> = ({
  headers,
  nesting,
}) => (
  <>
    {headers.map((h, i) => (
      <React.Fragment key={`${h.id}-${i}`}>
        <Box
          as="li"
          key={h.id}
          ml={nesting === 1 ? "3" : "0"}
          style={{ listStyle: "none", wordBreak: "break-word" }}
        >
          <Text
            as={Link}
            href={`#${h.id}`}
            size="2"
            color="gray"
            style={{ textDecoration: "none" }}
          >
            {h.title}
          </Text>
        </Box>

        {h.subHeaders.length > 0 && (
          <HeaderList headers={h.subHeaders} nesting={nesting + 1} />
        )}
      </React.Fragment>
    ))}
  </>
);

const OnThisPage: React.FC<Props> = ({ title, sourcePath }) => {
  const [headers, setHeaders] = useState<Header[]>([]);

  useEffect(() => {
    const documentHeaders = Array.from(
      document.querySelectorAll(".docs-content h1, h2, h3"),
    ) as HTMLHeadingElement[];

    setHeaders(buildHeaderTree(documentHeaders));
  }, [title, sourcePath]);

  if (headers.length === 0) {
    return null;
  }

  return (
    <Box
      as="aside"
      position="sticky"
      top="28"
      right="4"
      width="60"
      py="6"
      style={{ height: "calc(100vh - 15rem)" }}
    >
      <Stack direction="row" align="center" gap="1" mb="2">
        <Icon icon={Lucide.Text} size="2" color="default" aria-hidden />
        <Text as="span" size="2" weight="medium" color="default">
          On this page
        </Text>
      </Stack>
      <Stack as="ul" direction="column" gap="1">
        <HeaderList headers={headers} nesting={0} />
      </Stack>
      <Box borderTop="px" borderColor="gray-3" my="4" />
      <Text
        as="a"
        href={`https://github.com/knocklabs/docs/edit/main/${sourcePath}`}
        color="gray"
        size="1"
        mt="2"
        style={{ textDecoration: "none", display: "block" }}
        target="_blank"
        rel="noreferrer"
      >
        Edit this page on GitHub &rarr;
      </Text>
      <div
        id="gradient"
        className="sticky bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-white dark:from-gray-900 to-transparent"
      />
    </Box>
  );
};

export { OnThisPage };
