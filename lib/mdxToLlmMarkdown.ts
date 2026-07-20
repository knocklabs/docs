import fs from "fs";
import path from "path";

/**
 * Helpers for turning the custom MDX components used in our docs into plain
 * markdown for the "Copy for LLM" / llms.txt output.
 *
 * The docs render several React components that have no markdown equivalent. The
 * two that matter here are:
 *
 *   - `<Typedoc file="..." />`, which inlines an auto-generated SDK reference
 *     page from `/typedocs`. Without resolving it, an SDK component page like
 *     `knock-provider.md` copies as nothing but the bare component tag.
 *   - `<Attributes>` / `<Attribute>`, which render a property reference table.
 *     Those appear both inside the inlined typedoc content and directly in
 *     hand-written pages.
 *
 * We convert both to markdown so the copied content is actually useful to an
 * LLM. The attribute list format mirrors the one produced by
 * `scripts/generateApiMarkdown.ts` (`- **name** (type) *required* - description`).
 */

type AttributeValue = string | boolean;

/**
 * Decodes the handful of HTML entities that show up in typedoc source, so a
 * type like `Partial&lt;Translations&gt;` reads as `Partial<Translations>`.
 * `&amp;` is decoded last to avoid double-decoding.
 */
function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/** Collapses newlines and repeated whitespace so multi-line descriptions render on one line. */
function normalizeInlineWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function asString(value: AttributeValue | undefined): string {
  return typeof value === "string" ? value : "";
}

/**
 * Unwraps a JSX expression attribute value (the part inside `{...}`) down to its
 * string content. Handles the template-literal (`` {`...`} ``) and quoted-string
 * (`{"..."}`) forms we use for descriptions that contain quotes or backticks.
 * Any other expression is returned verbatim as a best effort.
 */
function unwrapExpression(expression: string): string {
  const trimmed = expression.trim();
  if (trimmed.startsWith("`") && trimmed.endsWith("`")) {
    return trimmed.slice(1, -1).replace(/\\`/g, "`");
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/**
 * Given `index` pointing at a quote or backtick in `source`, returns the index
 * just past the matching closing delimiter (respecting backslash escapes). Used
 * to skip over string contents while scanning JSX so quotes, braces, or `>`
 * inside a value don't affect parsing.
 */
function skipQuoted(source: string, index: number): number {
  const quote = source[index];
  index++;
  while (
    index < source.length &&
    !(source[index] === quote && source[index - 1] !== "\\")
  ) {
    index++;
  }
  return index + 1;
}

/**
 * Parses the attributes out of a JSX opening tag's inner text (everything
 * between the component name and the closing `>` or `/>`).
 *
 * Supports string values (`name="x"`, `name='x'`), expression values
 * (`` description={`...`} ``, `description={"..."}`), and boolean shorthand
 * (`isRequired`). Written as a small hand-rolled scanner rather than a regex so
 * that quotes, backticks, and braces inside a value don't break parsing.
 */
function parseJsxAttributes(input: string): Record<string, AttributeValue> {
  const attributes: Record<string, AttributeValue> = {};
  const isNameStart = (char: string) => /[A-Za-z_]/.test(char);
  const isNameChar = (char: string) => /[A-Za-z0-9_-]/.test(char);
  const length = input.length;
  let index = 0;

  while (index < length) {
    while (index < length && /\s/.test(input[index])) index++;
    if (index >= length) break;

    // Skip anything that can't start an attribute name (e.g. a stray `/`).
    if (!isNameStart(input[index])) {
      index++;
      continue;
    }

    const nameStart = index;
    while (index < length && isNameChar(input[index])) index++;
    const name = input.slice(nameStart, index);

    while (index < length && /\s/.test(input[index])) index++;

    if (input[index] !== "=") {
      // Boolean shorthand, e.g. `isRequired`.
      attributes[name] = true;
      continue;
    }

    index++; // consume '='
    while (index < length && /\s/.test(input[index])) index++;
    const valueChar = input[index];

    if (valueChar === '"' || valueChar === "'") {
      const quote = valueChar;
      index++;
      const valueStart = index;
      while (index < length && input[index] !== quote) index++;
      attributes[name] = input.slice(valueStart, index);
      index++; // consume closing quote
    } else if (valueChar === "{") {
      index++; // consume '{'
      while (index < length && /\s/.test(input[index])) index++;
      const inner = input[index];
      if (inner === "`" || inner === '"' || inner === "'") {
        // A single quoted/backtick string inside the braces.
        index++;
        const valueStart = index;
        while (
          index < length &&
          !(input[index] === inner && input[index - 1] !== "\\")
        ) {
          index++;
        }
        let raw = input.slice(valueStart, index);
        if (inner === "`") raw = raw.replace(/\\`/g, "`");
        attributes[name] = raw;
        index++; // consume closing quote
        while (index < length && input[index] !== "}") index++;
        index++; // consume '}'
      } else {
        // Some other expression: capture it with balanced braces, skipping over
        // any string contents so braces inside them don't throw off the count.
        let depth = 1;
        const valueStart = index;
        while (index < length && depth > 0) {
          const exprChar = input[index];
          if (exprChar === '"' || exprChar === "'" || exprChar === "`") {
            index = skipQuoted(input, index);
            continue;
          }
          if (exprChar === "{") {
            depth++;
          } else if (exprChar === "}") {
            depth--;
            if (depth === 0) break;
          }
          index++;
        }
        attributes[name] = unwrapExpression(input.slice(valueStart, index));
        index++; // consume closing '}'
      }
    } else {
      // Unquoted value (uncommon): read up to the next whitespace.
      const valueStart = index;
      while (index < length && !/\s/.test(input[index])) index++;
      attributes[name] = input.slice(valueStart, index);
    }
  }

  return attributes;
}

/** Renders a single `<Attribute>` as a markdown list item, nesting any children beneath it. */
function renderAttributeItem(
  attributes: Record<string, AttributeValue>,
  childrenMarkdown: string,
): string {
  const name = asString(attributes.name);
  const type = decodeHtmlEntities(asString(attributes.type));
  const description = normalizeInlineWhitespace(
    decodeHtmlEntities(asString(attributes.description)),
  );
  const isRequired =
    attributes.isRequired === true || attributes.isRequired === "true";

  let line = `- **${name}**`;
  if (type) {
    // Types are shown as inline code, but some already contain backticks (e.g.
    // an enum written as `a` | `b`). Wrapping those again produces broken nested
    // code spans, so emit them as-is when they already carry their own backticks.
    line += type.includes("`") ? ` (${type})` : ` (\`${type}\`)`;
  }
  if (isRequired) line += ` *required*`;
  if (description) line += ` - ${description}`;

  const trimmedChildren = childrenMarkdown.trim();
  if (trimmedChildren) {
    const indented = trimmedChildren
      .split("\n")
      .map((childLine) => (childLine ? `  ${childLine}` : childLine))
      .join("\n");
    line += `\n${indented}`;
  }

  return line;
}

/** Finds the end of a JSX opening tag, skipping over quoted/braced attribute values. */
function findOpeningTagEnd(
  source: string,
  from: number,
): { end: number; selfClosing: boolean } {
  let index = from;
  while (index < source.length) {
    const char = source[index];
    if (char === '"' || char === "'" || char === "`") {
      index = skipQuoted(source, index);
      continue;
    }
    if (char === "{") {
      let depth = 1;
      index++;
      while (index < source.length && depth > 0) {
        const inner = source[index];
        if (inner === '"' || inner === "'" || inner === "`") {
          index = skipQuoted(source, index);
          continue;
        }
        if (inner === "{") depth++;
        else if (inner === "}") depth--;
        index++;
      }
      continue;
    }
    if (char === "/" && source[index + 1] === ">") {
      return { end: index + 2, selfClosing: true };
    }
    if (char === ">") {
      return { end: index + 1, selfClosing: false };
    }
    index++;
  }
  return { end: index, selfClosing: false };
}

/**
 * Renders the `<Attribute>` children of a single (non-nested) `<Attributes>`
 * block as a markdown list. Block-form attributes carry already-converted
 * markdown children, which `renderAttributeItem` indents beneath the item.
 */
function renderAttributeList(inner: string): string {
  const items: string[] = [];
  let index = 0;
  let start = inner.indexOf("<Attribute", index);

  while (start !== -1) {
    // Guard against matching a stray `<Attributes` token. In practice inner
    // blocks are already converted (we work right-most first), but this keeps
    // the scanner from mis-parsing one as an `<Attribute>` element.
    if (inner.startsWith("<Attributes", start)) {
      index = start + "<Attributes".length;
      start = inner.indexOf("<Attribute", index);
      continue;
    }

    const openInnerStart = start + "<Attribute".length;
    const { end, selfClosing } = findOpeningTagEnd(inner, openInnerStart);
    const openInner = inner.slice(
      openInnerStart,
      selfClosing ? end - 2 : end - 1,
    );
    const attributes = parseJsxAttributes(openInner);

    let childrenMarkdown = "";
    if (selfClosing) {
      index = end;
    } else {
      const closeIndex = inner.indexOf("</Attribute>", end);
      if (closeIndex === -1) {
        childrenMarkdown = inner.slice(end);
        index = inner.length;
      } else {
        childrenMarkdown = inner.slice(end, closeIndex);
        index = closeIndex + "</Attribute>".length;
      }
    }

    items.push(renderAttributeItem(attributes, childrenMarkdown));
    start = inner.indexOf("<Attribute", index);
  }

  return items.length ? `\n${items.join("\n")}\n` : "";
}

/**
 * Replaces every `<Attributes>...</Attributes>` block with a markdown list.
 * Works from the innermost (right-most) block outward so that nested attribute
 * groups are converted before their parents, keeping the logic per-pass simple.
 */
export function convertAttributesToMarkdown(content: string): string {
  let result = content;
  let openIndex = result.lastIndexOf("<Attributes");

  while (openIndex !== -1) {
    const openTagEnd = result.indexOf(">", openIndex);
    if (openTagEnd === -1) break;

    const closeIndex = result.indexOf("</Attributes>", openTagEnd);
    if (closeIndex === -1) break;

    const inner = result.slice(openTagEnd + 1, closeIndex);
    const before = result.slice(0, openIndex);
    const after = result.slice(closeIndex + "</Attributes>".length);
    let markdown = renderAttributeList(inner);
    // The list already starts and ends with a newline, so drop a redundant one
    // where the surrounding text is also blank to avoid stacking blank lines.
    if (markdown.startsWith("\n") && /\n[ \t]*\n[ \t]*$/.test(before)) {
      markdown = markdown.slice(1);
    }
    if (markdown.endsWith("\n") && /^[ \t]*\n/.test(after)) {
      markdown = markdown.slice(0, -1);
    }
    result = before + markdown + after;

    openIndex = result.lastIndexOf("<Attributes");
  }

  return result;
}

/** Removes a leading YAML frontmatter block, if present. */
function stripFrontmatter(content: string): string {
  return content.replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---\s*\r?\n?/, "");
}

/**
 * Replaces `<Typedoc file="..." />` references with the body of the referenced
 * typedoc source file. Missing files are left in place with a warning rather
 * than failing the whole generation.
 */
export function resolveTypedocReferences(
  content: string,
  typedocsDir: string,
): string {
  return content.replace(
    /<Typedoc\s+file="([^"]+)"\s*\/>/g,
    (match, file: string) => {
      const typedocPath = path.join(typedocsDir, `${file}.mdx`);
      if (!fs.existsSync(typedocPath)) {
        console.warn(
          `Warning: Typedoc file not found for LLM markdown: ${file}`,
        );
        return match;
      }
      const body = fs.readFileSync(typedocPath, "utf-8");
      return stripFrontmatter(body).trim();
    },
  );
}

/**
 * Prepares raw MDX for LLM/markdown output: inlines `<Typedoc>` references, then
 * converts the `<Attributes>` components (including any that came from the
 * inlined typedoc content) into markdown lists.
 */
export function convertMdxForLlm(content: string, typedocsDir: string): string {
  const withTypedocs = resolveTypedocReferences(content, typedocsDir);
  return convertAttributesToMarkdown(withTypedocs);
}
