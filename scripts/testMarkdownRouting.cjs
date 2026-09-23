// Run after generating reference Markdown: node --import tsx scripts/testMarkdownRouting.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { NextRequest } = require("next/server");
const { proxy } = require("../proxy.ts");
const handler = require("../pages/api/md/[...slug].ts").default;

function response() {
  return {
    code: 200,
    headers: {},
    body: undefined,
    status(code) {
      this.code = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };
}

async function main() {
  const markdownHome = proxy(
    new NextRequest("https://docs.knock.app/", {
      headers: { accept: "text/markdown" },
    }),
  );
  assert.equal(
    markdownHome.headers.get("x-middleware-rewrite"),
    "https://docs.knock.app/llms.txt",
  );
  assert.equal(
    markdownHome.headers.get("Content-Type"),
    "text/markdown; charset=utf-8",
  );
  assert.equal(markdownHome.headers.get("Vary"), "Accept, Accept-Encoding");

  const markdownHomeBody = fs.readFileSync(
    path.join(process.cwd(), "public", "llms.txt"),
    "utf8",
  );
  assert.match(markdownHomeBody, /^# Knock Documentation/);
  assert.ok(markdownHomeBody.length > 500);

  const htmlHome = proxy(
    new NextRequest("https://docs.knock.app/", {
      headers: { accept: "text/html" },
    }),
  );
  assert.equal(htmlHome.headers.get("x-middleware-rewrite"), null);
  assert.equal(htmlHome.headers.get("Content-Type"), null);
  assert.equal(htmlHome.headers.get("Vary"), "Accept, Accept-Encoding");

  for (const pathname of [
    "/api/md/cli",
    "/api/search",
    "/openapi.yaml",
    "/mapi/openapi.yml",
  ]) {
    const result = proxy(
      new NextRequest(`https://docs.knock.app${pathname}`, {
        headers: { accept: "text/markdown" },
      }),
    );
    assert.equal(result.headers.get("x-middleware-rewrite"), null, pathname);
  }
  for (const pathname of [
    "/does-not-exist",
    "/api-reference/does-not-exist",
    "/cli/does-not-exist",
    "/mapi-reference/does-not-exist",
  ]) {
    const result = proxy(
      new NextRequest(`https://docs.knock.app${pathname}?slug=cli`, {
        headers: { accept: "text/markdown" },
      }),
    );
    assert.equal(
      result.headers.get("x-middleware-rewrite"),
      `https://docs.knock.app/api/md${pathname}`,
    );
    const res = response();
    await handler(
      { method: "GET", query: { slug: pathname.slice(1).split("/") } },
      res,
    );
    assert.equal(res.code, 404, pathname);
    assert.match(res.headers["Content-Type"], /text\/markdown/);
    assert.match(res.body, /^# 404/);
    for (const link of [
      "/sitemap.xml",
      "/llms.txt",
      "/llms-full.txt",
      "/api/search",
    ])
      assert.ok(res.body.includes(link));
  }
  const direct = proxy(
    new NextRequest("https://docs.knock.app/does-not-exist.md"),
  );
  assert.equal(
    direct.headers.get("x-middleware-rewrite"),
    "https://docs.knock.app/api/md/does-not-exist",
  );
  const html = proxy(
    new NextRequest("https://docs.knock.app/concepts/workflows", {
      headers: { accept: "text/markdown;q=0, text/html" },
    }),
  );
  assert.equal(html.headers.get("x-middleware-rewrite"), null);
  assert.equal(html.headers.get("Vary"), "Accept, Accept-Encoding");

  for (const slug of [
    ["..", "public-other", "secret"],
    ["../README"],
    ["..\\README"],
    ["nul\0"],
  ]) {
    const res = response();
    await handler({ method: "GET", query: { slug } }, res);
    assert.equal(res.code, 400);
  }
  for (const method of ["GET", "HEAD"]) {
    for (const slug of [
      ["cli"],
      ["api-reference", "users", "get"],
      ["mapi-reference"],
    ]) {
      const res = response();
      await handler({ method, query: { slug } }, res);
      assert.equal(res.code, 200, slug.join("/"));
      assert.match(res.headers["Content-Type"], /text\/markdown/);
      assert.equal(res.headers.Vary, "Accept, Accept-Encoding");
      if (method === "HEAD") assert.equal(res.body, "");
      else assert.ok(res.body.length > 0);
    }
  }
  const res = response();
  await handler({ method: "POST", query: { slug: ["cli"] } }, res);
  assert.equal(res.code, 405);
  assert.equal(res.headers.Allow, "GET, HEAD");
  console.log(
    "PASS: Markdown and HTML negotiation, cache-safe headers, bodies, routing, recovery links, HEAD, method guard, and traversal checks",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
