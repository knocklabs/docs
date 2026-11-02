const forbiddenKeys = new Set(["__proto__", "constructor", "prototype"]);

function isForbiddenKey(key: string): boolean {
  return forbiddenKeys.has(key);
}

// Dates and regular expressions are replaced as values. Everything else that
// is a non-null object, including arrays, is merged.
function isMergeable(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;

  const tag = Object.prototype.toString.call(value);
  return tag !== "[object Date]" && tag !== "[object RegExp]";
}

function propertyIsOnObject(object: unknown, property: string): boolean {
  try {
    return property in (object as object);
  } catch {
    return false;
  }
}

function assign(target: object, key: string, value: unknown) {
  Object.defineProperty(target, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

function cloneValue(value: unknown): unknown {
  if (!isMergeable(value)) return value;
  const empty: unknown[] | Record<string, unknown> = Array.isArray(value)
    ? []
    : {};
  return deepMerge(empty, value);
}

function mergeObject(
  target: unknown,
  source: unknown,
): Record<string, unknown> {
  const destination = {};

  if (isMergeable(target) && !Array.isArray(target)) {
    for (const key of Object.keys(target)) {
      if (isForbiddenKey(key)) continue;
      assign(destination, key, cloneValue(target[key]));
    }
  }

  if (isMergeable(source)) {
    for (const key of Object.keys(source)) {
      if (isForbiddenKey(key)) continue;

      const sourceValue = source[key];
      if (propertyIsOnObject(target, key) && isMergeable(sourceValue)) {
        assign(
          destination,
          key,
          deepMerge((target as Record<string, unknown>)[key], sourceValue),
        );
      } else {
        assign(destination, key, cloneValue(sourceValue));
      }
    }
  }

  return destination;
}

/**
 * Deep-merges plain objects and concatenates arrays.
 *
 * `__proto__`, `constructor`, and `prototype` are dropped, and properties are
 * defined explicitly, so a merge cannot set the result's prototype. This
 * replaces the `deepmerge` package, which has no release patched for
 * CVE-2026-93753.
 */
export function deepMerge<T>(target: T, source: unknown): T {
  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);

  if (sourceIsArray !== targetIsArray) {
    return cloneValue(source) as T;
  }

  if (sourceIsArray && targetIsArray) {
    return target.concat(source).map((element) => cloneValue(element)) as T;
  }

  return mergeObject(target, source) as T;
}
