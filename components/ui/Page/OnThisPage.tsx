import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Icon, Lucide } from "@telegraph/icon";
import { motion } from "framer-motion";

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
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const documentHeaders = Array.from(
      document.querySelectorAll(".docs-content h1, h2, h3"),
    ) as HTMLHeadingElement[];

    setHeaders(buildHeaderTree(documentHeaders));
  }, [title, sourcePath]);

  // A nice way to show that there is more content below the scroller
  useEffect(() => {
    if (scrollerRef.current && gradientRef.current) {
      const scroller = scrollerRef.current;
      const gradient = gradientRef.current;

      const handleScroll = () => {
        if (!scroller || !gradient) return;

        // If content height is less than or equal to viewport height, hide gradient
        if (scroller.scrollHeight <= scroller.clientHeight) {
          gradient.style.opacity = "0";
          scroller.style.paddingBottom = "var(--tgph-spacing-4)";
          return;
        }

        const scrollableHeight = scroller.scrollHeight - scroller.clientHeight;
        const scrolledAmount = scroller.scrollTop;
        const scrollPercentage = Math.min(scrolledAmount / scrollableHeight, 1);

        // Invert the percentage so opacity goes from 1 to 0 as we scroll down
        gradient.style.opacity = String(1 - scrollPercentage);
      };

      scroller.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check

      return () => {
        scroller.removeEventListener("scroll", handleScroll);
      };
    }
  }, [headers]);

  if (headers.length === 0) {
    return null;
  }

  return (
    <Box as="aside" className="lg-hidden">
      <Box
        position="sticky"
        top="32"
        right="4"
        style={{ height: "calc(100vh - 15rem)" }}
      >
        <Stack direction="row" align="center" gap="1" mb="2">
          <Icon icon={Lucide.Text} size="2" color="default" aria-hidden />
          <Text as="span" size="2" weight="medium" color="default">
            On this page
          </Text>
        </Stack>
        <Box position="relative" h="full">
          <Stack
            as="ul"
            direction="column"
            gap="1"
            style={{ overflowY: "auto" }}
            h="full"
            tgphRef={scrollerRef}
            pb="10"
          >
            <HeaderList headers={headers} nesting={0} />
          </Stack>
          <Box
            position="absolute"
            left="0"
            bottom="0"
            right="0"
            height="32"
            tgphRef={gradientRef}
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--tgph-surface-1))",
              pointerEvents: "none",
            }}
          />
          <Box borderTop="px" borderColor="gray-3" mb="4" />
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
        </Box>
      </Box>
    </Box>
  );
};

export { OnThisPage };
