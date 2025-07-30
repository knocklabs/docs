#!/usr/bin/env tsx

import {
  generateApiReferenceMarkdownFiles,
  generateAllApiReferenceMarkdownFiles,
} from "./generateLlmsTxt";

const args = process.argv.slice(2);
const apiType = args.includes("--mapi")
  ? "mapi"
  : args.includes("--both")
  ? "both"
  : "api";

async function run() {
  try {
    if (apiType === "both") {
      console.log(
        "🚀 Generating both API and MAPI reference markdown files...",
      );
      await generateAllApiReferenceMarkdownFiles();
      console.log(
        "✅ Both API reference markdown files generated successfully!",
      );
    } else {
      console.log(
        `🚀 Generating ${apiType.toUpperCase()} reference markdown files...`,
      );
      await generateApiReferenceMarkdownFiles(apiType as "api" | "mapi");
      console.log(
        `✅ ${apiType.toUpperCase()} reference markdown files generated successfully!`,
      );
    }
    process.exit(0);
  } catch (error) {
    console.error("❌ Error generating API reference files:", error);
    process.exit(1);
  }
}

run();
