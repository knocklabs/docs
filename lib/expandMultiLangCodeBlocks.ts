import {
  snippets,
  SNIPPET_FENCE_LANGUAGES,
  SNIPPET_LANGUAGE_LABELS,
  SNIPPET_LANGUAGE_ORDER,
} from "../data/code/snippetRegistry";

const MULTI_LANG_CODE_BLOCK_REGEX =
  /<MultiLangCodeBlock\b([^>]*)\/>/g;

function parseMultiLangCodeBlockAttributes(attributes: string): {
  snippet?: string;
  title?: string;
} {
  const snippetMatch = attributes.match(/\bsnippet="([^"]+)"/);
  const titleMatch = attributes.match(/\btitle="([^"]*)"/);

  return {
    snippet: snippetMatch?.[1],
    title: titleMatch?.[1],
  };
}

function renderSnippetMarkdown(snippetKey: string, title?: string): string {
  const snippetCode = snippets[snippetKey];

  if (!snippetCode) {
    return `<!-- Unknown MultiLangCodeBlock snippet: ${snippetKey} -->`;
  }

  const languages = SNIPPET_LANGUAGE_ORDER.filter((key) => key in snippetCode);
  const sections: string[] = [];

  if (title) {
    sections.push(`#### ${title}\n`);
  }

  for (const language of languages) {
    const code = snippetCode[language]?.trim() ?? "";
    const label = SNIPPET_LANGUAGE_LABELS[language];
    const fenceLanguage = SNIPPET_FENCE_LANGUAGES[language];

    sections.push(`**${label}**\n\n\`\`\`${fenceLanguage}\n${code}\n\`\`\`\n`);
  }

  return sections.join("\n");
}

function expandMultiLangCodeBlocks(content: string): string {
  return content.replace(MULTI_LANG_CODE_BLOCK_REGEX, (_, attributes) => {
    const { snippet, title } = parseMultiLangCodeBlockAttributes(attributes);

    if (!snippet) {
      return "<!-- MultiLangCodeBlock missing snippet attribute -->";
    }

    return renderSnippetMarkdown(snippet, title);
  });
}

export { expandMultiLangCodeBlocks, renderSnippetMarkdown };
