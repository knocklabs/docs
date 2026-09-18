import type { SupportedLanguage } from "../../components/ui/CodeBlock";

type SnippetLanguages = Partial<Record<SupportedLanguage, string>>;

const snippets: Record<string, SnippetLanguages> = {
  "api.idempotency": require("./api/idempotency").default,
  "sdks.install": require("./sdks/install").default,
  "users.bulkIdentify": require("./users/bulk-identify").default,
  "users.bulkDelete": require("./users/bulk-delete").default,
  "users.identify": require("./users/identify").default,
  "users.get": require("./users/get").default,
  "users.delete": require("./users/delete").default,
  "users.merge": require("./users/merge").default,
  "users.messages": require("./users/messages").default,
  "users.setPreferences": require("./users/set-preferences").default,
  "users.setPreferences.conditions":
    require("./users/set-preferences-with-conditions").default,
  "users.setPreferences.perTenant":
    require("./users/set-preferences-per-tenant").default,
  "users.bulkSetPreferences": require("./users/bulk-set-preferences").default,
  "users.listPreferences": require("./users/list-preferences").default,
  "users.getPreferences": require("./users/get-preferences").default,
  "users.getChannelData": require("./users/get-channel-data").default,
  "users.setChannelData": require("./users/set-channel-data").default,
  "users.setChannelDataDevices":
    require("./users/set-channel-data-devices").default,
  "users.setChannelData-push": require("./users/set-channel-data-push").default,
  "users.setChannelData-one-signal":
    require("./users/set-channel-data-one-signal").default,
  "users.setChannelData-aws-sns":
    require("./users/set-channel-data-aws-sns").default,
  "users.unsetChannelData": require("./users/unset-channel-data").default,
  "users.identifyChannelData": require("./users/identify-channel-data").default,
  "messages.list": require("./messages/list").default,
  "messages.get": require("./messages/get").default,
  "messages.getActivities": require("./messages/get-activities").default,
  "messages.getContent": require("./messages/get-content").default,
  "messages.getEvents": require("./messages/get-events").default,
  "objects.list": require("./objects/list").default,
  "objects.set": require("./objects/set").default,
  "objects.get": require("./objects/get").default,
  "objects.delete": require("./objects/delete").default,
  "objects.bulkSet": require("./objects/bulk-set").default,
  "objects.bulkDelete": require("./objects/bulk-delete").default,
  "objects.messages": require("./objects/messages").default,
  "objects.setChannelData.slack":
    require("./objects/set-channel-data-slack").default,
  "objects.setChannelData.msTeams":
    require("./objects/set-channel-data-ms-teams").default,
  "objects.setChannelData.discord.webhook":
    require("./objects/set-channel-data-discord-webhook").default,
  "objects.setChannelData.discord.bot":
    require("./objects/set-channel-data-discord-bot").default,
  "objects.unsetChannelData": require("./objects/unset-channel-data").default,
  "objects.getChannelData": require("./objects/get-channel-data").default,
  "objects.listPreferences": require("./objects/list-preferences").default,
  "objects.getPreferences": require("./objects/get-preferences").default,
  "objects.setPreferences": require("./objects/set-preferences").default,
  "tenants.list": require("./tenants/list").default,
  "tenants.get": require("./tenants/get").default,
  "tenants.set": require("./tenants/set").default,
  "tenants.delete": require("./tenants/delete").default,
  "workflows.cancel": require("./workflows/cancel").default,
  "workflows.cancel-with-recipients":
    require("./workflows/cancel-with-recipients").default,
  "workflows.trigger": require("./workflows/trigger").default,
  "workflows.trigger-with-identification":
    require("./workflows/trigger-with-identification").default,
  "workflows.trigger-with-user-identification":
    require("./workflows/trigger-with-user-identification").default,
  "workflows.trigger-with-object-identification":
    require("./workflows/trigger-with-object-identification").default,
  "workflows.trigger-with-actor":
    require("./workflows/trigger-with-actor").default,
  "workflows.trigger-with-object-as-recipient":
    require("./workflows/trigger-with-object-as-recipient").default,
  "workflows.trigger-with-object-as-actor":
    require("./workflows/trigger-with-object-as-actor").default,
  "workflows.trigger-with-tenant":
    require("./workflows/trigger-with-tenant").default,
  "workflows.trigger-with-branding-tenant":
    require("./workflows/trigger-with-branding-tenant").default,
  "workflows.trigger-with-attachment":
    require("./workflows/trigger-with-attachment").default,
  "workflows.trigger-with-user-channel-data":
    require("./workflows/trigger-with-user-channel-data").default,
  "workflows.trigger-with-user-preferences":
    require("./workflows/trigger-with-user-preferences").default,
  "workflows.playground": require("./workflows/playground").default,
};

const SNIPPET_LANGUAGE_ORDER: SupportedLanguage[] = [
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

const SNIPPET_LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  curl: "cURL",
  shell: "Shell",
  node: "Node.js",
  javascript: "JavaScript",
  jsweb: "JavaScript (browser)",
  ruby: "Ruby",
  python: "Python",
  php: "PHP",
  go: "Go",
  java: "Java",
  csharp: "C#",
  elixir: "Elixir",
  swift: "Swift",
  kotlin: "Kotlin",
  json: "JSON",
  yaml: "YAML",
};

const SNIPPET_FENCE_LANGUAGES: Record<SupportedLanguage, string> = {
  curl: "bash",
  shell: "bash",
  node: "javascript",
  javascript: "javascript",
  jsweb: "javascript",
  ruby: "ruby",
  python: "python",
  php: "php",
  go: "go",
  java: "java",
  csharp: "csharp",
  elixir: "elixir",
  swift: "swift",
  kotlin: "kotlin",
  json: "json",
  yaml: "yaml",
};

export {
  snippets,
  SNIPPET_FENCE_LANGUAGES,
  SNIPPET_LANGUAGE_LABELS,
  SNIPPET_LANGUAGE_ORDER,
};
export type { SnippetLanguages };
