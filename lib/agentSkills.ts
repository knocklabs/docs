/**
 * Helpers for surfacing Knock's published agent skills on the /agents page.
 *
 * Card title, description, and order are curated here. Skill URLs are resolved
 * from the live well-known index at
 * https://knock.app/.well-known/agent-skills/index.json, with a local fallback
 * path when the index is unavailable or missing an entry.
 */

export type AgentSkill = {
  /** Machine identifier, e.g. "knock-cli". */
  name: string;
  /** Card title shown on /agents (verb-led). */
  title: string;
  /** Short card description shown on /agents. */
  description: string;
  /** Absolute URL to the SKILL.md file. */
  url: string;
};

type AgentSkillCard = {
  name: string;
  title: string;
  description: string;
};

const KNOCK_ORIGIN = "https://knock.app";

export const AGENT_SKILLS_INDEX_URL = `${KNOCK_ORIGIN}/.well-known/agent-skills/index.json`;

/**
 * Curated /agents skill cards. Order, titles, and descriptions are controlled
 * here — not by the published skill index. Add or reorder entries to change
 * the grid. `name` must match a skill directory in knocklabs/skills.
 */
export const AGENT_SKILL_CARDS: AgentSkillCard[] = [
  {
    name: "knock-setup",
    title: "Set up Knock",
    description:
      "Connect MCP and skills, then discover and build your first workflows.",
  },
  {
    name: "knock-lifecycle-opportunities",
    title: "Find lifecycle opportunities",
    description:
      "Spot activation, retention, and revenue moments worth messaging.",
  },
  {
    name: "knock-in-app-ui",
    title: "Add in-app guides",
    description:
      "Ship banners, modals, and cards for announcements, paywalls, and other in-product messaging.",
  },
  {
    name: "knock-product-messaging-strategy",
    title: "Design messaging strategy",
    description:
      "Plan activation, engagement, and retention journeys before you build.",
  },
  {
    name: "knock-migrate-to-knock",
    title: "Migrate to Knock",
    description:
      "Investigate existing messaging infra and map it onto Knock concepts.",
  },
  {
    name: "knock-cli",
    title: "Manage resources as code",
    description:
      "Pull, edit, and push workflows, guides, and templates with the CLI.",
  },
];

const skillUrl = (name: string): string =>
  `${KNOCK_ORIGIN}/.well-known/agent-skills/${name}/SKILL.md`;

const toAbsoluteUrl = (url: string): string => {
  try {
    return new URL(url, KNOCK_ORIGIN).toString();
  } catch {
    return url;
  }
};

type RawSkill = {
  name?: unknown;
  description?: unknown;
  url?: unknown;
};

const cardsToSkills = (urlsByName: Map<string, string>): AgentSkill[] =>
  AGENT_SKILL_CARDS.map((card) => ({
    name: card.name,
    title: card.title,
    description: card.description,
    url: urlsByName.get(card.name) ?? skillUrl(card.name),
  }));

/**
 * Fetch published skill URLs, then render the curated card list. Card copy and
 * order always come from AGENT_SKILL_CARDS.
 */
export async function fetchAgentSkills(): Promise<AgentSkill[]> {
  const urlsByName = new Map<string, string>();

  try {
    const response = await fetch(AGENT_SKILLS_INDEX_URL);
    if (response.ok) {
      const data = (await response.json()) as { skills?: RawSkill[] };
      for (const raw of data.skills ?? []) {
        if (typeof raw.name === "string" && typeof raw.url === "string") {
          urlsByName.set(raw.name, toAbsoluteUrl(raw.url));
        }
      }
    }
  } catch {
    // Use constructed URLs from AGENT_SKILL_CARDS when the index is unreachable.
  }

  return cardsToSkills(urlsByName);
}

/** Prompt handed to a coding agent to install a specific skill. */
export const buildSkillPrompt = (skill: AgentSkill): string =>
  `Use the ${skill.name} skill from Knock to help me: ${skill.url}`;
