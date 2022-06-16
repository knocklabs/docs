import React, { useMemo } from "react";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import ruby from "react-syntax-highlighter/dist/cjs/languages/hljs/ruby";
import elixir from "react-syntax-highlighter/dist/cjs/languages/hljs/elixir";
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import php from "react-syntax-highlighter/dist/cjs/languages/hljs/php";
import dotnet from "react-syntax-highlighter/dist/cjs/languages/hljs/csharp";
import shell from "react-syntax-highlighter/dist/cjs/languages/hljs/shell";
import liquid from "react-syntax-highlighter/dist/cjs/languages/hljs/handlebars";
import go from "react-syntax-highlighter/dist/cjs/languages/hljs/go";
import { Icon, Tooltip } from "@chakra-ui/react";
import { IoCheckmark, IoCopy } from "react-icons/io5";
import useClipboard from "react-use-clipboard";

import { lightCodeTheme } from "../styles/codeThemes";
import { normalize } from "../lib/normalizeCode";
import { useIsMounted } from "../hooks/useIsMounted";

SyntaxHighlighter.registerLanguage("node", javascript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("jsx", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("elixir", elixir);
SyntaxHighlighter.registerLanguage("csharp", dotnet);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("shell", shell);
SyntaxHighlighter.registerLanguage("liquid", liquid);
SyntaxHighlighter.registerLanguage("go", go);

export type SupportedLanguage =
  | "javascript"
  | "node"
  | "shell"
  | "ruby"
  | "elixir"
  | "csharp"
  | "python"
  | "php"
  | "json"
  | "go";

const LanguageLabel = {
  javascript: "JavaScript",
  node: "Node",
  ruby: "Ruby",
  elixir: "Elixir",
  csharp: ".NET (C#)",
  python: "Python",
  php: "PHP",
  shell: "Shell",
  json: "JSON",
  go: "Go",
};

export interface Props {
  language?: string;
  languages?: string[];
  setLanguage?: (lang: SupportedLanguage) => void;
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
  languages,
  setLanguage,
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
      <div className="bg-gray-100 border-b p-2 flex items-center">
        {title && (
          <span className="text-gray-500 text-xs font-medium">{title}</span>
        )}

        <div className="flex items-center ml-auto">
          {languages && setLanguage && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="ml-auto bg-transparent text-xs font-medium text-gray-500 mr-2 mt-0.5 text-right"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {LanguageLabel[l] || l}
                </option>
              ))}
            </select>
          )}

          <Tooltip
            label="Copy this example"
            fontSize={12}
            px={1}
            py={1}
            lineHeight={1}
            placement="left-start"
          >
            <button
              type="button"
              onClick={setCopied}
              className="text-xs uppercase text-gray-500 tracking-wider px-1"
            >
              <Icon as={isCopied ? IoCheckmark : IoCopy} boxSize="12px" />
            </button>
          </Tooltip>
        </div>
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
