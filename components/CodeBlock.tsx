import React, { useMemo } from "react";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import ruby from "react-syntax-highlighter/dist/cjs/languages/hljs/ruby";
import shell from "react-syntax-highlighter/dist/cjs/languages/hljs/shell";
import useClipboard from "react-use-clipboard";
import { lightCodeTheme } from "../styles/codeThemes";
import { normalize } from "../lib/normalizeCode";
import { useIsMounted } from "../hooks/useIsMounted";

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("jsx", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("shell", shell);

export type SupportedLanguage = "javascript" | "shell" | "ruby" | "json";

export interface Props {
  language?: string;
  className?: string;
  children?: any;
}

const getParams = (
  className = "",
): { language?: string; for?: string; always?: boolean } => {
  const [language, params = ""] = className.split(":");

  const splitParams: { [key: string]: string } = params
    .split("&")
    .reduce((merged, param) => {
      const [key, value] = param.split("=");
      if (key !== "") {
        merged[key] = value ?? true;
      }

      return merged;
    }, {});

  return {
    language: language.split("language-")[1],
    ...splitParams,
  };
};

export const CodeBlock: React.FC<Props> = ({
  children,
  className = children.props ? children.props.className : "",
  language,
}) => {
  const isMounted = useIsMounted();

  const theme = lightCodeTheme;
  const params = useMemo(() => getParams(className) as any, [className]);
  const lang = useMemo(
    () => language ?? params.language ?? "shell",
    [language, params],
  );

  const [content] = useMemo(
    () =>
      normalize(
        children != null &&
          typeof children !== "string" &&
          children.props &&
          children.props.children
          ? children.props.children
          : children ?? "",
        className,
      ),
    [children],
  );

  const title = children.props.metastring;

  const [isCopied, setCopied] = useClipboard(content, {
    successDuration: 2000,
  });

  if (!isMounted) {
    return null;
  }

  return (
    <div className="code-block text-sm border rounded">
      <div className="bg-gray-100 border-b p-2 flex">
        {title && <span className="text-gray-500 font-medium">{title}</span>}

        <button
          type="button"
          onClick={setCopied}
          className="text-xs uppercase text-gray-500 tracking-wider ml-auto"
        >
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        showLineNumbers
        lineNumberStyle={{
          color: "#ccc",
        }}
        language={lang}
        style={theme}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};
