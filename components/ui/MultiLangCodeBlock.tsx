/*
  This is a code block component that allows us to select a language to show an example
*/

import { useEffect, useMemo } from "react";
import { useIsMounted } from "../../hooks/useIsMounted";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useEventEmitter } from "../../lib/eventEmitter";
import {
  snippets,
  SNIPPET_LANGUAGE_ORDER,
} from "../../data/code/snippetRegistry";
import { CodeBlock, SupportedLanguage } from "./CodeBlock";

type Props = {
  title: string;
  snippet: string;
};

export const LOCAL_STORAGE_KEY = "@knocklabs/example-lang";
export const EVENT_NAME = "language.change";

const MultiLangCodeBlock: React.FC<Props> = ({ title, snippet, ...props }) => {
  const isMounted = useIsMounted();
  const eventEmitter = useEventEmitter();
  const [language, setLanguage] = useLocalStorage<SupportedLanguage>(
    LOCAL_STORAGE_KEY,
    "node",
  );

  useEffect(() => {
    // When the language changes, set the new language
    const unsubscribe = eventEmitter.on(EVENT_NAME, setLanguage);
    return () => unsubscribe();
  }, [eventEmitter, setLanguage]);

  useEffect(() => {
    // When the language changes, notify any other components currently rendered
    eventEmitter.emit(EVENT_NAME, language);
  }, [language, eventEmitter]);

  // Set the list of languages in the switcher according to the languages in the snippet and ordered by the DEFAULT_ORDER
  const languages = useMemo(() => {
    const snippetCode = snippets[snippet];
    return SNIPPET_LANGUAGE_ORDER.filter((key) => key in snippetCode);
  }, [snippet]);

  const content = useMemo(() => {
    const snippetCode = snippets[snippet];

    // When a given block does not include any example code for the language that is currently stored in localstorage, we want to display the code that matches the first listed language in its switcher (which is what will be "selected" and displayed on the switcher by default)
    const listedLanguage = languages && languages[0];
    const code =
      (snippetCode && snippetCode[language]) ||
      (snippetCode && listedLanguage && snippetCode[listedLanguage]) ||
      "\n";

    return {
      props: {
        metastring: title,
        children: code,
        className: `language-${language}`,
        originalType: "code",
        mdxType: "code",
      },
    };
  }, [language, languages, snippet, title]);

  if (!isMounted) return null;

  return (
    <CodeBlock
      language={language}
      languages={languages}
      setLanguage={setLanguage}
      {...props}
    >
      {content}
    </CodeBlock>
  );
};

export default MultiLangCodeBlock;
