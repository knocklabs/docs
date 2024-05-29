import React, { useMemo } from "react";
import { useTheme } from "next-themes";
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
import java from "react-syntax-highlighter/dist/cjs/languages/hljs/java";
import yaml from "react-syntax-highlighter/dist/cjs/languages/hljs/yaml";
import kotlin from "react-syntax-highlighter/dist/cjs/languages/hljs/kotlin";
import swift from "react-syntax-highlighter/dist/cjs/languages/hljs/swift";
import { IoCheckmark, IoCopy } from "react-icons/io5";
import useClipboard from "react-use-clipboard";

import { lightCodeTheme, darkCodeTheme } from "../styles/codeThemes";
import { normalize } from "../lib/normalizeCode";
import { useIsMounted } from "../hooks/useIsMounted";

SyntaxHighlighter.registerLanguage("node", javascript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("jsx", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("jsweb", javascript);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("elixir", elixir);
SyntaxHighlighter.registerLanguage("csharp", dotnet);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("shell", shell);
SyntaxHighlighter.registerLanguage("liquid", liquid);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("curl", shell);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("kotlin", kotlin);

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
  | "go"
  | "java"
  | "kotlin"
  | "swift"
  | "yaml"
  | "curl"
  | "jsweb";

const LanguageLabel = {
  javascript: "JavaScript",
  node: "Node.js",
  ruby: "Ruby",
  elixir: "Elixir",
  csharp: ".NET (C#)",
  python: "Python",
  php: "PHP",
  shell: "Shell",
  json: "JSON",
  go: "Go",
  java: "Java",
  yaml: "YAML",
  curl: "cURL",
  kotlin: "Kotlin",
  swift: "Swift",
  jsweb: "JavaScript (Web SDK)",
};

export interface Props {
  language?: string;
  languages?: string[];
  setLanguage?: (lang: SupportedLanguage) => void;
  className?: string;
  children?: any;
  title?: string;
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
  ...props
}) => {
  const isMounted = useIsMounted();
  const { theme } = useTheme();

  const params = useMemo(() => getParams(className) as any, [className]);

  //Determine language to be used for syntax highlighting
  const lang = useMemo(() => {
    // Check if `language` and `languages` exist, and if so, whether `language` is in the `languages` list for the block
    // If so, we want to use it for syntax highlighting
    if (language && languages && languages.includes(language)) {
      return language;
    }
    // If `language` is defined but not in the `languages` list, default syntax highlighting to the first item in the languages list
    else if (language && languages && !languages.includes(language)) {
      return languages[0];
    }
    // Finally, fallback to `params.language` or to "shell" if it's also not defined
    else {
      return params.language ?? "shell";
    }
  }, [language, languages, params.language]);

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
    [children, className],
  );

  const title = props.title || children.props.metastring;

  const [isCopied, setCopied] = useClipboard(content, {
    successDuration: 2000,
  });

  if (!isMounted) {
    return null;
  }

  return (
    <div className="code-block text-sm border dark:border-gray-800 rounded overflow-hidden">
      <div className="bg-gray-100 dark:bg-[#2E2F34] text-gray-500 dark:text-gray-300 border-b dark:border-b-transparent p-2 flex items-center">
        {title && <span className="text-xs font-medium">{title}</span>}

        <div className="flex items-center ml-auto">
          {languages && setLanguage && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="ml-auto bg-transparent text-xs font-medium  mr-2 mt-0.5 text-right"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {LanguageLabel[l] || l}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={setCopied}
            className="text-xs uppercase  tracking-wider px-1"
          >
            {isCopied ? <IoCheckmark /> : <IoCopy />}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        showLineNumbers
        lineNumberStyle={{
          color: "#ccc",
        }}
        language={lang}
        style={theme === "light" ? lightCodeTheme : darkCodeTheme}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};
