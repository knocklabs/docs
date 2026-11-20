import {
  getCodeContent,
  getLanguageFromClassName,
  DEFAULT_CODE_LANGUAGE,
} from "./codeBlock";
import { highlightCode } from "./highlightCode";

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function textContent(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textContent).join("");
}

function classNameOf(node: HastNode): string {
  const className = node.properties?.className;
  return Array.isArray(className)
    ? className.join(" ")
    : String(className ?? "");
}

function highlightFence(pre: HastNode) {
  const code = pre.children?.find(
    (child) => child.type === "element" && child.tagName === "code",
  );
  if (!code) return;

  const className = classNameOf(code);
  const language = getLanguageFromClassName(className) ?? DEFAULT_CODE_LANGUAGE;
  const content = getCodeContent(textContent(code), className);

  // MDX passes this to CodeBlock as the `data-highlighted-html` prop.
  code.properties = {
    ...code.properties,
    dataHighlightedHtml: highlightCode(content, language),
  };
}

function walk(node: HastNode) {
  if (node.type === "element" && node.tagName === "pre") {
    highlightFence(node);
    return;
  }
  node.children?.forEach(walk);
}

/**
 * Highlights fenced code blocks at build time, so pages don't ship the
 * highlighter. Run it before `rehype-mdx-code-props`, which turns fences with
 * props into JSX that later plugins can't see.
 */
export default function rehypeHighlightCode() {
  return (tree: HastNode) => walk(tree);
}
