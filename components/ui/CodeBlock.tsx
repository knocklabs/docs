import React, { useEffect, useMemo, useState } from "react";
import { useClipboard } from "@/hooks/useClipboard";
import {
  DEFAULT_CODE_LANGUAGE,
  getCodeContent,
  getLanguageFromClassName,
  plainCodeToHtml,
} from "@/lib/codeBlock";

import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { Check, Copy } from "lucide-react";

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

export const CodeBlock: React.FC<Props> = ({
  children,
  className = children?.props ? children.props.className : "",
  language,
  languages,
  setLanguage,
  ...props
}) => {
  const fenceLanguage = getLanguageFromClassName(className);

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
    // Finally, fall back to the fence language, or to "shell" if it's also not defined
    else {
      return fenceLanguage ?? DEFAULT_CODE_LANGUAGE;
    }
  }, [language, languages, fenceLanguage]);

  const content = useMemo(() => {
    // Extract code content from children, ensuring we always get a string
    if (typeof children === "string") {
      return getCodeContent(children, className);
    }
    if (children?.props?.children != null) {
      const innerContent = children.props.children;
      if (typeof innerContent === "string") {
        return getCodeContent(innerContent, className);
      }
      if (Array.isArray(innerContent)) {
        const text = innerContent
          .filter((c): c is string => typeof c === "string")
          .join("");
        return getCodeContent(text, className);
      }
    }
    return getCodeContent("", className);
  }, [children, className]);

  // MDX fences arrive highlighted from the build (lib/rehypeHighlightCode.ts).
  const prehighlightedHtml: string | undefined =
    children?.props?.["data-highlighted-html"];

  // Other code, such as API reference examples, is highlighted in the browser.
  // The highlighter loads on first use, and the code shows as plain text until then.
  const [clientHighlight, setClientHighlight] = useState<{
    content: string;
    lang: string;
    html: string;
  }>();

  useEffect(() => {
    if (prehighlightedHtml !== undefined) return;

    let isCurrent = true;
    import("@/lib/highlightCode").then(({ highlightCode }) => {
      if (isCurrent) {
        setClientHighlight({
          content,
          lang,
          html: highlightCode(content, lang),
        });
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [prehighlightedHtml, content, lang]);

  const html = useMemo(() => {
    if (prehighlightedHtml !== undefined) return prehighlightedHtml;
    if (clientHighlight?.content === content && clientHighlight.lang === lang) {
      return clientHighlight.html;
    }
    return plainCodeToHtml(content);
  }, [prehighlightedHtml, clientHighlight, content, lang]);

  const title = props.title || children?.props?.metastring;

  const [isCopied, setCopied] = useClipboard(content, {
    successDuration: 2000,
  });

  return (
    <Box
      border="px"
      borderColor="gray-4"
      borderRadius="4"
      w="full"
      style={{ overflow: "hidden" }}
      data-code-block
      {...props}
    >
      <Stack
        bg="gray-2"
        borderBottom="px"
        borderColor="gray-4"
        p="2"
        alignItems="center"
      >
        {title && (
          <Text as="span" color="gray" size="1" weight="medium">
            {title}
          </Text>
        )}

        <Stack alignItems="center" ml="auto">
          {languages && setLanguage && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent  mr-2 mt-0.5 text-right"
              style={{
                color: "var(--tgph-gray-11)",
                fontSize: "12px",
                fontWeight: "500",
              }}
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
            icon={{
              icon: isCopied ? Check : Copy,
              "aria-hidden": true,
            }}
          />
        </Stack>
      </Stack>
      <pre data-code-body>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </Box>
  );
};
