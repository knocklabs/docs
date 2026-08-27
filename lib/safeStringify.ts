/**
 * Serializes a value to JSON while tolerating circular references.
 *
 * Any value encountered as its own ancestor is replaced with the string
 * "[Circular]". Values that merely appear more than once along different paths
 * (a shared, acyclic reference) are serialized in full each time — matching the
 * behavior we relied on from the `safe-stringify` package.
 */
export const safeStringify = (value: unknown): string => {
  // Tracks the ancestors on the current path. Adding before recursing and
  // removing afterwards means only true cycles (a value nested inside itself)
  // are flagged — not values that are simply shared across sibling branches.
  const ancestors = new WeakSet<object>();

  const strip = (input: unknown): unknown => {
    if (input === null || typeof input !== "object") return input;
    if (ancestors.has(input)) return "[Circular]";

    ancestors.add(input);
    const stripped = Array.isArray(input)
      ? input.map(strip)
      : Object.fromEntries(
          Object.entries(input).map(([key, val]) => [key, strip(val)]),
        );
    ancestors.delete(input);

    return stripped;
  };

  return JSON.stringify(strip(value));
};
