#!/usr/bin/env tsx
/**
 * Crawler reachability test script
 *
 * Tests that major AI crawlers can access the Knock documentation site
 * without being blocked by WAF, CDN, or bot management rules.
 *
 * Usage:
 *   yarn test:crawlers                    # Test production site
 *   yarn test:crawlers http://localhost:3002  # Test local dev server
 *
 * Exit codes:
 *   0 - All crawlers can access the site
 *   1 - One or more requests failed or were blocked
 *
 * @see https://is-agentic.com/scan/docs.knock.app for the external verification scan
 */

import { AI_CRAWLER_USER_AGENTS } from "../app/robots";

const DEFAULT_BASE_URL = "https://docs.knock.app";

const TEST_PAGES = ["/", "/getting-started/what-is-knock", "/api-reference"];

interface TestResult {
  userAgent: string;
  page: string;
  status: number;
  ok: boolean;
  blocked: boolean;
  challengePage: boolean;
  error?: string;
}

async function testCrawlerAccess(
  baseUrl: string,
  userAgent: string,
  page: string,
): Promise<TestResult> {
  const url = `${baseUrl}${page}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });

    const text = await response.text();

    const challengePage =
      text.includes("challenge-platform") ||
      text.includes("cf-browser-verification") ||
      text.includes("Just a moment") ||
      text.includes("Checking your browser") ||
      text.includes("DDoS protection by") ||
      text.includes("Vercel Security Checkpoint") ||
      text.includes("Enable JavaScript and cookies");

    const blocked =
      response.status === 403 ||
      response.status === 429 ||
      response.status === 503 ||
      challengePage;

    return {
      userAgent,
      page,
      status: response.status,
      ok: response.ok && !blocked,
      blocked,
      challengePage,
    };
  } catch (error) {
    return {
      userAgent,
      page,
      status: 0,
      ok: false,
      blocked: false,
      challengePage: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function formatResult(result: TestResult): string {
  const statusIcon = result.ok ? "✅" : result.blocked ? "❌" : "⚠️";
  const statusText = result.error
    ? `ERROR: ${result.error}`
    : result.challengePage
    ? "CHALLENGE PAGE"
    : result.blocked
    ? `BLOCKED (${result.status})`
    : `${result.ok ? "OK" : "FAILED"} (${result.status})`;

  return `${statusIcon} ${result.userAgent.padEnd(20)} ${result.page.padEnd(
    35,
  )} ${statusText}`;
}

async function main() {
  const baseUrl = process.argv[2] || DEFAULT_BASE_URL;

  console.log(
    "╔════════════════════════════════════════════════════════════════════╗",
  );
  console.log(
    "║                  AI Crawler Reachability Test                       ║",
  );
  console.log(
    "╠════════════════════════════════════════════════════════════════════╣",
  );
  console.log(`║ Base URL: ${baseUrl.padEnd(57)} ║`);
  console.log(
    `║ Crawlers: ${AI_CRAWLER_USER_AGENTS.length.toString().padEnd(57)} ║`,
  );
  console.log(`║ Pages:    ${TEST_PAGES.length.toString().padEnd(57)} ║`);
  console.log(
    "╚════════════════════════════════════════════════════════════════════╝",
  );
  console.log("");

  const results: TestResult[] = [];

  for (const userAgent of AI_CRAWLER_USER_AGENTS) {
    console.log(`\nTesting ${userAgent}...`);

    for (const page of TEST_PAGES) {
      const result = await testCrawlerAccess(baseUrl, userAgent, page);
      results.push(result);
      console.log(`  ${formatResult(result)}`);
    }
  }

  console.log("\n" + "═".repeat(72));
  console.log("SUMMARY");
  console.log("═".repeat(72));

  const totalTests = results.length;
  const passedTests = results.filter((r) => r.ok).length;
  const blockedTests = results.filter((r) => r.blocked).length;
  const challengeTests = results.filter((r) => r.challengePage).length;

  console.log(`Total tests:     ${totalTests}`);
  console.log(`Passed:          ${passedTests} ✅`);
  console.log(`Failed:          ${totalTests - passedTests}`);
  console.log(`Blocked:         ${blockedTests} ❌`);
  console.log(`Challenge pages: ${challengeTests} ⚠️`);
  console.log("");

  if (blockedTests > 0) {
    console.log("BLOCKED CRAWLERS:");
    const blockedCrawlers = [
      ...new Set(results.filter((r) => r.blocked).map((r) => r.userAgent)),
    ];
    for (const crawler of blockedCrawlers) {
      console.log(`  - ${crawler}`);
    }
    console.log("");
  }

  const allPassed = passedTests === totalTests;

  if (allPassed) {
    console.log("✅ All AI crawlers can access the documentation site");
  } else {
    console.log("❌ Some AI crawler requests failed or were blocked");
    console.log("\nRecommended actions:");
    console.log("  - Check failed URLs and the HTTP or network errors above");
    if (blockedTests > 0) {
      console.log("  - Check Vercel Bot Protection settings in the dashboard");
      console.log("  - Review WAF/CDN rules for the blocked user agents");
      console.log("  - Add explicit allow rules for legitimate AI crawlers");
    }
  }

  process.exit(allPassed ? 0 : 1);
}

main().catch((error) => {
  console.error("Test script failed:", error);
  process.exit(1);
});
