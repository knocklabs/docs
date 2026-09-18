import { MetadataRoute } from "next";
import { BASE_URL } from "../lib/constants";

/**
 * Major AI crawlers that should have read-only access to the documentation.
 * These user agents are explicitly allowed to fetch public pages.
 *
 * Verified crawlers:
 * - ChatGPT-User: OpenAI's ChatGPT web browsing agent
 * - ClaudeBot: Anthropic's Claude web crawler
 * - Google-Extended: Google's AI training data crawler
 * - ora-agent: Ora.ai's research agent
 * - DeepSeekBot: DeepSeek's AI crawler
 * - cohere-ai: Cohere's web crawler
 * - PerplexityBot: Perplexity AI's search crawler
 * - GPTBot: OpenAI's GPT training data crawler
 * - anthropic-ai: Anthropic's training data crawler
 *
 * @see https://is-agentic.com/scan/docs.knock.app for reachability verification
 */
export const AI_CRAWLER_USER_AGENTS = [
  "ChatGPT-User",
  "ClaudeBot",
  "Google-Extended",
  "ora-agent",
  "DeepSeekBot",
  "cohere-ai",
  "PerplexityBot",
  "GPTBot",
  "anthropic-ai",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_CRAWLER_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
