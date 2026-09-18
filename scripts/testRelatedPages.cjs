// Run with: node --import tsx scripts/testRelatedPages.cjs
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const {
  parseRelatedPages,
  fetchRelatedPages,
} = require("../lib/relatedPages.ts");

const valid = { title: "Workflow docs", url: "/concepts/workflows" };
const malformed = [
  null,
  {},
  { results: null },
  { results: "No matching documents" },
  { results: { title: "Not an array" } },
  { results: [] },
  {
    results: [
      null,
      "No matching documents",
      { type: "text", text: "No results found" },
      { title: { text: "Not a string" }, url: "/concepts/workflows" },
      { title: "Missing URL" },
      { title: "Invalid URL", url: {} },
      { title: " ", url: "/" },
      { title: "Empty URL", url: " " },
      { title: "Unsafe URL", url: "javascript:alert(1)" },
      { title: "Unsafe URL", url: "data:text/html,hello" },
      { title: "Broken URL", url: "https://" },
      { title: "Not a URL", url: "not a URL" },
      { title: "Protocol-relative", url: "//example.com" },
      { title: "Backslash", url: "/\\example.com" },
    ],
  },
];

async function main() {
  // Reproduce the old failure modes after an asynchronous search response.
  assert.throws(() => "No matching documents".slice(0, 5).map(() => {}));
  assert.throws(() => [null].map((result) => result.url));
  assert.throws(() =>
    renderToStaticMarkup(React.createElement("a", null, { text: "Bad title" })),
  );

  for (const response of malformed) {
    assert.deepEqual(parseRelatedPages(response), [], JSON.stringify(response));
  }
  assert.deepEqual(
    parseRelatedPages({ results: [...malformed[6].results, valid, valid] }),
    [valid],
  );
  assert.deepEqual(
    parseRelatedPages({
      results: [{ title: " External ", url: " https://example.com/docs " }],
    }),
    [{ title: "External", url: "https://example.com/docs" }],
  );
  const many = Array.from({ length: 10 }, (_, i) => ({
    title: `Page ${i}`,
    url: `/page-${i}`,
  }));
  assert.deepEqual(parseRelatedPages({ results: many }), many.slice(0, 5));

  const originalFetch = global.fetch;
  const controller = new AbortController();
  try {
    for (const response of [...malformed, { results: [valid] }]) {
      global.fetch = async (url, options) => {
        assert.equal(url, "/api/search");
        assert.equal(options.method, "POST");
        assert.equal(options.signal, controller.signal);
        assert.deepEqual(JSON.parse(options.body), { query: "/missing" });
        return { ok: true, json: async () => response };
      };
      const pages = await fetchRelatedPages("/missing", controller.signal);
      assert.deepEqual(pages, parseRelatedPages(response));
      assert.doesNotThrow(() =>
        renderToStaticMarkup(
          React.createElement(
            "ul",
            null,
            pages.map((page) =>
              React.createElement(
                "li",
                { key: page.url },
                React.createElement("a", { href: page.url }, page.title),
              ),
            ),
          ),
        ),
      );
    }
    global.fetch = async () => ({
      ok: false,
      json: () => {
        throw new Error("Do not parse failed responses");
      },
    });
    assert.deepEqual(
      await fetchRelatedPages("/missing", controller.signal),
      [],
    );
    global.fetch = async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError("Invalid JSON");
      },
    });
    assert.deepEqual(
      await fetchRelatedPages("/missing", controller.signal),
      [],
    );
    global.fetch = async () => {
      throw new TypeError("Network failure");
    };
    assert.deepEqual(
      await fetchRelatedPages("/missing", controller.signal),
      [],
    );
    global.fetch = async () => {
      throw new DOMException("Canceled", "AbortError");
    };
    controller.abort();
    assert.deepEqual(
      await fetchRelatedPages("/missing", controller.signal),
      [],
    );
  } finally {
    global.fetch = originalFetch;
  }
  console.log(
    "PASS: Empty/malformed results, safe links, deduplication, rendering, HTTP/JSON/network failures, and cancellation",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
