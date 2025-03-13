import { dereference } from "@scalar/openapi-parser";
import deepmerge from "deepmerge";
import { readFile } from "fs/promises";
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
}

function yamlToJson(yaml: string) {
  const json = parse(yaml);
  return json;
}

async function readOpenApiSpec() {
  const spec = await readFile("./data/specs/openapi.yml", "utf8");
  const jsonSpec = yamlToJson(spec);
  const { schema } = await dereference(jsonSpec);

  return schema;
}

async function readStainlessSpec(): Promise<StainlessConfig> {
  const customizations = await readSpecCustomizations();
  const spec = await readFile("./data/specs/stainless.yml", "utf8");
  const stainlessSpec = parse(spec);

  return deepmerge(stainlessSpec, customizations);
}

async function readSpecCustomizations() {
  const spec = await readFile("./data/specs/customizations.yml", "utf8");
  const customizations = parse(spec);

  return customizations;
}

export type { StainlessResource, StainlessConfig };
export { readOpenApiSpec, readStainlessSpec, readSpecCustomizations };
