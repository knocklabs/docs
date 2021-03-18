import React, { useEffect, useState } from "react";
import Link from "next/link";
import cn from "classnames";

export interface Props {
  title: string;
}

interface IHeader {
  level: number;
  title: string;
  id: string;
  subHeaders: IHeader[];
}

const nodeNameToLevel = { H1: 1, H2: 2, H3: 3, H4: 4 };

const nodeToHeader = (node: HTMLHeadingElement): IHeader => ({
  level: nodeNameToLevel[node.nodeName],
  title: node.innerText,
  id: node.id,
  subHeaders: [],
});

const buildHeaderTreeRec = (
  nodes: HTMLHeadingElement[],
  elm: IHeader,
  level: number
): IHeader[] => {
  const headers: IHeader[] = [];
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

const buildHeaderTree = (nodes: HTMLHeadingElement[]): IHeader[] => {
  if (nodes.length === 0) {
    return [];
  }

  const n = nodes[0];
  const h = nodeToHeader(n);

  return buildHeaderTreeRec(nodes, h, h.level);
};

const PageNav: React.FC<Props> = ({ title }) => {
  const [headers, setHeaders] = useState<IHeader[]>([]);

  useEffect(() => {
    const documentHeaders = Array.from(
      document.querySelectorAll(".docs-content h1, h2, h3")
    ) as HTMLHeadingElement[];

    setHeaders(buildHeaderTree(documentHeaders));
  }, [title]);

  if (headers.length === 0) {
    return null;
  }

  return (
    <aside className="fixed top-30 border-l pl-5 w-64">
      <h5 className="text-xs uppercase text-gray-900 font-semibold tracking-wider mb-3">
        On this page
      </h5>
      <ul className="space-y-2">
        <HeaderList headers={headers} nesting={0} />
      </ul>
    </aside>
  );
};

const HeaderList: React.FC<{ headers: IHeader[]; nesting: number }> = ({
  headers,
  nesting,
}) => (
  <>
    {headers.map((h, i) => (
      <React.Fragment key={`${h.id}-${i}`}>
        <li key={h.id} className={cn({ "ml-3": nesting === 1 })}>
          <Link href={`#${h.id}`}>
            <a
              className={cn({
                "text-gray-600 hover:text-gray-900": true,
              })}
            >
              {h.title}
            </a>
          </Link>
        </li>

        {h.subHeaders.length > 0 && (
          <HeaderList headers={h.subHeaders} nesting={nesting + 1} />
        )}
      </React.Fragment>
    ))}
  </>
);

export default PageNav;
