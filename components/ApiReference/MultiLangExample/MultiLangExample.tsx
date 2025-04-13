import { useEventEmitter } from "@byteclaw/use-event-emitter";
import { useEffect, useMemo } from "react";

import { useIsMounted } from "../../../hooks/useIsMounted";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { CodeBlock, SupportedLanguage } from "../../CodeBlock";
import { EVENT_NAME, LOCAL_STORAGE_KEY } from "../../MultiLangCodeBlock";

type Props = {
  examples: Record<string, string>;
  title: string;
};

function resolveLanguageToSnippet(language: string) {
  switch (language) {
    case "node":
      return "typescript";
    default:
      return language;
  }
}

function resolveSnippetLanguages(language: string) {
  switch (language) {
    case "typescript":
      return "node";
    default:
      return language;
  }
}

const MultiLangExample = ({ examples, title }: Props) => {
  const isMounted = useIsMounted();
  const eventEmitter = useEventEmitter();

  const languages = useMemo(
    () => Object.keys(examples).map(resolveSnippetLanguages),
    [examples],
  );

  const [language, setLanguage] = useLocalStorage<SupportedLanguage>(
    LOCAL_STORAGE_KEY,
    "node",
  );

  const resolvedLanguage = resolveLanguageToSnippet(language);

  useEffect(() => {
    // When the language changes, set the new language
    const unsubscribe = eventEmitter.on(EVENT_NAME, setLanguage);
    return () => unsubscribe();
  }, [eventEmitter, setLanguage]);

  useEffect(() => {
    // When the language changes, notify any other components currently rendered
    eventEmitter.emit(EVENT_NAME, language);
  }, [language, eventEmitter]);

  const exampleContent = useMemo(() => {
    const exampleInSelectedLanguage = examples[resolvedLanguage];

    // When a given block does not include any example code for the language that is currently stored in localstorage, we want to display the code that matches the first listed language in its switcher (which is what will be "selected" and displayed on the switcher by default)
    const listedLanguage = languages && languages[0];

    if (!exampleInSelectedLanguage) {
      return examples[listedLanguage];
    }

    return exampleInSelectedLanguage;
  }, [examples, resolvedLanguage, languages]);

  if (!isMounted) return null;

  return (
    <CodeBlock
      language={language}
      languages={languages}
      setLanguage={setLanguage}
      title={title}
    >
      {exampleContent}
    </CodeBlock>
  );
};

export default MultiLangExample;
