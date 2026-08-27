const decodeSegment = (segment: string): string =>
  segment.replace(/~1/g, "/").replace(/~0/g, "~");

/**
 * Minimal RFC 6901 JSON pointer lookup.
 *
 * We only ever read values out of OpenAPI specs (resolving pointers like
 * `/components/schemas/Workflow`), so this implements the `get` half of the
 * spec. A pointer must be empty (resolving to the whole document) or start
 * with `/`; the `~1` → `/` and `~0` → `~` escapes are decoded per the spec.
 */
export const getAtPointer = (document: object, pointer: string): any => {
  if (pointer === "") return document;
  if (pointer[0] !== "/") {
    throw new Error(`Invalid JSON pointer: ${pointer}`);
  }

  // Drop the empty segment from the leading slash, then walk the path, bailing
  // out to `undefined` as soon as it runs into a non-object.
  return pointer
    .slice(1)
    .split("/")
    .reduce<any>((value, segment) => {
      if (value === null || typeof value !== "object") return undefined;
      return value[decodeSegment(segment)];
    }, document);
};
