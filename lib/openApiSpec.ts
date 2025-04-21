import { dereference } from "@scalar/openapi-parser";
import deepmerge from "deepmerge";
import { readFile } from "fs/promises";
import safeStringify from "safe-stringify";
import { parse } from "yaml";

type StainlessResourceMethod =
  | string
  | {
      type: "http";
      endpoint: string;
      positional_params?: string[];
    };

type StainlessResource = {
  name?: string;
  description?: string;
  models?: Record<string, string>;
  methods?: Record<string, StainlessResourceMethod>;
  subresources?: Record<
    string,
    {
      name?: string;
      description?: string;
      models?: Record<string, string>;
      methods?: Record<string, StainlessResourceMethod>;
    }
  >;
};

interface StainlessConfig {
  resources: {
    [key: string]: StainlessResource;
  };
  environments: Record<string, string>;
}

function yamlToJson(yaml: string) {
  const json = parse(yaml);
  return json;
}

async function readOpenApiSpec(specName: string) {
  const spec = await readFile(`./data/specs/${specName}/openapi.yml`, "utf8");
  const jsonSpec = yamlToJson(spec);
  const { schema } = await dereference(jsonSpec);

  return JSON.parse(safeStringify(schema));
}

async function readStainlessSpec(specName: string): Promise<StainlessConfig> {
  const customizations = await readSpecCustomizations(specName);
  const spec = await readFile(`./data/specs/${specName}/stainless.yml`, "utf8");
  const stainlessSpec = parse(spec);
  return deepmerge(stainlessSpec, customizations);
}

async function readSpecCustomizations(specName: string) {
  const spec = await readFile(
    `./data/specs/${specName}/customizations.yml`,
    "utf8",
  );
  const customizations = parse(spec);

  return customizations;
}

export type { StainlessResource, StainlessConfig };
export { readOpenApiSpec, readStainlessSpec };
