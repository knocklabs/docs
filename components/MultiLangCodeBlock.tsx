/*
  This is a code block component that allows us to select a language to show an example
*/

import { useEventEmitter } from "@byteclaw/use-event-emitter";
import { useEffect, useMemo } from "react";
import { useIsMounted } from "../hooks/useIsMounted";
import useLocalStorage from "../hooks/useLocalStorage";
import { CodeBlock, SupportedLanguage } from "./CodeBlock";

type Props = {
  title: string;
  snippet: string;
};

const LOCAL_STORAGE_KEY = "@knocklabs/example-lang";
const EVENT_NAME = "language.change";

const snippets = {
  "api.idempotency": require("../data/code/api/idempotency").default,
  "sdks.install": require("../data/code/sdks/install").default,
  // Users
  "users.bulkIdentify": require("../data/code/users/bulk-identify").default,
  "users.bulkDelete": require("../data/code/users/bulk-delete").default,
  "users.identify": require("../data/code/users/identify").default,
  "users.get": require("../data/code/users/get").default,
  "users.delete": require("../data/code/users/delete").default,
  "users.merge": require("../data/code/users/merge").default,
  "users.messages": require("../data/code/users/messages").default,
  "users.setPreferences": require("../data/code/users/set-preferences").default,
  "users.setPreferences.conditions":
    require("../data/code/users/set-preferences-with-conditions").default,
  "users.setPreferences.perTenant":
    require("../data/code/users/set-preferences-per-tenant").default,
  "users.bulkSetPreferences": require("../data/code/users/bulk-set-preferences")
    .default,
  "users.listPreferences": require("../data/code/users/list-preferences").default,
  "users.getPreferences": require("../data/code/users/get-preferences").default,
  "users.getChannelData": require("../data/code/users/get-channel-data")
    .default,
  "users.setChannelData": require("../data/code/users/set-channel-data")
    .default,
  "users.setChannelData-push":
    require("../data/code/users/set-channel-data-push").default,
  "users.setChannelData-one-signal":
    require("../data/code/users/set-channel-data-one-signal").default,
  "users.unsetChannelData": require("../data/code/users/unset-channel-data")
    .default,
  "users.identifyChannelData":
    require("../data/code/users/identify-channel-data").default,

  // Messages
  "messages.list": require("../data/code/messages/list").default,
  "messages.get": require("../data/code/messages/get").default,
  "messages.getActivities": require("../data/code/messages/get-activities")
    .default,
  "messages.getContent": require("../data/code/messages/get-content").default,
  "messages.getEvents": require("../data/code/messages/get-events").default,

  // Objects
  "objects.set": require("../data/code/objects/set").default,
  "objects.get": require("../data/code/objects/get").default,
  "objects.delete": require("../data/code/objects/delete").default,
  "objects.bulkSet": require("../data/code/objects/bulk-set").default,
  "objects.bulkDelete": require("../data/code/objects/bulk-delete").default,
  "objects.messages": require("../data/code/objects/messages").default,
  "objects.setChannelData.slack":
    require("../data/code/objects/set-channel-data-slack").default,
  "objects.setChannelData.msTeams":
    require("../data/code/objects/set-channel-data-ms-teams").default,
  "objects.setChannelData.discord.webhook":
    require("../data/code/objects/set-channel-data-discord-webhook").default,
  "objects.setChannelData.discord.bot":
    require("../data/code/objects/set-channel-data-discord-bot").default,
  "objects.unsetChannelData": require("../data/code/objects/unset-channel-data")
    .default,
  "objects.getChannelData": require("../data/code/objects/get-channel-data")
    .default,
  "objects.getPreferences": require("../data/code/objects/get-preferences")
    .default,
  "objects.setPreferences": require("../data/code/objects/set-preferences")
    .default,

  // Tenants
  "tenants.list": require("../data/code/tenants/list").default,
  "tenants.get": require("../data/code/tenants/get").default,
  "tenants.set": require("../data/code/tenants/set").default,
  "tenants.delete": require("../data/code/tenants/delete").default,

  // Workflows
  "workflows.cancel": require("../data/code/workflows/cancel").default,
  "workflows.cancel-with-recipients":
    require("../data/code/workflows/cancel-with-recipients").default,
  "workflows.trigger": require("../data/code/workflows/trigger").default,
  "workflows.trigger-with-identification":
    require("../data/code/workflows/trigger-with-identification").default,
  "workflows.trigger-with-user-identification":
    require("../data/code/workflows/trigger-with-user-identification").default,
  "workflows.trigger-with-object-identification":
    require("../data/code/workflows/trigger-with-object-identification")
      .default,
  "workflows.trigger-with-actor":
    require("../data/code/workflows/trigger-with-actor").default,
  "workflows.trigger-with-object-as-recipient":
    require("../data/code/workflows/trigger-with-object-as-recipient").default,
  "workflows.trigger-with-object-as-actor":
    require("../data/code/workflows/trigger-with-object-as-actor").default,
  "workflows.trigger-with-tenant":
    require("../data/code/workflows/trigger-with-tenant").default,
  "workflows.trigger-with-branding-tenant":
    require("../data/code/workflows/trigger-with-branding-tenant").default,
  "workflows.trigger-with-attachment":
    require("../data/code/workflows/trigger-with-attachment").default,
  "workflows.trigger-with-user-channel-data":
    require("../data/code/workflows/trigger-with-user-channel-data").default,
  "workflows.trigger-with-user-preferences":
    require("../data/code/workflows/trigger-with-user-preferences").default,
  "workflows.playground": require("../data/code/workflows/playground").default,
};
/* eslint-enable */

const DEFAULT_ORDER: SupportedLanguage[] = [
  "curl",
  "shell",
  "node",
  "javascript",
  "jsweb",
  "ruby",
  "python",
  "php",
  "go",
  "java",
  "csharp",
  "elixir",
  "swift",
  "kotlin",
  "json",
  "yaml",
];

const MultiLangCodeBlock: React.FC<Props> = ({ title, snippet }) => {
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
  }, []);

  useEffect(() => {
    // When the language changes, notify any other components currently rendered
    eventEmitter.emit(EVENT_NAME, language);
  }, [language, eventEmitter]);

  // Set the list of languages in the switcher according to the languages in the snippet and ordered by the DEFAULT_ORDER
  const languages = useMemo(() => {
    const snippetCode = snippets[snippet];
    return DEFAULT_ORDER.filter((key) => key in snippetCode);
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
    >
      {content}
    </CodeBlock>
  );
};

export default MultiLangCodeBlock;
