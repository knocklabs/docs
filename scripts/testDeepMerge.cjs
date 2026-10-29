// Run with: node --import tsx scripts/testDeepMerge.cjs
const assert = require("node:assert/strict");
const { deepMerge } = require("../lib/deepMerge.ts");

const merged = deepMerge(
  { keep: true, nested: { fromTarget: 1, shared: "target" }, items: [1] },
  { nested: { fromSource: 2, shared: "source" }, items: [2], extra: "yes" },
);

assert.deepEqual(merged, {
  keep: true,
  nested: { fromTarget: 1, shared: "source", fromSource: 2 },
  items: [1, 2],
  extra: "yes",
});

assert.deepEqual(
  deepMerge({ value: { nested: true } }, { value: ["replaced"] }),
  {
    value: ["replaced"],
  },
);

assert.deepEqual(
  deepMerge({ value: ["replaced"] }, { value: { nested: true } }),
  {
    value: { nested: true },
  },
);

const poisoned = deepMerge(
  { session: null },
  JSON.parse('{"session":{"__proto__":{"admin":true}}}'),
);
assert.equal(poisoned.session.admin, undefined);
assert.equal(Object.hasOwn(poisoned.session, "__proto__"), false);
assert.equal(Object.getPrototypeOf(poisoned.session), Object.prototype);

const nullPrototypeTarget = deepMerge(
  Object.create(null),
  JSON.parse('{"__proto__":{"isAdmin":true}}'),
);
assert.equal(nullPrototypeTarget.isAdmin, undefined);
assert.deepEqual(Object.keys(nullPrototypeTarget), []);

const withForbiddenKeys = deepMerge(
  {},
  JSON.parse(
    '{"constructor":{"prototype":{"polluted":true}},"name":"kept","prototype":{"polluted":true}}',
  ),
);
assert.equal(withForbiddenKeys.polluted, undefined);
assert.deepEqual(withForbiddenKeys, { name: "kept" });

console.log("deep merge tests passed");
