import { cache } from "react";
import { dereference } from "@scalar/openapi-parser";
import { readFile } from "fs/promises";
import { parse } from "yaml";
import safeStringify from "safe-stringify";
import deepmerge from "deepmerge";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import type { SpecName, StainlessConfig } from "./types";

/**
 * Cached loader for the full dereferenced OpenAPI spec.
 * Uses React's cache() to dedupe within a single render pass.
 */
export const getOpenApiSpec = cache(
  async (specName: SpecName): Promise<OpenAPIV3.Document> => {
    const spec = await readFile(
      `./data/specs/${specName}/openapi.yml`,
      "utf8",
    );
    const { schema } = await dereference(parse(spec));
    return JSON.parse(safeStringify(schema));
  },
);

/**
 * Cached loader for the Stainless config with customizations.
 */
export const getStainlessSpec = cache(
  async (specName: SpecName): Promise<StainlessConfig> => {
    const [specFile, customizationsFile] = await Promise.all([
      readFile(`./data/specs/${specName}/stainless.yml`, "utf8"),
      readFile(`./data/specs/${specName}/customizations.yml`, "utf8"),
    ]);
    return deepmerge(parse(specFile), parse(customizationsFile));
  },
);
