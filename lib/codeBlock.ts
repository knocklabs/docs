// Shared by the build-time rehype plugin and the CodeBlock component. Keep this
// module free of @pierre/highlights so importing it doesn't ship the highlighter.
import { normalize } from "./normalizeCode";

export const DEFAULT_CODE_LANGUAGE = "shell";

// Language keys we use that Highlights doesn't know by these names.
const LANGUAGE_ALIASES: Record<string, string> = {
  curl: "bash",
  shell: "bash",
  node: "typescript",
  jsweb: "javascript",
  mjml: "html",
};

export function resolveCodeLanguage(language?: string): string {
  const key = (language || DEFAULT_CODE_LANGUAGE).toLowerCase();
  return LANGUAGE_ALIASES[key] ?? key;
}

// Fence class names look like `language-js`, optionally followed by
// `:key=value` params.
export function getLanguageFromClassName(className = ""): string | undefined {
  return className.split(":")[0].split("language-")[1] || undefined;
}

// Strips line directives and trims, so the copied text and the highlighted
// text match.
export function getCodeContent(text: string, className = ""): string {
  return normalize(text, className)[0];
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Wraps each line so CSS can number it. Lines are joined by a newline, which
// `white-space: pre` keeps when the reader copies a selection.
export function wrapCodeLines(lines: string[]): string {
  return lines.map((line) => `<span data-line>${line}</span>`).join("\n");
}

export function plainCodeToHtml(code: string): string {
  return wrapCodeLines(code.split("\n").map(escapeHtml));
}
