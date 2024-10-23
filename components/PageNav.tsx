import React, { useEffect, useState } from "react";
import Link from "next/link";
import cn from "classnames";

export interface Props {
  title: string;
  sourcePath: string;
}

interface IHeader {
  level: number;
  title: string;
  id: string;
  subHeaders: IHeader[];
}

const nodeNameToLevel = { H1: 1, H2: 2, H3: 3, H4: 4 };

const nodeToHeader = (node: HTMLHeadingElement): IHeader => {
  return {
    level: nodeNameToLevel[node.nodeName],
    title: node.innerText,
    id: node.id,
    subHeaders: [],
  };
};

const buildHeaderTreeRec = (
  nodes: HTMLHeadingElement[],
  elm: IHeader,
  level: number,
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

const HeaderList: React.FC<{ headers: IHeader[]; nesting: number }> = ({
  headers,
  nesting,
}) => (
  <>
    {headers.map((h, i) => (
      <React.Fragment key={`${h.id}-${i}`}>
        <li key={h.id} className={cn({ "ml-3": nesting === 1 })}>
          <Link
            href={`#${h.id}`}
            className={cn({
              "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100":
                true,
            })}
          >
            {h.title}
          </Link>
        </li>

        {h.subHeaders.length > 0 && (
          <HeaderList headers={h.subHeaders} nesting={nesting + 1} />
        )}
      </React.Fragment>
    ))}
  </>
);

const PageNav: React.FC<Props> = ({ title, sourcePath }) => {
  const [headers, setHeaders] = useState<IHeader[]>([]);

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
    <aside
      className="fixed top-30 pl-5 pb-4 w-64 overflow-y-auto"
      style={{ height: "calc(100vh - 15.8rem)" }}
    >
      <h5 className="text-xs uppercase text-gray-900 dark:text-gray-500 font-semibold tracking-wider mb-3">
        On this page
      </h5>
      <ul className="space-y-2">
        <HeaderList headers={headers} nesting={0} />
      </ul>
      <div className="my-4 border-t border-gray-200 dark:border-gray-800"></div>
      <a
        href={`https://github.com/knocklabs/docs/edit/main/${sourcePath}`}
        className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        target="_blank"
        rel="noreferrer"
      >
        Edit this page on GitHub &rarr;
      </a>
    </aside>
  );
};

export default PageNav;
