import React, { useEffect, useState, useRef, type RefObject } from "react";
import Link from "next/link";
import { Text as TextIcon } from "lucide-react";

import { Icon } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

import { ScrollerBottomGradient } from "./ScrollerBottomGradient";

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
          style={{
            listStyle: "none",
            wordBreak: "break-word",
            marginLeft: nesting === 1 ? "0.75rem" : "0",
            lineHeight: "1.5",
          }}
        >
          <Text
            as={Link}
            href={`#${h.id}`}
            onClick={(e) => {
              // Default browser behavior was buggy as hell, so we're handling it manually
              e.preventDefault();
              const el = document.getElementById(h.id);
              if (el) {
                const topOfElement =
                  el.getBoundingClientRect().top + window.scrollY;
                // Subtract 100 to give it 100px padding from the top, plus some comfort room
                const val = topOfElement - 110;
                window.scrollTo({
                  top: val,
                  behavior: "smooth",
                });
                history.replaceState(null, "", `#${h.id}`);
              }
            }}
            size="1"
            color="gray"
            data-toc-link
            style={{
              textDecoration: "none",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
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
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const documentHeaders = Array.from(
      document.querySelectorAll(".docs-content h1, h2, h3"),
    ) as HTMLHeadingElement[];

    setHeaders(buildHeaderTree(documentHeaders));
  }, [title, sourcePath]);

  // Always render container to reserve space; CSS hides on mobile via .toc-aside
  return (
    <Box
      as="aside"
      px="4"
      className="toc-aside"
      style={{ minWidth: "200px", width: "200px", flexShrink: 0 }}
    >
      <Box
        position="sticky"
        top="32"
        style={{ height: "calc(100vh - 15rem)", right: "1rem" }}
      >
        {headers.length > 0 && (
          <>
            <Stack direction="row" align="center" gap="1" height="7">
              <Icon icon={TextIcon} size="1" color="default" aria-hidden />
              <Text as="span" size="1" weight="medium" color="default">
                On this page
              </Text>
            </Stack>
            <Box position="relative" h="full">
              <Stack
                as="ul"
                direction="column"
                gap="2"
                mt="1"
                style={{ overflowY: "auto", paddingBottom: "2.5rem" }}
                h="full"
                tgphRef={scrollerRef}
              >
                <HeaderList headers={headers} nesting={0} />
              </Stack>
              <ScrollerBottomGradient
                scrollerRef={scrollerRef as RefObject<HTMLDivElement>}
              />
              <Box
                borderTop="px"
                borderColor="gray-4"
                style={{ marginBottom: "1rem" }}
              />
              <Text
                as="a"
                href={`https://github.com/knocklabs/docs/edit/main/${sourcePath}`}
                color="gray"
                size="1"
                style={{
                  textDecoration: "none",
                  display: "block",
                  marginTop: "0.5rem",
                }}
                target="_blank"
                rel="noreferrer"
              >
                Edit this page on GitHub &rarr;
              </Text>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export { OnThisPage };
