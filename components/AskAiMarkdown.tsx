// Renders Ask AI answers with @pierre/words. The sidebar loads this with
// next/dynamic, so Words and the highlighter only download once it's opened.
import {
  Markdown,
  type CodeHighlighterPlugin,
  type CodeOptions,
} from "@pierre/words/react";
import { createHighlightsPlugin } from "@pierre/words/highlights";

import { resolveCodeLanguage } from "@/lib/codeBlock";
import { codeTheme } from "@/lib/highlightCode";

// Same theme as the docs code blocks, and the same language aliases (such as
// `node` and `curl`), so answers highlight like the rest of the docs.
const highlights = createHighlightsPlugin({ theme: codeTheme });
const withAlias = (options: CodeOptions): CodeOptions => ({
  ...options,
  language: options.language
    ? resolveCodeLanguage(options.language)
    : options.language,
});

const codePlugin: CodeHighlighterPlugin = {
  highlight: (options) => highlights.highlight(withAlias(options)),
  createSession() {
    const session = highlights.createSession!();
    return {
      highlight: (options) => session.highlight(withAlias(options)),
      highlightLines: session.highlightLines
        ? (options) => session.highlightLines!(withAlias(options))
        : undefined,
      dispose: () => session.dispose(),
    };
  },
};

const plugins = { code: codePlugin };
const controls = { code: { copy: true, download: false } };

// Hooks receive each element's HTML. External links open in a new tab.
const components = {
  a: (html: string) =>
    /^<a\b[^>]*\bhref="https?:/.test(html)
      ? html.replace(/^<a\b/, '<a target="_blank" rel="noopener"')
      : html,
};

type Props = {
  content: string;
  isStreaming: boolean;
};

export default function AskAiMarkdown({ content, isStreaming }: Props) {
  return (
    <Markdown
      data-ask-ai-answer
      isAnimating={isStreaming}
      plugins={plugins}
      controls={controls}
      components={components}
    >
      {content}
    </Markdown>
  );
}
