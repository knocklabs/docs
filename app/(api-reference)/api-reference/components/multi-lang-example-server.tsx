"use client";

import { useEventEmitter } from "@byteclaw/use-event-emitter";
import { useEffect, useMemo } from "react";

import { useIsMounted } from "../../../../hooks/useIsMounted";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import {
  CodeBlock,
  SupportedLanguage,
} from "../../../../components/ui/CodeBlock";
import {
  EVENT_NAME,
  LOCAL_STORAGE_KEY,
} from "../../../../components/ui/MultiLangCodeBlock";

interface MultiLangExampleServerProps {
  examples: Record<string, string>;
  title: string;
}

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

export function MultiLangExampleServer({
  examples,
  title,
}: MultiLangExampleServerProps) {
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
    const unsubscribe = eventEmitter.on(EVENT_NAME, setLanguage);
    return () => unsubscribe();
  }, [eventEmitter, setLanguage]);

  useEffect(() => {
    eventEmitter.emit(EVENT_NAME, language);
  }, [language, eventEmitter]);

  const exampleContent = useMemo(() => {
    const exampleInSelectedLanguage = examples[resolvedLanguage];
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
}
