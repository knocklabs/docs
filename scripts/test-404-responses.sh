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

# Test 1b: HTML 404 contains recovery links
echo ""
echo "Test 1b: Verify HTML 404 contains recovery links"
HTML_RESPONSE=$(curl -s "$BASE_URL$RANDOM_PATH")

# Check for sitemap link in HTML
if echo "$HTML_RESPONSE" | grep -q "sitemap.xml"; then
    echo "✅ PASS: HTML contains sitemap link"
else
    echo "❌ FAIL: HTML missing sitemap link"
    exit 1
fi

# Check for llms.txt link in HTML
if echo "$HTML_RESPONSE" | grep -q "llms.txt"; then
    echo "✅ PASS: HTML contains llms.txt link"
else
    echo "❌ FAIL: HTML missing llms.txt link"
    exit 1
fi

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
