import {
  codeToTokens,
  isSupportedLanguage,
  type Theme,
  type ThemedToken,
} from "@pierre/highlights";

import { escapeHtml, resolveCodeLanguage, wrapCodeLines } from "./codeBlock";

// Each value names a `--code-*` CSS variable rather than a color. The colors
// for light and dark mode are set in styles/global.css. Scopes not listed here
// fall back to their parent scope (`keyword.control` uses `keyword`), then to
// `--code-foreground`.
const theme: Theme = {
  name: "knock-docs",
  appearance: "light",
  cssVariables: { prefix: "--code-" },
  style: {
    syntax: {
      attribute: "attribute",
      boolean: "literal",
      comment: { color: "comment", font_style: "italic" },
      "constant.builtin": "literal",
      "diff.minus": "tag",
      "diff.plus": "string",
      emphasis: { font_style: "italic" },
      "emphasis.strong": { font_weight: 700 },
      function: "function",
      keyword: "keyword",
      link_text: "string",
      link_uri: "meta",
      number: "number",
      preproc: "meta",
      property: "attribute",
      "punctuation.list_marker": "meta",
      selector: "tag",
      "selector.class": "attribute",
      "selector.id": "meta",
      "selector.pseudo": "attribute",
      string: "string",
      "string.regex": "regexp",
      "string.special": "literal",
      tag: "tag",
      "tag.doctype": "meta",
      title: "tag",
      type: "type",
      "type.builtin": "builtin",
      "variable.special": "literal",
    },
  },
};

const FOREGROUND = "var(--code-foreground)";
const ITALIC = 1;
const BOLD = 2;

function tokenStyle(token: ThemedToken): string {
  const styles: string[] = [];
  if (token.color && token.color !== FOREGROUND) {
    styles.push(`color:${token.color}`);
  }
  if (token.fontStyle && token.fontStyle & ITALIC) {
    styles.push("font-style:italic");
  }
  if (token.fontStyle && token.fontStyle & BOLD) {
    styles.push("font-weight:700");
  }
  return styles.join(";");
}

// Merges neighboring tokens that share a style, and leaves foreground text
// unwrapped, to keep the HTML small.
function lineToHtml(tokens: ThemedToken[]): string {
  let html = "";
  let style = "";
  let text = "";

  const flush = () => {
    if (!text) return;
    const escaped = escapeHtml(text);
    html += style ? `<span style="${style}">${escaped}</span>` : escaped;
  };

  for (const token of tokens) {
    const next = tokenStyle(token);
    if (next !== style) {
      flush();
      style = next;
      text = "";
    }
    text += token.content;
  }
  flush();

  return html;
}

/**
 * Highlights code as HTML, one `<span data-line>` per line. Unknown languages
 * render as plain text.
 */
export function highlightCode(code: string, language?: string): string {
  const resolved = resolveCodeLanguage(language);
  const lang = isSupportedLanguage(resolved) ? resolved : "plaintext";
  const { tokens } = codeToTokens(code, { lang, theme });
  return wrapCodeLines(tokens.map(lineToHtml));
}
