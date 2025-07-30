#!/usr/bin/env tsx

import { generateAllApiReferenceMarkdownFiles } from "./generateLlmsTxt";

async function run() {
  try {
    console.log("🚀 Generating API and MAPI reference markdown files...");
    await generateAllApiReferenceMarkdownFiles();
    console.log(
      "✅ API and MAPI reference markdown files generated successfully!",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error generating API reference files:", error);
    process.exit(1);
  }
}

run();
