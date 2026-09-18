#!/bin/bash

# Test script for agent-friendly 404 responses
# Verifies:
# 1. Nonexistent paths return HTTP 404
# 2. Response links to sitemap, llms.txt, docs index, and search
# 3. Markdown clients receive a Markdown recovery body

set -e

BASE_URL="${1:-http://localhost:3002}"
RANDOM_PATH="/nonexistent-page-$(date +%s)-$RANDOM"

echo "Testing 404 responses at $BASE_URL"
echo "Random nonexistent path: $RANDOM_PATH"
echo ""

# Test 1: HTML 404 status code
echo "Test 1: Verify HTML 404 returns correct status code"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$RANDOM_PATH")
if [ "$HTTP_STATUS" = "404" ]; then
    echo "✅ PASS: HTTP status is 404"
else
    echo "❌ FAIL: Expected HTTP 404, got $HTTP_STATUS"
    exit 1
fi

# Test 1b: HTML 404 exposes help links in metadata, not a visible recovery list
echo ""
echo "Test 1b: Verify HTML 404 contains non-rendered help links"
HTML_RESPONSE=$(curl -s "$BASE_URL$RANDOM_PATH")

printf '%s' "$HTML_RESPONSE" | node -e '
const assert = require("node:assert/strict");
const html = require("node:fs").readFileSync(0, "utf8");
const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
const links = head.match(/<link\b[^>]*>/gi) ?? [];
for (const href of ["/", "/sitemap.xml", "/llms.txt", "/llms-full.txt"]) {
  assert(links.some(link => link.includes(`href="${href}"`) && link.includes(`rel="help"`)),
    `Missing help metadata for ${href}`);
}
const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
assert(body.includes("404 - Page not found"), "Missing human-readable 404 message");
assert(!body.includes("Recovery options:"), "Recovery list should not be rendered");
assert(!/<a\b[^>]*href="\/(?:sitemap\.xml|llms(?:-full)?\.txt)"/i.test(body),
  "Machine-readable documentation links should not be rendered");
console.log("✅ PASS: All four help links are in the document head, without a visible recovery list");
'

# Test 2: Markdown 404 status code
echo ""
echo "Test 2: Verify Markdown 404 returns correct status code"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Accept: text/markdown" "$BASE_URL$RANDOM_PATH")
if [ "$HTTP_STATUS" = "404" ]; then
    echo "✅ PASS: Markdown HTTP status is 404"
else
    echo "❌ FAIL: Expected Markdown HTTP 404, got $HTTP_STATUS"
    exit 1
fi

# Test 3: Markdown 404 contains recovery links
echo ""
echo "Test 3: Verify Markdown 404 contains recovery links"
RESPONSE=$(curl -s -H "Accept: text/markdown" "$BASE_URL$RANDOM_PATH")

# Check for sitemap link
if echo "$RESPONSE" | grep -q "/sitemap.xml"; then
    echo "✅ PASS: Contains sitemap link"
else
    echo "❌ FAIL: Missing sitemap link"
    exit 1
fi

# Check for llms.txt link
if echo "$RESPONSE" | grep -q "/llms.txt"; then
    echo "✅ PASS: Contains llms.txt link"
else
    echo "❌ FAIL: Missing llms.txt link"
    exit 1
fi

# Check for docs index link (root /)
if echo "$RESPONSE" | grep -q "\[/\](/)" || echo "$RESPONSE" | grep -q "Documentation home"; then
    echo "✅ PASS: Contains docs index link"
else
    echo "❌ FAIL: Missing docs index link"
    exit 1
fi

# Check for search API reference
if echo "$RESPONSE" | grep -q "/api/search"; then
    echo "✅ PASS: Contains search API reference"
else
    echo "❌ FAIL: Missing search API reference"
    exit 1
fi

# Test 4: Markdown 404 content type
echo ""
echo "Test 4: Verify Markdown 404 returns correct content type"
CONTENT_TYPE=$(curl -s -o /dev/null -w "%{content_type}" -H "Accept: text/markdown" "$BASE_URL$RANDOM_PATH")
if echo "$CONTENT_TYPE" | grep -q "text/markdown"; then
    echo "✅ PASS: Content-Type is text/markdown"
else
    echo "❌ FAIL: Expected text/markdown, got $CONTENT_TYPE"
    exit 1
fi

# Test 5: Markdown body is actually markdown
echo ""
echo "Test 5: Verify Markdown 404 body is valid Markdown"
if echo "$RESPONSE" | grep -q "^# 404"; then
    echo "✅ PASS: Response starts with Markdown heading"
else
    echo "❌ FAIL: Response does not appear to be Markdown"
    exit 1
fi

echo ""
echo "=========================================="
echo "All 404 response tests passed!"
echo "=========================================="
