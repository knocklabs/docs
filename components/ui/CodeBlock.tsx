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
import bash from "react-syntax-highlighter/dist/cjs/languages/hljs/bash";
import useClipboard from "react-use-clipboard";

import { lightCodeTheme, darkCodeTheme } from "../../styles/codeThemes";
import { normalize } from "../../lib/normalizeCode";
import { useIsMounted } from "../../hooks/useIsMounted";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";

SyntaxHighlighter.registerLanguage("node", javascript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("jsx", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("jsweb", javascript);
SyntaxHighlighter.registerLanguage("tsx", javascript);
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
SyntaxHighlighter.registerLanguage("curl", bash);
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
  className = children?.props ? children.props.className : "",
  language,
  languages,
  setLanguage,
  ...props
}) => {
  const isMounted = useIsMounted();
  const { theme } = useTheme();

  const params = useMemo(() => getParams(className) as any, [className]);

  // Determine language to be used for syntax highlighting
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
    <Box border="px" borderColor="gray-4" borderRadius="2" w="full" style={{ overflow: "hidden" }} className="text-sm border dark:border-gray-800 rounded overflow-hidden w-full">
      <Stack bg="gray-2" borderBottom="px" borderColor="gray-2" p="2" alignItems="center">
        {title && <Text as="span" color="gray" size="1" weight="medium">{title}</Text>}

        <Stack alignItems="center" ml="auto">
          {languages && setLanguage && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent  mr-2 mt-0.5 text-right"
              style={{ color: "var(--tgph-gray-11)", fontSize: "12px", fontWeight: "500" }}
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {LanguageLabel[l] || l}
                </option>
              ))}
            </select>
          )}

          <Button
            variant="ghost"
            size="0"
            onClick={setCopied}
            px="1"
            icon={{ icon: isCopied ? Lucide.Check : Lucide.Copy, "aria-hidden": true }}
          />
        </Stack>
      </Stack>
      <SyntaxHighlighter
        showLineNumbers
        lineNumberStyle={{
          // ensure consistent line number styles across languages
          color: "var(--tgph-gray-8)",
          display: "inline-block",
          minWidth: "2.25em",
          paddingRight: "var(--tgph-spacing-5)",
          textAlign: "right",
          userSelect: "none",
          paddingLeft: "0px",
        }}
        language={lang}
        style={theme === "light" ? lightCodeTheme : darkCodeTheme}
      >
        {content}
      </SyntaxHighlighter>
    </Box>
  );
};
